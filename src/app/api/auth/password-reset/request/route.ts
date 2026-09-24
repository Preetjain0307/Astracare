import { NextResponse } from 'next/server'
import { createAndStoreOtp } from '@/lib/auth/otp-service'
import { sendEmailOtp } from '@/lib/email/email-service'
import { checkRateLimit } from '@/lib/auth/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Rate limit
    const rateCheck = checkRateLimit(`pwd_reset_req:${ip}:${normalizedEmail}`, 5, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many password reset requests. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    // Generate OTP record with purpose PASSWORD_RESET
    const otpResult = await createAndStoreOtp({
      destination: normalizedEmail,
      destinationType: 'EMAIL',
      purpose: 'PASSWORD_RESET',
    })

    if (otpResult.success && otpResult.otp) {
      await sendEmailOtp({
        toEmail: normalizedEmail,
        otp: otpResult.otp,
        purpose: 'PASSWORD_RESET',
      })
    }

    // Always return generic success message to prevent account enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email address, a password reset code has been sent.',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
