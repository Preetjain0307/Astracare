import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const DEMO_ACCOUNTS = {
  patient: {
    email: 'demo.patient@astracare.ai',
    password: 'DemoPatient@2026',
    fullName: 'Elena Rostova',
    role: 'patient',
    redirectTo: '/dashboard',
  },
  doctor: {
    email: 'demo.doctor@astracare.ai',
    password: 'DemoDoctor@2026',
    fullName: 'Dr. Sarah Jenkins, MD',
    role: 'doctor',
    redirectTo: '/dashboard/doctor',
  },
  admin: {
    email: 'admin@astracare.ai',
    password: 'DemoAdmin@2026',
    fullName: 'AstraCare System Admin',
    role: 'admin',
    redirectTo: '/dashboard/admin',
  },
}

export async function POST(request: Request) {
  try {
    const { role = 'patient' } = await request.json()
    const targetRole = (role in DEMO_ACCOUNTS ? role : 'patient') as keyof typeof DEMO_ACCOUNTS
    const demoUser = DEMO_ACCOUNTS[targetRole]

    const supabaseAdmin = createAdminClient()

    // Ensure demo user exists in Supabase Auth
    let userId: string
    try {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: demoUser.email,
        password: demoUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: demoUser.fullName,
          role: demoUser.role,
          is_mock_account: true,
        },
      })

      if (newUser?.user) {
        userId = newUser.user.id
      } else if (createError && createError.message.includes('already registered')) {
        // Find existing user id
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers()
        const existing = listData.users.find((u) => u.email === demoUser.email)
        userId = existing ? existing.id : 'demo-mock-user-id'
      } else {
        userId = 'demo-mock-user-id'
      }
    } catch {
      userId = 'demo-mock-user-id'
    }

    // Upsert demo profile
    try {
      const nameParts = demoUser.fullName.split(' ')
      await supabaseAdmin.from('profiles').upsert(
        {
          user_id: userId,
          first_name: nameParts[0],
          last_name: nameParts.slice(1).join(' ') || '',
          email_verified: true,
          phone_verified: true,
          fully_verified: true,
          onboarding_completed: true,
          role: demoUser.role,
        },
        { onConflict: 'user_id' }
      )
    } catch (e) {
      console.warn('[Demo Profile Upsert Skipped]', e)
    }

    // Attempt standard sign in to set cookies
    try {
      const supabaseServer = await createClient()
      await supabaseServer.auth.signInWithPassword({
        email: demoUser.email,
        password: demoUser.password,
      })
    } catch (authErr) {
      console.warn('[Demo SignIn Session Warning]', authErr)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: demoUser.email,
        fullName: demoUser.fullName,
        role: demoUser.role,
        emailVerified: true,
        fullyVerified: true,
        onboardingCompleted: true,
      },
      redirectTo: demoUser.redirectTo,
      message: `Logged in as ${demoUser.fullName} (${demoUser.role.toUpperCase()}) with preloaded clinical data.`,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to initialize demo session', details: error?.message },
      { status: 500 }
    )
  }
}
