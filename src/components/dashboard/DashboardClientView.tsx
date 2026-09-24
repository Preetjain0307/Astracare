'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Settings,
  Calendar,
  Sparkles,
  Watch,
  Activity,
  Smile,
  Moon,
  Droplets,
  Plus,
  CheckCircle2,
  Brain,
  FileText,
  Bell,
  Shield,
  Dumbbell,
  Apple,
  RefreshCw,
} from 'lucide-react'
import { DashboardSidebar, MobileBottomNav } from './DashboardNav'
import { DashboardHeader } from './DashboardHeader'
import { TodayHealthSummary } from './TodayHealthSummary'
import { HealthMetricCards } from './HealthMetricCards'
import { InteractiveAnalytics } from './InteractiveAnalytics'
import { AIInsightsSection } from './AIInsightsSection'
import { HealthAlertsSection } from './HealthAlertsSection'
import { DailyCheckInModal } from './DailyCheckInModal'
import { WeeklyCheckInModal } from './WeeklyCheckInModal'
import { MonthlyReviewModal } from './MonthlyReviewModal'
import { ProgressiveProfilingBanner } from './ProgressiveProfilingBanner'
import type { Profile, HealthQuestionnaire, DailyCheckIn, DashboardSummary } from '@/types'

interface DashboardClientViewProps {
  userEmail: string
  profile: Profile | null
  questionnaire: HealthQuestionnaire | null
  todayCheckIn: DailyCheckIn | null
  selectedGoals: string[]
}

