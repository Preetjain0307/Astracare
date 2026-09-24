'use client'

import React, { useState, useEffect } from 'react'
import { User, Activity, Flame, Wine, Shield, Globe, Info } from 'lucide-react'
import type { BasicProfileFormData } from '@/lib/validation/onboarding'
import { calculateBMI, getBMICategory } from '@/lib/utils'

interface StepBasicProfileProps {
  data: Partial<BasicProfileFormData>
  onChange: (updated: Partial<BasicProfileFormData>) => void
  errors?: Record<string, string>
}

export function StepBasicProfile({ data, onChange, errors }: StepBasicProfileProps) {
  const [heightUnit, setHeightUnit] = useState<'metric' | 'imperial'>(data.height_unit || 'metric')
  const [weightUnit, setWeightUnit] = useState<'metric' | 'imperial'>(data.weight_unit || 'metric')

  // Imperial state helpers
  const [feet, setFeet] = useState<number | ''>('')
  const [inches, setInches] = useState<number | ''>('')
  const [lbs, setLbs] = useState<number | ''>('')

  // Populate imperial initial state if height_cm / weight_kg already exist
  useEffect(() => {
    if (data.height_cm && heightUnit === 'imperial' && !feet && !inches) {
      const totalInches = Math.round(data.height_cm / 2.54)
      setFeet(Math.floor(totalInches / 12))
      setInches(totalInches % 12)
    }
    if (data.weight_kg && weightUnit === 'imperial' && !lbs) {
      setLbs(Math.round(data.weight_kg * 2.20462))
    }
  }, [data.height_cm, data.weight_kg, heightUnit, weightUnit])

  const handleMetricHeightChange = (val: number | null) => {
    onChange({ ...data, height_cm: val, height_unit: 'metric' })
  }

  const handleImperialHeightChange = (ft: number | '', inc: number | '') => {
    setFeet(ft)
    setInches(inc)
    if (ft !== '' || inc !== '') {
      const totalInches = (Number(ft) || 0) * 12 + (Number(inc) || 0)
      const cm = Math.round(totalInches * 2.54)
      onChange({ ...data, height_cm: cm, height_unit: 'imperial' })
    }
  }

  const handleMetricWeightChange = (val: number | null) => {
    onChange({ ...data, weight_kg: val, weight_unit: 'metric' })
  }

  const handleImperialWeightChange = (val: number | '') => {
    setLbs(val)
    if (val !== '') {
      const kg = Math.round(Number(val) / 2.20462 * 10) / 10
      onChange({ ...data, weight_kg: kg, weight_unit: 'imperial' })
    }
  }

  const bmi = calculateBMI(data.height_cm, data.weight_kg)
  const bmiCategory = getBMICategory(bmi)

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900">Basic Health Profile</h2>
        <p className="text-sm text-slate-500">
          This helps us customize recommendations tailored to your physical metrics.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs">
        {/* Name inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
            <input
              type="text"
              value={data.first_name || ''}
              onChange={(e) => onChange({ ...data, first_name: e.target.value })}
              placeholder="First name"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
            {errors?.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
            <input
              type="text"
              value={data.last_name || ''}
              onChange={(e) => onChange({ ...data, last_name: e.target.value })}
              placeholder="Last name"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
            {errors?.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
          </div>
        </div>

        {/* Age & Birth Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age</label>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => onChange({ ...data, age: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 28"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
            {errors?.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Birth Year</label>
            <input
              type="number"
              value={data.birth_year || ''}
              onChange={(e) => onChange({ ...data, birth_year: e.target.value ? Number(e.target.value) : null })}
              placeholder="e.g. 1996"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
          </div>
        </div>

        {/* Height section with unit toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Height</label>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setHeightUnit('metric')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  heightUnit === 'metric' ? 'bg-white shadow-xs text-rose-700 font-bold' : 'text-slate-600'
                }`}
              >
                Metric (cm)
              </button>
              <button
                type="button"
                onClick={() => setHeightUnit('imperial')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  heightUnit === 'imperial' ? 'bg-white shadow-xs text-rose-700 font-bold' : 'text-slate-600'
                }`}
              >
                Imperial (ft/in)
              </button>
            </div>
          </div>

          {heightUnit === 'metric' ? (
            <input
              type="number"
              value={data.height_cm || ''}
              onChange={(e) => handleMetricHeightChange(e.target.value ? Number(e.target.value) : null)}
              placeholder="Height in cm (e.g. 165)"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={feet}
                onChange={(e) => handleImperialHeightChange(e.target.value ? Number(e.target.value) : '', inches)}
                placeholder="Feet (ft)"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
              <input
                type="number"
                value={inches}
                onChange={(e) => handleImperialHeightChange(feet, e.target.value ? Number(e.target.value) : '')}
                placeholder="Inches (in)"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>
          )}
        </div>

        {/* Weight section with unit toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Weight</label>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setWeightUnit('metric')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  weightUnit === 'metric' ? 'bg-white shadow-xs text-rose-700 font-bold' : 'text-slate-600'
                }`}
              >
                Metric (kg)
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit('imperial')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  weightUnit === 'imperial' ? 'bg-white shadow-xs text-rose-700 font-bold' : 'text-slate-600'
                }`}
              >
                Imperial (lbs)
              </button>
            </div>
          </div>

          {weightUnit === 'metric' ? (
            <input
              type="number"
              value={data.weight_kg || ''}
              onChange={(e) => handleMetricWeightChange(e.target.value ? Number(e.target.value) : null)}
              placeholder="Weight in kg (e.g. 62)"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
          ) : (
            <input
              type="number"
              value={lbs}
              onChange={(e) => handleImperialWeightChange(e.target.value ? Number(e.target.value) : '')}
              placeholder="Weight in lbs (e.g. 136)"
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
          )}
        </div>

        {/* Calculated BMI Badge (Informational only) */}
        {bmi !== null && (
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-rose-600 shrink-0" />
              <span className="text-xs text-slate-700">
                Calculated BMI: <strong className="text-rose-900">{bmi}</strong> ({bmiCategory})
              </span>
            </div>
            <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
              Informational only
            </span>
          </div>
        )}

        {/* Activity Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Activity Level *</label>
          <select
            value={data.activity_level || ''}
            onChange={(e) => onChange({ ...data, activity_level: e.target.value })}
            className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
          >
            <option value="">Select activity level</option>
            <option value="sedentary">Sedentary (Little or no exercise)</option>
            <option value="lightly_active">Lightly Active (Exercise 1–3 days/week)</option>
            <option value="moderately_active">Moderately Active (Exercise 3–5 days/week)</option>
            <option value="very_active">Very Active (Hard exercise 6–7 days/week)</option>
            <option value="extra_active">Extra Active (Very physical job / daily training)</option>
          </select>
          {errors?.activity_level && <p className="mt-1 text-xs text-red-500">{errors.activity_level}</p>}
        </div>

        {/* Smoking & Alcohol with Prefer not to say */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Smoking Habit *</label>
            <select
              value={data.smoking || ''}
              onChange={(e) => onChange({ ...data, smoking: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
            >
              <option value="">Select option</option>
              <option value="never">Never smoked</option>
              <option value="former">Former smoker</option>
              <option value="occasional">Occasional smoker</option>
              <option value="regular">Regular smoker</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors?.smoking && <p className="mt-1 text-xs text-red-500">{errors.smoking}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Alcohol Consumption *</label>
            <select
              value={data.alcohol || ''}
              onChange={(e) => onChange({ ...data, alcohol: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
            >
              <option value="">Select option</option>
              <option value="never">Never</option>
              <option value="socially">Socially / Occasional</option>
              <option value="moderate">Moderate (1–3 drinks/week)</option>
              <option value="regular">Regular (4+ drinks/week)</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors?.alcohol && <p className="mt-1 text-xs text-red-500">{errors.alcohol}</p>}
          </div>
        </div>

        {/* Additional information */}
        <div className="pt-3 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Additional Details (Optional)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Blood Group</label>
              <select
                value={data.blood_group || ''}
                onChange={(e) => onChange({ ...data, blood_group: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="unknown">Don't know</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country</label>
              <input
                type="text"
                value={data.country || ''}
                onChange={(e) => onChange({ ...data, country: e.target.value })}
                placeholder="e.g. India / United States"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Emergency Contact Name</label>
              <input
                type="text"
                value={data.emergency_contact_name || ''}
                onChange={(e) => onChange({ ...data, emergency_contact_name: e.target.value })}
                placeholder="Contact person name"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Emergency Contact Phone</label>
              <input
                type="tel"
                value={data.emergency_contact_phone || ''}
                onChange={(e) => onChange({ ...data, emergency_contact_phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
