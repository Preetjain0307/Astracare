'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Heart,
  Brain,
  Activity,
  Sparkles,
  Zap,
  Clock,
  Shield,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Info,
} from 'lucide-react'

export default function DigitalHealthTwinPage() {
  const [selectedSystem, setSelectedSystem] = useState<'hormonal' | 'circadian' | 'metabolic' | 'vitality'>('hormonal')

  const SYSTEMS = [
    {
      id: 'hormonal',
      name: 'Endocrine & Hormonal Rhythm',
      score: 84,
      status: 'Stable / Follicular Alignment',
      summary: 'Estrogen curve rising normally. Low risk of ovulatory delay.',
      details: [
        { label: 'LH/FSH Balance Indicator', value: '1.2 : 1 (Optimal)' },
        { label: 'Cycle Phase Synchronization', value: 'Day 11 (Late Follicular)' },
        { label: 'Estrogen Trajectory', value: '+14% Week-over-Week' },
      ],
    },
    {
      id: 'circadian',
      name: 'Sleep & Circadian Clock',
      score: 88,
      status: 'High Sleep Efficiency',
      summary: 'Deep sleep and REM cycles aligned with 7.4 hr mean duration.',
      details: [
        { label: 'Circadian Consistency', value: '92% Alignment' },
        { label: 'Deep Sleep Ratio', value: '22% of total cycle' },
        { label: 'Resting HRV Baseline', value: '54 ms (Elevated Recovery)' },
      ],
    },
    {
      id: 'metabolic',
      name: 'Metabolic & Glycemic Balance',
      score: 81,
      status: 'Moderate Sensitivity',
      summary: 'Fasting glucose and postprandial levels steady with high hydration.',
      details: [
        { label: 'Glycemic Stability Index', value: '88 / 100' },
        { label: 'Hydration Fulfillment', value: '2.4 L / Day (96%)' },
        { label: 'Energy Expenditure Delta', value: '+340 kcal / Active Day' },
      ],
    },
    {
      id: 'vitality',
      name: 'Cardiovascular & Stress Twin',
      score: 86,
      status: 'Low Allostatic Load',
      summary: 'Resting heart rate stable at 62 bpm with rapid post-exercise recovery.',
      details: [
        { label: 'Resting Heart Rate', value: '62 bpm' },
        { label: 'Stress Recovery Index', value: '78 / 100' },
        { label: 'SpO2 Mean Baseline', value: '98.5%' },
      ],
    },
  ]

  const activeSystem = SYSTEMS.find((s) => s.id === selectedSystem) || SYSTEMS[0]

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/health-twin" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header Banner */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-pink-500/10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  M17 Longitudinal Digital Health Twin
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Your Digital Health Twin
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  A multi-system computational model reflecting your longitudinal hormonal rhythms, circadian cycles, metabolic trends, and wearable telemetry.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/90 p-3 rounded-2xl border border-rose-200/70 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 text-white flex items-center justify-center font-black text-lg">
                  85
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Vitality Score</span>
                  <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +2.4% vs Last Month
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Biological Age & Trajectory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biological Age Delta</span>
                <Clock className="w-4 h-4 text-rose-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">-1.8 Years</span>
                <span className="text-xs text-emerald-600 font-bold">Favorable</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculated from sleep consistency, resting HRV, and cardiovascular recovery timeseries.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hormonal Stability</span>
                <Heart className="w-4 h-4 text-pink-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">84 / 100</span>
                <span className="text-xs text-emerald-600 font-bold">In-Sync</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Current follicular progression is matching natural cycle models with low symptom distress.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allostatic Resilience</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">78 / 100</span>
                <span className="text-xs text-slate-600 font-bold">Moderate</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mild stress response detected during luteal transition. Mindfulness check-ins recommended.
              </p>
            </div>
          </div>

          {/* Twin Organ System Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* System Navigation Tabs */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider px-1">
                Body Sub-Systems
              </h2>
              {SYSTEMS.map((sys) => {
                const isActive = selectedSystem === sys.id
                return (
                  <button
                    key={sys.id}
                    onClick={() => setSelectedSystem(sys.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${

                      isActive
                        ? 'bg-white border-rose-400 shadow-glow ring-2 ring-rose-200'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{sys.name}</span>
                      <span className="text-[11px] text-slate-500">{sys.status}</span>
                    </div>
                    <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl">
                      {sys.score}%
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Detailed System Simulation */}
            <div className="lg:col-span-8 glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activeSystem.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{activeSystem.summary}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  {activeSystem.score}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Physiological Markers & Indicators
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeSystem.details.map((d) => (
                    <div key={d.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[11px] text-slate-500 font-medium block">{d.label}</span>
                      <span className="text-sm font-bold text-slate-800 block">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  Twin AI Trajectory Projection (Next 14 Days)
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Based on historical trends, basal body temperature curve, and circadian regularity, ovulation is projected within 48–72 hours with peak vitality indices expected on Day 14.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/health-twin" />
    </div>
  )
}
