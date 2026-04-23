/**
 * REvuBOT AI Client
 * Connects to the backend API which proxies to Gemini Flash 3.0
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
      throw new Error(errorData.error || 'Failed to get response from AI');
    }

    // Create a readable stream from the response body
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to read response stream');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines (SSE format)
      let lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              yield { text: parsed.text };
            }
          } catch (e) {
            // If not JSON, treat as plain text
            yield { text: data };
          }
        }
      }
    }
  } catch (error: any) {
    console.error("Neural Error in Frontend:", error);
    throw error;
  }
}
