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

// LLM Configuration - supports multiple providers via environment variables
interface LLMConfig {
  baseUrl: string;
  apiKey: string;
  model?: string;
  extraHeaders: Record<string, string>;
}

let cachedConfig: LLMConfig | null = null;

async function getLLMConfig(): Promise<LLMConfig | null> {
  if (cachedConfig) return cachedConfig;

  // Option 1: Use OPENAI_API_KEY + OPENAI_BASE_URL (standard OpenAI-compatible)
  const openaiKey = process.env.OPENAI_API_KEY;
  const openaiBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  if (openaiKey) {
    cachedConfig = {
      baseUrl: openaiBaseUrl,
      apiKey: openaiKey,
      model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
      extraHeaders: {},
    };
    return cachedConfig;
  }

  // Option 2: Use ZAI_* env vars (Z-AI SDK format)
  const zaiBaseUrl = process.env.ZAI_BASE_URL;
  const zaiApiKey = process.env.ZAI_API_KEY;
  if (zaiBaseUrl && zaiApiKey) {
    cachedConfig = {
      baseUrl: zaiBaseUrl,
      apiKey: zaiApiKey,
      model: process.env.LLM_MODEL,
      extraHeaders: {
        'X-Z-AI-From': 'Z',
        ...(process.env.ZAI_CHAT_ID ? { 'X-Chat-Id': process.env.ZAI_CHAT_ID } : {}),
        ...(process.env.ZAI_USER_ID ? { 'X-User-Id': process.env.ZAI_USER_ID } : {}),
        ...(process.env.ZAI_TOKEN ? { 'X-Token': process.env.ZAI_TOKEN } : {}),
      },
    };
    return cachedConfig;
  }

  // Option 3: Try reading .z-ai-config file (for local dev)
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');

    const configPaths = [
      path.join(process.cwd(), '.z-ai-config'),
      path.join(os.homedir(), '.z-ai-config'),
      '/etc/.z-ai-config',
    ];

    for (const filePath of configPaths) {
      try {
        const configStr = await fs.readFile(filePath, 'utf-8');
        const config = JSON.parse(configStr);
        if (config.baseUrl && config.apiKey) {
          cachedConfig = {
            baseUrl: config.baseUrl,
            apiKey: config.apiKey,
            model: config.model,
            extraHeaders: {
              'X-Z-AI-From': 'Z',
              ...(config.chatId ? { 'X-Chat-Id': config.chatId } : {}),
              ...(config.userId ? { 'X-User-Id': config.userId } : {}),
              ...(config.token ? { 'X-Token': config.token } : {}),
            },
          };
          return cachedConfig;
        }
      } catch {
        // Continue to next path
      }
    }
  } catch {
    // fs not available
  }

  return null;
}

// Call LLM API (OpenAI-compatible format)
async function callLLM(messages: Array<{ role: string; content: string }>) {
  const config = await getLLMConfig();
  if (!config) {
    throw new Error('LLM not configured. Set OPENAI_API_KEY or ZAI_BASE_URL+ZAI_API_KEY env vars.');
  }

  const url = `${config.baseUrl}/chat/completions`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
    ...config.extraHeaders,
  };

  const body: Record<string, any> = {
    messages,
    thinking: { type: 'disabled' },
  };
  if (config.model) {
    body.model = config.model;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
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

    const encoder = new TextEncoder();
    let fullResponse = '';
    let clientConnected = true;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseText = await callLLM(trimmedMessages);

          // Save to DB
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
