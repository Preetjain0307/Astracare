import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAndStoreOtp } from '@/lib/auth/otp-service'
import { sendEmailOtp } from '@/lib/email/email-service'
import { checkRateLimit } from '@/lib/auth/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const body = await request.json().catch(() => ({}))
    let email = body.email

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!email && user?.email) {
      email = user.email
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Rate limit per IP + email
    const rateCheck = checkRateLimit(`email_otp:${ip}:${normalizedEmail}`, 5, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many verification requests. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    // Generate & Store OTP in DB
    const otpResult = await createAndStoreOtp({
      destination: normalizedEmail,
      destinationType: 'EMAIL',
      purpose: 'EMAIL_VERIFICATION',
      userId: user?.id,
    })

    if (!otpResult.success || !otpResult.otp) {
      return NextResponse.json({ error: otpResult.error || 'Failed to generate verification code.' }, { status: 400 })
    }

    // Send Email
    const sendResult = await sendEmailOtp({
      toEmail: normalizedEmail,
      otp: otpResult.otp,
      purpose: 'EMAIL_VERIFICATION',
      userName: user?.user_metadata?.full_name,
    })

    if (!sendResult.success) {
      return NextResponse.json({ error: sendResult.error || 'Failed to send verification email.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
      warning: sendResult.warning,
      devOtp: sendResult.devOtp,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
