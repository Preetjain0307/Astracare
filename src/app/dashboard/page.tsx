import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClientView } from '@/components/dashboard/DashboardClientView'
import { getTodayDailyCheckIn } from '@/services/questionnaire'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: questionnaire }, { data: healthGoals }] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('health_questionnaire').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('health_goals').select('selected_goals').eq('user_id', user.id).maybeSingle(),
  ])

  const todayCheckIn = await getTodayDailyCheckIn(user.id)

  return (
    <DashboardClientView
      userEmail={user.email || ''}
      profile={profile}
      questionnaire={questionnaire}
      todayCheckIn={todayCheckIn}
      selectedGoals={healthGoals?.selected_goals || []}
    />
  )
}
