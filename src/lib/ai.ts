export async function* generateTravelAdvice(
  message: string,
  history: any[],
  language: string,
  imageData?: string,
  mimeType?: string,
  engine: string = 'gemini'
) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, language, imageData, mimeType, engine })
  });

  // CATCH BACKEND ERRORS HERE
  if (!response.ok) {
    let errorData: any = {};
    try { errorData = await response.json(); } catch (e) { errorData = { error: "Unknown server error" }; }
    
    const error = new Error(errorData.error || "Request failed");
    (error as any).retryable = errorData.retryable || false;
    throw error;
  }

  // STREAM IF SUCCESSFUL
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Failed to get stream");

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    if (buffer) {
      yield { text: buffer };
      buffer = '';
    }
  }
}
