import { NextResponse } from 'next/server';

export async function GET() {
  const results: Record<string, any> = {};

  results.env = {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET (' + process.env.DATABASE_URL.slice(0, 30) + '...)' : 'MISSING',
    GROQ_API_KEY: process.env.GROQ_API_KEY ? 'SET (' + process.env.GROQ_API_KEY.slice(0, 6) + '...)' : 'MISSING',
  };

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    results.database = 'CONNECTED';
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    ` as any[];
    results.tables = tableCheck.map((t: any) => t.table_name);
    await prisma.$disconnect();
  } catch (error: any) {
    results.database = 'FAILED: ' + error.message;
  }

  try {
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY || 'missing',
    });
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5,
    });
    results.groq = 'WORKING: ' + response.choices[0]?.message?.content;
  } catch (error: any) {
    results.groq = 'FAILED: ' + error.message;
  }

  return NextResponse.json(results, { status: 200 });
}
