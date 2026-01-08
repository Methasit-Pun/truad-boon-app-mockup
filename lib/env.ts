/**
 * Environment Variables Configuration and Validation
 * Ensures all required environment variables are present at runtime
 */

import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  DIRECT_URL: z.string().url().optional(),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Supabase (optional)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // LINE Bot (optional)
  LINE_CHANNEL_ACCESS_TOKEN: z.string().optional(),
  LINE_CHANNEL_SECRET: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validates and returns environment variables
 * Throws an error if validation fails
 */
export function getEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join('.')).join(', ')
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}\n` +
        'Please check your .env file and ensure all required variables are set.'
      )
    }
    throw error
  }
}

/**
 * Check if environment variables are valid without throwing
 */
export function validateEnv(): boolean {
  try {
    envSchema.parse(process.env)
    return true
  } catch {
    return false
  }
}

// Export validated env for use across the app
export const env = getEnv()
