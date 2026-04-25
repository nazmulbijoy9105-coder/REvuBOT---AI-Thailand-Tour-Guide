import { memoryDb } from './db-fallback';

// Detect if we're in a serverless environment where SQLite won't work
const isServerless = !!(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NETLIFY ||
  process.env.CF_PAGES
);

// Only try Prisma if we're NOT in a serverless environment
let prismaAvailable = !isServerless;
let prismaModule: any = null;

if (prismaAvailable) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client');
    const freshPrisma = new PrismaClient({ log: [] });

    const globalForPrisma = globalThis as unknown as {
      prisma: any | undefined;
    };

    // Always use the fresh PrismaClient in dev to avoid stale model cache
    if (process.env.NODE_ENV !== 'production') {
      // Replace the cached version with the fresh one to pick up schema changes
      if (globalForPrisma.prisma) {
        try { globalForPrisma.prisma.$disconnect(); } catch { /* ignore */ }
      }
      globalForPrisma.prisma = freshPrisma;
      prismaModule = freshPrisma;
    } else {
      globalForPrisma.prisma = globalForPrisma.prisma ?? freshPrisma;
      prismaModule = globalForPrisma.prisma;
    }
  } catch {
    prismaAvailable = false;
  }
}

// Helper: get messages for a session from memoryDb
async function getMessagesForSession(sessionId: string, opts?: any) {
  const msgs = await memoryDb.message.findMany({
    where: { sessionId },
    orderBy: opts?.orderBy || { createdAt: 'desc' },
  });
  if (opts?.take && msgs.length > opts.take) {
    return msgs.slice(0, opts.take);
  }
  return msgs;
}

// Create a db object that matches Prisma's API shape using memoryDb
// This ensures consistent API regardless of which backend is used
const memoryDbAdapter = {
  chatSession: {
    findMany: async (opts?: any) => {
      let results = await memoryDb.session.findMany();
      // Support include.messages
      if (opts?.include?.messages) {
        results = await Promise.all(
          results.map(async (s: any) => {
            const msgs = await getMessagesForSession(s.id, opts.include.messages);
            return { ...s, messages: msgs };
          })
        );
      }
      // Support orderBy
      if (opts?.orderBy) {
        const field = Object.keys(opts.orderBy)[0];
        const dir = opts.orderBy[field];
        results.sort((a: any, b: any) => {
          if (field === 'updatedAt') {
            return dir === 'desc'
              ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          }
          if (field === 'createdAt') {
            return dir === 'desc'
              ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          return 0;
        });
      }
      // Always return an array
      return Array.isArray(results) ? results : [];
    },
    findUnique: async (opts: any) => {
      const result = await memoryDb.session.findUnique({ where: opts.where });
      if (result && opts?.include?.messages) {
        const msgs = await getMessagesForSession(result.id, opts.include.messages);
        return { ...result, messages: msgs };
      }
      return result;
    },
    create: async (opts: any) => {
      return memoryDb.session.create({ data: opts.data });
    },
    update: async (opts: any) => {
      return memoryDb.session.update({ where: opts.where, data: opts.data });
    },
    delete: async (opts: any) => {
      // Delete messages first
      await memoryDb.message.deleteMany({ where: { sessionId: opts.where.id } });
      return memoryDb.session.delete({ where: opts.where });
    },
  },
  message: {
    findMany: async (opts: any) => {
      return memoryDb.message.findMany({ where: opts.where, orderBy: opts.orderBy });
    },
    count: async (opts: any) => {
      return memoryDb.message.count({ where: opts.where });
    },
    create: async (opts: any) => {
      return memoryDb.message.create({ data: opts.data });
    },
    deleteMany: async (opts: any) => {
      return memoryDb.message.deleteMany({ where: opts.where });
    },
  },
  feedback: {
    create: async (opts: any) => {
      return memoryDb.feedback.create({ data: opts.data });
    },
  },
};

// Create a safe wrapper around Prisma that falls back to memoryDb for missing models
function createSafeDb(prisma: any, fallback: typeof memoryDbAdapter) {
  return new Proxy(fallback, {
    get(target, prop: string) {
      // If Prisma has this model, use it
      if (prisma && prisma[prop] !== undefined) {
        return prisma[prop];
      }
      // Otherwise fall back to memoryDb adapter
      if (target[prop as keyof typeof target] !== undefined) {
        return target[prop as keyof typeof target];
      }
      return undefined;
    },
  });
}

// Export the appropriate db based on environment
export const db = prismaAvailable && prismaModule
  ? createSafeDb(prismaModule, memoryDbAdapter)
  : memoryDbAdapter;
