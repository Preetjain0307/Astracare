import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function calculateAge(dob: string | Date | null | undefined): number | null {
  if (!dob) return null
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function calculateBMI(
  heightCm: number | null | undefined,
  weightKg: number | null | undefined
): number | null {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function getBMICategory(bmi: number | null): string {
  if (bmi === null) return ''
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function getOnboardingStepPath(step: number): string {
  const paths: Record<number, string> = {
    1: '/onboarding/goals',
    2: '/onboarding/basic-information',
    3: '/onboarding/medical-history',
    4: '/onboarding/smart-band',
    5: '/onboarding/ai-preferences',
    6: '/onboarding/goal-questions',
    7: '/onboarding/review',
  }
  return paths[step] ?? '/onboarding/goals'
}

export const ONBOARDING_STEPS = [
  { step: 1, label: 'Health Goals', path: '/onboarding/goals' },
  { step: 2, label: 'Basic Info', path: '/onboarding/basic-information' },
  { step: 3, label: 'Medical History', path: '/onboarding/medical-history' },
  { step: 4, label: 'Smart Band', path: '/onboarding/smart-band' },
  { step: 5, label: 'AI Preferences', path: '/onboarding/ai-preferences' },
  { step: 6, label: 'Essential Questions', path: '/onboarding/goal-questions' },
  { step: 7, label: 'Review', path: '/onboarding/review' },
]

