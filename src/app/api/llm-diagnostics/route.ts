function redactSecrets(value: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? value.replaceAll(apiKey, '[REDACTED_API_KEY]') : value;
}

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
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
    return Response.json(diagnostics, { status: 200 });
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
      }),
      signal: AbortSignal.timeout(15000),
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const body = redactSecrets((await response.text()).slice(0, 500));
      diagnostics.llm = {
        ok: false,
        status: response.status,
        contentType,
        errorPreview: body,
      };
      return Response.json(diagnostics, { status: 200 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    diagnostics.llm = {
      ok: Boolean(content),
      status: response.status,
      contentType,
      contentLength: typeof content === 'string' ? content.length : 0,
    };
    return Response.json(diagnostics, { status: 200 });
  } catch (error) {
    diagnostics.llm = {
      ok: false,
      errorPreview: redactSecrets(error instanceof Error ? error.message : String(error)),
    };
    return Response.json(diagnostics, { status: 200 });
  }
}
