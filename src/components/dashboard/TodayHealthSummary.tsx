'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  Calendar,
  Dumbbell,
  Droplets,
  Plus,
  Minus,
  Sparkles,
  Info,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import type {
  HealthScoreResult,
  CycleStatusResult,
  SuggestedActivityResult,
} from '@/types'

interface TodayHealthSummaryProps {
  healthScore: HealthScoreResult
  cycleStatus: CycleStatusResult
  suggestedActivity: SuggestedActivityResult
  hydrationTotalMl: number
  hydrationGoalMl: number
  onHydrationChange?: (newTotal: number, newGoal: number) => void
}

export function TodayHealthSummary({
  healthScore,
  cycleStatus,
  suggestedActivity,
  hydrationTotalMl,
  hydrationGoalMl,
  onHydrationChange,
}: TodayHealthSummaryProps) {
  const [totalWater, setTotalWater] = useState(hydrationTotalMl)
  const [waterGoal, setWaterGoal] = useState(hydrationGoalMl)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [customGoalInput, setCustomGoalInput] = useState(waterGoal.toString())

  const handleAddWater = async (amount: number) => {
    setIsUpdating(true)
    try {
      const res = await fetch('/api/hydration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_ml: amount }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setTotalWater(data.totalMl)
        setWaterGoal(data.goalMl)
        onHydrationChange?.(data.totalMl, data.goalMl)
      }
    } catch {
      // fallback local update
      const next = totalWater + amount
      setTotalWater(next)
      onHydrationChange?.(next, waterGoal)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveCustomGoal = async () => {
    const val = parseInt(customGoalInput, 10)
    if (isNaN(val) || val < 500 || val > 10000) return

    setIsUpdating(true)
    try {
      const res = await fetch('/api/hydration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_goal_ml: val }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setWaterGoal(val)
        setShowGoalModal(false)
        onHydrationChange?.(totalWater, val)
      }
    } catch {
      setWaterGoal(val)
      setShowGoalModal(false)
    } finally {
      setIsUpdating(false)
    }
  }

  const waterPercent = Math.min(100, Math.round((totalWater / waterGoal) * 100))

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-600" /> Today&apos;s Health Summary
        </h2>
        <span className="text-xs font-bold text-slate-400">Live Assessment</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1: Health Score */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Health Score</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          {healthScore.score !== null ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{healthScore.score}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {healthScore.message}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-base font-extrabold text-slate-800 leading-snug block">
                {healthScore.message}
              </span>
              <p className="text-[11px] text-slate-400">Complete 3 daily check-ins to generate your score.</p>
            </div>
          )}
        </div>

        {/* CARD 2: Cycle Status */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Cycle Status</span>
            <div className="w-9 h-9 rounded-2xl bg-pink-50 text-pink-600 border border-pink-100 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-slate-900">{cycleStatus.currentPhase}</span>
              {cycleStatus.isEstimate && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  AI estimate
                </span>
              )}
            </div>

            {cycleStatus.cycleDay !== null ? (
              <p className="text-xs text-slate-600 font-medium">
                Cycle Day <strong>{cycleStatus.cycleDay}</strong> • Expected period:{' '}
                <strong>{cycleStatus.nextPeriodDate}</strong>
              </p>
            ) : (
              <p className="text-xs text-slate-400">{cycleStatus.message}</p>
            )}
          </div>
        </div>

        {/* CARD 3: Suggested Activity */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Suggested Activity</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-base font-extrabold text-slate-900">{suggestedActivity.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{suggestedActivity.description}</p>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
              {suggestedActivity.durationMinutes} mins • {suggestedActivity.category}
            </span>
          </div>
        </div>

        {/* CARD 4: Hydration Goal Engine */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Hydration</span>
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-[11px] text-rose-600 hover:underline font-bold"
            >
              Goal: {(waterGoal / 1000).toFixed(1)}L
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900">
                {(totalWater / 1000).toFixed(2)} <span className="text-sm font-bold text-slate-400">/ {(waterGoal / 1000).toFixed(1)}L</span>
              </span>
              <span className="text-xs font-extrabold text-blue-600">{waterPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${waterPercent}%` }}
              />
            </div>

            {/* Quick Add Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAddWater(250)}
                disabled={isUpdating}
                className="flex-1 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> +250ml
              </button>
              <button
                onClick={() => handleAddWater(500)}
                disabled={isUpdating}
                className="flex-1 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> +500ml
              </button>
            </div>
          </div>

          {/* Custom Goal Modal */}
          {showGoalModal && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-glow space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Set Daily Water Goal</h3>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Target in milliliters (ml)</label>
                  <input
                    type="number"
                    value={customGoalInput}
                    onChange={(e) => setCustomGoalInput(e.target.value)}
                    step={100}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCustomGoal}
                    className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white bg-rose-600 shadow-sm"
                  >
                    Save Goal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
