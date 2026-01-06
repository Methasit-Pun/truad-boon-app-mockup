import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> }
) {
  try {
    const { accountNumber } = await params

    if (!accountNumber) {
      return NextResponse.json(
        { error: "Missing accountNumber" },
        { status: 400 }
      )
    }

    const blacklisted = await prisma.blacklistedAccount.findUnique({
      where: { accountNumber },
    })

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
