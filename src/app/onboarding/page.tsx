import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getOnboardingStepPath } from '@/lib/utils'

// This page just routes the user to the correct step
export default async function OnboardingIndexPage() {
  const cookieStore = await cookies()
  const demoCookie = cookieStore.get('astracare_demo_user')?.value

  if (demoCookie) {
    redirect('/dashboard')
  }

  let user: any = null
  try {
    const supabase = await createClient()
    const userPromise = supabase.auth.getUser()
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { user: null } }), 1000))
    const authRes: any = await Promise.race([userPromise, timeoutPromise])
    user = authRes?.data?.user
  } catch {}

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
