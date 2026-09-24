'use client'

import React from 'react'
import { Brain, Sparkles, Lightbulb } from 'lucide-react'
import type { AIInsightItem } from '@/types'

interface AIInsightsSectionProps {
  insights?: AIInsightItem[]
}

export function AIInsightsSection({ insights = [] }: AIInsightsSectionProps) {
  return (
    <section className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Brain className="w-5 h-5 text-rose-600" /> AI Health Insights
        </h3>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          M3 Extension Engine Ready
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/70 via-white to-pink-50/40 border border-rose-100/80 flex items-start gap-3.5"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {item.insight}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                {item.isDemo && (
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Demo Insight
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
