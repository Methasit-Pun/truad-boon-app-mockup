import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const method = req.method
  const pathname = req.nextUrl.pathname
  
  // Determine if this is a sensitive operation (write/delete)
  const isSensitiveOp = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
  
  // Public read-only endpoints that don't require authentication
  const publicEndpoints = ['/api/foundations', '/api/blacklist']
  const isPublicRead = publicEndpoints.some(ep => pathname.startsWith(ep)) && method === 'GET'
  
  // Allow public read-only endpoints from any origin
  if (isPublicRead) {
    return NextResponse.next()
  }
  
  // For sensitive operations (write/delete), require valid authentication
  if (isSensitiveOp) {
    const apiKey = req.headers.get('x-api-key') || ''
    const expectedKey = process.env.API_KEY
    
    // Validate API key - log details server-side, but return only generic message to clients
    if (!expectedKey) {
      console.error('[Security] API_KEY environment variable not configured')
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      )
    }

    if (!apiKey || apiKey !== expectedKey) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      )
    }
  }
  
  // Allow same-origin requests for the frontend (GET requests on other endpoints)
  const origin = req.headers.get('origin') || req.headers.get('referer')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  if (origin && origin.startsWith(appUrl)) {
    return NextResponse.next()
  }
  
  // For other requests from external origins, require API key
  const apiKey = req.headers.get('x-api-key') || ''
  const expectedKey = process.env.API_KEY
  
  if (!expectedKey || apiKey !== expectedKey) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    )
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
