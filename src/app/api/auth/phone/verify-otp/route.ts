import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { verifyOtp } from '@/lib/auth/otp-service'
import { normalizePhoneNumber } from '@/lib/sms/sms-provider'
import { checkRateLimit } from '@/lib/auth/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { phone, otp } = await request.json()

    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    const targetPhone = phone || user?.user_metadata?.phone

    if (!targetPhone || !otp) {
      return NextResponse.json({ error: 'Phone number and 6-digit OTP code are required.' }, { status: 400 })
    }

    const normalizedPhone = normalizePhoneNumber(targetPhone)

    // Rate limit per IP + phone
    const rateCheck = checkRateLimit(`phone_verify:${ip}:${normalizedPhone}`, 10, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many verification attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    // Verify OTP using timing-safe SHA-256 hash comparison
    const result = await verifyOtp({
      destination: normalizedPhone,
      purpose: 'PHONE_VERIFICATION',
      otp,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Invalid or expired OTP code.' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()
    let targetUserId = user?.id || result.userId

    if (!targetUserId) {
      try {
        const { data: profileRec } = await supabaseAdmin
          .from('profiles')
          .select('user_id')
          .eq('phone', normalizedPhone)
          .maybeSingle()

        targetUserId = profileRec?.user_id
      } catch {
        // Ignore error
      }
    }

    let isEmailVerified = true
    let isOnboardingCompleted = false

    if (targetUserId) {
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle()

        if (profile) {
          isEmailVerified = profile.email_verified ?? true
          isOnboardingCompleted = profile.onboarding_completed ?? false
        }

        await supabaseAdmin
          .from('profiles')
          .update({
            phone: normalizedPhone,
            phone_verified: true,
            fully_verified: true,
          })
          .eq('user_id', targetUserId)
      } catch (profileErr) {
        console.warn('[Verify Phone OTP Profile Update Warning]', profileErr)
      }
    }

    const redirectTo = isOnboardingCompleted ? '/dashboard' : '/onboarding'

    return NextResponse.json({
      success: true,
      phoneVerified: true,
      emailVerified: isEmailVerified,
      fullyVerified: true,
      redirectTo,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    console.error('[Verify Phone OTP Error]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
