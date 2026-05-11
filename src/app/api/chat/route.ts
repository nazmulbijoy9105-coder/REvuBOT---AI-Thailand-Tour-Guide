import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

// ===== PRISMA =====
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ===== SYSTEM PROMPT =====
const SYSTEM_PROMPT = `You are REvuBOT, an expert AI Thailand Tour Guide.

## MANDATORY RESPONSE RULES:

1. **BE SPECIFIC, NOT BROAD** — Give exact names, prices, locations, hours.
   BAD: "There are many temples in Bangkok."
   GOOD: "Visit Wat Arun (entrance 100 THB, open 8AM-6PM). Take the Chao Phraya Express Boat to Tha Tien pier — 16 THB."

2. **BE PRECISE** — Answer exactly what was asked. Do NOT add unrelated info.

3. **SUMMARY FORMAT** — Use bullet points, short paragraphs. Scannable.
   - **Wat Pho**: 200 THB, 8AM-6:30PM, nearest BTS: Saphan Taksin + boat
   - **Wat Arun**: 100 THB, 8AM-6PM, same boat to Tha Tien pier

4. **ASK BEFORE ASSUMING** — If unclear, ask 1-2 focused questions:
   "What's your budget range? Solo or with family?"

5. **FOCUS ON CLIENT NEEDS** — Match their budget and travel style exactly.

6. **ACTIONABLE NEXT STEPS** — Always end with what they should DO next.

## YOUR KNOWLEDGE:
- All 77 provinces of Thailand
- Transport: BTS, MRT, boats, tuk-tuks, Grab, trains, buses
- Accommodation by budget tier
- Street food to fine dining with THB prices
- Temples, beaches, islands, mountains, national parks
- Visa, customs, cultural etiquette
- Safety tips, scams to avoid
- Seasonal recommendations
- Thai language basics for travelers

## RESPONSE FORMAT:
- Use **bold** for names and prices
- Use bullet lists for multiple options
- Keep under 200 words unless asked for detail
- Always include THB prices and transport info
- End with a follow-up question or next step

If asked outside Thailand, redirect politely.
If asked illegal, refuse politely.
Always respect Thai culture.`;

// ===== GROQ CLIENT (FREE TIER - LLAMA 3) =====
const groq = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

async function chatWithGroq(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  const start = Date.now();
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.3,
    max_tokens: 800,
    frequency_penalty: 0.3,
    presence_penalty: 0.2,
  });
  return {
    content: response.choices[0]?.message?.content || 'Sorry, no response generated.',
    provider: 'groq-llama3',
    responseTime: Date.now() - start,
  };
}

// ===== CHAT API ROUTE =====
export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 chars)' }, { status: 400 });
    }

    let convoId = conversationId;
    let previousMessages: { role: 'user' | 'assistant'; content: string }[] = [];

    if (convoId) {
      const convo = await prisma.conversation.findUnique({
        where: { id: convoId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (!convo) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }
      previousMessages = convo.messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
    } else {
      const convo = await prisma.conversation.create({
        data: { title: message.slice(0, 50) },
      });
      convoId = convo.id;
    }

    // Save user message
    await prisma.message.create({
      data: { conversationId: convoId, role: 'user', content: message },
    });

    // Build messages for AI (last 10 for context)
    const chatMessages = [...previousMessages.slice(-10), { role: 'user' as const, content: message }];

    // Call Groq (free)
    let result;
    try {
      result = await chatWithGroq(chatMessages);
    } catch (error: any) {
      result = {
        content: "⚠️ AI service is currently unavailable. Please check that the GROQ_API_KEY is set correctly in Vercel environment variables.",
        provider: 'error',
        responseTime: 0,
      };
    }

    // Save assistant message
    await prisma.message.create({
      data: {
        conversationId: convoId,
        role: 'assistant',
        content: result.content,
        aiProvider: result.provider,
        responseTime: result.responseTime,
      },
    });

    return NextResponse.json({
      content: result.content,
      provider: result.provider,
      responseTime: result.responseTime,
      conversationId: convoId,
    });
  } catch (error: any) {
    console.error('[Chat API Error]', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
