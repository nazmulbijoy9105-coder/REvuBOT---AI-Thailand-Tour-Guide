import { memoryDb } from './db-fallback';

// Check if Prisma/SQLite is available
let prismaAvailable = false;
let prismaModule: any = null;

try {
  // Dynamic require for Prisma - will fail gracefully if not available
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  prismaModule = new PrismaClient({ log: [] });
  prismaAvailable = true;
} catch {
  prismaAvailable = false;
}

// Wrap db with fallback: tries Prisma first, falls back to in-memory on error
function withFallback(prismaObj: any, memoryObj: any): any {
  return new Proxy(memoryObj, {
    get(target, prop) {
      if (prismaAvailable && prismaObj && prismaObj[prop]) {
        const original = prismaObj[prop];
        if (typeof original === 'object' && original !== null) {
          return withFallback(original, target[prop as string]);
        }
        if (typeof original === 'function') {
          return async (...args: any[]) => {
            try {
              return await original.apply(prismaObj, args);
            } catch (err) {
              console.warn(`Prisma failed, using memory fallback:`, (err as Error).message);
              prismaAvailable = false;
              const memoryFn = target[prop as string];
              if (typeof memoryFn === 'function') {
                return await memoryFn.apply(target, args);
              }
              throw err;
            }
          };
        }
        return original;
      }

      const value = target[prop as string];
      if (typeof value === 'function') {
        return value.bind(target);
      }
      return value;
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

const prisma = prismaAvailable ? (globalForPrisma.prisma ?? prismaModule) : null;

if (prismaAvailable && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const db = prismaAvailable && prisma
  ? withFallback(prisma, memoryDb)
  : memoryDb;
