import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const origin = req.headers.get('origin') || req.headers.get('referer')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Allow same-origin requests (from the frontend app itself)
  // This handles requests from the client-side app without requiring an API key
  if (origin && origin.startsWith(appUrl)) {
    return NextResponse.next()
  }
  
  // For external requests, require API key
  const apiKey = req.headers.get('x-api-key') || ''
  const expectedKey = process.env.API_KEY

  if (!expectedKey || apiKey !== expectedKey) {
    // Block unauthorized external requests
    return new NextResponse(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
