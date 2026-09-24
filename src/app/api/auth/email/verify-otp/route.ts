import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { verifyOtp } from '@/lib/auth/otp-service'
import { checkRateLimit } from '@/lib/auth/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { email, otp } = await request.json()

    const supabaseServer = await createClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    const targetEmail = email || user?.email

    if (!targetEmail || !otp) {
      return NextResponse.json({ error: 'Email and 6-digit verification code are required.' }, { status: 400 })
    }

    const normalizedEmail = targetEmail.trim().toLowerCase()

    // Rate limit per IP + email
    const rateCheck = checkRateLimit(`email_verify:${ip}:${normalizedEmail}`, 10, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many verification attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    // Verify OTP securely using timing-safe comparison
    const result = await verifyOtp({
      destination: normalizedEmail,
      purpose: 'EMAIL_VERIFICATION',
      otp,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Invalid or expired OTP.' }, { status: 400 })
    }

    // Determine target user ID
    const targetUserId = user?.id || result.userId

    if (targetUserId) {
      const supabaseAdmin = createAdminClient()

      try {
        // Fetch existing profile status
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('user_id', targetUserId)
          .maybeSingle()

        const isPhoneVerified = !!profile?.phone_verified
        const isFullyVerified = isPhoneVerified // since email is now verified!

        // Update profile verification flags in DB
        await supabaseAdmin
          .from('profiles')
          .update({
            email_verified: true,
            fully_verified: isFullyVerified,
          })
          .eq('user_id', targetUserId)
      } catch (profileErr) {
        console.warn('[Verify Email OTP Profile Update Warning]', profileErr)
      }
    }

    return NextResponse.json({
      success: true,
      emailVerified: true,
      redirectTo: '/auth/verify-phone',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    console.error('[Verify Email OTP Error]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
