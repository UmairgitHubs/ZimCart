import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import config from '../config/config.js';

const connectionString = config.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  max: config.NODE_ENV === 'production' ? 20 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (config.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Re-init prisma client for new schema
export default prisma;
