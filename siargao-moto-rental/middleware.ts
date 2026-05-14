import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: sessionData } = await supabase.auth.getSession()
  console.log("🔍 Middleware - Session check:", {
    path: req.nextUrl.pathname,
    hasSession: !!sessionData.session,
    sessionUser: sessionData.session?.user?.email
  })

  // Use session instead of getUser() to avoid SSL issues
  const user = sessionData.session?.user
  
  console.log("🔍 Middleware - User from session:", {
    path: req.nextUrl.pathname,
    hasUser: !!user,
    userEmail: user?.email
  })

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/setup', '/test-login', '/simple-test']
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname)
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  // Allow API routes to pass through
  if (isApiRoute) {
    return response
  }

  // If user is not signed in and trying to access protected route, redirect to /login
  if (!user && !isPublicPath) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access /login, redirect to /dashboard
  if (user && req.nextUrl.pathname === '/login') {
    const redirectUrl = new URL('/dashboard', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
