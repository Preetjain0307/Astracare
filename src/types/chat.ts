export type ChatIntent =
  | 'cycle_information'
  | 'cycle_prediction'
  | 'sleep_analysis'
  | 'stress_analysis'
  | 'activity_analysis'
  | 'hydration'
  | 'nutrition'
  | 'fitness'
  | 'mental_wellness'
  | 'wearable_data'
  | 'health_report'
  | 'ai_insights'
  | 'general_health_question'
  | 'medication_reminder'
  | 'emergency'
  | 'unknown'

export type ConfidenceLevel = 'high' | 'moderate' | 'low' | 'estimate'

export interface ChatSession {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  user_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  intent?: ChatIntent | null
  sources?: string[] | null
  confidence?: ConfidenceLevel | null
  created_at: string
}

export interface ChatRequest {
  message: string
  sessionId?: string
}

export interface ChatResponse {
  sessionId: string
  message: string
  intent: ChatIntent
  sources: string[]
  confidence: ConfidenceLevel
  disclaimer?: string
  isEmergency?: boolean
  isMedicationSafetyNotice?: boolean
}

export interface NLPClassificationResult {
  intent: ChatIntent
  confidence: ConfidenceLevel
  timeframe?: 'today' | 'last_7_days' | 'last_30_days' | 'all_time'
  extractedEntities?: Record<string, any>
  isEmergency: boolean
  isMedicationRelated: boolean
}

export interface ContextData {
  userProfile?: {
    firstName?: string | null
    age?: number | null
    goals?: string[]
    activityLevel?: string | null
  }
  cycleInfo?: {
    lastPeriodDate?: string | null
    avgCycleLength?: number | null
    currentPhase?: string
    nextPeriodDate?: string | null
    cycleDay?: number | null
  }
  sleepData?: {
    recentAvgQuality?: string
    averageHoursLogged?: number
    recentLogsCount?: number
  }
  stressData?: {
    recentMoodSummary?: string
    averageStressScore?: number
  }
  activityData?: {
    recentExerciseRate?: string
    totalActivitiesLogged?: number
  }
  hydrationData?: {
    todayAmountMl?: number
    dailyGoalMl?: number
    goalAchieved?: boolean
  }
  m3Insights?: {
    summaryText?: string
    insightsCount?: number
  }
  wearableSummary?: {
    connected?: boolean
    note?: string
  }
}
