import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator'
import { ONBOARDING_STEPS } from '@/lib/utils'
import { Sparkles, Heart } from 'lucide-react'

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const demoCookie = cookieStore.get('astracare_demo_user')?.value

  let demoPersona: any = null
  if (demoCookie) {
    try {
      demoPersona = JSON.parse(demoCookie)
    } catch {
      demoPersona = { role: 'patient', fullName: 'Elena Rostova', email: 'demo.patient@astracare.ai' }
    }
  }

  let user: any = null
  let currentStep = 1
  let questionnaire: any = { completed: false, current_step: 1 }

  if (demoPersona) {
    user = { id: demoPersona.id || 'demo-patient-uuid-001', email: demoPersona.email }
  } else {
    try {
      const supabase = await createClient()
      const userPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { user: null } }), 1000))
      const authRes: any = await Promise.race([userPromise, timeoutPromise])
      user = authRes?.data?.user

      if (user) {
        const { data: qData } = await supabase
          .from('health_questionnaire')
          .select('current_step, completed')
          .eq('user_id', user.id)
          .maybeSingle()
        if (qData) {
          questionnaire = qData
          currentStep = qData.current_step ?? 1
        }
      }
    } catch (e) {
      console.warn('[Onboarding Supabase Auth Notice]', e)
    }
  }

  if (!user && !demoPersona) redirect('/auth/login')


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/40 to-rose-50/60 font-sans text-slate-800">
      {/* Top nav header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center shadow-xs">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm tracking-tight">AstraCare AI</span>
                <span className="text-[10px] text-rose-600 font-semibold block -mt-0.5">Women's Health</span>
              </div>
            </div>
            <div className="text-xs text-rose-700 font-semibold bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
              Personalized Setup
            </div>
          </div>

          <ProgressIndicator currentStep={currentStep} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Welcome back resume notification */}
        {currentStep > 1 && questionnaire?.completed === false && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center gap-3 shadow-2xs animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-950">Welcome back!</p>
              <p className="text-xs text-rose-700">
                Your setup progress is saved. You are {Math.round(((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100)}% complete.
              </p>
            </div>
          </div>
        )}

        {children}
      </main>
    </div>
  )
}
