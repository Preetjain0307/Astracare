import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAndStoreOtp } from '@/lib/auth/otp-service'
import { getSmsProvider, normalizePhoneNumber } from '@/lib/sms/sms-provider'
import { checkRateLimit } from '@/lib/auth/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const body = await request.json().catch(() => ({}))

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const inputPhone = body.phone || user?.user_metadata?.phone

    if (!inputPhone || typeof inputPhone !== 'string') {
      return NextResponse.json({ error: 'Valid mobile number is required.' }, { status: 400 })
    }

    const normalizedPhone = normalizePhoneNumber(inputPhone)

    // Rate limit per IP + phone
    const rateCheck = checkRateLimit(`phone_otp:${ip}:${normalizedPhone}`, 5, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many OTP requests. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    // Generate & Store OTP in DB using SHA-256 hashing
    const otpResult = await createAndStoreOtp({
      destination: normalizedPhone,
      destinationType: 'PHONE',
      purpose: 'PHONE_VERIFICATION',
      userId: user?.id,
    })

    if (!otpResult.success || !otpResult.otp) {
      return NextResponse.json({ error: otpResult.error || 'Failed to generate verification code.' }, { status: 400 })
    }

    // Dispatch SMS via configured SmsProvider (SMTP, Fast2SMS, TextBee, or Development adapter)
    const smsProvider = getSmsProvider()
    const smsResult = await smsProvider.sendOtp(normalizedPhone, otpResult.otp, user?.email || undefined)

    if (!smsResult.success) {
      return NextResponse.json({ error: smsResult.error || 'Failed to send SMS OTP.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your mobile number.',
      phone: normalizedPhone,
      warning: smsResult.warning,
      devOtp: smsResult.devOtp || (process.env.NODE_ENV !== 'production' ? otpResult.otp : undefined),
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
