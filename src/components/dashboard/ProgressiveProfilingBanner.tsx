'use client'

import React from 'react'
import { Sparkles, ArrowRight, Activity, Dumbbell, Heart } from 'lucide-react'
import Link from 'next/link'

interface ProgressiveProfilingBannerProps {
  missingSections?: string[]
}

export function ProgressiveProfilingBanner({ missingSections }: ProgressiveProfilingBannerProps) {
  if (!missingSections || missingSections.length === 0) return null

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-rose-100/60 border border-rose-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-950">Progressive Profile Enhancement</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            Complete optional details for {missingSections.slice(0, 2).join(', ')} to unlock deeper AI insights.
          </p>
        </div>
      </div>

      <Link
        href="/onboarding/goal-questions"
        className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs"
      >
        <span>Complete Now</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
