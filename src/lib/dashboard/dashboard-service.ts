import type {
  DailyCheckIn,
  WeeklyCheckIn,
  MonthlyReview,
  ReproductiveHealth,
  HealthScoreResult,
  CycleStatusResult,
  SuggestedActivityResult,
  AIInsightItem,
  HealthAlertItem,
} from '@/types'

/**
 * Calculates a dynamic Health Score (1–100) from actual stored user check-ins.
 * Returns null if insufficient data exists (< 3 check-ins) to avoid misleading medical assessments.
 */
export function calculateHealthScore(
  checkins: DailyCheckIn[],
  weeklyCheckin: WeeklyCheckIn | null
): HealthScoreResult {
  if (!checkins || checkins.length < 3) {
    return {
      score: null,
      status: 'insufficient_data',
      message: 'Health score will appear after more data is collected.',
    }
  }

  let totalPoints = 0
  let maxPoints = 0

  // 1. Mood / Feeling (max 30 points)
  checkins.forEach((c) => {
    maxPoints += 10
    if (c.feeling === 'happy' || c.feeling === 'great' || c.feeling === 'good') totalPoints += 10
    else if (c.feeling === 'neutral' || c.feeling === 'okay') totalPoints += 6
    else if (c.feeling === 'sad' || c.feeling === 'anxious' || c.feeling === 'tired') totalPoints += 3
  })

  // 2. Sleep Quality (max 30 points)
  checkins.forEach((c) => {
    maxPoints += 10
    if (c.sleep_quality === 'great' || c.sleep_quality === 'good') totalPoints += 10
    else if (c.sleep_quality === 'moderate' || c.sleep_quality === 'okay') totalPoints += 6
    else totalPoints += 3
  })

  // 3. Activity Done (max 20 points)
  checkins.forEach((c) => {
    maxPoints += 10
    if (c.activity_done) totalPoints += 10
    else totalPoints += 4
  })

  // 4. Weekly Checkin Adjustment (max 20 points)
  if (weeklyCheckin) {
    maxPoints += 20
    totalPoints += Math.round(((weeklyCheckin.overall_health || 5) / 10) * 20)
  }

  const rawScore = Math.round((totalPoints / maxPoints) * 100)
  const score = Math.max(30, Math.min(100, rawScore))

  let status: HealthScoreResult['status'] = 'moderate'
  if (score >= 85) status = 'excellent'
  else if (score >= 70) status = 'good'

  return {
    score,
    status,
    message: `Based on your last ${checkins.length} check-ins.`,
  }
}

/**
 * Calculates reproductive cycle phase and next period prediction.
 * Uses last menstrual period date and average cycle length if available.
 * Returns clearly labeled AI estimates without presenting them as absolute medical facts.
 */
export function estimateCycleStatus(
  reproductiveData: Partial<ReproductiveHealth> | null,
  lastCheckinDate?: string
): CycleStatusResult {
  const lastPeriodStr = reproductiveData?.last_menstrual_period
  const cycleLength = reproductiveData?.avg_cycle_length || 28

  if (!lastPeriodStr) {
    return {
      currentPhase: 'Tracking Pending',
      cycleDay: null,
      nextPeriodDate: null,
      isEstimate: true,
      message: 'Add your last period date in cycle setup to unlock predictions.',
    }
  }

  const lastPeriod = new Date(lastPeriodStr)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - lastPeriod.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  const cycleDay = (diffDays % cycleLength) + 1

  let currentPhase = 'Follicular Phase'
  if (cycleDay >= 1 && cycleDay <= 5) {
    currentPhase = 'Menstrual Phase'
  } else if (cycleDay > 5 && cycleDay <= 13) {
    currentPhase = 'Follicular Phase'
  } else if (cycleDay >= 14 && cycleDay <= 16) {
    currentPhase = 'Ovulatory Window'
  } else {
    currentPhase = 'Luteal Phase'
  }

  // Calculate next expected period date
  const nextPeriod = new Date(lastPeriod)
  const totalCyclesPassed = Math.floor(diffDays / cycleLength) + 1
  nextPeriod.setDate(nextPeriod.getDate() + totalCyclesPassed * cycleLength)

  const nextPeriodDateStr = nextPeriod.toISOString().split('T')[0]

  return {
    currentPhase,
    cycleDay,
    nextPeriodDate: nextPeriodDateStr,
    isEstimate: true,
    message: 'AI estimate based on historical cycle length.',
  }
}

