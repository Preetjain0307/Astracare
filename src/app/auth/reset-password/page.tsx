'use client'

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle2, Lock, ArrowRight, ArrowLeft } from 'lucide-react'
import { OTPInput } from '@/components/auth/OTPInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailParam)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please provide your email address.')
      return
    }
    if (otp.length !== 6) {
      setError('Please enter the 6-digit security code sent to your email.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    startTransition(async () => {
      setError(null)
      try {
        const res = await fetch('/api/auth/password-reset/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setError(result.error || 'Failed to reset password.')
          return
        }

        setSuccess(true)
        setTimeout(() => router.push('/auth/login'), 2500)
      } catch {
        setError('Network error occurred.')
      }
    })
  }

  if (success) {
    return (
      <div className="text-center animate-fade-in bg-white rounded-3xl p-8 border border-rose-100 shadow-[0_10px_30px_rgba(225,29,72,0.08)]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Updated!</h2>
        <p className="text-sm text-slate-600 mb-6">Your password has been successfully reset.</p>
        <p className="text-xs text-brand-600 font-semibold animate-pulse">
          Redirecting to Sign In...
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-rose-100 p-8">
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <Label htmlFor="reset-email" required>Email address</Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <div>
          <Label required>6-Digit Reset Code</Label>
          <div className="py-2">
            <OTPInput value={otp} onChange={setOtp} disabled={isPending} />
          </div>
        </div>

        <div>
          <Label htmlFor="new-password" required>New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-10 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm-password" required>Confirm Password</Label>
          <Input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-xl"
          />
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100 text-center">
            {error}
          </div>
        )}

        <Button type="submit" loading={isPending} className="w-full h-12 rounded-2xl font-semibold bg-gradient-to-r from-brand-600 to-rose-600 text-white" size="lg">
          Reset Password <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-rose-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 mb-3 shadow-lg text-white">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Set new password</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your 6-digit reset code and new password</p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-3xl p-8 text-center text-sm text-slate-500">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="text-center mt-6">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
