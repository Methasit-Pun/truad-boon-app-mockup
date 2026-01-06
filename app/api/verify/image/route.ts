import { NextRequest, NextResponse } from "next/server"
import { verifyAccount } from "@/lib/verification"

/**
 * Image verification endpoint
 * Accepts: multipart/form-data with image file
 * Extracts account number from image (QR code)
 * Returns: Same VerificationResult as /api/verify/account
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File | null
    const bank = (formData.get("bank") as string) || "Unknown"

    if (!file) {
      return NextResponse.json(
        { error: "Missing image file" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)

    // Extract QR code from image
    const accountNumber = await extractQRCode(uint8Array, file.type)

    if (!accountNumber) {
      return NextResponse.json(
        {
          error: "Could not extract account number from image",
          details: "No valid QR code found in the image",
        },
        { status: 400 }
      )
    }

    // Verify the extracted account number
    const result = verifyAccount(accountNumber, bank)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Image verification error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Extract QR code from image using jsqr
 * Returns the decoded data from QR code (account number)
 */
async function extractQRCode(
  buffer: Uint8Array,
  mimeType: string
): Promise<string | null> {
  try {
    // Dynamically import jsqr (only when needed)
    const jsQR = (await import("jsqr")).default

    // Create image from buffer
    const blob = new Blob([buffer], { type: mimeType })
    const arrayBuffer = await blob.arrayBuffer()

    // For now, return mock account to test the pipeline
    // In production, this would need proper image decoding to canvas
    // and then jsQR processing
    console.log(
      "Image received, extracting QR code... (mock extraction returning test account)"
    )

    // Mock extraction - replace with real QR extraction in production
    // Real implementation would:
    // 1. Decode image to canvas
    // 2. Get image data from canvas
    // 3. Run jsQR(imageData.data, width, height)
    // 4. Extract code?.data

    return "565-471106-1" // Mock return for now
  } catch (error) {
    console.error("QR extraction error:", error)
    return null
  }
}
