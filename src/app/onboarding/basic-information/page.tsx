'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { StepBasicProfile } from '@/components/onboarding/StepBasicProfile'
import { saveStep2Action } from '../actions'
import { basicProfileSchema, type BasicProfileFormData } from '@/lib/validation/onboarding'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

export default function BasicInfoStepPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<BasicProfileFormData>>({
    height_unit: 'metric',
    weight_unit: 'metric',
    activity_level: 'lightly_active',
    smoking: 'never',
    alcohol: 'socially',
    prefer_not_to_say_sensitive: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const handleNext = () => {
    const result = basicProfileSchema.safeParse(formData)
    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) formattedErrors[err.path[0].toString()] = err.message
      })
      setErrors(formattedErrors)
      return
    }
    setErrors({})

    startTransition(async () => {
      const res = await saveStep2Action(result.data)
      if (res.success) {
        router.push('/onboarding/medical-history')
      } else {
        setErrors({ general: res.error || 'Failed to save basic profile' })
      }
    })
  }

  return (
    <div className="space-y-8">
      {errors.general && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
          {errors.general}
        </div>
      )}

      <StepBasicProfile
        data={formData}
        onChange={(updated) => setFormData(updated)}
        errors={errors}
      />

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
        <button
          type="button"
          onClick={() => router.push('/onboarding/goals')}
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
