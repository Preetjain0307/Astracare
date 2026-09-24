'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  AlertTriangle,
  Heart,
  Plus,
  CheckCircle2,
  Lock,
} from 'lucide-react'

export default function EmergencySOSPage() {
  const [sosTriggered, setSosTriggered] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const CONTACTS = [
    { name: 'Dr. Sarah Jenkins (OB/GYN)', relation: 'Physician', phone: '+1 (555) 349-2910', primary: true },
    { name: 'Michael Rostova', relation: 'Partner / Emergency Contact', phone: '+1 (555) 892-1029', primary: true },
  ]

  const triggerSOS = () => {
    setSosTriggered(true)
  }

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/emergency" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-red-200 bg-gradient-to-r from-red-500/15 via-rose-500/10 to-red-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold mb-3">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  M13 Emergency SOS & Acute Health Escalation
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Emergency SOS Center
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Instant geolocation broadcast and alert dispatch to primary emergency contacts and designated healthcare providers in acute events.
                </p>
              </div>
            </div>
          </div>

          {/* SOS Trigger Button Card */}
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-red-200 bg-white shadow-lg text-center space-y-6 flex flex-col items-center">
            {sosTriggered ? (
              <div className="p-6 rounded-3xl bg-red-50 border border-red-300 text-red-900 space-y-3 max-w-md">
                <AlertTriangle className="w-10 h-10 text-red-600 mx-auto animate-bounce" />
                <h3 className="font-black text-lg">EMERGENCY BROADCAST ACTIVE</h3>
                <p className="text-xs text-red-700 leading-relaxed">
                  Simulated geolocation & vital telemetry broadcasted to primary contacts. If you are in immediate physical danger, call national emergency services (911/112) immediately.
                </p>
                <button
                  onClick={() => setSosTriggered(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Cancel / Acknowledge Safe
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={triggerSOS}
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white font-black text-xl md:text-2xl shadow-2xl flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-8 ring-red-100"
                >
                  <ShieldAlert className="w-10 h-10 md:w-12 md:h-12" />
                  <span>SOS</span>
                </button>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Press for Emergency Broadcast</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    Will send current GPS location, vital telemetry, and medical summary to your primary contacts.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Emergency Contacts List */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Designated Emergency Contacts</h2>
              <button className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Add Contact
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {CONTACTS.map((c) => (
                <div key={c.name} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{c.name}</span>
                    <span className="text-xs text-slate-500 block">{c.relation}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">{c.phone}</span>
                    <a
                      href={`tel:${c.phone}`}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/emergency" />
    </div>
  )
}
