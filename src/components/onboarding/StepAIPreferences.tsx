'use client'

import React from 'react'
import { Sparkles, Calendar, HeartHandshake, Moon, Activity, Dumbbell, Apple, Bell, FileText, ShieldAlert, Check } from 'lucide-react'
import type { AIPreferencesFormData } from '@/lib/validation/onboarding'

export const AI_PREFERENCES_OPTIONS = [
  { id: 'period_prediction', label: 'Period & Cycle Prediction', icon: Calendar },
  { id: 'ovulation_prediction', label: 'Ovulation & Fertility Window', icon: HeartHandshake },
  { id: 'pregnancy_insights', label: 'Pregnancy Trimester Insights', icon: Sparkles },
  { id: 'sleep_analysis', label: 'Sleep & Rest Recovery Analysis', icon: Moon },
  { id: 'stress_monitoring', label: 'Stress Level & HRV Monitoring', icon: Activity },
  { id: 'workout_recommendations', label: 'Cycle-Synced Workouts', icon: Dumbbell },
  { id: 'nutrition_suggestions', label: 'Hormone-Balancing Nutrition', icon: Apple },
  { id: 'medication_reminders', label: 'Medication & Supplement Reminders', icon: Bell },
  { id: 'weekly_report', label: 'Weekly AI Health Digest', icon: FileText },
  { id: 'monthly_report', label: 'Monthly Life Stage Review', icon: FileText },
  { id: 'risk_alerts', label: 'Early Health Anomaly & Risk Alerts', icon: ShieldAlert },
]

interface StepAIPreferencesProps {
  data: Partial<AIPreferencesFormData>
  onChange: (updated: Partial<AIPreferencesFormData>) => void
}

export function StepAIPreferences({ data, onChange }: StepAIPreferencesProps) {
  const selected = data.preferences || AI_PREFERENCES_OPTIONS.map((o) => o.id)

  const togglePreference = (id: string) => {
    let updated = [...selected]
    if (updated.includes(id)) {
      updated = updated.filter((item) => item !== id)
    } else {
      updated.push(id)
    }
    onChange({ preferences: updated })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center space-y-1.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
          <Sparkles className="h-3 w-3" /> AI Customization
        </span>
        <h2 className="text-2xl font-bold text-slate-900">AI Health Assistant Preferences</h2>
        <p className="text-sm text-slate-500">
          What would you like your AI Health Assistant to help you with?
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AI_PREFERENCES_OPTIONS.map((pref) => {
            const Icon = pref.icon
            const isSelected = selected.includes(pref.id)

            return (
              <button
                key={pref.id}
                type="button"
                onClick={() => togglePreference(pref.id)}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold">{pref.label}</span>
                </div>

                <div
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-slate-400 pt-2">
          Stored for future AI intelligence modules. You can change these anytime in settings.
        </p>
      </div>
    </div>
  )
}
