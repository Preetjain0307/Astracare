'use client'

import React, { useState, useTransition } from 'react'
import { X, Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface WeeklyCheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function WeeklyCheckInModal({ isOpen, onClose, onSuccess }: WeeklyCheckInModalProps) {
  const [overallHealth, setOverallHealth] = useState<number>(8)
  const [exerciseFreq, setExerciseFreq] = useState<string>('3_5_days')
  const [stressLevel, setStressLevel] = useState<number>(4)
  const [unusualSymptoms, setUnusualSymptoms] = useState<boolean>(false)
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

        const { error: insertErr } = await supabase.from('weekly_checkins').insert({
          user_id: user.id,
          week_start_date: new Date().toISOString().split('T')[0],
          overall_health: overallHealth,
          exercise_frequency: exerciseFreq,
          stress_level: stressLevel,
          unusual_symptoms: unusualSymptoms,
        })

        if (!insertErr) {
          onSuccess()
          onClose()
        } else {
          setError(insertErr.message)
        }
      } catch (err: any) {
        setError(err.message || 'Weekly check-in failed')
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
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Weekly Reflection</span>
          <h3 className="text-xl font-bold text-slate-900">Weekly Health Check-in</h3>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Overall Health This Week: <strong className="text-rose-700">{overallHealth} / 10</strong>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={overallHealth}
              onChange={(e) => setOverallHealth(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Exercise Frequency This Week</label>
            <select
              value={exerciseFreq}
              onChange={(e) => setExerciseFreq(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
            >
              <option value="none">0 Days</option>
              <option value="1_2_days">1–2 Days</option>
              <option value="3_5_days">3–5 Days</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Stress Level: <strong className="text-rose-700">{stressLevel} / 10</strong>
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

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Unusual or Severe Symptoms This Week?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUnusualSymptoms(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unusualSymptoms ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white border text-slate-600'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setUnusualSymptoms(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  !unusualSymptoms ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white border text-slate-600'
                }`}
              >
                No
              </button>
            </div>
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit Weekly Check-in</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
