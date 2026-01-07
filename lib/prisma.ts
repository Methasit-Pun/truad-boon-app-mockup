import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// For Node.js: Pass config directly to adapter (don't use createClient)
const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  adapter,
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;