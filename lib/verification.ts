import { mockDb } from "./mock-db"

export type VerificationStatus = "safe" | "warning" | "danger"

export interface VerificationResult {
  status: VerificationStatus
  accountName: string
  accountNumber: string
  bank: string
  message: string
  identifierType?: "mobile" | "taxid" | "organizationref" | "donationbox" | "reference" | "account" | "unknown"
}

/**
 * Shared verification function used by both:
 * - POST /api/verify/account (manual input)
 * - POST /api/verify/image (image upload)
 */
export function verifyAccount(
  accountNumber: string,
  bank: string = "Unknown",
  identifierType: string = "account",
  merchantName?: string
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
      identifierType: identifierType as any,
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
      identifierType: identifierType as any,
    }
  }

  // Unknown account - use merchant name from QR if available
  mockDb.addLog({
    accountNumber,
    status: "WARNING",
    source: "WEB",
  })

  return {
    status: "warning",
    accountName: merchantName || "ไม่พบข้อมูล",
    accountNumber,
    bank,
    message:
      "⚠️ This account is not in our verified database. Please verify through other sources before donating.",
    identifierType: identifierType as any,
  }
}
