'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { StepGoalQuestions } from '@/components/onboarding/StepGoalQuestions'
import { saveStep6Action } from '../actions'
import { createClient } from '@/lib/supabase/client'
import type { HealthGoalId } from '@/types'
import type { GoalQuestionsFormData } from '@/lib/validation/onboarding'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

export default function GoalQuestionsStepPage() {
  const router = useRouter()
  const [selectedGoals, setSelectedGoals] = useState<HealthGoalId[]>(['period_tracking', 'mental_wellness'])
  const [formData, setFormData] = useState<Partial<GoalQuestionsFormData>>({})
  const [error, setError] = useState<string | null>(null)
  const [isLoadingGoals, setIsLoadingGoals] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function loadSelectedGoals() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: hg } = await supabase
            .from('health_goals')
            .select('selected_goals')
            .eq('user_id', user.id)
            .maybeSingle()

          if (hg?.selected_goals?.length) {
            setSelectedGoals(hg.selected_goals)
          }
        }
      } catch (e) {
        console.error('Error fetching selected goals:', e)
      } finally {
        setIsLoadingGoals(false)
      }
    }
    loadSelectedGoals()
  }, [])

  const handleNext = () => {
    setError(null)
    startTransition(async () => {
      const res = await saveStep6Action(formData)
      if (res.success) {
        router.push('/onboarding/review')
      } else {
        setError(res.error || 'Failed to save responses')
      }
    })
  }

  if (isLoadingGoals) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
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

      <StepGoalQuestions
        selectedGoals={selectedGoals}
        data={formData}
        onChange={(updated) => setFormData(updated)}
      />

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
        <button
          type="button"
          onClick={() => router.push('/onboarding/ai-preferences')}
          className="h-11 px-5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isPending}
          className="h-11 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Review Profile</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
