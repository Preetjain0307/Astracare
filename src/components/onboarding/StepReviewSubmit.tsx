'use client'

import React, { useState } from 'react'
import { CheckCircle2, Edit3, Loader2, Sparkles, User, Stethoscope, Target, Watch, Brain, HelpCircle } from 'lucide-react'
import type { QuestionnaireAllData } from '@/types'
import { HEALTH_GOALS_OPTIONS } from './StepWelcomeGoals'
import { AI_PREFERENCES_OPTIONS } from './StepAIPreferences'

interface StepReviewSubmitProps {
  allData: QuestionnaireAllData
  onEditStep: (stepNumber: number) => void
  onSubmit: () => Promise<void>
}

export function StepReviewSubmit({ allData, onEditStep, onSubmit }: StepReviewSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const profile = allData.profile
  const goals = allData.health_goals?.selected_goals || []
  const medical = allData.medical_history
  const smartBand = allData.smart_band
  const aiPref = allData.ai_preferences?.preferences || []
  const goalResponses = allData.goal_responses?.responses || {}

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center space-y-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5" /> Final Step
        </span>
        <h2 className="text-2xl font-bold text-slate-900">Review Your Health Profile</h2>
        <p className="text-sm text-slate-500">
          Please review your details before submitting. You can edit any section.
        </p>
      </div>

      <div className="space-y-4">
        {/* Section 1: Health Goals */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Target className="h-4 w-4 text-rose-600" /> Selected Health Goals
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {goals.map((goalId) => {
              const option = HEALTH_GOALS_OPTIONS.find((g) => g.id === goalId)
              return (
                <span
                  key={goalId}
                  className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold"
                >
                  {option ? option.title : goalId}
                </span>
              )
            })}
          </div>
        </div>

        {/* Section 2: Basic Profile */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <User className="h-4 w-4 text-rose-600" /> Basic Profile
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Name</span>
              <span className="font-semibold text-slate-800">
                {profile?.first_name} {profile?.last_name}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">Age / Birth Year</span>
              <span className="font-semibold text-slate-800">
                {profile?.age || profile?.birth_year || '—'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">Height & Weight</span>
              <span className="font-semibold text-slate-800">
                {profile?.height_cm ? `${profile.height_cm} cm` : '—'} / {profile?.weight_kg ? `${profile.weight_kg} kg` : '—'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">Activity Level</span>
              <span className="font-semibold text-slate-800 capitalize">
                {profile?.activity_level?.replace('_', ' ') || '—'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">Smoking</span>
              <span className="font-semibold text-slate-800 capitalize">{profile?.smoking || '—'}</span>
            </div>

            <div>
              <span className="text-slate-400 block">Alcohol</span>
              <span className="font-semibold text-slate-800 capitalize">{profile?.alcohol || '—'}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Medical History */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Stethoscope className="h-4 w-4 text-rose-600" /> Medical History
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block">Diagnoses</span>
              <span className="font-semibold text-slate-800">
                {medical?.diagnoses?.length ? medical.diagnoses.join(', ') : 'None declared'}
              </span>
            </div>

            {medical?.other_conditions && (
              <div>
                <span className="text-slate-400 block">Other Conditions</span>
                <span className="font-medium text-slate-700">{medical.other_conditions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Smart Band */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Watch className="h-4 w-4 text-rose-600" /> Smart Band Setup
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <p className="text-xs text-slate-700 font-medium">
            {smartBand?.owns_band ? 'AstraBand AI owned (Permissions configured)' : 'No smart band paired yet (Can pair later)'}
          </p>
        </div>

        {/* Section 5: AI Preferences */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
              <Brain className="h-4 w-4 text-rose-600" /> AI Preferences
            </div>
            <button
              type="button"
              onClick={() => onEditStep(5)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {aiPref.map((prefId) => {
              const opt = AI_PREFERENCES_OPTIONS.find((p) => p.id === prefId)
              return (
                <span key={prefId} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                  {opt ? opt.label : prefId}
                </span>
              )
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-md transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Completing Setup...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Submit Health Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
