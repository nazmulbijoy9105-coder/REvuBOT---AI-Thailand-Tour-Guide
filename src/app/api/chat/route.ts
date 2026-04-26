import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { thailandSystemPrompt } from '@/data/thailand-data';

type AgentDebugPayload = {
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
};

function agentDebugLog(payload: AgentDebugPayload) {
  fetch('http://127.0.0.1:7692/ingest/546afc5a-ad75-410d-afea-f935f43c38f1', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '16a81d' }, body: JSON.stringify({ sessionId: '16a81d', ...payload, timestamp: Date.now() }) }).catch(() => {});
}

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

type LlmProvider = {
  name: string;
  baseUrl: string;
  model: string;
  apiKey?: string;
};

async function callOpenAICompatible(provider: LlmProvider, messages: Array<{ role: string; content: string }>): Promise<string> {
  // #region agent log
  agentDebugLog({
    runId: 'initial',
    hypothesisId: 'C',
    location: 'src/app/api/chat/route.ts:callLLM:before-fetch',
    message: 'LLM request configuration',
    data: {
      provider: provider.name,
      hasApiKey: Boolean(provider.apiKey),
      hasOpenAIBaseUrlEnv: Boolean(process.env.OPENAI_BASE_URL),
      hasModelEnv: Boolean(process.env.LLM_MODEL),
      baseUrlEndsWithSlash: provider.baseUrl.endsWith('/'),
      modelLength: provider.model.length,
      messageCount: messages.length,
    },
  });
  // #endregion

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (provider.apiKey) {
    headers.Authorization = `Bearer ${provider.apiKey}`;
  }

  const response = await fetch(`${provider.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: provider.model, messages }),
  });

  // #region agent log
  agentDebugLog({
    runId: 'initial',
    hypothesisId: 'C,D',
    location: 'src/app/api/chat/route.ts:callLLM:after-fetch',
    message: 'LLM response status',
    data: {
      provider: provider.name,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type'),
    },
  });
  // #endregion

  if (!response.ok) {
    const errorBody = await response.text();
    // #region agent log
    agentDebugLog({
      runId: 'initial',
      hypothesisId: 'D',
      location: 'src/app/api/chat/route.ts:callLLM:error-response',
      message: 'LLM returned non-OK response',
      data: {
        provider: provider.name,
        status: response.status,
        bodyPreview: errorBody.slice(0, 180),
      },
    });
    // #endregion
    throw new Error(`LLM API failed (${response.status}): ${errorBody.slice(0, 200)}`);
  }

  const data = await response.json();
  // #region agent log
  agentDebugLog({
    runId: 'initial',
    hypothesisId: 'D',
    location: 'src/app/api/chat/route.ts:callLLM:parsed-response',
    message: 'LLM response parsed',
    data: {
      provider: provider.name,
      choiceCount: Array.isArray(data.choices) ? data.choices.length : 0,
      contentLength: data.choices?.[0]?.message?.content?.length ?? 0,
    },
  });
  // #endregion
  return data.choices?.[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';
}

async function callLLM(messages: Array<{ role: string; content: string }>): Promise<string> {
  const primaryApiKey = process.env.GEMINI_API_KEY;
  const primaryBaseUrl = process.env.OPENAI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
  const primaryModel = process.env.LLM_MODEL || 'gemini-2.0-flash';

  const providers: LlmProvider[] = [
    {
      name: 'configured',
      baseUrl: primaryBaseUrl,
      model: primaryModel,
      apiKey: primaryApiKey,
    },
    {
      name: 'pollinations-free',
      baseUrl: 'https://text.pollinations.ai/openai',
      model: 'openai',
    },
  ];

  let lastError: unknown;
  for (const provider of providers) {
    try {
      return await callOpenAICompatible(provider, messages);
    } catch (error) {
      lastError = error;
      // #region agent log
      agentDebugLog({
        runId: 'initial',
        hypothesisId: 'D',
        location: 'src/app/api/chat/route.ts:callLLM:fallback',
        message: 'LLM provider failed, trying next provider',
        data: {
          provider: provider.name,
          errorMessage: error instanceof Error ? error.message.slice(0, 220) : String(error).slice(0, 220),
        },
      });
      // #endregion
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, travelMode = 'solo' } = await req.json();

    // #region agent log
    agentDebugLog({
      runId: 'initial',
      hypothesisId: 'A',
      location: 'src/app/api/chat/route.ts:POST:request',
      message: 'Chat API received request',
      data: {
        hasMessage: Boolean(message),
        messageLength: typeof message === 'string' ? message.length : 0,
        hasSessionId: Boolean(sessionId),
        travelMode,
      },
    });
    // #endregion

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

    // #region agent log
    agentDebugLog({
      runId: 'initial',
      hypothesisId: 'B',
      location: 'src/app/api/chat/route.ts:POST:before-stream',
      message: 'Session and messages prepared',
      data: {
        foundOrCreatedSession: Boolean(session),
        effectiveSessionIdChanged: effectiveSessionId !== sessionId,
        dbMessageCount: dbMessages.length,
        trimmedMessageCount: trimmedMessages.length,
      },
    });
    // #endregion

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
          let chunksSent = 0;

          for (let i = 0; i < words.length; i += chunkSize) {
            if (!clientConnected) break;
            const chunk = words.slice(i, i + chunkSize).join(' ');
            const data = JSON.stringify({ content: chunk, done: false, isFirst });
            isFirst = false;
            const ok = safeEnqueue(controller, encoder, 'data: ' + data + '\n\n');
            if (!ok) { clientConnected = false; break; }
            chunksSent += 1;
            await new Promise((resolve) => setTimeout(resolve, 15));
          }

          if (clientConnected) {
            safeEnqueue(controller, encoder, 'data: ' + JSON.stringify({ done: true, fullResponse }) + '\n\n');
          }

          // #region agent log
          agentDebugLog({
            runId: 'initial',
            hypothesisId: 'E',
            location: 'src/app/api/chat/route.ts:stream:complete',
            message: 'Chat stream completed',
            data: {
              clientConnected,
              responseLength: fullResponse.length,
              chunksSent,
            },
          });
          // #endregion

          try { controller.close(); } catch { /* */ }
        } catch (error: any) {
          console.error('[REvuBOT] Streaming error:', error?.message || error);
          // #region agent log
          agentDebugLog({
            runId: 'initial',
            hypothesisId: 'B,D',
            location: 'src/app/api/chat/route.ts:stream:error',
            message: 'Chat stream failed',
            data: {
              errorMessage: error?.message || String(error),
              responseLength: fullResponse.length,
            },
          });
          // #endregion
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
