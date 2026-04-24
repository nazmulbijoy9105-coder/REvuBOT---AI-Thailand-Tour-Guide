import { GoogleGenAI } from "@google/genai";

// --- Retry helper ---
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const status = error?.status;
      if ((status === 503 || status === 429 || status === 500) && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Unreachable");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // 1. FIX: Block large images before Vercel crashes (4.5MB limit)
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > 4 * 1024 * 1024) {
    return res.status(413).json({ error: "VISUAL OVERFLOW: Image too large. Please compress or use a smaller image.", retryable: false });
  }

  const rawGeminiKey = (process.env.GEMINI_API_KEY || "").trim();
  const geminiKey = rawGeminiKey && !rawGeminiKey.includes("YOUR_API_KEY") ? rawGeminiKey : null;

  if (!geminiKey) return res.status(401).json({ error: "Neural Engine not configured." });

  try {
    const { message, history = [], language = "en", imageData, mimeType } = req.body;
    if (!message?.trim() && !imageData) return res.status(400).json({ error: "Message or image required", retryable: false });

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const contents = [
      ...history.map((h: any) => ({ role: h.role === "model" ? "model" : "user", parts: h.parts.map((p: any) => ({ text: p.text })) })),
      { role: "user", parts: [{ text: message || "" }, ...(imageData ? [{ inlineData: { data: imageData, mimeType } }] : [])] }
    ];

    const response = await withRetry(() =>
      ai.models.generateContentStream({
        model: "gemini-2.0-flash", // 2. FIX: Use stable model, not 3-preview
        contents,
        config: {
          // 3. FIX: Upgraded prompt for Thai knowledge & language lock
          systemInstruction: `You are REvuBOT, an elite Thailand tour guide. 
RULES:
- You MUST reply EXACTLY in this language: ${language === 'bn' ? 'Bengali' : language === 'hi' ? 'Hindi' : language === 'th' ? 'Thai' : language === 'si' ? 'Sinhala' : 'English'}. NEVER switch languages.
- Use a tactical, high-intelligence tone (e.g., "Intel secured", "Route mapped").
- Use Markdown formatting.
KNOWLEDGE: You know Thai visa rules (e-visa for BDT/INR), BTS/MRT routes, street food, temple dress codes, and scam warnings.`
        }
      })
    );

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    for await (const chunk of response) {
      if (chunk.text) res.write(chunk.text);
    }
    res.end();
  } catch (error: any) {
    console.error("Neural Error in API:", error);
    let clientError = "Internal neural processing error";
    let statusCode = 500;
    let retryable = false;

    if (error.message?.includes("API key not valid")) {
      clientError = "INVALID API KEY: Check your credentials.";
      statusCode = 401;
    } else if (error.status === 503 || error.status === 429) {
      clientError = "The AI model is busy. Please wait a moment and try again.";
      statusCode = 429; retryable = true;
    }
    res.status(statusCode).json({ error: clientError, retryable });
  }
}
