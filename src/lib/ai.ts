import { GoogleGenAI } from "@google/genai";

// Initialize the Google AI SDK
// The GEMINI_API_KEY is provided by the environment in AI Studio
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * REvuBOT AI Client
 * Direct neural link to Gemini Flash 3.0
 */
export async function* generateTravelAdvice(prompt: string, history: any[] = [], language: string = 'en', imageData?: string, mimeType: string = "image/jpeg") {
  try {
    const contents = [
      ...history.map((h: any) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts.map((p: any) => ({ text: p.text }))
      })),
      { 
        role: 'user', 
        parts: [
          { text: prompt },
          ...(imageData ? [{ inlineData: { data: imageData, mimeType } }] : [])
        ] 
      }
    ];

    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction: `You are REvuBOT, a helpful Thailand tour guide. 
        Support languages: English, Thai, Hindi, Sinhala. 
        Always prioritize the user's selected language: ${language}.
        Be professional, high-intelligence, and safety-conscious.
        Format your responses with clean Markdown. Use bolding and lists for readability.`
      }
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield { text: chunk.text };
      }
    }
  } catch (error: any) {
    console.error("Neural Error in Frontend:", error);
    throw error;
  }
}
