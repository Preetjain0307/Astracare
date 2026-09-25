import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const protectedRoutes = ['/dashboard', '/onboarding', '/settings']
  const authRoutes = ['/auth/login', '/auth/register']

  const demoCookie = request.cookies.get('astracare_demo_user')?.value
  const isAuthenticated = !!user || !!demoCookie

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect fully verified users away from auth pages to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }


  // Verification checks for logged-in users on protected routes
  if (isProtectedRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email_verified, phone_verified, fully_verified')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profile) {
      if (!profile.email_verified && !pathname.startsWith('/auth/verify-email')) {
        return NextResponse.redirect(new URL('/auth/verify-email', request.url))
      }
    }

  }

  // Redirect fully verified users away from auth pages to dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
