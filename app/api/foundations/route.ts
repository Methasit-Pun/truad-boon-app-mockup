import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateSensitiveOperation } from "@/lib/api-auth"

// GET - Public endpoint: Fetch verified foundations
export async function GET(req: NextRequest) {
  try {
    console.log("[Foundations API] Starting fetch request")
    console.log("[Foundations API] Database URL exists:", !!process.env.TURSO_DATABASE_URL)
    console.log("[Foundations API] Auth Token exists:", !!process.env.TURSO_AUTH_TOKEN)
    
    const foundations = await prisma.foundation.findMany({
      where: { verified: true },
      select: {
        id: true,
        name: true,
        accountNumber: true,
        bank: true,
        category: true,
        verified: true,
      },
    })
    
    console.log(`[Foundations API] Successfully fetched ${foundations.length} foundations`)
    return NextResponse.json(foundations)
  } catch (error) {
    console.error("[Foundations API] Error:", error)
    console.error("[Foundations API] Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Admin only: Add a new foundation
export async function POST(req: NextRequest) {
  // Validate API key for sensitive operation
  const authError = validateSensitiveOperation(req, ['POST'])
  if (authError) return authError

  try {
    const body = await req.json()
    const { name, accountNumber, bank, category } = body

    // Validate required fields
    if (!name || !accountNumber || !bank || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, accountNumber, bank, category" },
        { status: 400 }
      )
    }

    // Check if foundation already exists
    const existing = await prisma.foundation.findUnique({
      where: { accountNumber },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Foundation with this account number already exists" },
        { status: 409 }
      )
    }

    const foundation = await prisma.foundation.create({
      data: {
        name,
        accountNumber,
        bank,
        category,
        verified: true,
      },
    })

    return NextResponse.json(foundation, { status: 201 })
  } catch (error) {
    console.error("Foundation creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Admin only: Update a foundation
export async function PUT(req: NextRequest) {
  const authError = validateSensitiveOperation(req, ['PUT'])
  if (authError) return authError

  try {
    const body = await req.json()
    const { id, name, bank, category } = body

    if (!id) {
      return NextResponse.json(
        { error: "Foundation ID is required" },
        { status: 400 }
      )
    }

    const foundation = await prisma.foundation.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(bank && { bank }),
        ...(category && { category }),
      },
    })

    return NextResponse.json(foundation)
  } catch (error) {
    console.error("Foundation update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Admin only: Remove a foundation
export async function DELETE(req: NextRequest) {
  const authError = validateSensitiveOperation(req, ['DELETE'])
  if (authError) return authError

  try {
    const { searchParams } = req.nextUrl
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "Foundation ID is required" },
        { status: 400 }
      )
    }

    await prisma.foundation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Foundation deletion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
