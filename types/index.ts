/**
 * Shared Type Definitions
 * These types are used across the application for consistent typing
 */

import type { Bank } from '@prisma/client'

/**
 * Re-export Bank enum from Prisma
 */
export { Bank } from '@prisma/client'

/**
 * Verification Result returned to client
 */
export interface VerificationResult {
  status: 'safe' | 'warning' | 'danger'
  accountName: string
  accountNumber: string
  bank: string
  message: string
  matchedType?: 'FOUNDATION' | 'BLACKLIST' | 'NONE'
}

/**
 * Foundation data structure
 */
export interface Foundation {
  id: string
  name: string
  accountName: string
  bank: Bank
  accountNumber: string
  category: string
  verified: boolean
}

/**
 * Blacklisted account data structure
 */
export interface BlacklistedAccount {
  id: string
  accountNumber: string
  accountName: string
  bank: Bank
  reportedBy?: string | null
  reason?: string | null
  createdAt: Date
}

/**
 * Extracted account data from image processing
 */
export interface ExtractedAccountData {
  accountNumber: string
  accountName?: string
  bank?: Bank
  qrCodeData?: string
}

/**
 * Verification log entry
 */
export interface VerificationLog {
  id: string
  accountNumber: string
  accountName?: string | null
  bank?: Bank | null
  status: string
  userId?: string | null
  source: string
  createdAt: Date
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  error: string
  code?: string
  details?: unknown
}

  qrCodeData?: string
}

export interface LoadingStage {
  icon: React.ReactNode
  text: string
  duration: number
}
