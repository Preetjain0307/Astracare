'use client'

import React, { useState, useTransition } from 'react'
import { X, Smile, Moon, Zap, Activity, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface DailyCheckInModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const FEELING_EMOJIS = [
  { id: 'happy', label: 'Happy', emoji: '😄' },
  { id: 'neutral', label: 'Neutral', emoji: '🙂' },
  { id: 'sad', label: 'Sad', emoji: '😔' },
  { id: 'anxious', label: 'Anxious', emoji: '😟' },
  { id: 'exhausted', label: 'Exhausted', emoji: '😫' },
]

export function DailyCheckInModal({ isOpen, onClose, onSuccess }: DailyCheckInModalProps) {
  const [feeling, setFeeling] = useState<string>('happy')
  const [sleepQuality, setSleepQuality] = useState<string>('great')
  const [energyLevel, setEnergyLevel] = useState<string>('moderate')
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [activityDone, setActivityDone] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const toggleSymptom = (sym: string) => {
    if (sym === 'none') {
      setSymptoms(['none'])
      return
    }
    let updated = symptoms.filter((s) => s !== 'none')
    if (updated.includes(sym)) {
      updated = updated.filter((s) => s !== sym)
    } else {
      updated.push(sym)
    }
    setSymptoms(updated)
  }

  const handleSubmit = () => {
    setError(null)
    startTransition(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const todayStr = new Date().toISOString().split('T')[0]
        const { error: upsertErr } = await supabase
          .from('daily_checkins')
          .upsert(
            {
              user_id: user.id,
              checkin_date: todayStr,
              feeling,
              sleep_quality: sleepQuality,
              energy_level: energyLevel,
              symptoms,
              activity_done: activityDone,
            },
            { onConflict: 'user_id,checkin_date' }
          )

        if (!upsertErr) {
          onSuccess()
          onClose()
        } else {
          setError(upsertErr.message)
        }
      } catch (err: any) {
        setError(err.message || 'Check-in failed')
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
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
            <Sparkles className="h-3.5 w-3.5" /> Fast 10–30s Daily Check-in
          </div>
          <h3 className="text-xl font-bold text-slate-900">How are you feeling today?</h3>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Feeling Emoji selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Feeling Today</label>
            <div className="grid grid-cols-5 gap-2">
              {FEELING_EMOJIS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFeeling(f.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    feeling === f.id
                      ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-rose-200'
                  }`}
                >
                  <span className="text-2xl block">{f.emoji}</span>
                  <span className="text-[10px] font-semibold text-slate-700 block mt-1">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Sleep Quality</label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
              >
                <option value="poor">Poor Rest</option>
                <option value="fair">Fair</option>
                <option value="great">Great Rest</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Energy Level</label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
              >
                <option value="low">Low Energy</option>
                <option value="moderate">Moderate</option>
                <option value="high">High Energy</option>
              </select>
            </div>
          </div>

          {/* Symptoms Today */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Symptoms Today (Multi-select)</label>
            <div className="flex flex-wrap gap-1.5">
              {['Cramps', 'Bloating', 'Headache', 'Acne', 'Fatigue', 'Nausea', 'Mood Swings', 'none'].map((sym) => {
                const isSelected = symptoms.includes(sym)
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-rose-200'
                    }`}
                  >
                    {sym === 'none' ? 'None' : sym}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Activity Done */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Physical Activity Done Today?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActivityDone(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activityDone ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white border text-slate-600'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setActivityDone(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  !activityDone ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white border text-slate-600'
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
                <span>Logging...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Today's Check-in</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
