'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Dumbbell,
  Moon,
  Heart,
  Flame,
  Activity,
  Plus,
  Sparkles,
  Watch,
  CheckCircle2,
} from 'lucide-react'

export default function FitnessSleepPage() {
  const [activeTab, setActiveTab] = useState<'workouts' | 'sleep'>('workouts')

  const WORKOUTS = [
    { type: 'Strength & Core', duration: '45 mins', calories: 290, hrAvg: '138 bpm', phaseMatch: 'Follicular Optimized' },
    { type: 'Brisk Walk', duration: '30 mins', calories: 140, hrAvg: '112 bpm', phaseMatch: 'Active Recovery' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/fitness" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-indigo-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3">
                  <Dumbbell className="w-3.5 h-3.5" />
                  M7 Fitness, Workouts & Sleep Architecture
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Fitness & Sleep Intelligence
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Synchronize exercise intensity with your hormonal phases and analyze deep/REM restorative sleep architecture.
                </p>
              </div>
              <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2 self-start md:self-auto cursor-pointer">
                <Plus className="w-4 h-4" />
                Log Activity
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Steps</span>
              <div className="text-3xl font-black text-slate-900">8,420</div>
              <span className="text-xs text-emerald-600 font-bold">Goal: 10,000 (84%)</span>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Burn</span>
              <div className="text-3xl font-black text-orange-600">430 kcal</div>
              <span className="text-xs text-slate-600 font-medium">75 mins active duration</span>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sleep Duration</span>
              <div className="text-3xl font-black text-indigo-600">7h 35m</div>
              <span className="text-xs text-emerald-600 font-bold">Sleep Quality: 88 / 100</span>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resting Heart Rate</span>
              <div className="text-3xl font-black text-rose-600">62 bpm</div>
              <span className="text-xs text-slate-600 font-medium">HRV: 54 ms (Optimal)</span>
            </div>
          </div>

          {/* Sleep Architecture Breakdown */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-indigo-100 bg-white shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-600" />
                Last Night Sleep Architecture (AstraBand Telemetry)
              </h2>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                Restorative Sleep: 88%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                <span className="text-xs font-bold text-slate-600 block">Deep Sleep</span>
                <span className="text-2xl font-black text-indigo-700">1h 45m</span>
                <span className="text-[10px] text-slate-500 block">Cellular & Muscular Repair</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="text-xs font-bold text-slate-600 block">REM Sleep</span>
                <span className="text-2xl font-black text-purple-700">1h 55m</span>
                <span className="text-[10px] text-slate-500 block">Cognitive & Mood Restoration</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-600 block">Light Sleep</span>
                <span className="text-2xl font-black text-slate-700">3h 55m</span>
                <span className="text-[10px] text-slate-500 block">Wakeups: 1 (5 mins total)</span>
              </div>
            </div>
          </div>

          {/* Logged Workouts */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Today's Activities</h2>
            <div className="divide-y divide-slate-100">
              {WORKOUTS.map((w) => (
                <div key={w.type} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-bold text-slate-800">{w.type}</span>
                    <span className="text-xs text-rose-600 font-medium block">{w.phaseMatch}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                    <span>{w.duration}</span>
                    <span>{w.calories}</span>
                    <span>{w.hrAvg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/fitness" />
    </div>
  )
}
