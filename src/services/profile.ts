import { createClient } from '@/lib/supabase/server'
import type { Profile, HealthQuestionnaire } from '@/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as Profile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getQuestionnaire(userId: string): Promise<HealthQuestionnaire | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('health_questionnaire')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data as HealthQuestionnaire
}

export async function markOnboardingComplete(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const [profileResult, questionnaireResult] = await Promise.all([
    supabase
      .from('profiles')
      .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId),
    supabase
      .from('health_questionnaire')
      .update({
        completed: true,
        current_step: 8,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId),
  ])

  if (profileResult.error) return { success: false, error: profileResult.error.message }
  if (questionnaireResult.error) return { success: false, error: questionnaireResult.error.message }
  return { success: true }
}
