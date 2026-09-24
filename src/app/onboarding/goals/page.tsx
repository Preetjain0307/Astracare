'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { StepWelcomeGoals } from '@/components/onboarding/StepWelcomeGoals'
import { saveStep1Action } from '../actions'
import type { HealthGoalId } from '@/types'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function GoalsStepPage() {
  const router = useRouter()
  const [selectedGoals, setSelectedGoals] = useState<HealthGoalId[]>(['period_tracking'])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleNext = () => {
    if (selectedGoals.length === 0) {
      setError('Please select at least one health goal to continue.')
      return
    }
    setError(null)

    startTransition(async () => {
      const res = await saveStep1Action(selectedGoals)
      if (res.success) {
        router.push('/onboarding/basic-information')
      } else {
        setError(res.error || 'Failed to save goals. Please try again.')
      }
    })
  }

  return (
    <div className="space-y-8">
      <StepWelcomeGoals
        selectedGoals={selectedGoals}
        onChange={(goals) => {
          setSelectedGoals(goals)
          if (error) setError(null)
        }}
        error={error || undefined}
      />

      <div className="flex justify-end pt-4 border-t border-slate-200/60">
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
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
