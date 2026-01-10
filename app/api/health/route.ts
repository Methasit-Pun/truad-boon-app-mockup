import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const healthCheck = {
    status: "unknown",
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.TURSO_DATABASE_URL,
      hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
      databaseUrlLength: process.env.TURSO_DATABASE_URL?.length || 0,
      authTokenLength: process.env.TURSO_AUTH_TOKEN?.length || 0,
    },
    database: {
      connected: false,
      error: null as string | null,
      foundationCount: 0,
    },
  }

  try {
    // Try to connect to database and count foundations
    const count = await prisma.foundation.count()
    healthCheck.database.connected = true
    healthCheck.database.foundationCount = count
    healthCheck.status = "healthy"
    
    console.log("[Health Check] Success:", healthCheck)
    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    healthCheck.database.connected = false
    healthCheck.database.error = error instanceof Error ? error.message : "Unknown error"
    healthCheck.status = "unhealthy"
    
    console.error("[Health Check] Database connection failed:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    return NextResponse.json(healthCheck, { status: 503 })
  }
}
