'use client'

import React from 'react'
import { Watch, Wifi, Check, Lock, ShieldCheck, ArrowRight } from 'lucide-react'
import type { SmartBandFormData } from '@/lib/validation/onboarding'

export const SMART_BAND_PERMISSIONS = [
  { id: 'heart_rate', label: 'Heart Rate & Resting HR' },
  { id: 'hrv', label: 'Heart Rate Variability (HRV)' },
  { id: 'sleep', label: 'Sleep Cycles & Quality' },
  { id: 'steps_activity', label: 'Steps & Physical Activity' },
  { id: 'calories', label: 'Calories Burned' },
  { id: 'skin_temp', label: 'Skin Temperature Trend' },
  { id: 'spo2', label: 'Blood Oxygen (SpO2)' },
  { id: 'notifications', label: 'Health Alerts & Reminders' },
]

interface StepSmartBandProps {
  data: Partial<SmartBandFormData>
  onChange: (updated: Partial<SmartBandFormData>) => void
}

export function StepSmartBand({ data, onChange }: StepSmartBandProps) {
  const ownsBand = data.owns_band ?? false
  const selectedPermissions = data.permissions || SMART_BAND_PERMISSIONS.map((p) => p.id)

  const handleOwnsBandChange = (val: boolean) => {
    onChange({
      ...data,
      owns_band: val,
      permissions: val ? selectedPermissions : [],
    })
  }

  const togglePermission = (id: string) => {
    let updated = [...selectedPermissions]
    if (updated.includes(id)) {
      updated = updated.filter((item) => item !== id)
    } else {
      updated.push(id)
    }
    onChange({ ...data, permissions: updated })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold text-slate-900">Smart Band Setup</h2>
        <p className="text-sm text-slate-500">
          Sync real-time physiological vitals with your AstraBand AI smart band.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
        {/* Ownership Question */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-800">
            Do you own an AstraBand AI?
          </label>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleOwnsBandChange(true)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                ownsBand
                  ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/20 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2.5 rounded-full ${ownsBand ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Watch className="h-6 w-6" />
              </div>
              <span className="text-sm">Yes, I have AstraBand</span>
            </button>

            <button
              type="button"
              onClick={() => handleOwnsBandChange(false)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                !ownsBand
                  ? 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/20 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-rose-200 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2.5 rounded-full ${!ownsBand ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Watch className="h-6 w-6 opacity-40" />
              </div>
              <span className="text-sm">No, not yet</span>
            </button>
          </div>
        </div>

        {/* If Yes: Connection details & permission choices */}
        {ownsBand ? (
          <div className="space-y-5 pt-2 border-t border-slate-100 animate-fade-in">
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-600 text-white rounded-lg">
                  <Wifi className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-950">Connect AstraBand AI</h4>
                  <p className="text-xs text-rose-700">Bluetooth LE Hardware Sync</p>
                </div>
              </div>

              <span className="px-3 py-1 bg-white text-rose-700 border border-rose-200 text-xs font-semibold rounded-full shadow-2xs">
                AstraBand connection coming soon
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Vitals & Data Permissions
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SMART_BAND_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.id)
                  return (
                    <button
                      key={perm.id}
                      type="button"
                      onClick={() => togglePermission(perm.id)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                          : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{perm.label}</span>
                      <div
                        className={`h-4 w-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-1 animate-fade-in">
            <p className="font-semibold text-slate-800">No problem!</p>
            <p>You can connect AstraBand AI later at any time from Wearable Device Management.</p>
          </div>
        )}
      </div>
    </div>
  )
}
