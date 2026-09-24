'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, CheckCircle2 } from 'lucide-react'

export default function VerifyPhonePage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center glass-card rounded-3xl p-8 border border-rose-100 shadow-glow">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 mb-2">Email Verification Active</h1>
        <p className="text-xs text-slate-500">
          Mobile verification is bypassed. Redirecting to your dashboard...
        </p>
      </div>
    </div>
  )
}
