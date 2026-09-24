import type { AIProvider, GenerateInput } from './ai-provider'

export class FallbackLocalProvider implements AIProvider {
  name = 'AstraCare Local NLP Engine (Deterministic Fallback)'

  async generateResponse(input: GenerateInput): Promise<string> {
    const message = input.userMessage.toLowerCase()
    const ctx = input.contextData || {}
    const userName = ctx.userProfile?.firstName || 'there'

    // 1. Hydration Question
    if (ctx.hydrationData) {
      const { todayAmountMl, dailyGoalMl, goalAchieved } = ctx.hydrationData
      if (goalAchieved) {
        return `Hello ${userName}! You have recorded ${todayAmountMl} mL of water today. Excellent job! You've reached your daily goal of ${dailyGoalMl} mL.`
      }
      const remaining = Math.max(0, dailyGoalMl - todayAmountMl)
      return `Hello ${userName}! You have recorded ${todayAmountMl} mL of water today out of your ${dailyGoalMl} mL target. You need ${remaining} mL more to reach your goal.`
    }

    // 2. Cycle Prediction / Info Question
    if (ctx.cycleInfo) {
      const { currentPhase, nextPeriodDate, cycleDay, avgCycleLength } = ctx.cycleInfo
      if (!nextPeriodDate) {
        return `Hello ${userName}! You are currently in cycle tracking setup. Please enter your last period start date in your cycle settings to unlock automated period predictions.`
      }
      return `Based on your recorded cycle history (avg. ${avgCycleLength} days), you are currently on day ${cycleDay} (${currentPhase}). Your estimated next period is ${nextPeriodDate}. Please note this is an estimate and may shift as more data is recorded.`
    }

    // 3. Sleep Question
    if (ctx.sleepData) {
      const { recentAvgQuality, recentLogsCount } = ctx.sleepData
      if (recentLogsCount === 0) {
        return `Hello ${userName}! I don't see any sleep check-ins logged for you in the past 7 days. Complete a 30-second daily check-in so I can analyze your sleep trends!`
      }
      return `Over your last ${recentLogsCount} recorded daily check-ins, your average sleep quality was rated as ${recentAvgQuality}. Maintaining consistent sleep and wake times can help optimize your circadian rhythm.`
    }

    // 4. Stress Question
    if (ctx.stressData) {
      const { recentMoodSummary, averageStressScore } = ctx.stressData
      let response = `Your recent recorded feelings were: ${recentMoodSummary}.`
      if (averageStressScore !== undefined) {
        response += ` Your last weekly check-in recorded a stress level of ${averageStressScore}/10.`
      }
      response += ` Remember that sleep quality, hydration, and daily movement significantly influence stress levels.`
      return response
    }

    // 5. Activity Question
    if (ctx.activityData) {
      const { recentExerciseRate } = ctx.activityData
      return `You have completed workouts or physical activity on ${recentExerciseRate}. Keep up the great movement! Phase-aligned exercise can boost your energy levels.`
    }

    // 6. Wearable Question
    if (ctx.wearableSummary) {
      const { connected, note } = ctx.wearableSummary
      return `${note}. ${connected ? 'Your continuous heart rate and sleep vitals are being synced.' : 'Connect your AstraBand in settings to enable continuous HR and HRV tracking.'}`
    }

    // 7. General HRV explanation if user asks "Explain HRV"
    if (message.includes('hrv') || message.includes('heart rate variability')) {
      return `Heart Rate Variability (HRV) measures the variation in time between consecutive heartbeats. Higher HRV generally indicates better cardiovascular fitness and greater stress resilience, while lower HRV may suggest physical strain, fatigue, or elevated stress.`
    }

    // 8. General Default Response
    return `Hello ${userName}! I am your AstraCare AI Health Assistant. I can help answer health queries, track your hydration, cycle, sleep, and wellness trends. How can I support your health goals today?`
  }
}