const FUTURE_MODULES = [
  { icon: Brain, label: 'AI Health Intelligence', desc: 'Predictive risk score & biomarker analytics', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  { icon: Sparkles, label: 'AI Health Assistant', desc: '24/7 Conversational symptom & care guidance', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-100', href: '/dashboard/chat' },
  { icon: Apple, label: 'Nutrition & Hydration', desc: 'Cycle-synced hormone-balancing meal engine', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { icon: Dumbbell, label: 'Fitness & Movement', desc: 'Phase-tailored workout & recovery routines', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { icon: Watch, label: 'Wearable Management', desc: 'AstraBand continuous Bluetooth vitals sync', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { icon: Bell, label: 'Medication Reminders', desc: 'Intelligent pill & supplement tracking engine', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { icon: Shield, label: 'Emergency & SOS', desc: 'One-touch emergency medical alert dispatch', color: 'text-rose-700', bg: 'bg-rose-100/60', border: 'border-rose-200' },
]

export function DashboardClientView({
  userEmail,
  profile: initialProfile,
  questionnaire,
  todayCheckIn: initialCheckIn,
  selectedGoals,
}: DashboardClientViewProps) {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('/dashboard')
  const [showDailyModal, setShowDailyModal] = useState(false)
  const [showWeeklyModal, setShowWeeklyModal] = useState(false)
  const [showMonthlyModal, setShowMonthlyModal] = useState(false)

  const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/dashboard/summary')
      const json = await res.json()
      if (res.ok && json.summary) {
        setSummaryData(json.summary)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard summary:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const firstName = initialProfile?.first_name || userEmail.split('@')[0] || 'there'
  const isCompleted = initialProfile?.onboarding_completed || questionnaire?.completed

  return (
    <div className="min-h-screen gradient-mesh flex text-slate-800 pb-20 md:pb-8">
      {/* Desktop Sidebar Nav */}
      <DashboardSidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DashboardHeader
          firstName={firstName}
          alerts={summaryData?.alerts || []}
          onOpenAIChat={() => router.push('/dashboard/chat')}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-up">
          {/* Welcome Banner */}
          <div className="gradient-brand rounded-3xl p-6 sm:p-8 text-white shadow-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold backdrop-blur-md inline-block">
                  M5 Health Dashboard
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Welcome to Your Health Overview 👋
                </h2>
                <p className="text-rose-100 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                  {isCompleted
                    ? 'Your Women\'s Health profile is complete and secure ✓'
                    : 'Complete your health setup to unlock personalized AI predictive insights.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {!isCompleted ? (
                  <Link
                    href="/onboarding"
                    className="px-5 py-3 rounded-2xl bg-white text-rose-800 text-xs font-extrabold shadow-md hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    Complete Health Setup →
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDailyModal(true)}
                      className="px-4 py-2.5 rounded-2xl bg-white text-rose-800 text-xs font-extrabold shadow-md hover:bg-rose-50 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Daily Check-in</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowWeeklyModal(true)}
                      className="px-3.5 py-2.5 rounded-2xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 backdrop-blur-md transition-all cursor-pointer"
                    >
                      Weekly
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowMonthlyModal(true)}
                      className="px-3.5 py-2.5 rounded-2xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 backdrop-blur-md transition-all cursor-pointer"
                    >
                      Monthly
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progressive Profiling Banner */}
          {isCompleted && (
            <ProgressiveProfilingBanner
              missingSections={selectedGoals.length > 3 ? ['Detailed Fitness', 'Nutritional Allergies'] : []}
            />
          )}

          {/* TODAY'S HEALTH SUMMARY (Health Score, Cycle Status with AI estimate, Activity, Hydration) */}
          <TodayHealthSummary
            healthScore={
              summaryData?.healthScore || {
                score: null,
                status: 'insufficient_data',
                message: 'Health score will appear after more data is collected.',
              }
            }
            cycleStatus={
              summaryData?.cycleStatus || {
                currentPhase: 'Tracking Pending',
                cycleDay: null,
                nextPeriodDate: null,
                isEstimate: true,
                message: 'Add period date in cycle setup to unlock predictions.',
              }
            }
            suggestedActivity={
              summaryData?.suggestedActivity || {
                title: 'Light Walking & Mobility',
                category: 'walking',
                description: 'Low-impact movement to boost energy and circulation.',
                durationMinutes: 20,
                rationale: 'Default activity framework recommendation.',
              }
            }
            hydrationTotalMl={summaryData?.hydrationTotalMl || 0}
            hydrationGoalMl={summaryData?.hydrationGoalMl || 2500}
            onHydrationChange={(total, goal) => {
              setSummaryData((prev) => prev ? { ...prev, hydrationTotalMl: total, hydrationGoalMl: goal } : null)
            }}
          />

          {/* HEALTH METRICS CARDS */}
          <HealthMetricCards
            todayCheckIn={summaryData?.todayCheckIn || initialCheckIn}
            weeklyCheckIn={summaryData?.weeklyCheckIn || null}
            wearableConnected={summaryData?.wearableConnected || false}
          />

          {/* INTERACTIVE ANALYTICS (7d/30d/90d) */}
          <InteractiveAnalytics initialTimeframe="7d" />

          {/* AI INSIGHTS PLACEHOLDER */}
          <AIInsightsSection insights={summaryData?.aiInsights || []} />

          {/* HEALTH ALERTS */}
          <HealthAlertsSection alerts={summaryData?.alerts || []} />

          {/* FUTURE MODULES ROADMAP */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">AstraCare Health Modules</h3>
                <p className="text-xs text-slate-500 mt-0.5">Specialized healthcare intelligence suite</p>
              </div>
              <span className="text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full">
                Full Suite Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FUTURE_MODULES.map((mod) => {
                const CardWrapper = mod.href ? Link : 'div'
                return (
                  <CardWrapper
                    key={mod.label}
                    href={mod.href || '#'}
                    className={`glass-card rounded-3xl p-6 border ${mod.border} hover:shadow-glow transition-all duration-300 relative overflow-hidden group block cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-2xl ${mod.bg} border ${mod.border} flex items-center justify-center`}>
                        <mod.icon className={`h-5 w-5 ${mod.color}`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${mod.href ? 'text-rose-700 bg-rose-100 border border-rose-200' : 'text-slate-500 bg-slate-100 border border-slate-200'}`}>
                        {mod.href ? 'Active & Ready' : 'Module Ready'}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 mb-1">{mod.label}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{mod.desc}</p>
                  </CardWrapper>
                )
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Check-in Modals */}
      <DailyCheckInModal
        isOpen={showDailyModal}
        onClose={() => setShowDailyModal(false)}
        onSuccess={() => {
          fetchSummary()
        }}
      />

      <WeeklyCheckInModal
        isOpen={showWeeklyModal}
        onClose={() => setShowWeeklyModal(false)}
        onSuccess={() => {
          fetchSummary()
        }}
      />

      <MonthlyReviewModal
        isOpen={showMonthlyModal}
        onClose={() => setShowMonthlyModal(false)}
        onSuccess={() => {
          fetchSummary()
        }}
      />
    </div>
  )
}
