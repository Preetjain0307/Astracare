import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabaseServer = await createClient()
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const supabaseAdmin = createAdminClient()

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name, phone, role, email_verified, phone_verified, fully_verified, onboarding_completed')
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        phone: profile?.phone || user.user_metadata?.phone || null,
        firstName: profile?.first_name || user.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: profile?.last_name || null,
        role: profile?.role || 'patient',
        emailVerified: !!profile?.email_verified,
        phoneVerified: !!profile?.phone_verified,
        fullyVerified: !!profile?.fully_verified,
        onboardingCompleted: !!profile?.onboarding_completed,
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
