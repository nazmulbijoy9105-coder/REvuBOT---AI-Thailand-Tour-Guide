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
    prismaModule = new PrismaClient({ log: [] });

    const globalForPrisma = globalThis as unknown as {
      prisma: any | undefined;
    };

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = globalForPrisma.prisma ?? prismaModule;
      prismaModule = globalForPrisma.prisma;
    }
  } catch {
    prismaAvailable = false;
  }
}

// Create a db object that matches Prisma's API shape using memoryDb
// This ensures consistent API regardless of which backend is used
const memoryDbAdapter = {
  chatSession: {
    findMany: async (opts?: any) => {
      let results = await memoryDb.session.findMany();
      // Support include.messages
      if (opts?.include?.messages) {
        results = results.map(s => ({ ...s, messages: s.messages || [] }));
      }
      return results;
    },
    findUnique: async (opts: any) => {
      const result = await memoryDb.session.findUnique({ where: opts.where });
      if (result && opts?.include?.messages) {
        return { ...result, messages: await memoryDb.message.findMany({ where: { sessionId: result.id } }) };
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
};

// Export the appropriate db based on environment
export const db = prismaAvailable && prismaModule ? prismaModule : memoryDbAdapter;
