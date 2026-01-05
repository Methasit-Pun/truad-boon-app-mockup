import { NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { accountNumber, bank, accountName } = body

    if (!accountNumber || !bank) {
      return NextResponse.json(
        { error: "Missing required fields: accountNumber, bank" },
        { status: 400 }
      )
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

      return NextResponse.json({
        status: "danger",
        accountName: accountName || "Unknown",
        accountNumber,
        bank,
        message: `⚠️ This account has been reported as fraudulent. Reason: ${blacklisted.reason || "Suspicious activity detected"}`,
      })
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

      return NextResponse.json({
        status: "safe",
        accountName: foundation.name,
        accountNumber: foundation.accountNumber,
        bank: foundation.bank,
        message: `✅ This account belongs to ${foundation.name} (${foundation.category}). Safe to donate.`,
      })
    }

    // Unknown account
    mockDb.addLog({
      accountNumber,
      status: "WARNING",
      source: "WEB",
    })

    return NextResponse.json({
      status: "warning",
      accountName: accountName || "Unknown",
      accountNumber,
      bank,
      message:
        "⚠️ This account is not in our verified database. Please verify through other sources before donating.",
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
