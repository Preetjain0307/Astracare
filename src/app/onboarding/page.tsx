import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getOnboardingStepPath } from '@/lib/utils'

// This page just routes the user to the correct step
export default async function OnboardingIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('user_id', user.id)
    .single()

  if (profile?.onboarding_completed) {
    redirect('/dashboard')
  }

  const { data: questionnaire } = await supabase
    .from('health_questionnaire')
    .select('current_step, completed')
    .eq('user_id', user.id)
    .single()

  const step = questionnaire?.current_step ?? 1
  redirect(getOnboardingStepPath(step))
}
