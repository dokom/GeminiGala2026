import { PrismaClient } from '@prisma/client'
import { createMockPrisma } from './mock-db'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function getPrismaInstance(): PrismaClient {
  const isLocalMongo =
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes('127.0.0.1:27018') ||
    process.env.DATABASE_URL.includes('localhost:27018')

  // In AI Studio environment without external MongoDB, serve from mock directly
  // to avoid Prisma connection timeouts on localhost:27018.
  if (isLocalMongo && process.env.USE_REAL_PRISMA !== 'true') {
    return createMockPrisma() as PrismaClient
  }

  let realPrisma: PrismaClient | null = null
  try {
    realPrisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
  } catch {
    console.warn('[AI Studio] Database not connected — using mock')
  }

  return (realPrisma ?? createMockPrisma()) as PrismaClient
}

export const prisma = globalForPrisma.prisma ?? getPrismaInstance()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
