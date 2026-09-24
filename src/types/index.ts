export type UserRole = 'patient' | 'doctor' | 'admin'

export type HealthGoalId =
  | 'period_tracking'
  | 'pcos'
  | 'conceiving'
  | 'pregnancy'
  | 'postpartum'
  | 'menopause'
  | 'fitness'
  | 'nutrition'
  | 'weight_management'
  | 'sleep'
  | 'mental_wellness'
  | 'sexual_health'
  | 'thyroid'
  | 'general_wellness'

export type AIPreferenceId =
  | 'period_prediction'
  | 'ovulation_prediction'
  | 'pregnancy_insights'
  | 'sleep_analysis'
  | 'stress_monitoring'
  | 'workout_recommendations'
  | 'nutrition_suggestions'
  | 'medication_reminders'
  | 'weekly_report'
  | 'monthly_report'
  | 'risk_alerts'

export interface Profile {
  id: string
  user_id: string
  first_name: string | null
  last_name: string | null
  date_of_birth: string | null
  age: number | null
  birth_year: number | null
  phone: string | null
  avatar_url: string | null
  height_cm: number | null
  weight_kg: number | null
  height_unit: 'metric' | 'imperial'
  weight_unit: 'metric' | 'imperial'
  activity_level: string | null
  smoking: string | null
  alcohol: string | null
  blood_group: string | null
  location: string | null
  country: string | null
  time_zone: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  prefer_not_to_say_sensitive: boolean
  role: UserRole
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface HealthGoalRecord {
  id: string
  user_id: string
  selected_goals: HealthGoalId[]
  created_at: string
  updated_at: string
}

export interface AIPreferenceRecord {
  id: string
  user_id: string
  preferences: AIPreferenceId[]
  created_at: string
  updated_at: string
}

export interface SmartBandSetupRecord {
  id: string
  user_id: string
  owns_band: boolean
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface GoalSpecificResponsesRecord {
  id: string
  user_id: string
  responses: Record<string, any>
  created_at: string
  updated_at: string
}

export interface HealthQuestionnaire {
  id: string
  user_id: string
  current_step: number
  completed: boolean
  completed_steps?: number[]
  draft_answers?: Record<string, any>
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ReproductiveHealth {
  id: string
  user_id: string
  life_stage: string | null
  menstrual_status: string | null
  cycle_regularity: string | null
  avg_cycle_length: number | null
  avg_period_duration: number | null
  last_menstrual_period: string | null
  menstrual_symptoms: string[] | null
  pain_level: number | null
  pms_symptoms: string[] | null
  created_at: string
  updated_at: string
}

export interface MenstrualHistory {
  id: string
  user_id: string
  last_period_date: string | null
  avg_cycle_length: number | null
  avg_period_duration: number | null
  cycle_regularity: string | null
  symptoms: string[] | null
  pain_level: number | null
  spotting: boolean | null
  prev_irregularity: string | null
  created_at: string
  updated_at: string
}

export interface PregnancyFertility {
  id: string
  user_id: string
  currently_pregnant: string | null
  due_date: string | null
  pregnancy_history: string | null
  num_pregnancies: number | null
  num_live_births: number | null
  fertility_tracking: boolean | null
  pregnancy_planning: string | null
  contraception: string | null
  created_at: string
  updated_at: string
}

export interface MedicalHistory {
  id: string
  user_id: string
  conditions: string[] | null
  allergies: string[] | null
  medications: string[] | null
  surgeries: string[] | null
  diagnoses: string[] | null
  family_history: string[] | null
  other_conditions: string | null
  other_allergies: string | null
  pcos_diagnosed?: boolean
  endometriosis_diagnosed?: boolean
  thyroid_diagnosed?: boolean
  diabetes_diagnosed?: boolean
  hypertension_diagnosed?: boolean
  anemia_diagnosed?: boolean
  anxiety_depression_diagnosed?: boolean
  asthma_diagnosed?: boolean
  created_at: string
  updated_at: string
}

export interface LifestyleInformation {
  id: string
  user_id: string
  sleep_duration: number | null
  sleep_quality: string | null
  activity_level: string | null
  water_intake: number | null
  dietary_preference: string | null
  smoking_status: string | null
  alcohol_consumption: string | null
  stress_level: number | null
  occupation: string | null
  created_at: string
  updated_at: string
}

export interface WellnessInformation {
  id: string
  user_id: string
  stress_level: number | null
  mood: string | null
  sleep_quality: string | null
  general_wellness: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DailyCheckIn {
  id?: string
  user_id: string
  checkin_date?: string
  feeling: string
  sleep_quality: string
  energy_level: string
  symptoms: string[]
  activity_done: boolean
  created_at?: string
}

export interface WeeklyCheckIn {
  id?: string
  user_id: string
  week_start_date?: string
  overall_health: number
  exercise_frequency: string
  stress_level: number
  unusual_symptoms: boolean
  notes?: string
  created_at?: string
}

export interface MonthlyReview {
  id?: string
  user_id: string
  review_month?: string
  period_regular: string
  severe_symptoms: boolean
  weight_change: string
  sleep_quality: string
  stress_level: number
  notes?: string
  created_at?: string
}


export interface HydrationEntry {
  id?: string
  user_id: string
  entry_date: string
  amount_ml: number
  created_at?: string
}

export interface HydrationGoal {
  id?: string
  user_id: string
  daily_goal_ml: number
  created_at?: string
  updated_at?: string
}

export interface HealthScoreResult {
  score: number | null
  status: 'excellent' | 'good' | 'moderate' | 'insufficient_data'
  message: string
}

export interface CycleStatusResult {
  currentPhase: string
  cycleDay: number | null
  nextPeriodDate: string | null
  isEstimate: boolean
  message: string
}

export interface SuggestedActivityResult {
  title: string
  category: 'strength' | 'cardio' | 'walking' | 'recovery' | 'rest'
  description: string
  durationMinutes: number
  rationale: string
}

export interface AIInsightItem {
  id: string
  category: 'sleep' | 'activity' | 'cycle' | 'nutrition' | 'wellness'
  insight: string
  isDemo?: boolean
  timestamp: string
}

export interface HealthAlertItem {
  id: string
  type: 'cycle' | 'medication' | 'wearable' | 'general'
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  timestamp: string
}

export interface DashboardSummary {
  profile: Profile | null
  onboardingCompleted: boolean
  emailVerified: boolean
  todayCheckIn: DailyCheckIn | null
  weeklyCheckIn: WeeklyCheckIn | null
  monthlyReview: MonthlyReview | null
  hydrationTotalMl: number
  hydrationGoalMl: number
  healthScore: HealthScoreResult
  cycleStatus: CycleStatusResult
  suggestedActivity: SuggestedActivityResult
  wearableConnected: boolean
  aiInsights: AIInsightItem[]
  alerts: HealthAlertItem[]
}

export interface AnalyticsTrendPoint {
  date: string
  label: string
  sleepQualityScore?: number
  sleepHours?: number
  stressLevel?: number
  activityDone?: number
  hydrationMl?: number
  mood?: string
}

export interface DashboardAnalyticsData {
  timeframe: '7d' | '30d' | '90d'
  hasSufficientData: boolean
  message: string
  sleepTrend: AnalyticsTrendPoint[]
  stressTrend: AnalyticsTrendPoint[]
  activityTrend: AnalyticsTrendPoint[]
  hydrationTrend: AnalyticsTrendPoint[]
  moodDistribution: { mood: string; count: number }[]
  cycleHistory: { cycleStart: string; lengthDays: number }[]
}

export interface QuestionnaireAllData {
  questionnaire: HealthQuestionnaire | null
  profile: Profile | null
  health_goals: HealthGoalRecord | null
  ai_preferences: AIPreferenceRecord | null
  smart_band: SmartBandSetupRecord | null
  goal_responses: GoalSpecificResponsesRecord | null
  reproductive_health: ReproductiveHealth | null
  medical_history: MedicalHistory | null
  lifestyle: LifestyleInformation | null
  wellness: WellnessInformation | null
}

export interface AuthError {
  message: string
  status?: number
}

export interface ActionResult<T = unknown> {
  data?: T
  error?: string
  success: boolean
}

export * from './chat'



