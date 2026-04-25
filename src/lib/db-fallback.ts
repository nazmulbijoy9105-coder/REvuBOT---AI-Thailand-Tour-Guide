// In-memory database fallback for serverless environments (Vercel)
// where SQLite/file-based Prisma doesn't work

interface SessionRecord {
  id: string;
  title: string;
  travelMode: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  messages: MessageRecord[];
}

interface MessageRecord {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  createdAt: string;
}

interface FeedbackRecord {
  id: string;
  category: string;
  message: string;
  createdAt: string;
}

// Global in-memory store (persists across requests in the same serverless instance)
const globalForDb = globalThis as unknown as {
  memorySessions: Map<string, SessionRecord> | undefined;
  memoryMessages: Map<string, MessageRecord> | undefined;
  memoryFeedbacks: Map<string, FeedbackRecord> | undefined;
  messageCounter: number | undefined;
  feedbackCounter: number | undefined;
};

const sessions = globalForDb.memorySessions ?? new Map<string, SessionRecord>();
const messages = globalForDb.memoryMessages ?? new Map<string, MessageRecord>();
const feedbacks = globalForDb.memoryFeedbacks ?? new Map<string, FeedbackRecord>();
let messageCounter = globalForDb.messageCounter ?? 0;
let feedbackCounter = globalForDb.feedbackCounter ?? 0;

globalForDb.memorySessions = sessions;
globalForDb.memoryMessages = messages;
globalForDb.memoryFeedbacks = feedbacks;
globalForDb.messageCounter = messageCounter;
globalForDb.feedbackCounter = feedbackCounter;

function genId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const memoryDb = {
  session: {
    findMany: async (): Promise<SessionRecord[]> => {
      return Array.from(sessions.values()).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },
    findUnique: async ({ where }: { where: { id: string } }): Promise<SessionRecord | null> => {
      return sessions.get(where.id) || null;
    },
    create: async ({ data }: { data: { title: string; travelMode: string; language: string } }): Promise<SessionRecord> => {
      const now = new Date().toISOString();
      const record: SessionRecord = {
        id: genId(),
        title: data.title,
        travelMode: data.travelMode,
        language: data.language,
        createdAt: now,
        updatedAt: now,
        messages: [],
      };
      sessions.set(record.id, record);
      return record;
    },
    update: async ({ where, data }: { where: { id: string }; data: { title?: string; updatedAt?: string } }): Promise<SessionRecord> => {
      const record = sessions.get(where.id);
      if (!record) throw new Error('Session not found');
      if (data.title) record.title = data.title;
      if (data.updatedAt) record.updatedAt = data.updatedAt;
      else record.updatedAt = new Date().toISOString();
      sessions.set(where.id, record);
      return record;
    },
    delete: async ({ where }: { where: { id: string } }): Promise<SessionRecord> => {
      const record = sessions.get(where.id);
      if (!record) throw new Error('Session not found');
      sessions.delete(where.id);
      // Delete associated messages
      for (const [key, msg] of messages.entries()) {
        if (msg.sessionId === where.id) {
          messages.delete(key);
        }
      }
      return record;
    },
  },
  message: {
    findMany: async ({ where, orderBy }: { where: { sessionId: string }; orderBy?: { createdAt: string } }): Promise<MessageRecord[]> => {
      const result = Array.from(messages.values())
        .filter((m) => m.sessionId === where.sessionId);
      if (orderBy?.createdAt === 'asc') {
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      return result;
    },
    count: async ({ where }: { where: { sessionId: string } }): Promise<number> => {
      return Array.from(messages.values()).filter((m) => m.sessionId === where.sessionId).length;
    },
    create: async ({ data }: { data: { sessionId: string; role: string; content: string } }): Promise<MessageRecord> => {
      messageCounter++;
      const record: MessageRecord = {
        id: `msg_${messageCounter}`,
        sessionId: data.sessionId,
        role: data.role,
        content: data.content,
        createdAt: new Date().toISOString(),
      };
      messages.set(record.id, record);
      // Update session timestamp
      const session = sessions.get(data.sessionId);
      if (session) {
        session.updatedAt = new Date().toISOString();
        sessions.set(data.sessionId, session);
      }
      return record;
    },
    deleteMany: async ({ where }: { where: { sessionId: string } }): Promise<void> => {
      for (const [key, msg] of messages.entries()) {
        if (msg.sessionId === where.sessionId) {
          messages.delete(key);
        }
      }
    },
  },
  feedback: {
    create: async ({ data }: { data: { category: string; message: string } }): Promise<FeedbackRecord> => {
      feedbackCounter++;
      const record: FeedbackRecord = {
        id: `fb_${feedbackCounter}`,
        category: data.category,
        message: data.message,
        createdAt: new Date().toISOString(),
      };
      feedbacks.set(record.id, record);
      return record;
    },
  },
};
