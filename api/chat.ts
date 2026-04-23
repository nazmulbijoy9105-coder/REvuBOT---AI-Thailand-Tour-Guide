import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { message, history = [], language = "en", imageData, mimeType } =
      await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response("Missing API Key", { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = [
      ...history,
      {
        role: "user",
        parts: [
          { text: message },
          ...(imageData
            ? [{ inlineData: { data: imageData, mimeType } }]
            : []),
        ],
      },
    ];

    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: `You are REvuBOT, a travel AI for Thailand. Respond in ${language}. Be precise, helpful, and safe.`,
      },
    });

    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
