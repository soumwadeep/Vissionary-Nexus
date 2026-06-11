import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/wallet',
  '/collaborations',
  '/events',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log("Middleware pathname:", pathname)

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  console.log("Middleware isProtectedRoute:", isProtectedRoute)

  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    console.log("Middleware session token:", token)
    console.log("Middleware authenticated user:", token?.email)

    // If user is not authenticated, redirect to login
    if (!token) {
      console.log("Middleware: No token, redirecting to login")
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    console.log("Middleware: Token found, proceeding")
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/wallet/:path*',
    '/collaborations/:path*',
    '/events/:path*',
    '/admin/:path*',
  ],
}
