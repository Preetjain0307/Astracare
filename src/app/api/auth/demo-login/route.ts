import { NextResponse } from 'next/server'

export const DEMO_ACCOUNTS = {
  patient: {
    id: 'demo-patient-uuid-001',
    email: 'demo.patient@astracare.ai',
    password: 'DemoPatient@2026',
    fullName: 'Elena Rostova',
    role: 'patient',
    redirectTo: '/dashboard',
  },
  doctor: {
    id: 'demo-doctor-uuid-002',
    email: 'demo.doctor@astracare.ai',
    password: 'DemoDoctor@2026',
    fullName: 'Dr. Sarah Jenkins, MD',
    role: 'doctor',
    redirectTo: '/dashboard/doctor',
  },
  admin: {
    id: 'demo-admin-uuid-003',
    email: 'admin@astracare.ai',
    password: 'DemoAdmin@2026',
    fullName: 'AstraCare System Admin',
    role: 'admin',
    redirectTo: '/dashboard/admin',
  },
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const role = body?.role || 'patient'
    const targetRole = (role in DEMO_ACCOUNTS ? role : 'patient') as keyof typeof DEMO_ACCOUNTS
    const demoUser = DEMO_ACCOUNTS[targetRole]

    const response = NextResponse.json({
      success: true,
      user: {
        id: demoUser.id,
        email: demoUser.email,
        fullName: demoUser.fullName,
        role: demoUser.role,
        emailVerified: true,
        fullyVerified: true,
        onboardingCompleted: true,
      },
      redirectTo: demoUser.redirectTo,
      message: `Logged in as ${demoUser.fullName} (${demoUser.role.toUpperCase()}) with preloaded mock clinical data.`,
    })

    // Set demo authentication cookie
    response.cookies.set('astracare_demo_user', JSON.stringify({
      id: demoUser.id,
      email: demoUser.email,
      fullName: demoUser.fullName,
      role: demoUser.role,
    }), {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to initialize demo session', details: error?.message },
      { status: 500 }
    )
  }
}

