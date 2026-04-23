/**
 * REvuBOT AI Client
 * Proxied neural link to the Express Backend API
 */
export async function* generateTravelAdvice(prompt: string, history: any[] = [], language: string = 'en', imageData?: string, mimeType: string = "image/jpeg") {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        history,
        language,
        imageData,
        mimeType
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Neural Stream unreachable.");

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      if (text) {
        yield { text };
      }
    }
  } catch (error: any) {
    console.error("Neural Error Dispatching to Server:", error);
    throw error;
  }
}
