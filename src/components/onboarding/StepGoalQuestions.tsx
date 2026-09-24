'use client'

import React from 'react'
import { Calendar, Activity, Heart, Baby, Smile, Zap, Dumbbell, Apple, Brain, Sparkles, AlertCircle } from 'lucide-react'
import type { HealthGoalId } from '@/types'
import type { GoalQuestionsFormData } from '@/lib/validation/onboarding'

interface StepGoalQuestionsProps {
  selectedGoals: HealthGoalId[]
  data: Partial<GoalQuestionsFormData>
  onChange: (updated: Partial<GoalQuestionsFormData>) => void
  errors?: Record<string, string>
}

export function StepGoalQuestions({ selectedGoals, data, onChange, errors }: StepGoalQuestionsProps) {
  // Helpers to check if a specific goal section should be rendered
  const hasGoal = (id: HealthGoalId) => selectedGoals.includes(id)
  const isMultipleGoals = selectedGoals.length > 3

  const updateField = <K extends keyof GoalQuestionsFormData>(field: K, val: GoalQuestionsFormData[K]) => {
    onChange({ ...data, [field]: val })
  }

  const toggleArrayItem = (field: 'pcos_symptoms' | 'pregnancy_symptoms' | 'exercise_types', item: string) => {
    const current = (data[field] || []) as string[]
    let updated = [...current]
    if (updated.includes(item)) {
      updated = updated.filter((i) => i !== item)
    } else {
      updated.push(item)
    }
    onChange({ ...data, [field]: updated })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900">Essential Goal Information</h2>
        <p className="text-sm text-slate-500">
          Tailored questions based on your selected health goals.
        </p>
      </div>

      {/* Notice for multiple goals */}
      {isMultipleGoals && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900">
          <Sparkles className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">You've selected multiple health goals!</p>
            <p className="text-rose-700 mt-0.5">
              We'll ask only the essential questions now so setup stays quick (~2 minutes). You can fill in remaining progressive details whenever you use specific features.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. PERIOD & CYCLE TRACKING */}
        {(hasGoal('period_tracking') || hasGoal('general_wellness')) && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Calendar className="h-4 w-4" /> Period & Cycle Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Day of Last Period</label>
                <input
                  type="date"
                  value={data.last_period_date || ''}
                  onChange={(e) => updateField('last_period_date', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Average Cycle Length (Days)</label>
                <input
                  type="number"
                  value={data.avg_cycle_length || ''}
                  onChange={(e) => updateField('avg_cycle_length', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 28"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cycle Regularity</label>
                <select
                  value={data.cycle_regularity || ''}
                  onChange={(e) => updateField('cycle_regularity', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select regularity</option>
                  <option value="regular">Regular (predictable start date)</option>
                  <option value="irregular">Irregular (varies significantly)</option>
                  <option value="varies">Varies occasionally</option>
                  <option value="unsure">Don't know</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Average Pain Level (1–10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={data.pain_level || ''}
                  onChange={(e) => updateField('pain_level', e.target.value ? Number(e.target.value) : null)}
                  placeholder="1 (Mild) to 10 (Severe)"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. PCOS / HORMONAL HEALTH */}
        {hasGoal('pcos') && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Activity className="h-4 w-4" /> PCOS & Hormonal Health Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diagnosed with PCOS?</label>
                <select
                  value={data.pcos_diagnosed || ''}
                  onChange={(e) => updateField('pcos_diagnosed', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select status</option>
                  <option value="yes">Yes, medically diagnosed</option>
                  <option value="suspected">Suspected / Symptoms present</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Do you experience irregular periods?</label>
                <select
                  value={data.pcos_irregular_periods === undefined ? '' : data.pcos_irregular_periods ? 'yes' : 'no'}
                  onChange={(e) => updateField('pcos_irregular_periods', e.target.value === 'yes')}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Experienced PCOS Symptoms</label>
              <div className="flex flex-wrap gap-2">
                {['Acne', 'Hair Loss', 'Facial / Body Hair', 'Weight Gain', 'Mood Swings', 'Fatigue'].map((sym) => {
                  const isChecked = (data.pcos_symptoms || []).includes(sym)
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleArrayItem('pcos_symptoms', sym)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                        isChecked ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {sym}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. TRYING TO CONCEIVE */}
        {hasGoal('conceiving') && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Heart className="h-4 w-4" /> Fertility & Ovulation Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Day of Last Period</label>
                <input
                  type="date"
                  value={data.conceiving_last_period || data.last_period_date || ''}
                  onChange={(e) => updateField('conceiving_last_period', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tracking Method</label>
                <select
                  value={data.tracking_method || ''}
                  onChange={(e) => updateField('tracking_method', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select tracking method</option>
                  <option value="ovulation_kit">Ovulation Test Kits (LH)</option>
                  <option value="bbt">Basal Body Temperature (BBT)</option>
                  <option value="cervical_mucus">Cervical Mucus</option>
                  <option value="none">None yet</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 4. PREGNANCY TRACKING */}
        {hasGoal('pregnancy') && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Baby className="h-4 w-4" /> Pregnancy Tracking Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Due Date / Week</label>
                <input
                  type="text"
                  value={data.pregnancy_week_or_due_date || ''}
                  onChange={(e) => updateField('pregnancy_week_or_due_date', e.target.value)}
                  placeholder="e.g. Week 14 or Oct 24, 2026"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">High-Risk Pregnancy Notes (if any)</label>
                <input
                  type="text"
                  value={data.high_risk_info || ''}
                  onChange={(e) => updateField('high_risk_info', e.target.value)}
                  placeholder="e.g. Gestational Diabetes, None"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. POSTPARTUM RECOVERY */}
        {hasGoal('postpartum') && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Smile className="h-4 w-4" /> Postpartum Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Feeding Method</label>
                <select
                  value={data.feeding_method || ''}
                  onChange={(e) => updateField('feeding_method', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select feeding method</option>
                  <option value="breastfeeding">Breastfeeding</option>
                  <option value="formula">Formula Feeding</option>
                  <option value="mixed">Mixed Feeding</option>
                  <option value="pumping">Pumping</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Biggest Challenge</label>
                <select
                  value={data.postpartum_challenge || ''}
                  onChange={(e) => updateField('postpartum_challenge', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select challenge</option>
                  <option value="recovery_pain">Recovery Pain</option>
                  <option value="sleep_deprivation">Sleep Deprivation</option>
                  <option value="anxiety">Anxiety / Mood</option>
                  <option value="pelvic_floor">Pelvic Floor Weakness</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 6. MENOPAUSE */}
        {hasGoal('menopause') && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Zap className="h-4 w-4" /> Menopause Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hot Flash Frequency</label>
                <select
                  value={data.hot_flash_frequency || ''}
                  onChange={(e) => updateField('hot_flash_frequency', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Multiple times daily</option>
                  <option value="weekly">A few times a week</option>
                  <option value="rare">Rarely</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Concern</label>
                <select
                  value={data.menopause_challenge || ''}
                  onChange={(e) => updateField('menopause_challenge', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select concern</option>
                  <option value="sleep">Sleep disruption</option>
                  <option value="mood">Mood changes</option>
                  <option value="brain_fog">Brain fog</option>
                  <option value="joint_pain">Joint pain</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 7. FITNESS */}
        {hasGoal('fitness') && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Dumbbell className="h-4 w-4" /> Fitness Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Fitness Goal</label>
                <select
                  value={data.fitness_goal || ''}
                  onChange={(e) => updateField('fitness_goal', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select goal</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Strength / Muscle Gain</option>
                  <option value="stay_active">Stay Active & Energized</option>
                  <option value="flexibility">Flexibility & Core</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exercise Frequency</label>
                <select
                  value={data.exercise_frequency || ''}
                  onChange={(e) => updateField('exercise_frequency', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select frequency</option>
                  <option value="never">Never / Rarely</option>
                  <option value="1_2_days">1–2 Days / week</option>
                  <option value="3_5_days">3–5 Days / week</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 8. NUTRITION */}
        {hasGoal('nutrition') && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Apple className="h-4 w-4" /> Nutrition & Hydration Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Food Preference</label>
                <select
                  value={data.food_preference || ''}
                  onChange={(e) => updateField('food_preference', e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none bg-white"
                >
                  <option value="">Select diet</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Water Target (Liters)</label>
                <input
                  type="number"
                  step="0.5"
                  value={data.water_intake_liters || ''}
                  onChange={(e) => updateField('water_intake_liters', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 2.5"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 9. MENTAL WELLNESS */}
        {(hasGoal('mental_wellness') || hasGoal('sleep')) && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-slate-100 pb-2.5">
              <Brain className="h-4 w-4" /> Mental Wellness & Sleep Essentials
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stress Level (1–10)</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={data.stress_level || ''}
                  onChange={(e) => updateField('stress_level', e.target.value ? Number(e.target.value) : null)}
                  placeholder="1 (Low) to 10 (Very High)"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Average Sleep Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={data.sleep_hours || ''}
                  onChange={(e) => updateField('sleep_hours', e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 7.5"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
