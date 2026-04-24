import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sessions = await db.chatSession.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, travelMode, language } = await req.json();
    const session = await db.chatSession.create({
      data: {
        title: title || 'New Chat',
        travelMode: travelMode || 'solo',
        language: language || 'en',
      },
    });
    return NextResponse.json(session);
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    await db.message.deleteMany({ where: { sessionId } });
    await db.chatSession.delete({ where: { id: sessionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete session:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
