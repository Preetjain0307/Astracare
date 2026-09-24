'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Shield,
  UserCheck,
  FileText,
  Activity,
  Heart,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

export default function DoctorConsolePage() {
  const [selectedPatient, setSelectedPatient] = useState('1')
  const [noteContent, setNoteContent] = useState('')

  const PATIENTS = [
    { id: '1', name: 'Elena Rostova', age: 26, cycleStatus: 'Day 11 (Follicular)', riskSummary: 'Low PCOS / Mild Anemia', lastActive: 'Today' },
    { id: '2', name: 'Sophia Chen', age: 31, cycleStatus: 'Day 22 (Luteal)', riskSummary: 'Moderate PCOS / Normal Thyroid', lastActive: 'Yesterday' },
    { id: '3', name: 'Aaliyah Khan', age: 29, cycleStatus: 'Gestational W14', riskSummary: 'Normal Glycemic / High Vitality', lastActive: '2 days ago' },
  ]

  const activePatient = PATIENTS.find((p) => p.id === selectedPatient) || PATIENTS[0]

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/doctor" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-teal-500/10 via-rose-500/10 to-indigo-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-3">
                  <Shield className="w-3.5 h-3.5" />
                  M14 Doctor's Clinical Console & Decision Support
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Doctor Clinical Portal
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Review consented patient rosters, longitudinal telemetry trends, AI risk stratifications, and author clinical consultation notes.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/90 p-3 rounded-2xl border border-slate-200">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Dr. Sarah Jenkins, MD</span>
                  <span className="text-slate-500">OB/GYN • Verified License</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Roster & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Patient Roster */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider px-1">
                Consented Patient Roster ({PATIENTS.length})
              </h2>
              {PATIENTS.map((p) => {
                const isSelected = selectedPatient === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatient(p.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-teal-400 shadow-glow ring-2 ring-teal-200'
                        : 'bg-white/60 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900">{p.name}</span>
                      <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full">
                        Age {p.age}
                      </span>
                    </div>
                    <span className="text-xs text-rose-600 font-semibold">{p.cycleStatus}</span>
                    <span className="text-[11px] text-slate-500">{p.riskSummary}</span>
                  </button>
                )
              })}
            </div>

            {/* Patient Clinical View */}
            <div className="lg:col-span-8 glass-card p-6 md:p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activePatient.name}</h3>
                  <span className="text-xs text-slate-500">Consented Access • Scope: Vitals, Cycle, Reports, ML Risks</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                  Consent Active
                </span>
              </div>

              {/* Patient Vitals & Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-500 block">Cycle Rhythm</span>
                  <span className="text-sm font-bold text-slate-800 block">{activePatient.cycleStatus}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-500 block">Resting HR / HRV</span>
                  <span className="text-sm font-bold text-slate-800 block">62 bpm / 54 ms</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-500 block">AI Screening</span>
                  <span className="text-sm font-bold text-slate-800 block">{activePatient.riskSummary}</span>
                </div>
              </div>

              {/* Doctor Clinical Notes */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 block">Author Clinical Note / Recommendation</label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Record observations regarding patient cycle, hormonal lab tests, or lifestyle advice..."
                  className="w-full p-3.5 border rounded-2xl text-xs font-medium border-slate-200 focus:outline-none focus:border-teal-400"
                />
                <button className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-all cursor-pointer shadow-sm">
                  Save Clinical Note to Patient Record
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/doctor" />
    </div>
  )
}
