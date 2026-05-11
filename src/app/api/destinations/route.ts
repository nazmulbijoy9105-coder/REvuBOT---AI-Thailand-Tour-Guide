import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const SYSTEM_PROMPT = `You are a Thailand destinations expert. Give SPECIFIC place names, entrance fees in THB, opening hours, and transport info. Format as bullet points. Keep under 150 words.`;

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
        { role: 'user', content: message || 'Best destinations in Thailand' },
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    
    const where: any = {};
    if (category) where.category = category;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    
    const destinations = await prisma.destination.findMany({ where, take: 20 });
    return NextResponse.json(destinations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
