import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check onboarding status
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single()

        if (profile && !profile.onboarding_completed) {
          return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
        }
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(
    new URL('/auth/login?error=auth_callback_error', requestUrl.origin)
  )
}
