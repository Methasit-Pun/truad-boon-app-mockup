import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { accountNumber, status, userId, source } = body

    if (!accountNumber || !status) {
      return NextResponse.json(
        { error: "Missing required fields: accountNumber, status" },
        { status: 400 }
      )
    }

    const log = await prisma.verificationLog.create({
      data: {
        accountNumber,
        status,
        userId: userId || null,
        source: source || "WEB",
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error("Log creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const days = parseInt(searchParams.get("days") || "7", 10)
    const status = searchParams.get("status")

    const since = new Date()
    since.setDate(since.getDate() - days)

    const logs = await prisma.verificationLog.findMany({
      where: {
        createdAt: { gte: since },
        ...(status && { status }),
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Logs fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
