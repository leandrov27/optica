import { PrismaClient } from 'src/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined;
};

const db =
  process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : globalForPrisma.db ?? (globalForPrisma.db = new PrismaClient());

export default db;
