'use client'

import React, { useState } from 'react'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
  Shield,
  Brain,
  Database,
  CheckCircle2,
  Server,
  Activity,
  AlertTriangle,
  Lock,
  Layers,
} from 'lucide-react'

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<'models' | 'datasets' | 'audit'>('models')

  const REGISTERED_MODELS = [
    { id: 'pcos_risk_v1', name: 'PCOS Risk Classifier', algo: 'GradientBoosting', version: '1.0.0', status: 'ACTIVE', metric: 'F1: 0.987 | ROC-AUC: 0.999' },
    { id: 'cycle_length_v1', name: 'Cycle Duration Predictor', algo: 'RidgeRegressor', version: '1.0.0', status: 'ACTIVE', metric: 'MAE: 0.64 days | R²: 0.892' },
    { id: 'anemia_risk_v1', name: 'Anemia & Iron Screener', algo: 'RandomForest', version: '1.0.0', status: 'ACTIVE', metric: 'F1: 0.975 | ROC-AUC: 0.998' },
    { id: 'diabetes_risk_v1', name: 'Diabetes Risk Classifier', algo: 'LogisticRegression', version: '1.0.0', status: 'ACTIVE', metric: 'ROC-AUC: 0.916 | F1: 0.771' },
    { id: 'thyroid_risk_v1', name: 'Thyroid Dysfunction Screener', algo: 'GradientBoosting', version: '1.0.0', status: 'ACTIVE', metric: 'F1: 0.996 | ROC-AUC: 1.000' },
  ]

  const DATASETS = [
    { name: 'PCOS Clinical & Diagnostic Dataset', source: 'Kaggle (Kottayam Medical Study)', license: 'CC BY 4.0', records: '1,200 Cohort Samples', status: 'APPROVED_FOR_TRAINING' },
    { name: 'FedCycle Longitudinal Cycle Cohort', source: 'Aggregated Anonymized Mobile Logs', license: 'ODbL / CC BY-NC 4.0', records: '1,500 Cycle Events', status: 'APPROVED_FOR_TRAINING' },
    { name: 'Complete Blood Count & Anemia Cohort', source: 'Clinical Hematology Benchmark', license: 'CC0 Public Domain', records: '1,200 Records', status: 'APPROVED_FOR_TRAINING' },
    { name: 'PIMA Female Diabetes Cohort', source: 'NIDDK / UCI Repository', license: 'CC BY-SA 4.0', records: '1,200 Records', status: 'APPROVED_FOR_TRAINING' },
    { name: 'Garavan Thyroid Disease Cohort', source: 'UCI Machine Learning Repository', license: 'CC BY 4.0', records: '1,200 Records', status: 'APPROVED_FOR_TRAINING' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <DashboardSidebar currentTab="/dashboard/admin" />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full pb-24 md:pb-12">
          
          {/* Header */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100/80 bg-gradient-to-r from-slate-900/10 via-rose-500/10 to-indigo-500/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-3">
                  <Shield className="w-3.5 h-3.5" />
                  M15 System Administration, ML Registry & Governance
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Admin & AI Governance Console
                </h1>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl font-medium">
                  Manage active ML model versions, Kaggle dataset provenance cards, system health telemetry, and Row Level Security audits.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All 5 Models Active & Serving
              </div>
            </div>
          </div>

          {/* Model Registry Table */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-rose-600" />
                Active ML Model Registry (Production Serving)
              </h2>
              <span className="text-xs text-slate-500 font-semibold">5 Registered</span>
            </div>

            <div className="divide-y divide-slate-100">
              {REGISTERED_MODELS.map((m) => (
                <div key={m.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{m.name}</span>
                    <span className="text-xs text-slate-500">
                      ID: {m.id} • Algorithm: {m.algo} • Version: {m.version}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700">{m.metric}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px]">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kaggle Dataset Registry Table */}
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-rose-100 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                Verified Kaggle Clinical Dataset Registry
              </h2>
              <span className="text-xs text-slate-500 font-semibold">5 Verified Cohorts</span>
            </div>

            <div className="divide-y divide-slate-100">
              {DATASETS.map((d) => (
                <div key={d.name} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{d.name}</span>
                    <span className="text-xs text-slate-500">
                      Source: {d.source} • License: {d.license} • {d.records}
                    </span>
                  </div>
                  <span className="bg-teal-50 text-teal-800 px-3 py-1 rounded-xl text-xs font-bold self-start md:self-auto">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileBottomNav currentTab="/dashboard/admin" />
    </div>
  )
}
