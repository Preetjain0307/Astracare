import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getTodayDailyCheckIn,
  getCurrentWeekCheckIn,
  getCurrentMonthReview,
  getTodayHydration,
  getAnalyticsHistory,
} from '@/services/questionnaire'
import { getProfile } from '@/services/profile'
import {
  calculateHealthScore,
  estimateCycleStatus,
  getSuggestedActivity,
  generateAIInsights,
  generateHealthAlerts,
} from '@/lib/dashboard/dashboard-service'
import type { DashboardSummary } from '@/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 })
    }

    const userId = user.id

    // Fetch user profile and onboarding data
    const profile = await getProfile(userId)
    const onboardingCompleted = !!profile?.onboarding_completed

    // Fetch check-ins and hydration
    const [todayCheckIn, weeklyCheckIn, monthlyReview, hydration, history] = await Promise.all([
      getTodayDailyCheckIn(userId),
      getCurrentWeekCheckIn(userId),
      getCurrentMonthReview(userId),
      getTodayHydration(userId),
      getAnalyticsHistory(userId, 7),
    ])

    // Calculate dynamic health score
    const healthScore = calculateHealthScore(history.checkins, weeklyCheckIn)

    // Calculate cycle phase
    const cycleStatus = estimateCycleStatus(null)

    // Get suggested activity based on cycle & today's checkin
    const suggestedActivity = getSuggestedActivity(cycleStatus, todayCheckIn)

    // Check smart band setup
    const { data: smartBand } = await supabase
      .from('smart_band_setup')
      .select('owns_band')
      .eq('user_id', userId)
      .maybeSingle()

    const wearableConnected = !!smartBand?.owns_band

    // Extension points
    const aiInsights = generateAIInsights(history.checkins, hydration.totalMl, hydration.goalMl)
    const alerts = generateHealthAlerts(cycleStatus, todayCheckIn)

    const summary: DashboardSummary = {
      profile,
      onboardingCompleted,
      emailVerified: !!user.email_confirmed_at,
      todayCheckIn,
      weeklyCheckIn,
      monthlyReview,
      hydrationTotalMl: hydration.totalMl,
      hydrationGoalMl: hydration.goalMl,
      healthScore,
      cycleStatus,
      suggestedActivity,
      wearableConnected,
      aiInsights,
      alerts,
    }

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('Error fetching dashboard summary:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to load dashboard summary' },
      { status: 500 }
    )
  }
}
