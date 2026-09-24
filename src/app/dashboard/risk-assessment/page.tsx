'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Brain,
  Sparkles,
  Activity,
  Heart,
  Droplet,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react'

interface PredictionResult {
  domain: string
  model_id: string
  model_version: string
  prediction: string
  confidence: number
  probability_distribution?: Record<string, number>
  data_quality: string
  feature_completeness_pct?: number
  disclaimer: string
  status: string
}

export default function RiskAssessmentPage() {
  const [selectedDomain, setSelectedDomain] = useState<'pcos_risk' | 'cycle_length' | 'anemia_risk' | 'diabetes_risk' | 'thyroid_risk'>('pcos_risk')
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    // Shared / Anthropometric
    age: 26,
    bmi: 24.5,
    // PCOS
    cycle_length_days: 34,
    cycle_regularity: 1,
    weight_gain_sudden: 1,
    hair_growth_hirsutism: 1,
    skin_darkening: 0,
    hair_thinning: 1,
    pimples_acne: 1,
    fast_food_freq: 2,
    exercise_regularity: 0,
    // Cycle
    prev_cycle_length: 30,
    cycle_variance: 2.4,
    sleep_avg_hours: 6.8,
    stress_score_avg: 6.5,
    activity_intensity_min: 30,
    caffeine_intake_mg: 150,
    bbt_celsius: 36.6,
    // Anemia
    period_flow_intensity: 2,
    fatigue_frequency: 2,
    dizziness_frequency: 1,
    pale_skin_flag: 1,
    cold_hands_feet_flag: 1,
    diet_type_code: 1,
    shortness_of_breath_flag: 0,
    estimated_hemoglobin_gl: 11.2,
    // Diabetes
    pregnancies_count: 0,
    glucose_fasting_mgdl: 102,
    blood_pressure_diastolic: 76,
    skin_thickness_mm: 22,
    insulin_micro_u_ml: 75,
    diabetes_pedigree_function: 0.45,
    daily_physical_activity_min: 35,
    // Thyroid
    unexplained_weight_change_kg: 3.5,
    temperature_sensitivity: -1,
    heart_rate_resting_bpm: 64,
    fatigue_level: 2,
    hair_loss_severity: 1,
    cycle_flow_changes: 1,
    mood_anxiety_depression_score: 5.5,
    tsh_level_est: 4.8,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const runPrediction = async () => {
    setIsLoading(true)
    setPrediction(null)
    try {
      const res = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: selectedDomain,
          features: formData,
        }),
      })
      const data = await res.json()
      setPrediction(data)
    } catch (err) {
      console.error('Inference call failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const DOMAIN_TABS = [
    { id: 'pcos_risk', label: 'PCOS Hormonal Risk', icon: Heart, color: 'from-pink-500 to-rose-600' },
    { id: 'cycle_length', label: 'Cycle Duration ML', icon: Activity, color: 'from-purple-500 to-pink-500' },
    { id: 'anemia_risk', label: 'Anemia & Iron Screener', icon: Droplet, color: 'from-red-500 to-rose-500' },
    { id: 'diabetes_risk', label: 'Diabetes & Metabolism', icon: TrendingUp, color: 'from-amber-500 to-rose-500' },
    { id: 'thyroid_risk', label: 'Thyroid Dysfunction', icon: Sparkles, color: 'from-indigo-500 to-rose-500' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/risk-assessment" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-purple-500/10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-3">
                  <Brain className="w-3.5 h-3.5" />
                  M11 Disease Risk & Health Intelligence Layer
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Predictive Health Risk Assessment
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Trained on verified clinical benchmarks and Kaggle cohort datasets with rigorous feature engineering, cross-validation, and safety guardrails.
                </p>
              </div>
              <div className="text-xs bg-white/80 border border-rose-200/60 p-3 rounded-2xl shadow-sm max-w-xs">
                <span className="font-bold text-slate-800 block mb-1">Safety Notice:</span>
                <span className="text-slate-600 leading-relaxed">
                  AstraCare AI risk indicators provide decision support. They do not substitute clinical lab testing or diagnostic consultations.
                </span>
              </div>
            </div>
          </div>

          {/* Domain Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {DOMAIN_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = selectedDomain === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedDomain(tab.id as any)
                    setPrediction(null)
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                    isActive
                      ? 'bg-white border-rose-400 shadow-glow ring-2 ring-rose-300/40'
                      : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-rose-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tab.color} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-rose-700' : 'text-slate-700'}`}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Assessment Form & Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  Assessment Input Parameters
                </h2>
                <span className="text-xs text-slate-500 font-medium">Model: {selectedDomain}_v1</span>
              </div>

              {/* Shared Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">BMI (kg/m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bmi}
                    onChange={(e) => handleInputChange('bmi', Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* PCOS Specific */}
              {selectedDomain === 'pcos_risk' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Average Cycle (Days)</label>
                      <input
                        type="number"
                        value={formData.cycle_length_days}
                        onChange={(e) => handleInputChange('cycle_length_days', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Cycle Regularity</label>
                      <select
                        value={formData.cycle_regularity}
                        onChange={(e) => handleInputChange('cycle_regularity', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      >
                        <option value={0}>Regular (21-35 days)</option>
                        <option value={1}>Irregular / Delayed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hair_growth_hirsutism === 1}
                        onChange={(e) => handleInputChange('hair_growth_hirsutism', e.target.checked ? 1 : 0)}
                        className="accent-rose-600 rounded"
                      />
                      Excess Facial/Body Hair
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.weight_gain_sudden === 1}
                        onChange={(e) => handleInputChange('weight_gain_sudden', e.target.checked ? 1 : 0)}
                        className="accent-rose-600 rounded"
                      />
                      Sudden Weight Gain
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.skin_darkening === 1}
                        onChange={(e) => handleInputChange('skin_darkening', e.target.checked ? 1 : 0)}
                        className="accent-rose-600 rounded"
                      />
                      Skin Darkening / Patches
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pimples_acne === 1}
                        onChange={(e) => handleInputChange('pimples_acne', e.target.checked ? 1 : 0)}
                        className="accent-rose-600 rounded"
                      />
                      Persistent Cystic Acne
                    </label>
                  </div>
                </div>
              )}

              {/* Cycle Length Specific */}
              {selectedDomain === 'cycle_length' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Previous Cycle Duration</label>
                      <input
                        type="number"
                        value={formData.prev_cycle_length}
                        onChange={(e) => handleInputChange('prev_cycle_length', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Average Stress (1-10)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.stress_score_avg}
                        onChange={(e) => handleInputChange('stress_score_avg', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mean Sleep (Hours)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.sleep_avg_hours}
                        onChange={(e) => handleInputChange('sleep_avg_hours', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Basal Temp (°C)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={formData.bbt_celsius}
                        onChange={(e) => handleInputChange('bbt_celsius', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Anemia Specific */}
              {selectedDomain === 'anemia_risk' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Period Flow</label>
                      <select
                        value={formData.period_flow_intensity}
                        onChange={(e) => handleInputChange('period_flow_intensity', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      >
                        <option value={0}>Light</option>
                        <option value={1}>Moderate</option>
                        <option value={2}>Heavy (Menorrhagia)</option>
                        <option value={3}>Very Heavy</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Chronic Fatigue</label>
                      <select
                        value={formData.fatigue_frequency}
                        onChange={(e) => handleInputChange('fatigue_frequency', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      >
                        <option value={0}>Rarely</option>
                        <option value={1}>Sometimes</option>
                        <option value={2}>Frequent</option>
                        <option value={3}>Severe Constant</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pale_skin_flag === 1}
                        onChange={(e) => handleInputChange('pale_skin_flag', e.target.checked ? 1 : 0)}
                        className="accent-rose-600 rounded"
                      />
                      Pale Skin / Conjunctiva
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.cold_hands_feet_flag === 1}
                        onChange={(e) => handleInputChange('cold_hands_feet_flag', e.target.checked ? 1 : 0)}
                        className="accent-rose-600 rounded"
                      />
                      Cold Hands / Feet
                    </label>
                  </div>
                </div>
              )}

              {/* Diabetes Specific */}
              {selectedDomain === 'diabetes_risk' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Fasting Glucose (mg/dL)</label>
                    <input
                      type="number"
                      value={formData.glucose_fasting_mgdl}
                      onChange={(e) => handleInputChange('glucose_fasting_mgdl', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={formData.blood_pressure_diastolic}
                      onChange={(e) => handleInputChange('blood_pressure_diastolic', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Past Pregnancies</label>
                    <input
                      type="number"
                      value={formData.pregnancies_count}
                      onChange={(e) => handleInputChange('pregnancies_count', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Daily Activity (Min)</label>
                    <input
                      type="number"
                      value={formData.daily_physical_activity_min}
                      onChange={(e) => handleInputChange('daily_physical_activity_min', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Thyroid Specific */}
              {selectedDomain === 'thyroid_risk' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Weight Change (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.unexplained_weight_change_kg}
                        onChange={(e) => handleInputChange('unexplained_weight_change_kg', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Temp Sensitivity</label>
                      <select
                        value={formData.temperature_sensitivity}
                        onChange={(e) => handleInputChange('temperature_sensitivity', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      >
                        <option value={-1}>Cold Intolerance (Hypo)</option>
                        <option value={0}>Normal</option>
                        <option value={1}>Heat Intolerance (Hyper)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Resting Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={formData.heart_rate_resting_bpm}
                        onChange={(e) => handleInputChange('heart_rate_resting_bpm', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Serum TSH</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.tsh_level_est}
                        onChange={(e) => handleInputChange('tsh_level_est', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl text-sm font-medium border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={runPrediction}
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold shadow-glow flex items-center justify-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing Scikit-Learn Model Pipeline...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    Generate AI Health Prediction
                  </>
                )}
              </button>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-5 space-y-6">
              {prediction ? (
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-200 bg-white shadow-md space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                      Prediction Result
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {prediction.model_id} v{prediction.model_version}
                    </span>
                  </div>

                  <div className="text-center py-4 space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                      Assessed Risk Indicator
                    </span>
                    <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      {prediction.prediction}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confidence Score: {Math.round(prediction.confidence * 100)}%
                    </div>
                  </div>

                  {/* Distribution */}
                  {prediction.probability_distribution && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700 block">Class Probability Distribution:</span>
                      <div className="space-y-1.5">
                        {Object.entries(prediction.probability_distribution).map(([label, prob]) => (
                          <div key={label} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                              <span>{label}</span>
                              <span>{Math.round((prob as number) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all"
                                style={{ width: `${(prob as number) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Quality */}
                  <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">Data Quality Index:</span>
                    <span className="font-bold text-slate-800">{prediction.data_quality}</span>
                  </div>

                  {/* Disclaimer */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex gap-2.5 items-start">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{prediction.disclaimer}</span>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-8 rounded-3xl border border-dashed border-rose-200 bg-white/60 text-center space-y-4 flex flex-col items-center justify-center min-h-[360px]">
                  <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">No Prediction Generated Yet</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Adjust the clinical features on the left and click "Generate AI Health Prediction" to run the scikit-learn model.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/risk-assessment" />
    </div>
  )
}
