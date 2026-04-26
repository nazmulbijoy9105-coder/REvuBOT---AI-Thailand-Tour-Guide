function redactSecrets(value: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? value.replaceAll(apiKey, '[REDACTED_API_KEY]') : value;
}

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

async function testModel(targetUrl: string, apiKey: string | undefined, model: string) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
      }),
      signal: AbortSignal.timeout(15000),
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const body = redactSecrets((await response.text()).slice(0, 500));
      return {
        ok: false,
        status: response.status,
        contentType,
        errorPreview: body,
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return {
      ok: Boolean(content),
      status: response.status,
      contentType,
      contentLength: typeof content === 'string' ? content.length : 0,
    };
  } catch (error) {
    return {
      ok: false,
      errorPreview: redactSecrets(error instanceof Error ? error.message : String(error)),
    };
  }
}

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
  const model = process.env.LLM_MODEL || 'gemini-2.0-flash';
  const targetUrl = joinUrl(baseUrl, '/chat/completions');

  const diagnostics = {
    env: {
      hasGeminiApiKey: Boolean(apiKey),
      hasOpenAIBaseUrl: Boolean(process.env.OPENAI_BASE_URL),
      hasLlmModel: Boolean(process.env.LLM_MODEL),
      baseUrlValid: true,
      baseUrlHasTrailingSlash: baseUrl.endsWith('/'),
      modelLength: model.length,
    },
    llm: null as null | {
      ok: boolean;
      status?: number;
      contentType?: string | null;
      errorPreview?: string;
      contentLength?: number;
    },
    candidates: null as null | Record<string, Awaited<ReturnType<typeof testModel>>>,
    fallback: null as null | Awaited<ReturnType<typeof testModel>>,
  };

  try {
    new URL(targetUrl);
  } catch {
    diagnostics.env.baseUrlValid = false;
    return Response.json(diagnostics, { status: 200 });
  }

  if (!apiKey) {
    diagnostics.llm = {
      ok: false,
      errorPreview: 'GEMINI_API_KEY is missing at runtime.',
    };
    diagnostics.fallback = await testModel(
      'https://text.pollinations.ai/openai/chat/completions',
      undefined,
      'openai'
    );
    return Response.json(diagnostics, { status: 200 });
  }

  diagnostics.llm = await testModel(targetUrl, apiKey, model);

  const candidateModels = Array.from(new Set([
    model,
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
  ]));

  diagnostics.candidates = Object.fromEntries(
    await Promise.all(
      candidateModels.map(async (candidateModel) => [
        candidateModel,
        await testModel(targetUrl, apiKey, candidateModel),
      ])
    )
  );

  diagnostics.fallback = await testModel(
    'https://text.pollinations.ai/openai/chat/completions',
    undefined,
    'openai'
  );

  return Response.json(diagnostics, { status: 200 });
}
