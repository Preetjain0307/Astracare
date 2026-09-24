'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Calendar as CalendarIcon,
  Heart,
  Sparkles,
  Droplet,
  Flame,
  Activity,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'

export default function CycleTrackingPage() {
  const [selectedPhase, setSelectedPhase] = useState<'menstrual' | 'follicular' | 'ovulatory' | 'luteal'>('follicular')
  const [symptoms, setSymptoms] = useState<string[]>(['Cramps (Mild)', 'Bloating'])

  const PHASES = [
    { id: 'menstrual', name: 'Menstrual Phase', days: 'Days 1 - 5', desc: 'Shedding of uterine lining. Rest and hydration prioritized.', color: 'from-rose-500 to-red-500' },
    { id: 'follicular', name: 'Follicular Phase', days: 'Days 6 - 13', desc: 'Estrogen rising. High energy, strength workouts optimal.', color: 'from-pink-500 to-rose-400' },
    { id: 'ovulatory', name: 'Ovulation Window', days: 'Days 14 - 16', desc: 'Peak fertility, highest LH surge. Energy peak.', color: 'from-purple-500 to-pink-500' },
    { id: 'luteal', name: 'Luteal Phase', days: 'Days 17 - 28', desc: 'Progesterone dominance. Calming yoga, magnesium rich foods.', color: 'from-amber-500 to-rose-400' },
  ]

  const SYMPTOM_OPTIONS = [
    'Cramps (Mild)', 'Cramps (Severe)', 'Headache', 'Backache', 
    'Bloating', 'Acne Breakout', 'Breast Tenderness', 'Fatigue', 
    'Mood Swings', 'Craving Sweets', 'High Libido', 'Insomnia'
  ]

  const toggleSymptom = (sym: string) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/cycle" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header Banner */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-3">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  M2 Cycle, Fertility & Life Stage Tracking
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Menstrual & Ovulation Intelligence
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Track symptoms, predict ovulation windows, monitor hormonal transitions, and sync workouts with your natural rhythm.
                </p>
              </div>
              <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-glow hover:opacity-95 flex items-center gap-2 self-start md:self-auto cursor-pointer">
                <Plus className="w-4 h-4" />
                Log Period Start
              </button>
            </div>
          </div>

          {/* Current Cycle State Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Cycle Day</span>
              <div className="text-3xl font-black text-rose-600">Day 11</div>
              <span className="text-xs text-slate-600 font-medium">Follicular Phase (Estrogen Peak)</span>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Ovulation</span>
              <div className="text-3xl font-black text-purple-600">In 3 Days</div>
              <span className="text-xs text-slate-600 font-medium">Fertile Window: Sep 28 - Oct 02</span>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Period Prediction</span>
              <div className="text-3xl font-black text-slate-800">17 Days</div>
              <span className="text-xs text-slate-600 font-medium">Est. Duration: 29.4 days</span>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cycle Regularity</span>
              <div className="text-3xl font-black text-emerald-600">Regular</div>
              <span className="text-xs text-slate-600 font-medium">Variance: ± 1.2 Days (High Confidence)</span>
            </div>
          </div>

          {/* Four Phase Architecture */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Cycle Phases & Hormonal Guidance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {PHASES.map((phase) => (
                <div
                  key={phase.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    selectedPhase === phase.id
                      ? 'bg-white border-rose-400 shadow-glow ring-2 ring-rose-200'
                      : 'bg-white/80 border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${phase.color} text-white flex items-center justify-center font-bold text-xs mb-3`}>
                    <Droplet className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{phase.name}</h3>
                  <span className="text-xs font-semibold text-rose-600 block mb-2">{phase.days}</span>
                  <p className="text-xs text-slate-500 leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Symptoms Logger */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  Daily Symptom & Biomarker Logging
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Select all symptoms experienced today</p>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl">
                {symptoms.length} Logged
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SYMPTOM_OPTIONS.map((sym) => {
                const isSelected = symptoms.includes(sym)
                return (
                  <button
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50/60'
                    }`}
                  >
                    <span>{sym}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/cycle" />
    </div>
  )
}
