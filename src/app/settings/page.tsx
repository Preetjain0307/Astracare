import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Shield, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const demoCookie = cookieStore.get('astracare_demo_user')?.value

  let demoPersona: any = null
  if (demoCookie) {
    try {
      demoPersona = JSON.parse(demoCookie)
    } catch {
      demoPersona = { role: 'patient', fullName: 'Elena Rostova', email: 'demo.patient@astracare.ai' }
    }
  }

  let user: any = null
  let profile: any = {
    first_name: demoPersona?.fullName ? demoPersona.fullName.split(' ')[0] : 'Elena',
    last_name: demoPersona?.fullName ? demoPersona.fullName.split(' ').slice(1).join(' ') : 'Rostova',
    phone: '+1 (555) 234-5678',
    date_of_birth: '1998-05-14',
    location: 'San Francisco, CA',
    onboarding_completed: true,
  }

  if (demoPersona) {
    user = {
      id: demoPersona.id || 'demo-patient-uuid-001',
      email: demoPersona.email || 'demo.patient@astracare.ai',
      created_at: '2026-01-15T00:00:00.000Z',
      email_confirmed_at: '2026-01-15T00:00:00.000Z',
      app_metadata: { provider: 'demo_mock' },
    }
  } else {
    try {
      const supabase = await createClient()
      const userPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { user: null } }), 1000))
      const authRes: any = await Promise.race([userPromise, timeoutPromise])
      user = authRes?.data?.user

      if (user) {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        if (dbProfile) profile = dbProfile
      }
    } catch (e) {
      console.warn('[Settings Supabase Auth Notice]', e)
    }
  }

  if (!user && !demoPersona) redirect('/auth/login')

  const authProvider = user?.app_metadata?.provider ?? 'email'


  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-semibold text-slate-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center">
                <User className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <CardTitle className="text-base">Profile Information</CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Name</span>
              <span className="text-sm font-medium text-slate-900">
                {profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-900">{user.email ?? '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Phone</span>
              <span className="text-sm font-medium text-slate-900">{user.phone ?? profile?.phone ?? '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Date of birth</span>
              <span className="text-sm font-medium text-slate-900">{formatDate(profile?.date_of_birth)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">Location</span>
              <span className="text-sm font-medium text-slate-900">{profile?.location ?? '—'}</span>
            </div>

            <div className="pt-2">
              <Link href="/onboarding/basic-information"
                className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Edit profile information →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center">
                <Shield className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <CardTitle className="text-base">Account Security</CardTitle>
                <CardDescription>Authentication and security settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Sign in method</span>
              <Badge variant="brand" className="capitalize">{authProvider}</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Account created</span>
              <span className="text-sm font-medium text-slate-900">{formatDate(user.created_at)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-500">Email verified</span>
              <Badge variant={user.email_confirmed_at ? 'success' : 'warning'}>
                {user.email_confirmed_at ? 'Verified' : 'Unverified'}
              </Badge>
            </div>

            {authProvider === 'email' && (
              <div className="pt-2">
                <Link href="/auth/forgot-password"
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                  Change password →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                <Bell className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <CardTitle className="text-base">Health Data</CardTitle>
                <CardDescription>Manage your health information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500">Onboarding status</span>
              <Badge variant={profile?.onboarding_completed ? 'success' : 'warning'}>
                {profile?.onboarding_completed ? 'Complete' : 'In progress'}
              </Badge>
            </div>
            <div className="pt-2 flex gap-3">
              <Link href="/onboarding/review"
                className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                View health profile →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <div className="p-4 rounded-2xl border border-red-100 bg-red-50">
          <h3 className="text-sm font-semibold text-red-700 mb-1">Account Actions</h3>
          <p className="text-xs text-red-500 mb-3">
            These actions may affect your account and data.
          </p>
          <Link href="/auth/login"
            className="text-sm text-red-600 hover:text-red-700 font-medium">
            Sign out of all sessions →
          </Link>
        </div>
      </main>
    </div>
  )
}
