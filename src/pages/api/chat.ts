import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawGeminiKey = (process.env.GEMINI_API_KEY || "").trim();
  const rawGrokKey = (process.env.GROK_API_KEY || "").trim();

  const geminiKey = rawGeminiKey && !rawGeminiKey.includes("YOUR_API_KEY") ? rawGeminiKey : null;
  const grokKey = rawGrokKey && !rawGrokKey.includes("YOUR_API_KEY") ? rawGrokKey : null;

  try {
    const { message, history = [], language = "en", imageData, mimeType } = req.body;

    if (geminiKey) {
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

      const stream = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction: `You are REvuBOT, a helpful Thailand tour guide.
          Support languages: English, Thai, Hindi, Sinhala.
          Always prioritize the user's selected language: ${language}.
          Be professional, high-intelligence, and safety-conscious.`
        }
      });

      res.setHeader("Content-Type", "text/plain");
      for await (const chunk of stream) {
        if (chunk.text) res.write(chunk.text);
      }
      res.end();
      return;
    }

    if (grokKey) {
      const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${grokKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `You are REvuBOT, a helpful Thailand tour guide. Support languages: English, Thai, Hindi, Sinhala. Current user language preference: ${language}` },
            ...history,
            { role: "user", content: message }
          ],
          model: "grok-beta"
        })
      });
      const data = await grokRes.json();
      return res.json({ reply: data.choices[0].message.content });
    }

    return res.status(401).json({ error: "Neural Engine not configured. Please supply GEMINI_API_KEY." });
  } catch (error: any) {
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
