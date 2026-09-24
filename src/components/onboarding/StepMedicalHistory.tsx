'use client'

import React from 'react'
import { Stethoscope, Check, AlertCircle } from 'lucide-react'
import type { MedicalHistoryFormData } from '@/lib/validation/onboarding'

export const DIAGNOSES_OPTIONS = [
  { id: 'pcos', label: 'PCOS / PCOD' },
  { id: 'endometriosis', label: 'Endometriosis' },
  { id: 'thyroid', label: 'Thyroid Disorder (Hypo/Hyper)' },
  { id: 'diabetes', label: 'Diabetes / Pre-diabetes' },
  { id: 'hypertension', label: 'High Blood Pressure' },
  { id: 'anemia', label: 'Anemia' },
  { id: 'anxiety_depression', label: 'Anxiety / Depression' },
  { id: 'asthma', label: 'Asthma' },
  { id: 'none', label: 'None of the above' },
  { id: 'other', label: 'Other condition' },
]

export const FAMILY_HISTORY_OPTIONS = [
  'Breast Cancer',
  'Ovarian Cancer',
  'PCOS',
  'Thyroid Disorder',
  'Diabetes',
  'Heart Disease',
  'Hypertension',
  'Osteoporosis',
]

interface StepMedicalHistoryProps {
  data: Partial<MedicalHistoryFormData>
  onChange: (updated: Partial<MedicalHistoryFormData>) => void
  errors?: Record<string, string>
}

export function StepMedicalHistory({ data, onChange, errors }: StepMedicalHistoryProps) {
  const selectedDiagnoses = data.diagnoses || []
  const selectedFamilyHistory = data.family_history || []

  const toggleDiagnosis = (id: string) => {
    if (id === 'none') {
      // Selecting None clears all conflicting selections
      onChange({
        ...data,
        diagnoses: ['none'],
        other_conditions: '',
      })
      return
    }

    let updated = selectedDiagnoses.filter((item) => item !== 'none')
    if (updated.includes(id)) {
      updated = updated.filter((item) => item !== id)
    } else {
      updated.push(id)
    }

    onChange({
      ...data,
      diagnoses: updated,
      other_conditions: updated.includes('other') ? data.other_conditions : '',
    })
  }

  const toggleFamilyHistory = (item: string) => {
    let updated = [...selectedFamilyHistory]
    if (updated.includes(item)) {
      updated = updated.filter((i) => i !== item)
    } else {
      updated.push(item)
    }
    onChange({ ...data, family_history: updated })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900">Medical History</h2>
        <p className="text-sm text-slate-500">
          Sharing your health history ensures safe, personalized AI suggestions.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
        {/* Diagnoses Question */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-800">
            Have you ever been diagnosed with any of the following? (Select all that apply)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DIAGNOSES_OPTIONS.map((item) => {
              const isSelected = selectedDiagnoses.includes(item.id)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleDiagnosis(item.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
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

          {/* Conditional "Other" text input */}
          {selectedDiagnoses.includes('other') && (
            <div className="pt-2 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Please specify other health condition(s)
              </label>
              <input
                type="text"
                value={data.other_conditions || ''}
                onChange={(e) => onChange({ ...data, other_conditions: e.target.value })}
                placeholder="Describe condition..."
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>
          )}
        </div>

        {/* Current Medications */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Current Medications & Supplements (Optional)
          </label>
          <textarea
            value={data.current_medications || ''}
            onChange={(e) => onChange({ ...data, current_medications: e.target.value })}
            placeholder="e.g. Metformin 500mg, Iron supplements, Birth control..."
            rows={2}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
          />
        </div>

        {/* Previous Surgeries */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Previous Surgeries or Procedures (Optional)
          </label>
          <input
            type="text"
            value={data.surgeries || ''}
            onChange={(e) => onChange({ ...data, surgeries: e.target.value })}
            placeholder="e.g. Appendectomy (2021), C-section (2023)"
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
          />
        </div>

        {/* Drug Allergies */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Known Drug / Food Allergies (Optional)
          </label>
          <input
            type="text"
            value={data.allergies || ''}
            onChange={(e) => onChange({ ...data, allergies: e.target.value })}
            placeholder="e.g. Penicillin, Sulfa drugs, Peanuts..."
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
          />
        </div>

        {/* Family History */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Family Medical History (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {FAMILY_HISTORY_OPTIONS.map((item) => {
              const isSelected = selectedFamilyHistory.includes(item)
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleFamilyHistory(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-rose-300'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
