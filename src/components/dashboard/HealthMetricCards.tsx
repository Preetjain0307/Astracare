'use client'

import React from 'react'
import {
  Moon,
  Smile,
  Activity,
  Watch,
  Heart,
  Zap,
  Thermometer,
  Plus,
} from 'lucide-react'
import type { DailyCheckIn, WeeklyCheckIn } from '@/types'

interface HealthMetricCardsProps {
  todayCheckIn: DailyCheckIn | null
  weeklyCheckIn: WeeklyCheckIn | null
  wearableConnected: boolean
}

export function HealthMetricCards({
  todayCheckIn,
  weeklyCheckIn,
  wearableConnected,
}: HealthMetricCardsProps) {
  const sleepQuality = todayCheckIn?.sleep_quality || 'No entry'
  const stressLevel = weeklyCheckIn?.stress_level || 'No entry'
  const activityDone = todayCheckIn?.activity_done

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Health Metrics & Vitals</h3>
        <span className="text-xs text-slate-400 font-medium">Synced Biometrics</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* SLEEP CARD */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-700">Sleep</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Daily Log</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900 capitalize">{sleepQuality}</div>
            <p className="text-xs text-slate-500">
              {todayCheckIn ? 'Sleep quality logged for today' : 'No sleep data recorded yet today'}
            </p>
          </div>
        </div>

        {/* STRESS CARD */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Smile className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-700">Stress & Mood</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Weekly Log</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">
              {weeklyCheckIn ? `${weeklyCheckIn.stress_level} / 10` : 'Not recorded'}
            </div>
            <p className="text-xs text-slate-500">
              {weeklyCheckIn ? 'Stress level recorded for this week' : 'Complete weekly check-in to record stress'}
            </p>
          </div>
        </div>

        {/* ACTIVITY CARD */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-slate-700">Movement & Activity</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Daily Log</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">
              {activityDone === true ? 'Completed ✓' : activityDone === false ? 'Rest Day' : 'Pending Log'}
            </div>
            <p className="text-xs text-slate-500">
              {activityDone !== undefined ? 'Physical activity recorded for today' : 'Tap daily check-in to record movement'}
            </p>
          </div>
        </div>

        {/* WEARABLE CARD 1: HEART RATE */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-rose-600" />
              </div>
              <span className="text-xs font-extrabold text-slate-700">Heart Rate & HRV</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">AstraBand</span>
          </div>

          {wearableConnected ? (
            <div className="space-y-1">
              <div className="text-2xl font-extrabold text-slate-900">72 <span className="text-sm font-bold text-slate-400">BPM</span></div>
              <p className="text-xs text-slate-500">Resting HR: 64 BPM • HRV: 58ms</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">No wearable data available yet.</p>
              <button className="text-xs font-extrabold text-rose-600 hover:underline flex items-center gap-1">
                <Watch className="w-3.5 h-3.5" /> Connect AstraBand
              </button>
            </div>
          )}
        </div>

        {/* WEARABLE CARD 2: OXYGEN (SpO2) */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-extrabold text-slate-700">Blood Oxygen (SpO2)</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">AstraBand</span>
          </div>

          {wearableConnected ? (
            <div className="space-y-1">
              <div className="text-2xl font-extrabold text-slate-900">98%</div>
              <p className="text-xs text-slate-500">Normal oxygen saturation level</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">No wearable data available yet.</p>
              <button className="text-xs font-extrabold text-rose-600 hover:underline flex items-center gap-1">
                <Watch className="w-3.5 h-3.5" /> Connect AstraBand
              </button>
            </div>
          )}
        </div>

        {/* WEARABLE CARD 3: BODY TEMP */}
        <div className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-pink-600" />
              </div>
              <span className="text-xs font-extrabold text-slate-700">Body Temperature</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">AstraBand</span>
          </div>

          {wearableConnected ? (
            <div className="space-y-1">
              <div className="text-2xl font-extrabold text-slate-900">36.6 °C</div>
              <p className="text-xs text-slate-500">Baseline core temperature stable</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">No wearable data available yet.</p>
              <button className="text-xs font-extrabold text-rose-600 hover:underline flex items-center gap-1">
                <Watch className="w-3.5 h-3.5" /> Connect AstraBand
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
