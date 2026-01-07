import { NextRequest, NextResponse } from 'next/server'

/**
 * Validates API key for sensitive operations (POST, PUT, DELETE)
 * Returns null if valid, or NextResponse error if invalid
 */
export function validateApiKey(req: NextRequest): NextResponse | null {
  const apiKey = req.headers.get('x-api-key') || ''
  const expectedKey = process.env.API_KEY

  if (!expectedKey) {
    // Keep a server-side log for developers but do not expose details to clients
    // console.error('[API Auth] API_KEY environment variable not configured')
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 500 }
    )
  }

  if (!apiKey || apiKey !== expectedKey) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // Valid API key
  return null
}

/**
 * Validates that the request method is allowed for admin operations
 */
export function requireMethod(req: NextRequest, ...methods: string[]): NextResponse | null {
  if (!methods.includes(req.method)) {
    return NextResponse.json(
      { error: `Method ${req.method} not allowed` },
      { status: 405 }
    )
  }
  return null
}

/**
 * Combined validation for sensitive operations
 * Usage: 
 *   const authError = validateSensitiveOperation(req, ['POST', 'DELETE'])
 *   if (authError) return authError
 */
export function validateSensitiveOperation(
  req: NextRequest,
  allowedMethods: string[] = ['POST', 'PUT', 'DELETE', 'PATCH']
): NextResponse | null {
  // Check method
  const methodError = requireMethod(req, ...allowedMethods)
  if (methodError) return methodError

  // Check API key
  return validateApiKey(req)
}
