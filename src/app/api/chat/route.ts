import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';
import { thailandSystemPrompt } from '@/data/thailand-data';

const TRAVEL_MODE_PROMPTS: Record<string, string> = {
  solo: "The user is traveling SOLO. Focus on budget-friendly options, social hostels, solo-friendly activities, safety tips for solo travelers, and places to meet other travelers.",
  couple: "The user is traveling as a COUPLE. Focus on romantic spots, sunset dining, couple-friendly hotels, private tours, and intimate experiences.",
  family: "The user is traveling with FAMILY/GROUP. Focus on kid-friendly activities, family hotels, group dining options, safety for children, and logistics for larger groups.",
  corporate: "The user is on CORPORATE travel. Focus on business hotels, coworking spaces, executive transport, networking venues, and efficient itineraries around meetings.",
  business: "The user is on BUSINESS travel. Focus on premium accommodations, professional dining, transport efficiency, and combining work with leisure activities.",
};

function safeEnqueue(controller: ReadableStreamDefaultController, encoder: TextEncoder, data: string): boolean {
  try {
    controller.enqueue(encoder.encode(data));
    return true;
  } catch {
    // Controller already closed (client disconnected)
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, travelMode = 'solo' } = await req.json();

    if (!message || !sessionId) {
      return new Response(JSON.stringify({ error: 'Message and sessionId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure the session exists — auto-create if missing (e.g. planner sessions)
    let session = await db.chatSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      try {
        session = await db.chatSession.create({
          data: {
            id: sessionId,
            title: message.length > 40 ? message.substring(0, 40) + '...' : message,
            travelMode: travelMode || 'solo',
            language: 'en',
          },
        });
      } catch (createErr) {
        // If ID format is invalid for Prisma (e.g. planner-1234), generate a valid one
        console.warn('Session auto-create failed, using generated ID:', createErr);
        session = await db.chatSession.create({
          data: {
            title: message.length > 40 ? message.substring(0, 40) + '...' : message,
            travelMode: travelMode || 'solo',
            language: 'en',
          },
        });
      }
    }

    const effectiveSessionId = session.id;

    // Save user message to DB
    await db.message.create({
      data: { sessionId: effectiveSessionId, role: 'user', content: message },
    });

    // Get conversation history
    const dbMessages = await db.message.findMany({
      where: { sessionId: effectiveSessionId },
      orderBy: { createdAt: 'asc' },
    });

    // Build messages array for LLM
    const travelModeInstruction = TRAVEL_MODE_PROMPTS[travelMode] || TRAVEL_MODE_PROMPTS.solo;
    const systemPrompt = `${thailandSystemPrompt}\n\n## CURRENT TRAVEL MODE:\n${travelModeInstruction}`;

    const llmMessages = [
      { role: 'assistant' as const, content: systemPrompt },
      ...dbMessages.map((m: any) => ({
        role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
    ];

    // Keep last 20 messages max to stay within token limits
    const trimmedMessages = llmMessages.length > 22
      ? [llmMessages[0], ...llmMessages.slice(-21)]
      : llmMessages;

    // Create streaming response
    const zai = await ZAI.create();

    const encoder = new TextEncoder();
    let fullResponse = '';
    let clientConnected = true;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await zai.chat.completions.create({
            messages: trimmedMessages,
            thinking: { type: 'disabled' },
          });

          const responseText = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';

          // Save to DB first
          fullResponse = responseText;
          await db.message.create({
            data: { sessionId: effectiveSessionId, role: 'assistant', content: fullResponse },
          });

          // Update session title if first message
          const messageCount = await db.message.count({ where: { sessionId: effectiveSessionId } });
          if (messageCount <= 2) {
            const title = message.length > 40 ? message.substring(0, 40) + '...' : message;
            try {
              await db.chatSession.update({
                where: { id: effectiveSessionId },
                data: { title },
              });
            } catch {
              // Ignore update errors
            }
          }

          // Stream the response in chunks for a better UX
          const words = responseText.split(' ');
          const chunkSize = 3;
          let isFirst = true;

          for (let i = 0; i < words.length; i += chunkSize) {
            if (!clientConnected) break;

            const chunk = words.slice(i, i + chunkSize).join(' ');
            const data = JSON.stringify({ content: chunk, done: false, isFirst });
            isFirst = false;

            const ok = safeEnqueue(controller, encoder, 'data: ' + data + '\n\n');
            if (!ok) {
              clientConnected = false;
              break;
            }

            // Small delay for streaming effect
            await new Promise((resolve) => setTimeout(resolve, 15));
          }

          // Send done signal
          if (clientConnected) {
            safeEnqueue(controller, encoder, 'data: ' + JSON.stringify({ done: true, fullResponse }) + '\n\n');
          }

          try {
            controller.close();
          } catch {
            // Already closed
          }
        } catch (error) {
          console.error('Streaming error:', error);
          const errorMsg = "I'm having trouble connecting right now. Please try again in a moment. 🙏";

          // Try to save error response to DB
          try {
            await db.message.create({
              data: { sessionId: effectiveSessionId, role: 'assistant', content: errorMsg },
            });
          } catch {
            // DB error - ignore
          }

          safeEnqueue(controller, encoder, 'data: ' + JSON.stringify({ content: errorMsg, done: false, isFirst: true }) + '\n\n');
          safeEnqueue(controller, encoder, 'data: ' + JSON.stringify({ done: true, fullResponse: errorMsg }) + '\n\n');

          try {
            controller.close();
          } catch {
            // Already closed
          }
        }
      },
      cancel() {
        clientConnected = false;
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    const errorInfo = {
      error: 'Internal server error',
      details: error?.message || String(error),
      stack: error?.stack?.split('\n').slice(0, 3).join(' | '),
    };
    return new Response(JSON.stringify(errorInfo), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
