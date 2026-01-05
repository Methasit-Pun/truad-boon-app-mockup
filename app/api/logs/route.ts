import { NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

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

    const log = {
      accountNumber,
      status,
      userId: userId || null,
      source: source || "WEB",
    }

    mockDb.addLog(log)

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

    const logs = mockDb.getLogs(days, status || undefined)

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Logs fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
