import { GoogleGenAI } from "@google/genai";

// Standard Gemini initialization
const getAiKey = () => {
  const key = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    console.warn("[REvuBOT] GEMINI_API_KEY is missing or using placeholder. AI features will be disabled.");
  }
  return key || "AI_KEY_MISSING";
};

const ai = new GoogleGenAI({ apiKey: getAiKey() });

export async function generateTravelAdvice(prompt: string, history: any[] = [], language: string = 'en', imageData?: string, mimeType: string = "image/jpeg") {
  try {
    const isAuto = language === 'auto';
    const systemInstruction = `You are REvuBOT, the ultimate Thailand tour guide. 
    
    TACTICAL MODE: ${imageData ? "VISUAL ANALYSIS" : "TEXTUAL Q&A"}.
    ${imageData ? "If an image is provided, focus on translating text (if a menu/sign) or providing cultural context (if a landmark)." : ""}
    
    LANGUAGE: ${isAuto ? "AUTO-DETECT" : language}.
    Support: en, th, hi, si.
    
    EXPERTISE: Thai culture, visa, transit, food.`;

    const contents = [
      ...history,
      { 
        role: 'user', 
        parts: [
          { text: prompt },
          ...(imageData ? [{ inlineData: { data: imageData, mimeType } }] : [])
        ] 
      }
    ];

    const chat = ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents,
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
