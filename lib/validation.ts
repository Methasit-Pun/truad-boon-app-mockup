/**
 * Validation Utilities
 * Helper functions for data validation
 */

import { Bank } from '@prisma/client'

/**
 * Validate Thai mobile number format
 */
export function isValidThaiMobile(mobile: string): boolean {
  const cleaned = mobile.replace(/[^0-9]/g, '')
  return /^0[0-9]{9}$/.test(cleaned)
}

/**
 * Validate Thai national ID format
 */
export function isValidThaiNationalId(id: string): boolean {
  const cleaned = id.replace(/[^0-9]/g, '')
  
  if (cleaned.length !== 13) return false
  
  // Validate checksum
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * (13 - i)
  }
  const mod = sum % 11
  const check = (11 - mod) % 10
  
  return check === parseInt(cleaned.charAt(12))
}

/**
 * Validate account number format
 */
export function isValidAccountNumber(accountNumber: string): boolean {
  const cleaned = accountNumber.replace(/[^0-9]/g, '')
  // Most Thai bank accounts are 10 digits
  // PromptPay can be 10 or 13 digits (phone number)
  return cleaned.length >= 10 && cleaned.length <= 13
}

/**
 * Validate bank enum
 */
export function isValidBank(bank: string): bank is Bank {
  return Object.values(Bank).includes(bank as Bank)
}

/**
 * Format Thai mobile number
 * Example: 0812345678 -> 081-234-5678
 */
export function formatThaiMobile(mobile: string): string {
  const cleaned = mobile.replace(/[^0-9]/g, '')
  if (cleaned.length !== 10) return mobile
  
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
}

/**
 * Format account number
 * Example: 1234567890 -> 123-456-7890
 */
export function formatAccountNumber(accountNumber: string, bank?: Bank): string {
  const cleaned = accountNumber.replace(/[^0-9]/g, '')
  
  // Different banks have different formats
  // This is a simplified version
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  if (cleaned.length === 13) {
    // PromptPay phone number format
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return accountNumber
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate random ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}${prefix ? '_' : ''}${timestamp}${random}`
}

/**
 * Parse error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unknown error occurred'
}

/**
 * Check if string is valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}
