'use client'

import React from 'react'
import { Bell, AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import type { HealthAlertItem } from '@/types'

interface HealthAlertsSectionProps {
  alerts?: HealthAlertItem[]
}

export function HealthAlertsSection({ alerts = [] }: HealthAlertsSectionProps) {
  if (alerts.length === 0) return null

  return (
    <section className="glass-card rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="w-5 h-5 text-rose-600" /> Health Reminders & Alerts
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Notification Infrastructure
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const isWarning = alert.severity === 'warning'
          const isCritical = alert.severity === 'critical'

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                isCritical
                  ? 'bg-red-50/80 border-red-200 text-red-900'
                  : isWarning
                  ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                  : 'bg-rose-50/60 border-rose-100 text-slate-800'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isCritical ? 'bg-red-600 text-white' : isWarning ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isCritical ? <ShieldAlert className="w-4 h-4" /> : isWarning ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-extrabold">{alert.title}</h4>
                <p className="text-xs leading-relaxed opacity-90">{alert.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
