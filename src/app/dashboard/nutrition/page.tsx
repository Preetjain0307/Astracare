'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Apple,
  Droplet,
  Plus,
  Flame,
  CheckCircle2,
  Sparkles,
  Activity,
  Coffee,
} from 'lucide-react'

export default function NutritionHydrationPage() {
  const [waterConsumed, setWaterConsumed] = useState(1750) // ml
  const waterGoal = 2500 // ml

  const addWater = (amount: number) => {
    setWaterConsumed((prev) => Math.min(prev + amount, 5000))
  }

  const percentage = Math.min(Math.round((waterConsumed / waterGoal) * 100), 100)

  const MEALS = [
    { type: 'Breakfast', name: 'Greek Yogurt Bowl with Berries & Chia Seeds', calories: 340, protein: '22g', carbs: '38g', fat: '10g' },
    { type: 'Lunch', name: 'Grilled Salmon Quinoa Bowl with Avocado', calories: 580, protein: '42g', carbs: '46g', fat: '22g' },
    { type: 'Snack', name: 'Raw Almonds & Green Matcha Latte', calories: 190, protein: '6g', carbs: '14g', fat: '12g' },
    { type: 'Dinner', name: 'Stir-Fried Tofu with Broccoli & Brown Rice', calories: 460, protein: '28g', carbs: '52g', fat: '14g' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/nutrition" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Banner */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-rose-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
                  <Apple className="w-3.5 h-3.5" />
                  M6 Nutrition, Micronutrients & Hydration
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Nutrition & Hydration Intelligence
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Track balanced macronutrients, hormonal-supporting micronutrients (Iron, Zinc, Magnesium), and optimal hydration.
                </p>
              </div>
              <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-2 self-start md:self-auto cursor-pointer">
                <Plus className="w-4 h-4" />
                Log Meal / Food
              </button>
            </div>
          </div>

          {/* Hydration & Macros Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Hydration Widget */}
            <div className="lg:col-span-5 glass-card p-6 md:p-8 rounded-3xl border border-cyan-100 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-cyan-500" />
                  Hydration Ring Tracker
                </h2>
                <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-xl">
                  {percentage}% of Goal
                </span>
              </div>

              <div className="text-center py-4 space-y-2">
                <div className="text-4xl font-black text-slate-900 tracking-tight">
                  {waterConsumed} <span className="text-lg font-bold text-slate-500">/ {waterGoal} ml</span>
                </div>
                <p className="text-xs text-slate-500">Target calculated for active recovery</p>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => addWater(250)}
                  className="py-2.5 px-3 rounded-xl border border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  +250 ml (Glass)
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="py-2.5 px-3 rounded-xl border border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  +500 ml (Bottle)
                </button>
                <button
                  onClick={() => addWater(750)}
                  className="py-2.5 px-3 rounded-xl border border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-all cursor-pointer text-center"
                >
                  +750 ml (Large)
                </button>
              </div>
            </div>

            {/* Daily Macro Targets */}
            <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Macronutrient Balance (Today)
                </h2>
                <span className="text-xs font-bold text-slate-600">1,570 / 1,850 kcal</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                  <span className="text-xs font-bold text-slate-600 block">Protein</span>
                  <span className="text-2xl font-black text-rose-600">98g</span>
                  <span className="text-[10px] text-slate-500 block">Goal: 105g (93%)</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                  <span className="text-xs font-bold text-slate-600 block">Carbohydrates</span>
                  <span className="text-2xl font-black text-amber-600">150g</span>
                  <span className="text-[10px] text-slate-500 block">Goal: 175g (85%)</span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                  <span className="text-xs font-bold text-slate-600 block">Healthy Fats</span>
                  <span className="text-2xl font-black text-purple-600">58g</span>
                  <span className="text-[10px] text-slate-500 block">Goal: 60g (96%)</span>
                </div>
              </div>

              {/* Hormonal Micronutrient Insight */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Micronutrient Status: Iron & Magnesium Optimal
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Your current follicular intake contains recommended bioavailable iron from chia, quinoa, and tofu to replenish ferritin levels.
                </p>
              </div>
            </div>
          </div>

          {/* Meals Log Table */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Today's Logged Meals</h2>
            <div className="divide-y divide-slate-100">
              {MEALS.map((m) => (
                <div key={m.type} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">{m.type}</span>
                    <span className="text-sm font-bold text-slate-800">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                    <span>{m.calories} kcal</span>
                    <span>P: {m.protein}</span>
                    <span>C: {m.carbs}</span>
                    <span>F: {m.fat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/nutrition" />
    </div>
  )
}