/**
 * Generates deterministic activity recommendations based on cycle phase, sleep, and stress.
 * Avoids false medical claims.
 */
export function getSuggestedActivity(
  cycleStatus: CycleStatusResult,
  todayCheckin: DailyCheckIn | null
): SuggestedActivityResult {
  const phase = cycleStatus.currentPhase
  const sleepQuality = todayCheckin?.sleep_quality || 'moderate'
  const feeling = todayCheckin?.feeling || 'okay'

  if (sleepQuality === 'poor' || feeling === 'tired') {
    return {
      title: 'Restorative Gentle Yoga & Stretching',
      category: 'recovery',
      description: 'Focus on light mobility, gentle breathwork, and muscle recovery.',
      durationMinutes: 20,
      rationale: 'Recommended because your recorded sleep or energy level is lower today.',
    }
  }

  if (phase === 'Menstrual Phase') {
    return {
      title: 'Light Walking & Gentle Mobility',
      category: 'walking',
      description: 'Low-impact movement to reduce pelvic tension and boost endorphins.',
      durationMinutes: 25,
      rationale: 'Tailored for your menstrual phase for comfort and circulation.',
    }
  }

  if (phase === 'Ovulatory Window' || phase === 'Follicular Phase') {
    return {
      title: 'Cycle-Synced Strength & Conditioning',
      category: 'strength',
      description: 'Moderate resistance training or steady cardio to leverage rising energy levels.',
      durationMinutes: 35,
      rationale: 'Estrogen levels support optimal muscle recovery and energy during this window.',
    }
  }

  return {
    title: 'Balanced Moderate Workout',
    category: 'cardio',
    description: 'Steady-state cardio or Pilates to maintain strength and reduce stress.',
    durationMinutes: 30,
    rationale: 'Balanced activity routine based on your general health goals.',
  }
}

/**
 * Generates extension point AI insights from actual user stored checkins.
 */
export function generateAIInsights(
  checkins: DailyCheckIn[],
  hydrationTotalMl: number,
  hydrationGoalMl: number
): AIInsightItem[] {
  const insights: AIInsightItem[] = []

  if (checkins && checkins.length >= 2) {
    const sleepCount = checkins.filter((c) => c.sleep_quality === 'great' || c.sleep_quality === 'good').length
    if (sleepCount >= 2) {
      insights.push({
        id: 'ins_1',
        category: 'sleep',
        insight: 'Your sleep quality has remained consistent across your recent daily logs.',
        timestamp: 'Today',
      })
    }
  }

  if (hydrationTotalMl >= hydrationGoalMl) {
    insights.push({
      id: 'ins_2',
      category: 'nutrition',
      insight: 'You achieved your hydration goal today! Optimal hydration supports energy and skin health.',
      timestamp: 'Today',
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'ins_demo_1',
      category: 'wellness',
      insight: 'Continue completing daily check-ins to build personalized AI health trends.',
      isDemo: true,
      timestamp: 'Just now',
    })
  }

  return insights
}

/**
 * Generates health notification alerts infrastructure.
 */
export function generateHealthAlerts(
  cycleStatus: CycleStatusResult,
  todayCheckin: DailyCheckIn | null
): HealthAlertItem[] {
  const alerts: HealthAlertItem[] = []

  if (cycleStatus.nextPeriodDate) {
    alerts.push({
      id: 'alt_1',
      type: 'cycle',
      title: 'Upcoming Cycle Window',
      message: `Your next cycle is estimated to begin around ${cycleStatus.nextPeriodDate} (AI estimate).`,
      severity: 'info',
      timestamp: 'Today',
    })
  }

  if (!todayCheckin) {
    alerts.push({
      id: 'alt_2',
      type: 'general',
      title: 'Daily Log Reminder',
      message: 'You have not completed your 30-second health check-in today.',
      severity: 'warning',
      timestamp: 'Today',
    })
  }

  return alerts
}
