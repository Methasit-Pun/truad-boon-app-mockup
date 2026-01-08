/**
 * Verify Account API Route
 * Handles account verification against foundation and blacklist databases
 */

import { NextRequest, NextResponse } from 'next/server'
import { Bank } from '@prisma/client'
import { getPrisma } from '@/lib/prisma'
import { verifyAccount, VerificationResult } from '@/lib/verification-service'
import { logger } from '@/lib/logger'
import { formatErrorResponse, ValidationError } from '@/lib/errors'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    logger.info('POST /api/verify-account - Request received')

    const body = await request.json()
    const { accountNumber, accountName, bank, source = 'WEB' } = body

    if (!accountNumber || typeof accountNumber !== 'string') {
      throw new ValidationError('accountNumber is required and must be a string')
    }

    const prisma = getPrisma()

    // Parse bank if it's a string
    const bankValue = typeof bank === 'string' && bank in Bank 
      ? (bank as Bank) 
      : bank

    // Verify the account
    const result: VerificationResult = await verifyAccount(
      prisma,
      accountNumber,
      accountName,
      bankValue,
      source
    )

    logger.info('POST /api/verify-account - Success', { 
      status: result.status,
      matchedType: result.matchedType,
    })

    return NextResponse.json(result)
    
  } catch (error) {
    logger.error('POST /api/verify-account - Error', error)
    
    const errorResponse = formatErrorResponse(error)
    return NextResponse.json(
      errorResponse,
      { status: errorResponse.statusCode }
    )
  }
}

