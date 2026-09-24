import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnalyticsHistory } from '@/services/questionnaire'
import type { DashboardAnalyticsData, AnalyticsTrendPoint } from '@/types'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframeParam = searchParams.get('timeframe') || '7d'
    const days = timeframeParam === '90d' ? 90 : timeframeParam === '30d' ? 30 : 7

    const history = await getAnalyticsHistory(user.id, days)

    const hasCheckins = history.checkins.length > 0
    const hasHydration = history.hydration.length > 0

    const hasSufficientData = history.checkins.length >= 2 || history.hydration.length >= 2

    // Map daily checkins to trend points
    const sleepTrend: AnalyticsTrendPoint[] = history.checkins.map((c) => ({
      date: c.checkin_date,
      label: new Date(c.checkin_date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      sleepQualityScore: c.sleep_quality === 'great' ? 90 : c.sleep_quality === 'good' ? 75 : 50,
      sleepHours: c.sleep_quality === 'great' ? 8 : c.sleep_quality === 'good' ? 7 : 5.5,
    }))

    const stressTrend: AnalyticsTrendPoint[] = history.weekly.map((w) => ({
      date: w.week_start_date,
      label: `Week of ${cShortDate(w.week_start_date)}`,
      stressLevel: w.stress_level || 5,
    }))

    const activityTrend: AnalyticsTrendPoint[] = history.checkins.map((c) => ({
      date: c.checkin_date,
      label: cShortDate(c.checkin_date),
      activityDone: c.activity_done ? 100 : 20,
    }))

    // Group hydration by date
    const hydrationByDate: Record<string, number> = {}
    history.hydration.forEach((h) => {
      hydrationByDate[h.entry_date] = (hydrationByDate[h.entry_date] || 0) + (h.amount_ml || 0)
    })

    const hydrationTrend: AnalyticsTrendPoint[] = Object.entries(hydrationByDate).map(([date, total]) => ({
      date,
      label: cShortDate(date),
      hydrationMl: total,
    }))

    // Calculate mood distribution
    const moodCounts: Record<string, number> = {}
    history.checkins.forEach((c) => {
      const feeling = c.feeling || 'neutral'
      moodCounts[feeling] = (moodCounts[feeling] || 0) + 1
    })

    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({ mood, count }))

    const analyticsData: DashboardAnalyticsData = {
      timeframe: timeframeParam as '7d' | '30d' | '90d',
      hasSufficientData,
      message: hasSufficientData
        ? `Analytics generated from your recorded logs over the last ${days} days.`
        : 'Not enough data yet. Continue tracking daily to unlock insights.',
      sleepTrend,
      stressTrend,
      activityTrend,
      hydrationTrend,
      moodDistribution,
      cycleHistory: [],
    }

    return NextResponse.json({ analytics: analyticsData })
  } catch (error: any) {
    console.error('Error fetching dashboard analytics:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to load dashboard analytics' },
      { status: 500 }
    )
  }
}

function cShortDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
  } catch {
    return dateStr
  }
}
