'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

interface ReviewSubmitButtonProps {
  userId: string
}

export function ReviewSubmitButton({ userId }: ReviewSubmitButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null)
      const supabase = createClient()

      const [profileResult, questionnaireResult] = await Promise.all([
        supabase.from('profiles')
          .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
          .eq('user_id', userId),
        supabase.from('health_questionnaire')
          .update({
            completed: true,
            current_step: 8,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId),
      ])

      if (profileResult.error || questionnaireResult.error) {
        setError('Something went wrong. Please try again.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    })
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-brand-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Submit your health profile?</h2>
          <p className="text-sm text-slate-500 mb-6">
            Once submitted, your health profile will be complete and you'll be taken to your dashboard.
            You can update your information anytime from settings.
          </p>
          {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button className="flex-1" loading={isPending} onClick={handleSubmit}>
              Submit & Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 text-white text-center">
        <h3 className="font-semibold mb-1">Ready to complete your health profile?</h3>
        <p className="text-xs text-brand-200 mb-4">
          This information helps AstraCare AI provide personalized health insights.
        </p>
        <Button
          onClick={() => setShowConfirm(true)}
          className="bg-white text-brand-700 hover:bg-brand-50 font-semibold px-8"
          size="lg"
        >
          Submit Health Information
        </Button>
      </div>
    </div>
  )
}
