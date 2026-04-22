/**
 * REvuBOT AI Client
 * Proxies requests to the server to ensure maximum security for API keys.
 */
export async function* generateTravelAdvice(prompt: string, history: any[] = [], language: string = 'en', imageData?: string, mimeType: string = "image/jpeg") {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: prompt, 
        history, 
        language, 
        imageData, 
        mimeType 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Neural Link Failed: ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Neural Stream unreachable.");

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      yield { text: chunk };
    }
  } catch (error) {
    console.error("Neural Error:", error);
    throw error;
  }
}
