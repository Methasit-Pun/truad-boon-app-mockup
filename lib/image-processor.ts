/**
 * Image Processing Service
 * Handles QR code scanning and OCR text extraction
 */

import jsQR from 'jsqr'
import { createWorker, Worker } from 'tesseract.js'
import { createCanvas, loadImage } from 'canvas'
import { Bank } from '@prisma/client'
import {
  BANK_KEYWORDS,
  ACCOUNT_NUMBER_PATTERNS,
  ACCOUNT_NAME_PATTERNS,
  OCR_CONFIG,
} from '@/lib/constants'
import { logger } from '@/lib/logger'
import { ImageProcessingError } from '@/lib/errors'

export interface ExtractedData {
  accountNumber: string
  accountName?: string
  bank?: Bank
  qrCodeData?: string
}

/**
 * Convert base64 image to ImageData
 */
async function base64ToImageData(base64: string): Promise<ImageData> {
  try {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const img = await loadImage(buffer)
    const canvas = createCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    return ctx.getImageData(0, 0, img.width, img.height)
  } catch (error) {
    logger.error('Failed to convert base64 to ImageData', error)
    throw new ImageProcessingError('Invalid image format')
  }
}

/**
 * Parse PromptPay QR code data
 */
function parsePromptPayQR(qrData: string): Partial<ExtractedData> {
  try {
    let accountNumber = ''
    let bank: Bank = Bank.PROMPTPAY

    // Extract PromptPay ID from EMV QR format (tag 29)
    const promptPayMatch = qrData.match(/29\d{2}0016A000000677010111(\d{13})/)
    if (promptPayMatch) {
      accountNumber = promptPayMatch[1]
      bank = Bank.PROMPTPAY
    }

    // Extract from other bank formats (tag 30)
    const bankMatch = qrData.match(/30\d{2}\d{4}(\w+)/)
    if (bankMatch) {
      const bankData = bankMatch[1]
      if (bankData.includes('KBANK')) bank = Bank.KBANK
      else if (bankData.includes('SCB')) bank = Bank.SCB
      else if (bankData.includes('BBL')) bank = Bank.BBL
      else if (bankData.includes('KTB')) bank = Bank.KTB
    }

    logger.debug('Parsed QR code', { accountNumber, bank })

    return {
      accountNumber: accountNumber || qrData,
      bank,
      qrCodeData: qrData,
    }
  } catch (error) {
    logger.warn('Failed to parse PromptPay QR', error)
    return { qrCodeData: qrData }
  }
}

/**
 * Extract text from image using OCR
 */
async function extractTextFromImage(imageData: ImageData): Promise<string> {
  let worker: Worker | null = null

  try {
    worker = await createWorker(OCR_CONFIG.languages)
    await worker.setParameters({
      tessedit_char_whitelist: OCR_CONFIG.whitelistChars,
    })

    const { data: { text } } = await worker.recognize(imageData)
    logger.debug('OCR text extracted', { textLength: text.length })
    
    return text
  } catch (error) {
    logger.error('OCR processing failed', error)
    throw new ImageProcessingError('Failed to extract text from image')
  } finally {
    if (worker) {
      await worker.terminate()
    }
  }
}

/**
 * Extract account name from OCR text
 */
function extractAccountName(ocrText: string): string | undefined {
  for (const pattern of ACCOUNT_NAME_PATTERNS) {
    const match = ocrText.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }

  // Fallback: Thai name pattern
  const thaiNameMatch = ocrText.match(/([ก-๙]+\s+[ก-๙]+)/)
  if (thaiNameMatch) {
    return thaiNameMatch[1].trim()
  }

  return undefined
}

/**
 * Detect bank from OCR text or QR data
 */
function detectBank(ocrText: string, qrBank?: Bank): Bank {
  if (qrBank) return qrBank

  for (const [keywords, bank] of Object.entries(BANK_KEYWORDS)) {
    const regex = new RegExp(keywords, 'i')
    if (regex.test(ocrText)) {
      return bank
    }
  }

  return Bank.OTHER
}

/**
 * Extract account number from OCR text
 */
function extractAccountNumber(ocrText: string): string | undefined {
  for (const pattern of ACCOUNT_NUMBER_PATTERNS) {
    const match = ocrText.match(pattern)
    if (match) {
      return match[0]
    }
  }
  return undefined
}

/**
 * Main image processing function
 */
export async function processImage(base64Image: string): Promise<ExtractedData> {
  logger.info('Starting image processing')

  const imageData = await base64ToImageData(base64Image)
  let extractedData: Partial<ExtractedData> = {}

  // Step 1: Try QR code extraction
  try {
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height)
    if (qrCode) {
      logger.info('QR code detected')
      extractedData = parsePromptPayQR(qrCode.data)
    }
  } catch (error) {
    logger.warn('QR code detection failed', error)
  }

  // Step 2: OCR text extraction
  const ocrText = await extractTextFromImage(imageData)

  // Step 3: Extract missing data from OCR
  if (!extractedData.accountName) {
    extractedData.accountName = extractAccountName(ocrText)
  }

  if (!extractedData.bank) {
    extractedData.bank = detectBank(ocrText, extractedData.bank)
  }

  if (!extractedData.accountNumber) {
    extractedData.accountNumber = extractAccountNumber(ocrText)
  }

  logger.info('Image processing completed', {
    hasAccountNumber: !!extractedData.accountNumber,
    hasAccountName: !!extractedData.accountName,
    bank: extractedData.bank,
  })

  return {
    accountNumber: extractedData.accountNumber || '',
    accountName: extractedData.accountName,
    bank: extractedData.bank,
    qrCodeData: extractedData.qrCodeData,
  }
}
