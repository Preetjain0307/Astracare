import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardClientView } from '@/components/dashboard/DashboardClientView'
import { getTodayDailyCheckIn } from '@/services/questionnaire'

export default async function DashboardPage() {
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
  if (demoPersona) {
    user = {
      id: demoPersona.id || 'demo-patient-uuid-001',
      email: demoPersona.email || 'demo.patient@astracare.ai',
    }
  } else {
    try {
      const supabase = await createClient()
      const userPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { user: null } }), 1000))
      const authRes: any = await Promise.race([userPromise, timeoutPromise])
      user = authRes?.data?.user
    } catch (e) {
      console.warn('[Dashboard Supabase Auth Notice]', e)
    }
  }

  if (!user && !demoPersona) {
    redirect('/auth/login')
  }


  // Preloaded mock fallback data
  const mockProfile = {
    first_name: demoPersona?.fullName ? demoPersona.fullName.split(' ')[0] : 'Elena',
    last_name: demoPersona?.fullName ? demoPersona.fullName.split(' ').slice(1).join(' ') : 'Rostova',
    age: 26,
    height: 168,
    weight: 58,
    activity_level: 'moderate',
    email_verified: true,
    phone_verified: true,
    fully_verified: true,
    onboarding_completed: true,
    role: demoPersona?.role || 'patient',
  }

  const mockQuestionnaire = {
    user_id: user?.id || 'demo-user-id',
    cycle_regularity: 'regular',
    typical_cycle_length: 29,
    typical_period_duration: 5,
    last_period_start_date: new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0],
    primary_goal: 'period_tracking',
    pcos_diagnosed: false,
    endometriosis_diagnosed: false,
    thyroid_diagnosed: false,
  }

  const defaultGoals = [
    'period_tracking',
    'pcos_hormonal_health',
    'nutrition',
    'better_sleep',
    'fitness_exercise',
  ]

  let profile: any = mockProfile
  let questionnaire: any = mockQuestionnaire
  let healthGoals = { selected_goals: defaultGoals }
  let todayCheckIn: any = null

  if (user) {
    try {
      const supabase = await createClient()
      const [pRes, qRes, gRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('health_questionnaire').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('health_goals').select('selected_goals').eq('user_id', user.id).maybeSingle(),
      ])
      if (pRes.data) profile = { ...mockProfile, ...pRes.data }
      if (qRes.data) questionnaire = { ...mockQuestionnaire, ...qRes.data }
      if (gRes.data?.selected_goals) healthGoals = gRes.data
      const dbCheckIn = await getTodayDailyCheckIn(user.id)
      if (dbCheckIn) todayCheckIn = dbCheckIn
    } catch {
      // Fallback
    }
  }

  return (
    <DashboardClientView
      userEmail={user?.email || demoPersona?.email || 'demo.patient@astracare.ai'}
      profile={profile}
      questionnaire={questionnaire}
      todayCheckIn={todayCheckIn}
      selectedGoals={healthGoals?.selected_goals || defaultGoals}
    />
  )
}
