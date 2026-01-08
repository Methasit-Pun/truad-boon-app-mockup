/**
 * Application Constants
 * Centralized configuration values for the application
 */

import { Bank } from '@prisma/client'

/**
 * Bank Display Names (Thai)
 */
export const BANK_NAMES: Record<Bank, string> = {
  [Bank.PROMPTPAY]: 'พร้อมเพย์',
  [Bank.KBANK]: 'ธนาคารกสิกรไทย',
  [Bank.SCB]: 'ธนาคารไทยพาณิชย์',
  [Bank.BBL]: 'ธนาคารกรุงเทพ',
  [Bank.KTB]: 'ธนาคารกรุงไทย',
  [Bank.BAY]: 'ธนาคารกรุงศรีอยุธยา',
  [Bank.TMB]: 'ธนาคารทหารไทยธนชาต',
  [Bank.CIMB]: 'ธนาคารซีไอเอ็มบีไทย',
  [Bank.TISCO]: 'ธนาคารทิสโก้',
  [Bank.UOB]: 'ธนาคารยูโอบี',
  [Bank.GSB]: 'ธนาคารออมสิน',
  [Bank.BAAC]: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
  [Bank.OTHER]: 'อื่นๆ',
}

/**
 * Bank Keywords for OCR Detection
 */
export const BANK_KEYWORDS: Record<string, Bank> = {
  'กสิกรไทย|KBANK|K-Bank|Kasikorn': Bank.KBANK,
  'ไทยพาณิชย์|SCB|Siam Commercial': Bank.SCB,
  'กรุงเทพ|BBL|Bangkok Bank': Bank.BBL,
  'กรุงไทย|KTB|Krung Thai': Bank.KTB,
  'กรุงศรี|BAY|Krungsri': Bank.BAY,
  'ทหารไทย|TMB|TMBThanachart': Bank.TMB,
  'พร้อมเพย์|PromptPay': Bank.PROMPTPAY,
  'ซีไอเอ็มบี|CIMB': Bank.CIMB,
  'ทิสโก้|TISCO': Bank.TISCO,
  'ยูโอบี|UOB': Bank.UOB,
  'ออมสิน|GSB': Bank.GSB,
  'ธกส|BAAC': Bank.BAAC,
}

/**
 * Account Number Patterns for OCR
 */
export const ACCOUNT_NUMBER_PATTERNS = [
  /\d{3}-\d+-\d+/g,     // XXX-XXXXXX-X format
  /\d{3}-\d-\d{5}-\d/g, // XXX-X-XXXXX-X format
  /\d{10}/g,            // 10 digits
  /\d{13}/g,            // 13 digits (PromptPay phone number)
]

/**
 * Account Name Extraction Patterns
 */
export const ACCOUNT_NAME_PATTERNS = [
  /ชื่อบัญชี[:\s]*([ก-๙a-zA-Z\s]+)/i,
  /บัญชี[:\s]*([ก-๙a-zA-Z\s]+)/i,
  /Account Name[:\s]*([ก-๙a-zA-Z\s]+)/i,
  /Name[:\s]*([ก-๙a-zA-Z\s]+)/i,
]

/**
 * OCR Configuration
 */
export const OCR_CONFIG = {
  languages: ['tha', 'eng'],
  whitelistChars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzก-๙ ',
} as const

/**
 * Verification Status Messages
 */
export const VERIFICATION_MESSAGES = {
  SAFE: 'บัญชีนี้เป็นมูลนิธิที่ได้รับการรับรอง ปลอดภัย 100% สามารถบริจาคได้อย่างมั่นใจ',
  WARNING: 'ไม่พบข้อมูลบัญชีนี้ในระบบ กรุณาตรวจสอบอีกครั้งหรือติดต่อมูลนิธิโดยตรง',
  DANGER: 'บัญชีนี้อยู่ในรายชื่อมิจฉาชีพ ห้ามโอนเงิน!',
} as const

/**
 * API Routes
 */
export const API_ROUTES = {
  PROCESS_IMAGE: '/api/process-image',
  VERIFY_ACCOUNT: '/api/verify-account',
} as const

/**
 * Image Processing Configuration
 */
export const IMAGE_CONFIG = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const

/**
 * Loading Stage Configuration
 */
export const LOADING_STAGES = [
  {
    text: 'กำลังอ่านข้อมูลจากรูปภาพ',
    duration: 1500,
  },
  {
    text: 'ตรวจสอบชื่อและที่อยู่บัญชีปลายทาง',
    duration: 1500,
  },
  {
    text: 'ตรวจข้อมูลกับมูลนิธิกว่า 200 แห่ง',
    duration: 2000,
  },
  {
    text: 'คัดกรองรายชื่อเฝ้าระวังมิจฉาชีพ',
    duration: 2000,
  },
  {
    text: 'สรุปผลความปลอดภัย',
    duration: 1000,
  },
] as const
