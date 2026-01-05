import { NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function GET(
  req: NextRequest,
  { params }: { params: { accountNumber: string } }
) {
  try {
    const { accountNumber } = params

    if (!accountNumber) {
      return NextResponse.json(
        { error: "Missing accountNumber" },
        { status: 400 }
      )
    }

    const blacklisted = mockDb.getBlacklistedByAccount(accountNumber)

    return NextResponse.json({
      isBlacklisted: !!blacklisted,
      data: blacklisted || null,
    })
  } catch (error) {
    console.error("Blacklist check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
