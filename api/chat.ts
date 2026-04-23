import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawGeminiKey = (process.env.GEMINI_API_KEY || "").trim();
  const geminiKey = rawGeminiKey && !rawGeminiKey.includes("YOUR_API_KEY") ? rawGeminiKey : null;

  if (!geminiKey) {
    return res.status(401).json({ error: "Neural Engine not configured. Please supply GEMINI_API_KEY." });
  }

  try {
    const { message, history = [], language = "en", imageData, mimeType } = req.body;
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const contents = [
      ...history.map((h: any) => ({
        role: h.role === "model" ? "model" : "user",
        parts: h.parts.map((p: any) => ({ text: p.text }))
      })),
      {
        role: "user",
        parts: [
          { text: message },
          ...(imageData ? [{ inlineData: { data: imageData, mimeType } }] : [])
        ]
      }
    ];

    const model = ai.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: `You are REvuBOT, a helpful Thailand tour guide. 
      Support languages: English, Thai, Hindi, Sinhala. 
      Always prioritize the user's selected language: ${language}.
      Be professional, high-intelligence, and safety-conscious.`
    });

    const result = await model.generateContentStream({ contents });

    res.setHeader("Content-Type", "text/plain");
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) res.write(chunkText);
    }
    res.end();
  } catch (error: any) {
    console.error("Neural Error in API:", error);
    let clientError = "Internal neural processing error";
    let statusCode = 500;

    if (error.message?.includes("API key not valid")) {
      clientError = "INVALID API KEY: The Gemini API Key provided is rejected by Google. Please check your credentials.";
      statusCode = 401;
    }

    res.status(statusCode).json({
      error: clientError,
      requestId: Math.random().toString(36).substring(7)
    });
  }
}
