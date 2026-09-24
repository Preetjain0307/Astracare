'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  FileText,
  Download,
  Share2,
  Lock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Shield,
} from 'lucide-react'

export default function HealthReportsPage() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => {
      setDownloading(false)
      alert('AstraCare Comprehensive Health Summary PDF generated successfully.')
    }, 1200)
  }

  const REPORTS = [
    { title: 'Monthly Hormonal & Cycle Summary', date: 'Sep 2026', type: 'Clinical Summary', size: '1.2 MB', pages: '4 Pages' },
    { title: 'Cardiometabolic & Wearable Biomarker Report', date: 'Aug 2026', type: 'Telemetry Analysis', size: '2.4 MB', pages: '6 Pages' },
    { title: 'AI Risk Stratification & Screening Dossier', date: 'Jul 2026', type: 'AI Intelligence', size: '850 KB', pages: '3 Pages' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/reports" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-indigo-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-3">
                  <FileText className="w-3.5 h-3.5" />
                  M10 Clinical Health Reports & History
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Health Reports & Longitudinal Records
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Export doctor-ready PDF summaries, manage medical records, and grant cryptographic consented access to your gynecologist or endocrinologist.
                </p>
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-glow hover:opacity-95 flex items-center gap-2 self-start md:self-auto cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Generating PDF...' : 'Generate New PDF Report'}
              </button>
            </div>
          </div>

          {/* Consented Doctor Sharing Card */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" />
                Active Doctor Consent & Data Sharing
              </h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                1 Doctor Granted Access
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-slate-800 block">Dr. Sarah Jenkins, MD</span>
                <span className="text-xs text-slate-500">Obstetrics & Gynecology • Access Expires in 48 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                  Manage Scope
                </button>
                <button className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer">
                  Revoke Consent
                </button>
              </div>
            </div>
          </div>

          {/* Available Reports */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Generated Clinical Dossiers</h2>
            <div className="divide-y divide-slate-100">
              {REPORTS.map((r) => (
                <div key={r.title} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800">{r.title}</span>
                      <span className="text-xs text-slate-500 block">
                        {r.type} • {r.date} • {r.pages} ({r.size})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={handleDownload}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-600 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-600 transition-all cursor-pointer">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/reports" />
    </div>
  )
}
