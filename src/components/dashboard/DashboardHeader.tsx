'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  Settings,
  Sparkles,
  Calendar as CalendarIcon,
  User,
  X,
  CheckCircle2,
} from 'lucide-react'
import { SignOutButton } from '@/app/dashboard/SignOutButton'
import type { HealthAlertItem } from '@/types'

interface DashboardHeaderProps {
  firstName: string
  alerts?: HealthAlertItem[]
  onOpenAIChat?: () => void
}

export function DashboardHeader({ firstName, alerts = [], onOpenAIChat }: DashboardHeaderProps) {
  const [showAlertsPopover, setShowAlertsPopover] = useState(false)

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="glass-card sticky top-0 z-30 border-b border-rose-100/80 shadow-2xs backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left Greeting & Date */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
            <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>{dateStr}</span>
            <span className="hidden sm:inline">• Here&apos;s your health overview today</span>
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Shortcut */}
          {onOpenAIChat ? (
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-extrabold shadow-glow hover:shadow-glow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">AI Health Assistant</span>
            </button>
          ) : (
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-extrabold shadow-glow hover:shadow-glow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">AI Health Assistant</span>
            </Link>
          )}

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsPopover(!showAlertsPopover)}
              className="p-2.5 rounded-2xl bg-white/80 border border-rose-100 hover:bg-rose-50/60 text-slate-600 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              )}
            </button>

            {showAlertsPopover && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-3xl p-4 border border-rose-100 shadow-glow z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Health Alerts</h3>
                  <button onClick={() => setShowAlertsPopover(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div key={alert.id} className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs">
                        <div className="font-extrabold text-slate-900 flex items-center justify-between mb-1">
                          <span>{alert.title}</span>
                          <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{alert.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                      No critical health alerts right now.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <Link
            href="/settings"
            className="p-2.5 rounded-2xl bg-white/80 border border-rose-100 hover:bg-rose-50/60 text-slate-600 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* User Sign Out */}
          <SignOutButton />
        </div>
      </div>
    </header>
  )
}
