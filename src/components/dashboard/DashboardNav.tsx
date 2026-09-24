'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Heart,
  LayoutDashboard,
  Calendar,
  Brain,
  Sparkles,
  Apple,
  Dumbbell,
  Smile,
  Watch,
  FileText,
  Bell,
  Shield,
  User,
} from 'lucide-react'

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/chat', label: 'AI Health Assistant', icon: Sparkles },
  { href: '/dashboard/cycle', label: 'Cycle & Ovulation', icon: Calendar },
  { href: '/dashboard/risk-assessment', label: 'AI Risk Predictor', icon: Brain },
  { href: '/dashboard/health-twin', label: 'Digital Health Twin', icon: Heart },
  { href: '/dashboard/nutrition', label: 'Nutrition & Hydration', icon: Apple },
  { href: '/dashboard/fitness', label: 'Fitness & Sleep', icon: Dumbbell },
  { href: '/dashboard/wellness', label: 'Mental Wellness', icon: Smile },
  { href: '/dashboard/medications', label: 'Medications', icon: Bell },
  { href: '/dashboard/wearables', label: 'AstraBand & Wearables', icon: Watch },
  { href: '/dashboard/reports', label: 'Health Reports', icon: FileText },
  { href: '/dashboard/doctor', label: "Doctor's Console", icon: Shield },
  { href: '/dashboard/admin', label: 'Admin Portal', icon: User },
  { href: '/dashboard/emergency', label: 'Emergency / SOS', icon: Shield, isAlert: true },
  { href: '/settings', label: 'Profile & Security', icon: User },
]


interface DashboardNavProps {
  currentTab?: string
  onTabChange?: (tabHref: string) => void
}

export function DashboardSidebar({ currentTab = '/dashboard', onTabChange }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 glass-card border-r border-rose-100/80 min-h-screen p-4 sticky top-0 z-20">
      {/* Brand Header */}
      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-rose-100/60">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center shadow-glow text-white">
          <Heart className="w-5 h-5 fill-white" />
        </div>
        <div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-none">AstraCare AI</span>
          <span className="text-[10px] text-rose-600 font-bold tracking-wider uppercase">Women's Health</span>
        </div>
      </Link>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || currentTab === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onTabChange?.(item.href)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-glow'
                  : item.isAlert
                  ? 'text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 border border-rose-200/60'
                  : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isAlert ? 'text-rose-600' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export function MobileBottomNav({ currentTab = '/dashboard', onTabChange }: DashboardNavProps) {
  const mobileItems = [
    NAV_ITEMS[0], // Dashboard
    NAV_ITEMS[1], // AI Health Assistant
    NAV_ITEMS[2], // Cycle
    NAV_ITEMS[4], // Nutrition
    NAV_ITEMS[11], // Settings
  ]

  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-rose-100 shadow-lg px-2 py-2 flex items-center justify-around backdrop-blur-xl">
      {mobileItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || currentTab === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onTabChange?.(item.href)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-rose-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-rose-600 stroke-[2.5]' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-1 font-bold">{item.label.split(' ')[0]}</span>
          </Link>
        )
      })}
    </div>
  )
}
