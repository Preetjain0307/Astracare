'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Smile,
  Heart,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  MessageCircle,
} from 'lucide-react'

export default function MentalWellnessPage() {
  const [selectedMood, setSelectedMood] = useState('😊')
  const [stressLevel, setStressLevel] = useState(3)
  const [journalNote, setJournalNote] = useState('')

  const MOODS = [
    { emoji: '😊', label: 'Energized & Happy' },
    { emoji: '🙂', label: 'Calm & Grounded' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😟', label: 'Anxious / Stressed' },
    { emoji: '😞', label: 'Exhausted / Low' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/wellness" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-3">
                  <Smile className="w-3.5 h-3.5" />
                  M8 Mental Health, Stress Resilience & Mindfulness
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Mental Wellness & Mindful Check-in
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Track emotional wellbeing, correlate allostatic stress with hormonal cycles, and record daily reflections.
                </p>
              </div>
            </div>
          </div>

          {/* Daily Mood Check-in */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-purple-100 bg-white shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900">How are you feeling today?</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {MOODS.map((m) => {
                const isSelected = selectedMood === m.emoji
                return (
                  <button
                    key={m.emoji}
                    onClick={() => setSelectedMood(m.emoji)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 border-purple-400 shadow-sm ring-2 ring-purple-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-3xl">{m.emoji}</span>
                    <span className="text-xs font-bold text-slate-700">{m.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Stress Slider */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700">Daily Stress Level (1 to 10):</span>
                <span className="text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                  Level {stressLevel} / 10
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Low / Relaxed</span>
                <span>Moderate</span>
                <span>High / Overwhelmed</span>
              </div>
            </div>

            {/* Mindful Journal */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Daily Reflection / Journal Notes</label>
              <textarea
                rows={3}
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Write down any feelings, triggers, or gratitude reflections..."
                className="w-full p-3 border rounded-2xl text-xs font-medium border-slate-200 focus:outline-none focus:border-purple-400"
              />
              <button className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all cursor-pointer shadow-sm">
                Save Check-in
              </button>
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/wellness" />
    </div>
  )
}
