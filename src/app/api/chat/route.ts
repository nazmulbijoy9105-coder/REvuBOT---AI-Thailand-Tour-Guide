import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { routeChat } from '@/lib/ai/router';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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
        include: { messages: { orderBy: { createdAt: 'asc' } }, preference: true },
      });
      if (!convo) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }
      previousMessages = convo.messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      // Add preference context if available
      if (convo.preference) {
        const p = convo.preference;
        const parts = [];
        if (p.budget) parts.push(`Budget: ${p.budget}`);
        if (p.travelStyle) parts.push(`Style: ${p.travelStyle}`);
        if (p.interests?.length) parts.push(`Interests: ${p.interests.join(', ')}`);
        if (p.groupType) parts.push(`Group: ${p.groupType}`);
        if (parts.length) {
          previousMessages.push({
            role: 'assistant',
            content: `[User Profile noted: ${parts.join(' | ')}]`,
          });
        }
      }
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

    // Route to AI
    const result = await routeChat(chatMessages);

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
