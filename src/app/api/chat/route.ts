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

// ─── Groq Multi-Key Rotation ─────────────────────────────────────────────────
// Collects all GROQ_API_KEY_1, GROQ_API_KEY_2, ... env vars at startup.
// Each request round-robins to the next key. If a key hits 429, it is skipped
// and the next key is tried automatically.

function getGroqKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const key = process.env[`GROQ_API_KEY_${i}`];
    if (key) keys.push(key);
  }
  // Also accept legacy single OPENAI_API_KEY as fallback
  const single = process.env.OPENAI_API_KEY;
  if (single && !keys.includes(single)) keys.push(single);
  return keys;
}

// Shared rotation index across requests in the same serverless instance
let keyIndex = 0;

async function callLLMWithRotation(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const keys = getGroqKeys();
  if (keys.length === 0) {
    throw new Error('No API keys configured. Add GROQ_API_KEY_1, GROQ_API_KEY_2, ... to Vercel env vars.');
  }

  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.groq.com/openai/v1';
  const model = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';

  // Try each key once, starting from current rotation index
  for (let attempt = 0; attempt < keys.length; attempt++) {
    const currentIndex = (keyIndex + attempt) % keys.length;
    const apiKey = keys[currentIndex];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages }),
    });

    if (response.status === 429) {
      // This key is rate limited — try the next one
      console.warn(`GROQ key index ${currentIndex + 1} hit rate limit, trying next...`);
      continue;
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`LLM API failed (${response.status}): ${errorBody.slice(0, 200)}`);
    }

    // Success — advance rotation index for next request
    keyIndex = (currentIndex + 1) % keys.length;

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';
  }

  // All keys exhausted
  throw new Error('All API keys have hit their daily rate limit. Resets at midnight UTC.');
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, travelMode = 'solo' } = await req.json();

    if (!message || !sessionId) {
      return new Response(JSON.stringify({ error: 'Message and sessionId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure the session exists — auto-create if missing
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
      { role: 'system' as const, content: systemPrompt },
      ...dbMessages.map((m: any) => ({
        role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
    ];

    // Keep last 20 messages max to stay within token limits
    const trimmedMessages = llmMessages.length > 22
      ? [llmMessages[0], ...llmMessages.slice(-21)]
      : llmMessages;

    const encoder = new TextEncoder();
    let fullResponse = '';
    let clientConnected = true;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseText = await callLLMWithRotation(trimmedMessages);

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
              // Ignore
            }
          }

          // Stream the response in chunks
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

            await new Promise((resolve) => setTimeout(resolve, 15));
          }

          if (clientConnected) {
            safeEnqueue(controller, encoder, 'data: ' + JSON.stringify({ done: true, fullResponse }) + '\n\n');
          }

          try { controller.close(); } catch { /* */ }
        } catch (error) {
          console.error('Streaming error:', error);
          const errorMsg = "I'm having trouble connecting right now. Daily limit may be reached — please try again after midnight UTC. 🙏";

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
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error?.message || String(error),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
