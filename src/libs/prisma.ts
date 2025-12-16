/*import { PrismaClient } from 'src/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined;
};

const db =
  process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : globalForPrisma.db ?? (globalForPrisma.db = new PrismaClient());

export default db;*/


import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'src/generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const db = new PrismaClient({ adapter });

export default db;