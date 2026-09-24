import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyOtp } from '@/lib/auth/otp-service'
import { checkRateLimit } from '@/lib/auth/rate-limit'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, OTP, and new password are required.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 })
    }

    // Rate limit
    const rateCheck = checkRateLimit(`pwd_reset_verify:${ip}:${normalizedEmail}`, 10, 15 * 60 * 1000)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429 }
      )
    }

    // 1. Verify OTP using timing-safe comparison
    const result = await verifyOtp({
      destination: normalizedEmail,
      purpose: 'PASSWORD_RESET',
      otp,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Invalid or expired OTP code.' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    // 2. Fetch user ID by email using listUsers
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError || !usersData?.users) {
      return NextResponse.json({ error: 'Failed to locate user account.' }, { status: 500 })
    }

    const user = usersData.users.find(u => u.email?.toLowerCase() === normalizedEmail)

    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 })
    }

    // 3. Update user password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
