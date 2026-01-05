import { NextRequest, NextResponse } from "next/server"
import { mockDb } from "@/lib/mock-db"

export async function GET(req: NextRequest) {
  try {
    const foundations = mockDb.getAllFoundations()
    return NextResponse.json(foundations)
  } catch (error) {
    console.error("Foundations fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
