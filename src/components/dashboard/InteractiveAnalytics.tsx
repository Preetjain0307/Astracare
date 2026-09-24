'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Calendar,
  Info,
  Moon,
  Smile,
  Droplets,
  Activity,
  Sparkles,
} from 'lucide-react'
import type { DashboardAnalyticsData } from '@/types'

interface InteractiveAnalyticsProps {
  initialTimeframe?: '7d' | '30d' | '90d'
}

export function InteractiveAnalytics({ initialTimeframe = '7d' }: InteractiveAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>(initialTimeframe)
  const [data, setData] = useState<DashboardAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchAnalytics() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/dashboard/analytics?timeframe=${timeframe}`)
        const json = await res.json()
        if (isMounted && res.ok && json.analytics) {
          setData(json.analytics)
        }
      } catch (err) {
        console.error('Failed to load analytics:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchAnalytics()
    return () => { isMounted = false }
  }, [timeframe])

  return (
    <section className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-6">
      {/* Header & Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-600" /> Health Analytics & Trends
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Visualized data from your recorded check-ins and biometrics</p>
        </div>

        {/* Timeframe Switcher Buttons */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/60 self-start sm:self-auto">
          {(['7d', '30d', '90d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-white text-rose-600 shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
          Loading health analytics...
        </div>
      ) : !data?.hasSufficientData ? (
        /* Empty State */
        <div className="py-12 px-4 text-center rounded-2xl bg-rose-50/50 border border-rose-100/60 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
            <Info className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-800">Not enough data yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Continue completing daily check-ins to build your health history and unlock interactive trends.
          </p>
        </div>
      ) : (
        /* Trend Visualizations */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SLEEP & HYDRATION PROGRESS */}
          <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-purple-600" /> Sleep Quality Trend
              </span>
              <span className="text-[10px] font-bold text-slate-400">{data.sleepTrend.length} entries</span>
            </div>

            <div className="h-32 flex items-end gap-2 pt-4 border-b border-slate-200/80 pb-2">
              {data.sleepTrend.map((pt, idx) => {
                const heightPct = Math.max(15, (pt.sleepQualityScore || 50))
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {pt.label}: {pt.sleepQualityScore}%
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[9px] text-slate-400 font-bold truncate max-w-full">{pt.label.split(',')[0]}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* MOOD DISTRIBUTION */}
          <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-600" /> Mood Breakdown
              </span>
              <span className="text-[10px] font-bold text-slate-400">Total Check-ins</span>
            </div>

            <div className="space-y-3 pt-2">
              {data.moodDistribution.map((m) => {
                const maxCount = Math.max(...data.moodDistribution.map((d) => d.count), 1)
                const pct = Math.round((m.count / maxCount) * 100)

                return (
                  <div key={m.mood} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 capitalize">
                      <span>{m.mood}</span>
                      <span>{m.count} days</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
