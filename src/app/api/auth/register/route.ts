import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { createAndStoreOtp } from '@/lib/auth/otp-service'
import { sendEmailOtp } from '@/lib/email/email-service'
import { checkRateLimit } from '@/lib/auth/rate-limit'
import { normalizePhoneNumber } from '@/lib/sms/sms-provider'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const rateCheck = checkRateLimit(`register:${ip}`, 10, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    const { fullName, email, phone, password } = await request.json()

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email, and password are required.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPhone = phone ? normalizePhoneNumber(phone) : null

    const supabaseAdmin = createAdminClient()

    // 1. Check existing phone in profiles if provided
    if (normalizedPhone) {
      try {
        const { data: existingProfiles } = await supabaseAdmin
          .from('profiles')
          .select('id, user_id, phone')
          .eq('phone', normalizedPhone)
          .limit(1)

        if (existingProfiles && existingProfiles.length > 0) {
          return NextResponse.json({ error: 'An account with this phone number already exists.' }, { status: 400 })
        }
      } catch {
        // Ignore check error
      }
    }




    // 2. Split full name
    const nameParts = fullName.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || ''

    // 3. Create auth user in Supabase
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName.trim(),
        phone: normalizedPhone,
      },
    })

    if (createError) {
      if (createError.message.includes('already registered')) {
        return NextResponse.json({ error: 'An account with this email address already exists. Please sign in.' }, { status: 400 })
      }
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    const userId = newUser.user.id

    // 4. Upsert profiles record safely
    try {
      await supabaseAdmin.from('profiles').upsert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName || null,
        phone: normalizedPhone,
        role: 'patient',
        email_verified: false,
        phone_verified: false,
        fully_verified: false,
        onboarding_completed: false,
      }, { onConflict: 'user_id' })
    } catch {
      try {
        await supabaseAdmin.from('profiles').upsert({
          user_id: userId,
          first_name: firstName,
          last_name: lastName || null,
          phone: normalizedPhone,
          role: 'patient',
        }, { onConflict: 'user_id' })
      } catch (upsertErr) {
        console.warn('[Register Profile Upsert Fallback Warning]', upsertErr)
      }
    }

    // 5. Establish user session cookies
    const supabaseServer = await createClient()
    await supabaseServer.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    // 6. Generate and send initial Email OTP
    const otpResult = await createAndStoreOtp({
      destination: normalizedEmail,
      destinationType: 'EMAIL',
      purpose: 'EMAIL_VERIFICATION',
      userId,
    })

    let emailDevOtp: string | undefined
    let emailWarning: string | undefined

    if (otpResult.success && otpResult.otp) {
      const emailSendRes = await sendEmailOtp({
        toEmail: normalizedEmail,
        otp: otpResult.otp,
        purpose: 'EMAIL_VERIFICATION',
        userName: firstName,
      })
      emailDevOtp = emailSendRes.devOtp
      emailWarning = emailSendRes.warning
    }

    return NextResponse.json({
      success: true,
      userId,
      email: normalizedEmail,
      phone: normalizedPhone,
      nextStep: 'VERIFY_EMAIL',
      devOtp: emailDevOtp,
      warning: emailWarning,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    console.error('[Register API Error]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
