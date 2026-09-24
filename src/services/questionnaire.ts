import { createClient } from '@/lib/supabase/server'
import type {
  ReproductiveHealth,
  MedicalHistory,
  LifestyleInformation,
  WellnessInformation,
  QuestionnaireAllData,
  HealthGoalRecord,
  AIPreferenceRecord,
  SmartBandSetupRecord,
  GoalSpecificResponsesRecord,
  DailyCheckIn,
  WeeklyCheckIn,
  MonthlyReview,
} from '@/types'

// Advance the questionnaire step tracker
export async function advanceStep(
  userId: string,
  step: number,
  draftData?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: current } = await supabase
    .from('health_questionnaire')
    .select('completed_steps, draft_answers, current_step')
    .eq('user_id', userId)
    .single()

  const existingSteps = current?.completed_steps || []
  const newSteps = Array.from(new Set([...existingSteps, step - 1]))
  const updatedDraft = { ...(current?.draft_answers || {}), ...(draftData || {}) }

  const { error } = await supabase
    .from('health_questionnaire')
    .upsert(
      {
        user_id: userId,
        current_step: step,
        completed_steps: newSteps,
        draft_answers: updatedDraft,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// Generic upsert helper
async function upsertTable<T extends Record<string, unknown>>(
  table: string,
  userId: string,
  data: T
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from(table).upsert(
    { ...data, user_id: userId, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  )
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function saveHealthGoals(userId: string, selectedGoals: string[]) {
  return upsertTable('health_goals', userId, { selected_goals: selectedGoals })
}

export async function saveBasicProfile(userId: string, profileData: Record<string, any>) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function saveMedicalHistory(userId: string, data: Record<string, any>) {
  return upsertTable('medical_history', userId, data)
}


export async function saveSmartBandSetup(userId: string, ownsBand: boolean, permissions: string[]) {
  return upsertTable('smart_band_setup', userId, { owns_band: ownsBand, permissions })
}

export async function saveAIPreferences(userId: string, preferences: string[]) {
  return upsertTable('ai_preferences', userId, { preferences })
}

export async function saveGoalSpecificResponses(userId: string, responses: Record<string, any>) {
  return upsertTable('goal_specific_responses', userId, { responses })
}

export async function completeOnboarding(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  // Mark questionnaire as completed
  const { error: qError } = await supabase
    .from('health_questionnaire')
    .update({
      completed: true,
      current_step: 7,
      completed_at: now,
      updated_at: now,
    })
    .eq('user_id', userId)

  if (qError) return { success: false, error: qError.message }

  // Mark profile as onboarding_completed
  const { error: pError } = await supabase
    .from('profiles')
    .update({
      onboarding_completed: true,
      updated_at: now,
    })
    .eq('user_id', userId)

  if (pError) return { success: false, error: pError.message }

  return { success: true }
}

export async function submitDailyCheckIn(userId: string, data: Omit<DailyCheckIn, 'user_id'>) {
  const supabase = await createClient()
  const todayStr = data.checkin_date || new Date().toISOString().split('T')[0]
  const { error } = await supabase
    .from('daily_checkins')
    .upsert(
      {
        user_id: userId,
        checkin_date: todayStr,
        feeling: data.feeling,
        sleep_quality: data.sleep_quality,
        energy_level: data.energy_level,
        symptoms: data.symptoms,
        activity_done: data.activity_done,
      },
      { onConflict: 'user_id,checkin_date' }
    )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function submitWeeklyCheckIn(userId: string, data: Omit<WeeklyCheckIn, 'user_id'>) {
  const supabase = await createClient()
  const { error } = await supabase.from('weekly_checkins').insert({
    user_id: userId,
    week_start_date: data.week_start_date || new Date().toISOString().split('T')[0],
    overall_health: data.overall_health,
    exercise_frequency: data.exercise_frequency,
    stress_level: data.stress_level,
    unusual_symptoms: data.unusual_symptoms,
    notes: data.notes,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function submitMonthlyReview(userId: string, data: Omit<MonthlyReview, 'user_id'>) {
  const supabase = await createClient()
  const monthStr = data.review_month || new Date().toISOString().slice(0, 7)
  const { error } = await supabase.from('monthly_reviews').upsert(
    {
      user_id: userId,
      review_month: monthStr,
      period_regular: data.period_regular,
      severe_symptoms: data.severe_symptoms,
      weight_change: data.weight_change,
      sleep_quality: data.sleep_quality,
      stress_level: data.stress_level,
      notes: data.notes,
    },
    { onConflict: 'user_id,review_month' }
  )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getTodayDailyCheckIn(userId: string) {
  const supabase = await createClient()
  const todayStr = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('checkin_date', todayStr)
    .maybeSingle()

  return data as DailyCheckIn | null
}

export async function getCurrentWeekCheckIn(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('weekly_checkins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data as WeeklyCheckIn | null
}

export async function getCurrentMonthReview(userId: string) {
  const supabase = await createClient()
  const monthStr = new Date().toISOString().slice(0, 7)
  const { data } = await supabase
    .from('monthly_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('review_month', monthStr)
    .maybeSingle()

  return data as MonthlyReview | null
}

export async function addHydrationEntry(userId: string, amountMl: number) {
  const supabase = await createClient()
  const todayStr = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('hydration_entries')
    .insert({
      user_id: userId,
      entry_date: todayStr,
      amount_ml: amountMl,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function deleteHydrationEntry(userId: string, entryId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('hydration_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getTodayHydration(userId: string) {
  const supabase = await createClient()
  const todayStr = new Date().toISOString().split('T')[0]

  const [{ data: entries }, { data: goalRecord }] = await Promise.all([
    supabase
      .from('hydration_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', todayStr),
    supabase
      .from('hydration_goals')
      .select('daily_goal_ml')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  const totalMl = (entries || []).reduce((acc, curr) => acc + (curr.amount_ml || 0), 0)
  const goalMl = goalRecord?.daily_goal_ml || 2500

  return { totalMl, goalMl, entries: entries || [] }
}

export async function setHydrationGoal(userId: string, dailyGoalMl: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('hydration_goals').upsert(
    {
      user_id: userId,
      daily_goal_ml: dailyGoalMl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getAnalyticsHistory(userId: string, days: number = 7) {
  const supabase = await createClient()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  const startDateStr = startDate.toISOString().split('T')[0]

  const [{ data: checkins }, { data: hydration }, { data: weekly }, { data: monthly }] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('checkin_date', startDateStr)
      .order('checkin_date', { ascending: true }),
    supabase
      .from('hydration_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('entry_date', startDateStr),
    supabase
      .from('weekly_checkins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('monthly_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  ])

  return {
    checkins: checkins || [],
    hydration: hydration || [],
    weekly: weekly || [],
    monthly: monthly || [],
  }
}

// Fetch all M2 questionnaire data for review & dashboard
export async function getAllM2Data(userId: string): Promise<QuestionnaireAllData> {
  const supabase = await createClient()

  const [q, p, hg, ai, sb, gr, med, ls, w] = await Promise.all([
    supabase.from('health_questionnaire').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('health_goals').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('ai_preferences').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('smart_band_setup').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('goal_specific_responses').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('medical_history').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('lifestyle_information').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('wellness_information').select('*').eq('user_id', userId).maybeSingle(),
  ])

  return {
    questionnaire: q.data as QuestionnaireAllData['questionnaire'],
    profile: p.data as QuestionnaireAllData['profile'],
    health_goals: hg.data as QuestionnaireAllData['health_goals'],
    ai_preferences: ai.data as QuestionnaireAllData['ai_preferences'],
    smart_band: sb.data as QuestionnaireAllData['smart_band'],
    goal_responses: gr.data as QuestionnaireAllData['goal_responses'],
    reproductive_health: null,
    medical_history: med.data as QuestionnaireAllData['medical_history'],
    lifestyle: ls.data as QuestionnaireAllData['lifestyle'],
    wellness: w.data as QuestionnaireAllData['wellness'],
  }
}

