import { GoogleGenAI } from "@google/genai";

// Standard Gemini initialization
const getAiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("[REvuBOT] GEMINI_API_KEY is missing. AI features will be disabled. Check your environment variables.");
  }
  return key || "AI_KEY_MISSING";
};

const ai = new GoogleGenAI({ apiKey: getAiKey() });

export async function generateTravelAdvice(prompt: string, history: any[] = [], language: string = 'en') {
  try {
    const isAuto = language === 'auto';
    const systemInstruction = `You are REvuBOT, the ultimate Thailand tour guide and personalized travel assistant for international tourists. 
    
    LANGUAGE PROTOCOL:
    - Current Language Preference: ${isAuto ? "AUTO-DETECT (Respond in the same language as the user's message)" : language}.
    - Support languages: English (en), Thai (th), Hindi (hi), Sinhala (si).
    - If language is not 'auto', you MUST respond ONLY in the designated language: ${language}.
    - Use appropriate scripts: Thai (อักษรไทย), Hindi (देवनागरी), Sinhala (සිංහල අක්ෂර).
    
    EXPERTISE:
    - You are an expert on Thai culture, visa requirements, transportation (tuk-tuks, BTS, trains), local food, and hidden gems.
    - Mention dress codes for temples (cover shoulders and knees).
    - Provide accurate info on VAT refunds and tourist safety.
    
    FORMATTING:
    - Use Markdown for bolding, lists, and headers.
    - Keep responses professional, helpful, and concise.`;

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
