import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
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
    return false;
  }
}

async function callLLM(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in Vercel environment variables.');

  const baseUrl = process.env.OPENAI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
  const model = process.env.LLM_MODEL || 'gemini-2.0-flash';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`LLM API failed (${response.status}): ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';
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
      } catch {
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

    await db.message.create({
      data: { sessionId: effectiveSessionId, role: 'user', content: message },
    });

    const dbMessages = await db.message.findMany({
      where: { sessionId: effectiveSessionId },
      orderBy: { createdAt: 'asc' },
    });

    const travelModeInstruction = TRAVEL_MODE_PROMPTS[travelMode] || TRAVEL_MODE_PROMPTS.solo;
    const systemPrompt = `${thailandSystemPrompt}\n\n## CURRENT TRAVEL MODE:\n${travelModeInstruction}`;

    const llmMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...dbMessages.map((m: any) => ({
        role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
    ];

    const trimmedMessages = llmMessages.length > 22
      ? [llmMessages[0], ...llmMessages.slice(-21)]
      : llmMessages;

    const encoder = new TextEncoder();
    let fullResponse = '';
    let clientConnected = true;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseText = await callLLM(trimmedMessages);

          fullResponse = responseText;
          await db.message.create({
            data: { sessionId: effectiveSessionId, role: 'assistant', content: fullResponse },
          });

          const messageCount = await db.message.count({ where: { sessionId: effectiveSessionId } });
          if (messageCount <= 2) {
            const title = message.length > 40 ? message.substring(0, 40) + '...' : message;
            try {
              await db.chatSession.update({
                where: { id: effectiveSessionId },
                data: { title },
              });
            } catch { /* ignore */ }
          }

          const words = responseText.split(' ');
          const chunkSize = 3;
          let isFirst = true;

          for (let i = 0; i < words.length; i += chunkSize) {
            if (!clientConnected) break;
            const chunk = words.slice(i, i + chunkSize).join(' ');
            const data = JSON.stringify({ content: chunk, done: false, isFirst });
            isFirst = false;
            const ok = safeEnqueue(controller, encoder, 'data: ' + data + '\n\n');
            if (!ok) { clientConnected = false; break; }
            await new Promise((resolve) => setTimeout(resolve, 15));
          }

          if (clientConnected) {
            safeEnqueue(controller, encoder, 'data: ' + JSON.stringify({ done: true, fullResponse }) + '\n\n');
          }

          try { controller.close(); } catch { /* */ }
        } catch (error: any) {
          console.error('[REvuBOT] Streaming error:', error?.message || error);
          const errorMsg = "I'm having trouble connecting right now. Please try again in a moment. 🙏";

          try {
            await db.message.create({
              data: { sessionId: effectiveSessionId, role: 'assistant', content: errorMsg },
            });
          } catch { /* */ }

          safeEnqueue(controller, encoder, 'data: ' + JSON.stringify({ content: errorMsg, done: false, isFirst: true }) + '\n\n');
          safeEnqueue(controller, encoder, 'data: ' + JSON.stringify({ done: true, fullResponse: errorMsg }) + '\n\n');
          try { controller.close(); } catch { /* */ }
        }
      },
      cancel() { clientConnected = false; },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[REvuBOT] Chat API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error?.message || String(error),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
