'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StepReviewSubmit } from '@/components/onboarding/StepReviewSubmit'
import { completeOnboardingAction } from '../actions'
import { createClient } from '@/lib/supabase/client'
import type { QuestionnaireAllData } from '@/types'
import { getOnboardingStepPath } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function ReviewStepPage() {
  const router = useRouter()
  const [allData, setAllData] = useState<QuestionnaireAllData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const [p, hg, ai, sb, gr, med] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('health_goals').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('ai_preferences').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('smart_band_setup').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('goal_specific_responses').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('medical_history').select('*').eq('user_id', user.id).maybeSingle(),
        ])

        setAllData({
          questionnaire: null,
          profile: p.data as any,
          health_goals: hg.data as any,
          ai_preferences: ai.data as any,
          smart_band: sb.data as any,
          goal_responses: gr.data as any,
          reproductive_health: null,
          medical_history: med.data as any,
          lifestyle: null,
          wellness: null,
        })
      } catch (err: any) {
        setError(err.message || 'Failed to load questionnaire review data')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  const handleEditStep = (stepNumber: number) => {
    router.push(getOnboardingStepPath(stepNumber))
  }

  const handleSubmit = async () => {
    setError(null)
    const res = await completeOnboardingAction()
    if (res.success) {
      router.push('/dashboard')
    } else {
      setError(res.error || 'Failed to complete health profile setup')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
      </div>
    )
  }

  if (!allData) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-sm text-red-500">{error || 'Could not load review data'}</p>
        <button
          onClick={() => router.push('/onboarding/goals')}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
        >
          Start Setup Over
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
          {error}
        </div>
      )}

      <StepReviewSubmit
        allData={allData}
        onEditStep={handleEditStep}
        onSubmit={handleSubmit}
      />

      <div className="flex items-center justify-start pt-4 border-t border-slate-200/60">
        <button
          type="button"
          onClick={() => router.push('/onboarding/goal-questions')}
          className="h-11 px-5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Questions</span>
        </button>
      </div>
    </div>
  )
}
