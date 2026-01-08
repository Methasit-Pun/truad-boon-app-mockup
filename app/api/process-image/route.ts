/**
 * Process Image API Route
 * Handles image upload and extraction of account information
 */

import { NextRequest, NextResponse } from 'next/server'
import { processImage, ExtractedData } from '@/lib/image-processor'
import { logger } from '@/lib/logger'
import { formatErrorResponse, ValidationError } from '@/lib/errors'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    logger.info('POST /api/process-image - Request received')

    const body = await request.json()
    const { image } = body

    if (!image || typeof image !== 'string') {
      throw new ValidationError('Image is required and must be a base64 string')
    }

    // Process the image
    const result: ExtractedData = await processImage(image)

    logger.info('POST /api/process-image - Success')
    return NextResponse.json(result)
    
  } catch (error) {
    logger.error('POST /api/process-image - Error', error)
    
    const errorResponse = formatErrorResponse(error)
    return NextResponse.json(
      errorResponse,
      { status: errorResponse.statusCode }
    )
  }
}

