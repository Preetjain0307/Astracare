'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { StepAIPreferences, AI_PREFERENCES_OPTIONS } from '@/components/onboarding/StepAIPreferences'
import { saveStep5Action } from '../actions'
import type { AIPreferencesFormData } from '@/lib/validation/onboarding'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

export default function AIPreferencesStepPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<AIPreferencesFormData>>({
    preferences: AI_PREFERENCES_OPTIONS.map((p) => p.id),
  })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleNext = () => {
    setError(null)
    startTransition(async () => {
      const res = await saveStep5Action(formData)
      if (res.success) {
        router.push('/onboarding/goal-questions')
      } else {
        setError(res.error || 'Failed to save AI preferences')
      }
    })
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
          {error}
        </div>
      )}

      <StepAIPreferences
        data={formData}
        onChange={(updated) => setFormData(updated)}
      />

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
        <button
          type="button"
          onClick={() => router.push('/onboarding/smart-band')}
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
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
