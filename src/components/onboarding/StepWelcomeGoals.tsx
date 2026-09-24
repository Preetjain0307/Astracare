'use client'

import React from 'react'
import {
  Calendar,
  Activity,
  Heart,
  Baby,
  Smile,
  Zap,
  Dumbbell,
  Apple,
  Scale,
  Moon,
  Brain,
  Shield,
  Sparkles,
  Check,
} from 'lucide-react'
import type { HealthGoalId } from '@/types'

export interface HealthGoalOption {
  id: HealthGoalId
  title: string
  description: string
  icon: React.ElementType
}

export const HEALTH_GOALS_OPTIONS: HealthGoalOption[] = [
  {
    id: 'period_tracking',
    title: 'Period & Cycle Tracking',
    description: 'Track cycle, flow, symptoms, and predict period dates',
    icon: Calendar,
  },
  {
    id: 'pcos',
    title: 'PCOS / Hormonal Health',
    description: 'Manage PCOS symptoms, insulin sensitivity, and cycle regularity',
    icon: Activity,
  },
  {
    id: 'conceiving',
    title: 'Trying to Conceive',
    description: 'Fertility window tracking, ovulation monitoring, and conception insights',
    icon: Heart,
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy Tracking',
    description: 'Week-by-week baby growth, trimester symptoms, and health guidelines',
    icon: Baby,
  },
  {
    id: 'postpartum',
    title: 'Postpartum Recovery',
    description: 'Pelvic floor, mood support, feeding, and physical recovery',
    icon: Smile,
  },
  {
    id: 'menopause',
    title: 'Menopause & Perimenopause',
    description: 'Hot flash management, hormone changes, and symptom tracking',
    icon: Zap,
  },
  {
    id: 'fitness',
    title: 'Fitness & Exercise',
    description: 'Cycle-sync workouts, strength training, and endurance',
    icon: Dumbbell,
  },
  {
    id: 'nutrition',
    title: 'Nutrition & Meal Insights',
    description: 'Hormone-balancing foods, hydration, and nutritional plans',
    icon: Apple,
  },
  {
    id: 'weight_management',
    title: 'Weight Management',
    description: 'Healthy weight goals tailored to your metabolic health',
    icon: Scale,
  },
  {
    id: 'sleep',
    title: 'Better Sleep',
    description: 'Sleep quality analysis, circadian rhythm, and restorative rest',
    icon: Moon,
  },
  {
    id: 'mental_wellness',
    title: 'Mental Wellness',
    description: 'Stress tracking, mood patterns, mindfulness, and mental clarity',
    icon: Brain,
  },
  {
    id: 'sexual_health',
    title: 'Sexual & Reproductive Health',
    description: 'Intimacy wellness, libido tracking, and reproductive care',
    icon: Shield,
  },
  {
    id: 'thyroid',
    title: 'Thyroid Health',
    description: 'Monitor thyroid energy shifts, metabolism, and symptoms',
    icon: Sparkles,
  },
  {
    id: 'general_wellness',
    title: 'General Women\'s Wellness',
    description: 'Holistic preventive healthcare and daily wellness tracking',
    icon: Heart,
  },
]

interface StepWelcomeGoalsProps {
  selectedGoals: HealthGoalId[]
  onChange: (goals: HealthGoalId[]) => void
  error?: string
}

export function StepWelcomeGoals({ selectedGoals, onChange, error }: StepWelcomeGoalsProps) {
  const toggleGoal = (id: HealthGoalId) => {
    if (selectedGoals.includes(id)) {
      onChange(selectedGoals.filter((g) => g !== id))
    } else {
      onChange([...selectedGoals, id])
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
          <Sparkles className="h-3.5 w-3.5" /> Welcome to AstraCare AI
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Let's personalize your health journey
        </h1>
        <p className="text-sm text-slate-600">
          It only takes 2–3 minutes. What would you like help with today? Select all that apply.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {HEALTH_GOALS_OPTIONS.map((goal) => {
          const Icon = goal.icon
          const isSelected = selectedGoals.includes(goal.id)

          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${
                isSelected
                  ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-rose-50/20 shadow-xs'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                  isSelected ? 'bg-rose-600 text-white' : 'bg-rose-100/70 text-rose-700 group-hover:bg-rose-200/70'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <h3 className={`text-sm font-bold ${isSelected ? 'text-rose-950' : 'text-slate-800'}`}>
                  {goal.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {goal.description}
                </p>
              </div>

              <div
                className={`absolute top-3.5 right-3.5 h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Selected <span className="font-semibold text-rose-600">{selectedGoals.length}</span> goal{selectedGoals.length === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  )
}
