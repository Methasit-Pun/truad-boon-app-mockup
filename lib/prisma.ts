/**
 * Prisma Client Singleton with Proper Error Handling
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { logger } from './logger'
import { DatabaseError } from './errors'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
  // eslint-disable-next-line no-var
  var prismaPool: Pool | undefined
}

/**
 * Get or create connection pool
 */
function getOrCreatePool(databaseUrl: string): Pool {
  if (!global.prismaPool) {
    try {
      global.prismaPool = new Pool({ 
        connectionString: databaseUrl,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      })

      global.prismaPool.on('error', (err) => {
        logger.error('Unexpected database pool error', err)
      })

      logger.info('Database connection pool created')
    } catch (error) {
      logger.error('Failed to create database pool', error)
      throw new DatabaseError('Failed to initialize database connection pool')
    }
  }
  
  return global.prismaPool
}

/**
 * Create Prisma client instance
 */
function createPrismaClient(databaseUrl: string): PrismaClient {
  try {
    const adapter = new PrismaPg(getOrCreatePool(databaseUrl))
    const client = new PrismaClient({ 
      adapter,
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn']
        : ['error'],
    })

    global.prisma = client
    logger.info('Prisma client created')
    
    return client
  } catch (error) {
    logger.error('Failed to create Prisma client', error)
    throw new DatabaseError('Failed to initialize database client')
  }
}

/**
 * Get Prisma client singleton
 * @throws {DatabaseError} If DATABASE_URL is not set
 */
export function getPrisma(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new DatabaseError(
      'DATABASE_URL environment variable is required. ' +
      'Please check your .env file and ensure DATABASE_URL is set.'
    )
  }

  if (!global.prisma) {
    global.prisma = createPrismaClient(databaseUrl)
  }

  return global.prisma
}

/**
 * Disconnect Prisma client and close pool
 * Used for graceful shutdown
 */
export async function disconnectPrisma(): Promise<void> {
  try {
    if (global.prisma) {
      await global.prisma.$disconnect()
      global.prisma = undefined
      logger.info('Prisma client disconnected')
    }

    if (global.prismaPool) {
      await global.prismaPool.end()
      global.prismaPool = undefined
      logger.info('Database pool closed')
    }
  } catch (error) {
    logger.error('Error during Prisma disconnect', error)
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const prisma = getPrisma()
    await prisma.$queryRaw`SELECT 1`
    logger.info('Database connection test successful')
    return true
  } catch (error) {
    logger.error('Database connection test failed', error)
    return false
  }
}

// Handle graceful shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', () => {
    disconnectPrisma()
  })
}

