import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || ''
  const expectedKey = process.env.API_KEY

  if (!expectedKey) {
    console.warn('[Proxy] API_KEY not configured')
    // Avoid exposing config details to callers; return generic 404 with JSON body
    return new NextResponse(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    })
  }

  if (apiKey !== expectedKey) {
    // Treat unauthorized requests as not-found to hide existence of the endpoint
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
