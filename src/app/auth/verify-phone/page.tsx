'use client'

import { useState, useEffect, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Phone, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, Edit2 } from 'lucide-react'
import { OTPInput } from '@/components/auth/OTPInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function VerifyPhoneForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneParam = searchParams.get('phone') || ''

  const [phone, setPhone] = useState(phoneParam)
  const [isEditingPhone, setIsEditingPhone] = useState(!phoneParam)
  const [otp, setOtp] = useState('')
  const [isPending, startTransition] = useTransition()
  const [resending, setResending] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [error, setError] = useState<string | null>(null)
  const [devOtpMessage, setDevOtpMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(
    phoneParam ? `We've sent a 6-digit verification code to ${phoneParam}` : null
  )
  const [isVerified, setIsVerified] = useState(false)

  // Fetch current user profile if phone not provided in params
  useEffect(() => {
    if (!phoneParam) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.phone) {
            setPhone(data.user.phone)
            setIsEditingPhone(false)
            setInfoMessage(`We've sent a 6-digit verification code to ${data.user.phone}`)
            if (data.user.phoneVerified) {
              setIsVerified(true)
            }
          }
        })
        .catch(() => {})
    }
  }, [phoneParam])

  // Timer countdown logic
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleSendOtp = () => {
    if (!phone.trim()) {
      setError('Please enter a valid mobile number.')
      return
    }

    startTransition(async () => {
      setError(null)
      setInfoMessage(null)
      setDevOtpMessage(null)

      try {
        const res = await fetch('/api/auth/phone/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        })

        const data = await res.json()

        if (!res.ok || data.error) {
          setError(data.error || 'Failed to send OTP to mobile number.')
          return
        }

        if (data.phone) setPhone(data.phone)
        if (data.devOtp) {
          setDevOtpMessage(`[Dev Mode Code: ${data.devOtp}]`)
          setOtp(data.devOtp)
        }

        setIsEditingPhone(false)
        setInfoMessage(`Verification code sent to ${data.phone || phone}`)
        setResendTimer(60)
      } catch {
        setError('Network error occurred while requesting OTP.')
      }
    })
  }

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.')
      return
    }

    startTransition(async () => {
      setError(null)
      setInfoMessage(null)

      try {
        const res = await fetch('/api/auth/phone/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, otp }),
        })

        const data = await res.json()

        if (!res.ok || data.error) {
          setError(data.error || 'Invalid or expired OTP code.')
          return
        }

        setIsVerified(true)
        setTimeout(() => {
          router.push(data.redirectTo || '/onboarding')
          router.refresh()
        }, 1200)
      } catch {
        setError('Network error occurred during verification.')
      }
    })
  }

  if (isVerified) {
    return (
      <div className="w-full max-w-md text-center animate-fade-in bg-white rounded-3xl p-8 border border-rose-100 shadow-[0_10px_30px_rgba(225,29,72,0.08)]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Fully Verified!</h2>
        <p className="text-sm text-slate-600 mb-6">Dual verification (Email + Mobile) is complete.</p>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-600 bg-brand-50 px-4 py-2 rounded-full">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Transitioning to AstraCare Onboarding...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-rose-100 p-8 space-y-6">
      {isEditingPhone ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone-input" required>Mobile Number</Label>
            <Input
              id="phone-input"
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-2xl"
            />
          </div>
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-xs text-rose-700 border border-rose-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Button onClick={handleSendOtp} loading={isPending} className="w-full h-12 rounded-2xl">
            Send OTP
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center">
            <p className="text-sm text-slate-600">We&apos;ve sent a 6-digit verification code to</p>
            <div className="inline-flex items-center gap-2 mt-1 font-semibold text-slate-900">
              <span>{phone}</span>
              <button
                type="button"
                onClick={() => {
                  setIsEditingPhone(true)
                  setError(null)
                }}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1 bg-brand-50 px-2 py-0.5 rounded-md"
              >
                <Edit2 className="w-3 h-3" /> Change Number
              </button>
            </div>
          </div>

          {infoMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-xs text-emerald-800 border border-emerald-100 text-center leading-relaxed">
              {infoMessage} {devOtpMessage && <span className="font-mono font-bold block mt-1">{devOtpMessage}</span>}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100 text-center leading-relaxed flex items-center justify-center gap-2">
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
            Verify Mobile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Resend Section */}
          <div className="text-center border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-500 mb-2">Didn&apos;t receive the SMS?</p>
            {resendTimer > 0 ? (
              <p className="text-xs font-medium text-slate-400">
                Resend available in <span className="text-brand-600 font-bold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={resending}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-all"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function VerifyPhonePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-rose-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 mb-3 shadow-lg text-white">
            <Phone className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify your mobile number</h1>
          <p className="text-sm text-slate-500 mt-1">Step 2 of 2 — AstraCare Dual Verification</p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-3xl p-8 text-center text-sm text-slate-500">Loading...</div>}>
          <VerifyPhoneForm />
        </Suspense>

        <p className="text-center text-xs text-slate-400 mt-6">
          Need help? Contact <Link href="#" className="underline hover:text-slate-600">AstraCare Support</Link>
        </p>
      </div>
    </div>
  )
}
