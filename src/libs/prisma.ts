import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'prigen/client';

// ----------------------------------------------------------------------

const createPrismaClient = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 10,
    allowPublicKeyRetrieval: true,
    logger: {
      network: (info) => {
        console.log('PrismaAdapterNetwork', info);
      },
      query: (info) => {
        console.log('PrismaAdapterQuery', info);
      },
      error: (error) => {
        console.error('PrismaAdapterError', error);
      },
      warning: (info) => {
        console.warn('PrismaAdapterWarning', info);
      },
    },
  });

  return new PrismaClient({ adapter });
};

// ----------------------------------------------------------------------

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const db = globalForPrisma.prisma ?? createPrismaClient();

export default db;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
