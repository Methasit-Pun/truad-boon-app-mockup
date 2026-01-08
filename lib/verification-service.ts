/**
 * Account Verification Service
 * Handles account verification against foundation and blacklist databases
 */

import { PrismaClient, Bank } from '@prisma/client'
import type { Foundation, BlacklistedAccount } from '@prisma/client'
import { logger } from '@/lib/logger'
import { DatabaseError } from '@/lib/errors'
import { VERIFICATION_MESSAGES, BANK_NAMES } from '@/lib/constants'

export type VerificationStatus = 'safe' | 'warning' | 'danger'
export type MatchedType = 'FOUNDATION' | 'BLACKLIST' | 'NONE'

export interface VerificationResult {
  status: VerificationStatus
  accountName: string
  accountNumber: string
  bank: string
  message: string
  matchedType: MatchedType
}

/**
 * Normalize account number for comparison
 */
export function normalizeAccountNumber(value: string): string {
  return value.replace(/[^0-9a-z]/gi, '').toLowerCase()
}

/**
 * Find foundation in database
 */
async function findFoundation(
  prisma: PrismaClient,
  accountNumber: string,
  normalizedAccount: string
): Promise<Foundation | null> {
  try {
    // Try direct match first
    const directMatch = await prisma.foundation.findFirst({
      where: {
        verified: true,
        OR: [
          { accountNumber },
          { accountNumber: normalizedAccount },
        ],
      },
    })

    if (directMatch) return directMatch

    // Fallback: normalized comparison
    const allFoundations = await prisma.foundation.findMany({
      where: { verified: true },
    })

    return (
      allFoundations.find(
        (f) => normalizeAccountNumber(f.accountNumber) === normalizedAccount
      ) || null
    )
  } catch (error) {
    logger.error('Database error finding foundation', error)
    throw new DatabaseError('Failed to query foundation database')
  }
}

/**
 * Find blacklisted account in database
 */
async function findBlacklistedAccount(
  prisma: PrismaClient,
  accountNumber: string,
  normalizedAccount: string
): Promise<BlacklistedAccount | null> {
  try {
    // Try direct match first
    const directMatch = await prisma.blacklistedAccount.findFirst({
      where: {
        OR: [
          { accountNumber },
          { accountNumber: normalizedAccount },
        ],
      },
    })

    if (directMatch) return directMatch

    // Fallback: normalized comparison
    const allBlacklisted = await prisma.blacklistedAccount.findMany()

    return (
      allBlacklisted.find(
        (b) => normalizeAccountNumber(b.accountNumber) === normalizedAccount
      ) || null
    )
  } catch (error) {
    logger.error('Database error finding blacklisted account', error)
    throw new DatabaseError('Failed to query blacklist database')
  }
}

/**
 * Get bank display name
 */
function getBankDisplayName(bank?: Bank | string): string {
  if (!bank) return 'ไม่ระบุ'
  if (bank in BANK_NAMES) {
    return BANK_NAMES[bank as Bank]
  }
  return bank
}

/**
 * Build safe verification response
 */
function buildSafeResponse(foundation: Foundation): VerificationResult {
  return {
    status: 'safe',
    accountName: foundation.accountName || foundation.name,
    accountNumber: foundation.accountNumber,
    bank: getBankDisplayName(foundation.bank),
    message: VERIFICATION_MESSAGES.SAFE,
    matchedType: 'FOUNDATION',
  }
}

/**
 * Build danger verification response
 */
function buildDangerResponse(account: BlacklistedAccount): VerificationResult {
  return {
    status: 'danger',
    accountName: account.accountName || 'บัญชีถูกรายงานว่าเป็นมิจฉาชีพ',
    accountNumber: account.accountNumber,
    bank: getBankDisplayName(account.bank),
    message: account.reason || VERIFICATION_MESSAGES.DANGER,
    matchedType: 'BLACKLIST',
  }
}

/**
 * Build warning verification response
 */
function buildWarningResponse(
  accountNumber: string,
  accountName?: string,
  bank?: Bank | string
): VerificationResult {
  return {
    status: 'warning',
    accountName: accountName || 'ไม่พบข้อมูล',
    accountNumber,
    bank: getBankDisplayName(bank),
    message: VERIFICATION_MESSAGES.WARNING,
    matchedType: 'NONE',
  }
}

/**
 * Log verification to database
 */
async function logVerification(
  prisma: PrismaClient,
  result: VerificationResult,
  bank?: Bank,
  source: string = 'WEB'
): Promise<void> {
  try {
    await prisma.verificationLog.create({
      data: {
        accountNumber: result.accountNumber,
        accountName: result.accountName,
        bank,
        status: result.status === 'safe' ? 'SAFE' 
          : result.status === 'danger' ? 'DANGER' 
          : 'WARNING',
        source,
      },
    })
  } catch (error) {
    // Log but don't throw - verification logging shouldn't break the flow
    logger.error('Failed to log verification', error)
  }
}

/**
 * Main verification function
 */
export async function verifyAccount(
  prisma: PrismaClient,
  accountNumber: string,
  accountName?: string,
  bank?: Bank | string,
  source?: string
): Promise<VerificationResult> {
  logger.info('Starting account verification', { accountNumber, bank })

  const normalizedAccount = normalizeAccountNumber(accountNumber)

  if (!normalizedAccount) {
    throw new DatabaseError('Account number must include digits')
  }

  // Query database for matches
  const [foundationMatch, blacklistMatch] = await Promise.all([
    findFoundation(prisma, accountNumber, normalizedAccount),
    findBlacklistedAccount(prisma, accountNumber, normalizedAccount),
  ])

  // Build response based on matches
  let result: VerificationResult

  if (blacklistMatch) {
    result = buildDangerResponse(blacklistMatch)
  } else if (foundationMatch) {
    result = buildSafeResponse(foundationMatch)
  } else {
    result = buildWarningResponse(accountNumber, accountName, bank)
  }

  // Log verification
  const bankEnum = typeof bank === 'string' && bank in Bank ? (bank as Bank) : undefined
  await logVerification(prisma, result, bankEnum, source)

  logger.info('Account verification completed', { 
    status: result.status,
    matchedType: result.matchedType,
  })

  return result
}
