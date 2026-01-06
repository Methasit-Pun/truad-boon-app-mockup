import { NextRequest, NextResponse } from "next/server"
import { verifyAccount } from "@/lib/verification"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { accountNumber, bank, identifierType, merchantName } = body

    if (!accountNumber || !bank) {
      return NextResponse.json(
        { error: "Missing required fields: accountNumber, bank" },
        { status: 400 }
      )
    }

    const result = verifyAccount(accountNumber, bank, identifierType || "account", merchantName)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
