import { createClient } from '@/lib/supabase/server'
import type { ChatIntent, ContextData } from '@/types/chat'
import { estimateCycleStatus } from '@/lib/dashboard/dashboard-service'

/**
 * Retrieves ONLY intent-relevant structured user context from Supabase DB.
 * Implements Least-Privilege Data Access: does not retrieve unrelated medical history or personal data.
 */
export async function getSanitizedChatContext(
  userId: string,
  intent: ChatIntent
): Promise<{ context: ContextData; sources: string[] }> {
  const supabase = await createClient()
  const context: ContextData = {}
  const sources: string[] = []

  // Always retrieve basic profile name & goals for personalized greeting/tone
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, age, activity_level')
    .eq('user_id', userId)
    .maybeSingle()

  const { data: goalsRecord } = await supabase
    .from('health_goals')
    .select('selected_goals')
    .eq('user_id', userId)
    .maybeSingle()

  context.userProfile = {
    firstName: profile?.first_name || 'User',
    age: profile?.age || null,
    goals: goalsRecord?.selected_goals || [],
    activityLevel: profile?.activity_level || null,
  }
  sources.push('user_profile')

  // Intent-based context selection
  switch (intent) {
    case 'hydration': {
      const todayStr = new Date().toISOString().split('T')[0]
      const { data: entries } = await supabase
        .from('hydration_entries')
        .select('amount_ml')
        .eq('user_id', userId)
        .eq('entry_date', todayStr)

      const { data: goal } = await supabase
        .from('hydration_goals')
        .select('daily_goal_ml')
        .eq('user_id', userId)
        .maybeSingle()

      const totalMl = (entries || []).reduce((acc, curr) => acc + (curr.amount_ml || 0), 0)
      const dailyGoal = goal?.daily_goal_ml || 2500

      context.hydrationData = {
        todayAmountMl: totalMl,
        dailyGoalMl: dailyGoal,
        goalAchieved: totalMl >= dailyGoal,
      }
      sources.push('daily_hydration_logs')
      break
    }

    case 'cycle_prediction':
    case 'cycle_information': {
      const { data: repro } = await supabase
        .from('reproductive_health')
        .select('last_menstrual_period, avg_cycle_length, avg_period_duration, cycle_regularity')
        .eq('user_id', userId)
        .maybeSingle()

      const cycleEstimate = estimateCycleStatus(repro)
      context.cycleInfo = {
        lastPeriodDate: repro?.last_menstrual_period || null,
        avgCycleLength: repro?.avg_cycle_length || 28,
        currentPhase: cycleEstimate.currentPhase,
        nextPeriodDate: cycleEstimate.nextPeriodDate,
        cycleDay: cycleEstimate.cycleDay,
      }
      sources.push('reproductive_health_logs', 'm3_cycle_estimate_engine')
      break
    }

    case 'sleep_analysis': {
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('sleep_quality, feeling, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7)

      if (checkins && checkins.length > 0) {
        const goodSleepCount = checkins.filter(
          (c) => c.sleep_quality === 'great' || c.sleep_quality === 'good'
        ).length

        context.sleepData = {
          recentAvgQuality:
            goodSleepCount >= Math.ceil(checkins.length / 2) ? 'Good/Great' : 'Fair/Poor',
          recentLogsCount: checkins.length,
        }
      } else {
        context.sleepData = {
          recentAvgQuality: 'No recent logs',
          recentLogsCount: 0,
        }
      }
      sources.push('daily_checkins_sleep_logs')
      break
    }

    case 'stress_analysis':
    case 'mental_wellness': {
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('feeling, sleep_quality, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7)

      const { data: weekly } = await supabase
        .from('weekly_checkins')
        .select('stress_level, overall_health')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      context.stressData = {
        recentMoodSummary: checkins?.map((c) => c.feeling).join(', ') || 'No recent mood logs',
        averageStressScore: weekly?.stress_level || undefined,
      }
      sources.push('daily_checkins_mood', 'weekly_checkins_stress')
      break
    }

    case 'activity_analysis':
    case 'fitness': {
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('activity_done')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7)

      const activeDays = (checkins || []).filter((c) => c.activity_done).length
      context.activityData = {
        recentExerciseRate: `${activeDays} of ${checkins?.length || 0} recent days`,
        totalActivitiesLogged: activeDays,
      }
      sources.push('daily_checkins_activity')
      break
    }

    case 'wearable_data': {
      const { data: smartBand } = await supabase
        .from('smart_band_setup')
        .select('owns_band, permissions')
        .eq('user_id', userId)
        .maybeSingle()

      context.wearableSummary = {
        connected: !!smartBand?.owns_band,
        note: smartBand?.owns_band
          ? 'AstraBand paired (Continuous Vitals Monitoring Active)'
          : 'No wearable device connected yet',
      }
      sources.push('smart_band_setup')
      break
    }

    case 'health_report':
    case 'ai_insights': {
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7)

      context.m3Insights = {
        summaryText: `Analysis based on ${checkins?.length || 0} recent daily check-ins.`,
        insightsCount: checkins?.length || 0,
      }
      sources.push('m3_health_intelligence_summary')
      break
    }

    default:
      // For general health question, no extra sensitive data retrieved beyond basic profile
      break
  }

  return { context, sources }
}
