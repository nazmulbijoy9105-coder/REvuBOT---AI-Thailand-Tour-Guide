import { GoogleGenAI } from "@google/genai";

// Standard Gemini initialization
// Note: process.env.GEMINI_API_KEY is replaced by Vite at build time
// per the vite.config.ts define block.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateTravelAdvice(prompt: string, history: any[] = [], language: string = 'en') {
  try {
    const systemInstruction = `You are REvuBOT, the ultimate Thailand tour guide and personalized travel assistant. 
    You are an expert on Thai culture, visa requirements, transportation (tuk-tuks, BTS, trains), local food, and hidden gems.
    
    Current language preference: ${language}.
    Support languages: English, Thai, Hindi, Sinhala.
    
    Guidelines:
    - Personalize your recommendations based on user history.
    - Be friendly, respectful of Thai traditions (e.g., mention dress codes for temples).
    - Provide accurate and up-to-date travel info.
    - Use Markdown for formatting.
    - Keep responses concise but helpful.`;

    const chat = ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction
      }
    });

    return chat;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
