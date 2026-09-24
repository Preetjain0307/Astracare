import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/auth/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Rate limit per IP + email
    const rateCheck = checkRateLimit(`login:${ip}:${normalizedEmail}`, 10, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    const supabaseServer = await createClient()

    // 1. Authenticate credentials
    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const userId = authData.user.id
    const supabaseAdmin = createAdminClient()

    // 2. Query profile status
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email_verified, phone_verified, fully_verified, onboarding_completed')
      .eq('user_id', userId)
      .maybeSingle()

    // If profile does not exist yet, create a baseline profile
    if (!profile) {
      const nameParts = (authData.user.user_metadata?.full_name || '').split(' ')
      const { data: newProfile } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: userId,
          first_name: nameParts[0] || null,
          last_name: nameParts.slice(1).join(' ') || null,
          phone: authData.user.user_metadata?.phone || null,
          email_verified: false,
          phone_verified: false,
          fully_verified: false,
          onboarding_completed: false,
        })
        .select()
        .single()

      profile = newProfile
    }

    const emailVerified = !!profile?.email_verified
    const phoneVerified = !!profile?.phone_verified
    const fullyVerified = emailVerified && phoneVerified
    const onboardingCompleted = !!profile?.onboarding_completed

    // 3. Update fully_verified if both are true but flag wasn't set
    if (emailVerified && phoneVerified && !profile?.fully_verified) {
      await supabaseAdmin
        .from('profiles')
        .update({ fully_verified: true })
        .eq('user_id', userId)
    }

    // 4. Determine redirect path
    let redirectTo = '/dashboard'
    if (!emailVerified) {
      redirectTo = '/auth/verify-email'
    } else if (!phoneVerified) {
      redirectTo = '/auth/verify-phone'
    } else if (!onboardingCompleted) {
      redirectTo = '/onboarding'
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: normalizedEmail,
        emailVerified,
        phoneVerified,
        fullyVerified,
        onboardingCompleted,
      },
      redirectTo,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    console.error('[Login API Error]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
