'use client'

import { useState, useEffect, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react'
import { OTPInput } from '@/components/auth/OTPInput'
import { Button } from '@/components/ui/button'

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailParam)
  const [otp, setOtp] = useState('')
  const [isPending, startTransition] = useTransition()
  const [resending, setResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(
    emailParam ? `We've sent a 6-digit verification code to ${emailParam}` : null
  )
  const [isVerified, setIsVerified] = useState(false)

  // Fetch current user details if email query param not present
  useEffect(() => {
    if (!emailParam) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.email) {
            setEmail(data.user.email)
            if (data.user.emailVerified) {
              setIsVerified(true)
            }
          }
        })
        .catch(() => {})
    }
  }, [emailParam])

  // Timer countdown logic
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.')
      return
    }

    startTransition(async () => {
      setError(null)
      setInfoMessage(null)

      try {
        const res = await fetch('/api/auth/email/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        })

        const data = await res.json()

        if (!res.ok || data.error) {
          setError(data.error || 'Invalid or expired verification code.')
          return
        }

        setIsVerified(true)
        setTimeout(() => {
          router.push(data.redirectTo || '/auth/verify-phone')
          router.refresh()
        }, 1200)
      } catch {
        setError('Network error occurred. Please check your internet connection.')
      }
    })
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0 || resending) return
    setResending(true)
    setError(null)
    setInfoMessage(null)

    try {
      const res = await fetch('/api/auth/email/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Failed to resend verification code.')
        setResending(false)
        return
      }

      setInfoMessage(`A new 6-digit verification code was sent to ${email}`)
      setResendTimer(60)
    } catch {
      setError('Network error occurred while requesting resend.')
    } finally {
      setResending(false)
    }
  }

  if (isVerified) {
    return (
      <div className="w-full max-w-md text-center animate-fade-in bg-white rounded-3xl p-8 border border-rose-100 shadow-[0_10px_30px_rgba(225,29,72,0.08)]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
        <p className="text-sm text-slate-600 mb-6">Your email address has been successfully confirmed.</p>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-600 bg-brand-50 px-4 py-2 rounded-full">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Next step: Mobile Verification...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-rose-100 p-8 space-y-6">
      <div className="text-center">
        <p className="text-sm text-slate-600">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="text-sm font-semibold text-slate-900 mt-0.5 break-all">
          {email || 'your email address'}
        </p>
      </div>

      {infoMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-xs text-emerald-800 border border-emerald-100 text-center leading-relaxed">
          {infoMessage}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100 text-center leading-relaxed flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* OTP Input */}
      <div className="py-2">
        <OTPInput
          value={otp}
          onChange={(val) => {
            setOtp(val)
            setError(null)
          }}
          disabled={isPending}
          error={error ?? undefined}
        />
      </div>

      <Button
        onClick={handleVerify}
        loading={isPending}
        className="w-full h-12 text-base font-semibold rounded-2xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-700 hover:to-rose-700 text-white shadow-md transition-all"
      >
        Verify Email <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {/* Resend Section */}
      <div className="text-center border-t border-slate-100 pt-5">
        <p className="text-xs text-slate-500 mb-2">Didn&apos;t receive the code?</p>
        {resendTimer > 0 ? (
          <p className="text-xs font-medium text-slate-400">
            Resend available in <span className="text-brand-600 font-bold">{resendTimer}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-all"
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-rose-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 mb-3 shadow-lg text-white">
            <Mail className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
          <p className="text-sm text-slate-500 mt-1">Step 1 of 2 — AstraCare Dual Verification</p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-3xl p-8 text-center text-sm text-slate-500">Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>

        <p className="text-center text-xs text-slate-400 mt-6">
          Need help? Contact <Link href="#" className="underline hover:text-slate-600">AstraCare Support</Link>
        </p>
      </div>
    </div>
  )
}
