'use client'

import { usePathname } from 'next/navigation'
import { cn, ONBOARDING_STEPS } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ProgressIndicatorProps {
  currentStep?: number
  className?: string
}

export function ProgressIndicator({ currentStep: propStep, className }: ProgressIndicatorProps) {
  const pathname = usePathname()

  // Determine current step automatically from URL pathname or fallback to prop
  let stepFromPath = ONBOARDING_STEPS.findIndex((s) => pathname?.includes(s.path)) + 1
  if (stepFromPath < 1) stepFromPath = propStep || 1

  const activeStep = stepFromPath
  const totalSteps = ONBOARDING_STEPS.length
  const percentage = Math.round((activeStep / totalSteps) * 100)

  return (
    <div className={cn('w-full', className)}>
      {/* Step label */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs sm:text-sm font-bold text-slate-800">
          Step {activeStep} of {totalSteps}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-rose-700">
          {ONBOARDING_STEPS[activeStep - 1]?.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-rose-100/70 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-full transition-all duration-500 ease-out shadow-2xs"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="hidden md:flex items-center justify-between">
        {ONBOARDING_STEPS.map((step) => {
          const isCompleted = step.step < activeStep
          const isCurrent = step.step === activeStep
          const isFuture = step.step > activeStep

          return (
            <div key={step.step} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                  isCompleted && 'bg-rose-600 text-white shadow-2xs',
                  isCurrent && 'bg-rose-600 text-white ring-4 ring-rose-200/70 shadow-sm scale-110',
                  isFuture && 'bg-white border border-slate-200 text-slate-400'
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  step.step
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium transition-colors text-center',
                  isCurrent ? 'text-rose-950 font-bold' : isFuture ? 'text-slate-400' : 'text-slate-600 font-semibold'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
