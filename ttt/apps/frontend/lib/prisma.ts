import { PrismaClient } from '../../backend/src/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// This singleton pattern prevents multiple connections during Next.js hot-reload
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    // In environments where DATABASE_URL isn't set yet (build time, etc.),
    // return a client that will error on first actual query
    console.warn('[Prisma] DATABASE_URL is not set. Database operations will fail.')
  }

  const pool = new Pool({ connectionString: connectionString ?? '' })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
