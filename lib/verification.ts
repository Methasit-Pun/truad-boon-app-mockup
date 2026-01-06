import { mockDb } from "./mock-db"

export type VerificationStatus = "safe" | "warning" | "danger"

export interface VerificationResult {
  status: VerificationStatus
  accountName: string
  accountNumber: string
  bank: string
  message: string
}

/**
 * Shared verification function used by both:
 * - POST /api/verify/account (manual input)
 * - POST /api/verify/image (image upload)
 */
export function verifyAccount(
  accountNumber: string,
  bank: string = "Unknown"
): VerificationResult {
  if (!accountNumber || !bank) {
    throw new Error("Missing required fields: accountNumber, bank")
  }

  // Check if blacklisted
  const blacklisted = mockDb.getBlacklistedByAccount(accountNumber)

  if (blacklisted) {
    // Log the verification attempt
    mockDb.addLog({
      accountNumber,
      status: "DANGER",
      source: "WEB",
    })

    return {
      status: "danger",
      accountName: "บัญชีถูกรายงานว่าเป็นมิจฉาชีพ",
      accountNumber,
      bank,
      message: `⚠️ This account has been reported as fraudulent. Reason: ${blacklisted.reason || "Suspicious activity detected"}`,
    }
  }

  // Check if verified foundation
  const foundation = mockDb.getFoundationByAccount(accountNumber)

  if (foundation && foundation.verified) {
    // Log the verification attempt
    mockDb.addLog({
      accountNumber,
      status: "SAFE",
      source: "WEB",
    })

    return {
      status: "safe",
      accountName: foundation.name,
      accountNumber: foundation.accountNumber,
      bank: foundation.bank,
      message: `✅ This account belongs to ${foundation.name} (${foundation.category}). Safe to donate.`,
    }
  }

  // Unknown account
  mockDb.addLog({
    accountNumber,
    status: "WARNING",
    source: "WEB",
  })

  return {
    status: "warning",
    accountName: "ไม่พบข้อมูล",
    accountNumber,
    bank,
    message:
      "⚠️ This account is not in our verified database. Please verify through other sources before donating.",
  }
}
