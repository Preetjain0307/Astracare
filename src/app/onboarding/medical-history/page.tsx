'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { StepMedicalHistory } from '@/components/onboarding/StepMedicalHistory'
import { saveStep3Action } from '../actions'
import { medicalHistorySchema, type MedicalHistoryFormData } from '@/lib/validation/onboarding'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

export default function MedicalHistoryStepPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<MedicalHistoryFormData>>({
    diagnoses: [],
    family_history: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const handleNext = () => {
    const result = medicalHistorySchema.safeParse(formData)
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
      const res = await saveStep3Action(result.data)
      if (res.success) {
        router.push('/onboarding/smart-band')
      } else {
        setErrors({ general: res.error || 'Failed to save medical history' })
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

      <StepMedicalHistory
        data={formData}
        onChange={(updated) => setFormData(updated)}
        errors={errors}
      />

      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
        <button
          type="button"
          onClick={() => router.push('/onboarding/basic-information')}
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
