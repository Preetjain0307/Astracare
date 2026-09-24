'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Bell,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Pill,
} from 'lucide-react'

export default function MedicationsPage() {
  const [meds, setMeds] = useState([
    { id: '1', name: 'Prenatal Vitamin Complex', dose: '1 Capsule', time: '08:00 AM', taken: true, frequency: 'Daily' },
    { id: '2', name: 'Iron Bisglycinate (Gentle Iron)', dose: '25 mg', time: '01:00 PM', taken: true, frequency: 'Daily with meal' },
    { id: '3', name: 'Magnesium Glycinate', dose: '200 mg', time: '09:30 PM', taken: false, frequency: 'Nightly before sleep' },
  ])

  const toggleMed = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/medications" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-blue-500/10 via-rose-500/10 to-indigo-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
                  <Bell className="w-3.5 h-3.5" />
                  M12 Medication & Supplement Reminders
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Medication & Supplement Schedule
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Track adherence streaks, schedule intake reminders, and sync supplement timings with your nutritional windows.
                </p>
              </div>
              <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2 self-start md:self-auto cursor-pointer">
                <Plus className="w-4 h-4" />
                Add Medication / Vitamin
              </button>
            </div>
          </div>

          {/* Adherence Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Adherence</span>
              <div className="text-3xl font-black text-blue-600">67%</div>
              <span className="text-xs text-slate-600 font-medium">2 of 3 doses completed</span>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Streak</span>
              <div className="text-3xl font-black text-emerald-600">14 Days</div>
              <span className="text-xs text-slate-600 font-medium">100% adherence over last 2 weeks</span>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Scheduled Dose</span>
              <div className="text-3xl font-black text-slate-800">09:30 PM</div>
              <span className="text-xs text-slate-600 font-medium">Magnesium Glycinate (200 mg)</span>
            </div>
          </div>

          {/* Medication List */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-blue-100 bg-white shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Today's Medication Schedule</h2>
            <div className="divide-y divide-slate-100">
              {meds.map((m) => (
                <div key={m.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMed(m.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                        m.taken
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 hover:border-blue-400 bg-slate-50'
                      }`}
                    >
                      {m.taken && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <span className={`text-sm font-bold ${m.taken ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {m.name}
                      </span>
                      <span className="text-xs text-slate-500 block">
                        {m.dose} • {m.frequency}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600 self-end md:self-auto">
                    <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/medications" />
    </div>
  )
}
