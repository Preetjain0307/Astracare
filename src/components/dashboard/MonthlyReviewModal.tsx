'use client'

import React, { useState, useTransition } from 'react'
import { X, Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface MonthlyReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function MonthlyReviewModal({ isOpen, onClose, onSuccess }: MonthlyReviewModalProps) {
  const [periodRegular, setPeriodRegular] = useState<string>('yes')
  const [severeSymptoms, setSevereSymptoms] = useState<boolean>(false)
  const [weightChange, setWeightChange] = useState<string>('no_change')
  const [sleepQuality, setSleepQuality] = useState<string>('great')
  const [stressLevel, setStressLevel] = useState<number>(5)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const handleSubmit = () => {
    setError(null)
    startTransition(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const monthStr = new Date().toISOString().slice(0, 7)
        const { error: upsertErr } = await supabase.from('monthly_reviews').upsert(
          {
            user_id: user.id,
            review_month: monthStr,
            period_regular: periodRegular,
            severe_symptoms: severeSymptoms,
            weight_change: weightChange,
            sleep_quality: sleepQuality,
            stress_level: stressLevel,
          },
          { onConflict: 'user_id,review_month' }
        )

        if (!upsertErr) {
          onSuccess()
          onClose()
        } else {
          setError(upsertErr.message)
        }
      } catch (err: any) {
        setError(err.message || 'Monthly review failed')
      }
    })
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-rose-100 shadow-2xl max-w-lg w-full p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Monthly Health Assessment</span>
          <h3 className="text-xl font-bold text-slate-900">Monthly Life Stage Review</h3>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Was your period regular this month?</label>
            <select
              value={periodRegular}
              onChange={(e) => setPeriodRegular(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
            >
              <option value="yes">Yes, regular</option>
              <option value="no">No, irregular / delayed</option>
              <option value="not_applicable">Not Applicable</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight Change</label>
              <select
                value={weightChange}
                onChange={(e) => setWeightChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
              >
                <option value="no_change">No significant change</option>
                <option value="increased">Increased</option>
                <option value="decreased">Decreased</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sleep Quality This Month</label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
              >
                <option value="great">Restorative / Great</option>
                <option value="fair">Moderate / Fair</option>
                <option value="poor">Disrupted / Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Monthly Average Stress: <strong className="text-rose-700">{stressLevel} / 10</strong>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Monthly Review</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
