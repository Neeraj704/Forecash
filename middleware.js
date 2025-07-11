// middleware.js (at repo root)
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // skip _next & static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/fonts') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // handle root specially
  if (pathname === '/') {
    let token
    try {
      token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    } catch (e) {
      // if something goes wrong reading the token, treat as unauthenticated
      token = null
    }

    if (token) {
      // signed in, but not onboarded?
      if (!token.onboardingCompleted) {
        return NextResponse.redirect(new URL('/onboarding', req.url))
      }
      // signed in & onboarded
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    // not signed in → show landing
    return NextResponse.next()
  }

  // public pages (login/signup/onboarding)
  if (['/login', '/signup', '/onboarding'].includes(pathname)) {
    return NextResponse.next()
  }

  // everything else is protected
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (!token.onboardingCompleted) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/goals/:path*',
    '/transactions/:path*',
    '/reports/:path*',
    '/chatbot/:path*',
    '/fi-mcp/:path*',
  ],
}
