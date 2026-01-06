import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const foundations = await prisma.foundation.findMany({
      where: { verified: true },
    })
    return NextResponse.json(foundations)
  } catch (error) {
    console.error("Foundations fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
