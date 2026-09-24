'use server'

import { createClient } from '@/lib/supabase/server'
import {
  saveHealthGoals,
  saveBasicProfile,
  saveMedicalHistory,
  saveSmartBandSetup,
  saveAIPreferences,
  saveGoalSpecificResponses,
  completeOnboarding,
  advanceStep,
} from '@/services/questionnaire'
import type { HealthGoalId } from '@/types'
import type {
  BasicProfileFormData,
  MedicalHistoryFormData,
  SmartBandFormData,
  AIPreferencesFormData,
  GoalQuestionsFormData,
} from '@/lib/validation/onboarding'

async function getAuthUserId() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return user.id
}

export async function saveStep1Action(selectedGoals: HealthGoalId[]) {
  try {
    const userId = await getAuthUserId()
    const res = await saveHealthGoals(userId, selectedGoals)
    if (!res.success) return { success: false, error: res.error }
    await advanceStep(userId, 2, { selected_goals: selectedGoals })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save health goals' }
  }
}

export async function saveStep2Action(profileData: Partial<BasicProfileFormData>) {
  try {
    const userId = await getAuthUserId()
    const res = await saveBasicProfile(userId, profileData)
    if (!res.success) return { success: false, error: res.error }
    await advanceStep(userId, 3, { profile: profileData })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save profile' }
  }
}

export async function saveStep3Action(medicalData: Partial<MedicalHistoryFormData>) {
  try {
    const userId = await getAuthUserId()
    const res = await saveMedicalHistory(userId, medicalData)
    if (!res.success) return { success: false, error: res.error }
    await advanceStep(userId, 4, { medical: medicalData })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save medical history' }
  }
}

export async function saveStep4Action(smartBandData: Partial<SmartBandFormData>) {
  try {
    const userId = await getAuthUserId()
    const res = await saveSmartBandSetup(
      userId,
      smartBandData.owns_band ?? false,
      smartBandData.permissions || []
    )
    if (!res.success) return { success: false, error: res.error }
    await advanceStep(userId, 5, { smart_band: smartBandData })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save smart band setup' }
  }
}

export async function saveStep5Action(aiData: Partial<AIPreferencesFormData>) {
  try {
    const userId = await getAuthUserId()
    const res = await saveAIPreferences(userId, aiData.preferences || [])
    if (!res.success) return { success: false, error: res.error }
    await advanceStep(userId, 6, { ai_preferences: aiData.preferences })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save AI preferences' }
  }
}

export async function saveStep6Action(goalData: Partial<GoalQuestionsFormData>) {
  try {
    const userId = await getAuthUserId()
    const res = await saveGoalSpecificResponses(userId, goalData)
    if (!res.success) return { success: false, error: res.error }
    await advanceStep(userId, 7, { goal_responses: goalData })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save goal responses' }
  }
}

export async function completeOnboardingAction() {
  try {
    const userId = await getAuthUserId()
    const res = await completeOnboarding(userId)
    if (!res.success) return { success: false, error: res.error }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to complete onboarding' }
  }
}
