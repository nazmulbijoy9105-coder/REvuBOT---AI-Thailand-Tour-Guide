import { NextResponse } from 'next/server';

export async function GET() {
  const results: Record<string, any> = {};

  // Check env vars
  results.env = {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET (' + process.env.DATABASE_URL.slice(0, 30) + '...)' : 'MISSING',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? 'SET (' + process.env.DEEPSEEK_API_KEY.slice(0, 6) + '...)' : 'MISSING',
    GROK_API_KEY: process.env.GROK_API_KEY ? 'SET (' + process.env.GROK_API_KEY.slice(0, 6) + '...)' : 'MISSING',
  };

  // Test DB connection
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    results.database = 'CONNECTED';
    
    // Check if tables exist
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    ` as any[];
    results.tables = tableCheck.map((t: any) => t.table_name);
    
    await prisma.$disconnect();
  } catch (error: any) {
    results.database = 'FAILED: ' + error.message;
  }

  // Test DeepSeek API
  try {
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5,
    });
    results.deepseek = 'WORKING: ' + response.choices[0]?.message?.content;
  } catch (error: any) {
    results.deepseek = 'FAILED: ' + error.message;
  }

  // Test Grok API
  try {
    const OpenAI = (await import('openai')).default;
    const client = new OpenAI({
      baseURL: 'https://api.x.ai/v1',
      apiKey: process.env.GROK_API_KEY,
    });
    const response = await client.chat.completions.create({
      model: 'grok-3-mini',
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5,
    });
    results.grok = 'WORKING: ' + response.choices[0]?.message?.content;
  } catch (error: any) {
    results.grok = 'FAILED: ' + error.message;
  }

  return NextResponse.json(results, { status: 200 });
}
