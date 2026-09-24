'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Watch,
  Heart,
  Activity,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  BatteryCharging,
  Wifi,
  Radio,
} from 'lucide-react'

export default function WearablesPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [deviceConnected, setDeviceConnected] = useState(true)

  const syncDevice = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
    }, 1800)
  }

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/wearables" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-indigo-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-3">
                  <Watch className="w-3.5 h-3.5" />
                  M9 Wearable Device Management & AstraBand Gateway
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  AstraBand & Wearable Telemetry
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Real-time physiological telemetry abstraction layer supporting continuous ECG, HRV, SpO2, and basal skin temperature.
                </p>
              </div>
              <button
                onClick={syncDevice}
                disabled={isSyncing}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-glow hover:opacity-95 flex items-center gap-2 self-start md:self-auto cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing Telemetry...' : 'Sync Device Now'}
              </button>
            </div>
          </div>

          {/* Device Status Card */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold">
                  <Watch className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">AstraBand Pulse Gen 2</h3>
                  <span className="text-xs text-slate-500 block">MAC: 84:C5:E6:3A:91:0F • Firmware: v2.4.1 (Latest)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <Wifi className="w-3.5 h-3.5" /> Connected & Streaming
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> 84%
                </span>
              </div>
            </div>

            {/* Telemetry Stream */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 block">Heart Rate</span>
                <span className="text-2xl font-black text-rose-600">64 bpm</span>
                <span className="text-[10px] text-slate-500 block">Resting range: 58-68 bpm</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 block">Heart Rate Variability (HRV)</span>
                <span className="text-2xl font-black text-purple-600">54 ms</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Elevated (Optimal Recovery)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 block">Blood Oxygen (SpO2)</span>
                <span className="text-2xl font-black text-blue-600">98.5%</span>
                <span className="text-[10px] text-slate-500 block">Normal peripheral saturation</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 block">Basal Skin Temperature</span>
                <span className="text-2xl font-black text-amber-600">36.55 °C</span>
                <span className="text-[10px] text-slate-500 block">Pre-ovulatory baseline</span>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/wearables" />
    </div>
  )
}
