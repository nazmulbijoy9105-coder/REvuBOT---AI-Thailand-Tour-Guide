export async function* generateTravelAdvice(
  prompt,
  history = [],
  language = "en",
  imageData,
  mimeType = "image/jpeg"
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: prompt,
      history,
      language,
      imageData,
      mimeType
    })
  });

  if (!res.body) throw new Error("No response stream");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    yield {
      text: decoder.decode(value)
    };
  }
}
