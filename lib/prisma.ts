import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// For serverless: Pass config directly to adapter
const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log('[Prisma] Initializing with:', {
  hasUrl: !!process.env.TURSO_DATABASE_URL,
  hasToken: !!process.env.TURSO_AUTH_TOKEN,
  urlPrefix: process.env.TURSO_DATABASE_URL?.substring(0, 20) + '...',
  nodeEnv: process.env.NODE_ENV,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter,
  log: ['error', 'warn', 'query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;