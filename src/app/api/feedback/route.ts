import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a Thailand hotel and accommodation expert. Give SPECIFIC hotel names, exact price ranges in THB, and locations. Format as bullet points. Keep under 150 words. Always include price per night.`;

function getGroqClient() {
  return new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY || 'missing',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message || 'Suggest hotels in Bangkok for mid-range budget' },
      ],
      temperature: 0.3,
      max_tokens: 600,
    });
    return NextResponse.json({
      content: response.choices[0]?.message?.content || 'No response',
      provider: 'groq',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
