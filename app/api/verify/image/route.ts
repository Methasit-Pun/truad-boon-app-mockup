import { NextRequest, NextResponse } from "next/server"

/**
 * @deprecated This endpoint is no longer used.
 * 
 * QR code extraction moved to frontend for efficiency:
 * 1. Frontend extracts QR code from image using jsqr
 * 2. Frontend sends extracted account number to /api/verify/account
 * 3. Backend verifies the account
 * 
 * If you need backend image processing in the future:
 * - Install 'sharp' and 'jimp' for image processing
 * - Convert image to canvas and pixel data
 * - Use jsqr on the pixel data
 * 
 * For now, use /api/verify/account instead.
 */
export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      error: "Deprecated endpoint",
      message: "QR code extraction has moved to frontend. Use /api/verify/account instead.",
      guide: {
        frontend: "Extract QR code using jsqr on canvas",
        send: "POST /api/verify/account with { accountNumber, bank }",
        backend: "Verification happens in /lib/verification.ts",
      },
    },
    { status: 410 }
  )
}
