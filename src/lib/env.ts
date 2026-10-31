import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_TEST: z.string().min(1),
  APP_URL: z.string().url().transform((v) => v.replace(/\/+$/, '')),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  ADMIN_SEED_EMAIL: z.string().email(),
  ADMIN_SEED_PASSWORD: z.string().min(12),
})

export type Env = z.infer<typeof schema>

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = schema.safeParse(source)
  if (!result.success) {
    const detail = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ')
    throw new Error(`Invalid environment: ${detail}`)
  }
  if (result.data.DATABASE_URL_TEST === result.data.DATABASE_URL) {
    throw new Error('Invalid environment: DATABASE_URL_TEST must differ from DATABASE_URL')
  }
  return result.data
}

let cached: Env | null = null

export function getEnv(): Env {
  if (!cached) {
    const fallbackSource: Record<string, string | undefined> = {
      DATABASE_URL: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27018/gala?replicaSet=rs0',
      DATABASE_URL_TEST: process.env.DATABASE_URL_TEST || 'mongodb://127.0.0.1:27018/gala_test?replicaSet=rs0',
      APP_URL: process.env.APP_URL || 'http://localhost:3000',
      SESSION_SECRET: process.env.SESSION_SECRET || 'c304f56f14066f1cf1d93d39589d81d2c304f56f14066f1cf1d93d39589d81d2',
      ADMIN_SEED_EMAIL: process.env.ADMIN_SEED_EMAIL || 'owner@example.com',
      ADMIN_SEED_PASSWORD: process.env.ADMIN_SEED_PASSWORD || 'hunter2hunter2',
    }
    cached = parseEnv(fallbackSource)
  }
  return cached
}
