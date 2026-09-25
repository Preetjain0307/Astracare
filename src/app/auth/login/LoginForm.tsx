'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Heart,
  ShieldCheck,
  User,
  Stethoscope,
  Shield,
  Zap,
} from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validation/auth'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { OTPInput } from '@/components/auth/OTPInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type EmailSubMode = 'password' | 'otp'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackError = searchParams.get('error')

  const [emailMode, setEmailMode] = useState<EmailSubMode>('password')
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [authError, setAuthError] = useState<string | null>(null)
  const [demoLoadingRole, setDemoLoadingRole] = useState<string | null>(null)

  // Email OTP state
  const [emailOtpStep, setEmailOtpStep] = useState<'email' | 'otp'>('email')
  const [emailOtpInput, setEmailOtpInput] = useState('')
  const [emailForOtp, setEmailForOtp] = useState('')
  const [emailResendTimer, setEmailResendTimer] = useState(0)

  const emailForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const startTimer = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(60)
    const interval = setInterval(() => {
      setter((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 1. Password Login Submission
  const handlePasswordLogin = (data: LoginFormData) => {
    startTransition(async () => {
      setAuthError(null)

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setAuthError(result.error || 'Invalid login credentials. Please try again.')
          return
        }

        router.push(result.redirectTo || '/dashboard')
        router.refresh()
      } catch {
        setAuthError('Network error occurred during login.')
      }
    })
  }

  // 2. Request Email OTP for Login
  const handleSendEmailOtp = (targetEmail: string) => {
    if (!targetEmail || !targetEmail.includes('@')) {
      setAuthError('Please enter a valid email address.')
      return
    }

    startTransition(async () => {
      setAuthError(null)

      try {
        const res = await fetch('/api/auth/email/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: targetEmail }),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setAuthError(result.error || 'Failed to send email verification code.')
          return
        }

        setEmailForOtp(targetEmail)
        setEmailOtpStep('otp')
        startTimer(setEmailResendTimer)
      } catch {
        setAuthError('Network error while requesting email OTP.')
      }
    })
  }

  // 3. Verify Email OTP for Login
  const handleVerifyEmailOtp = () => {
    if (emailOtpInput.length !== 6) {
      setAuthError('Please enter the complete 6-digit OTP code.')
      return
    }

    startTransition(async () => {
      setAuthError(null)

      try {
        const res = await fetch('/api/auth/email/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailForOtp, otp: emailOtpInput }),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setAuthError(result.error || 'Invalid or expired verification code.')
          return
        }

        router.push(result.redirectTo || '/dashboard')
        router.refresh()
      } catch {
        setAuthError('Network error while verifying email OTP.')
      }
    })
  }

  // 4. One-Click Instant Mock Demo Login
  const handleDemoLogin = async (role: 'patient' | 'doctor' | 'admin') => {
    setDemoLoadingRole(role)
    setAuthError(null)

    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setAuthError(data.error || 'Failed to initialize demo login.')
        setDemoLoadingRole(null)
        return
      }

      router.push(data.redirectTo || '/dashboard')
      router.refresh()
    } catch {
      setAuthError('Network error during demo initialization.')
      setDemoLoadingRole(null)
    }
  }

  return (
    <div className="min-h-screen gradient-mesh flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-12 left-1/3 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-12 right-1/3 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse-glow" />

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 mb-3 shadow-glow text-white">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-0.5">Sign in to your AstraCare AI account</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-glow space-y-5">
          {/* Callback Error */}
          {callbackError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-700">
              Authentication failed. Please try again.
            </div>
          )}

          {/* ⚡ ONE-CLICK INSTANT DEMO LOGIN PANEL */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-rose-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                Instant Demo Access (Mock Data)
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-rose-100">
                1-Click
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('patient')}
                disabled={!!demoLoadingRole || isPending}
                className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200/80 text-center transition-all cursor-pointer shadow-xs hover:border-rose-400 group disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-800 block leading-tight">Patient</span>
                <span className="text-[9px] text-slate-500 block">Elena (Age 26)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('doctor')}
                disabled={!!demoLoadingRole || isPending}
                className="p-2.5 rounded-xl bg-white hover:bg-teal-50 border border-teal-200/80 text-center transition-all cursor-pointer shadow-xs hover:border-teal-400 group disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-800 block leading-tight">Doctor</span>
                <span className="text-[9px] text-slate-500 block">Dr. Sarah (MD)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={!!demoLoadingRole || isPending}
                className="p-2.5 rounded-xl bg-white hover:bg-purple-50 border border-purple-200/80 text-center transition-all cursor-pointer shadow-xs hover:border-purple-400 group disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-1 group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-800 block leading-tight">Admin</span>
                <span className="text-[9px] text-slate-500 block">ML Registry</span>
              </button>
            </div>
            {demoLoadingRole && (
              <p className="text-[11px] text-rose-600 font-bold text-center animate-pulse">
                Initializing {demoLoadingRole.toUpperCase()} demo session with live health metrics...
              </p>
            )}
          </div>

          <Separator label="or sign in with standard account" className="my-2" />

          {/* Google OAuth */}
          <GoogleAuthButton mode="signin" />

          {/* Mode Switch: Password vs OTP */}
          <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3 mb-4">
            <span className="text-slate-500 font-medium">Sign In Method:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setEmailMode('password'); setAuthError(null); }}
                className={`px-3 py-1 rounded-xl transition-all font-bold cursor-pointer ${
                  emailMode === 'password'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => { setEmailMode('otp'); setAuthError(null); }}
                className={`px-3 py-1 rounded-xl transition-all font-bold flex items-center gap-1 cursor-pointer ${
                  emailMode === 'otp'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-rose-600" /> Login by Email OTP
              </button>
            </div>
          </div>

          {/* Mode 1: Password Login */}
          {emailMode === 'password' && (
            <form onSubmit={emailForm.handleSubmit(handlePasswordLogin)} className="space-y-4">
              <div>
                <Label htmlFor="login-email" required>Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="pl-10 rounded-xl bg-white/70"
                    error={emailForm.formState.errors.email?.message}
                    {...emailForm.register('email')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-password" required>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="pl-10 pr-10 rounded-xl bg-white/70"
                    error={emailForm.formState.errors.password?.message}
                    {...emailForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-xs text-rose-600 hover:text-rose-700 font-bold">
                  Forgot password?
                </Link>
              </div>

              {authError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100 text-center">
                  {authError}
                </div>
              )}

              <Button
                type="submit"
                loading={isPending}
                className="w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 text-white shadow-glow cursor-pointer"
                size="lg"
              >
                Sign in with Password <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Mode 2: Email OTP Login */}
          {emailMode === 'otp' && (
            <div className="space-y-4">
              {emailOtpStep === 'email' ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email-otp-input" required>Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="email-otp-input"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 rounded-xl bg-white/70"
                        value={emailForOtp}
                        onChange={(e) => setEmailForOtp(e.target.value)}
                      />
                    </div>
                  </div>

                  {authError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100 text-center">
                      {authError}
                    </div>
                  )}

                  <Button
                    onClick={() => handleSendEmailOtp(emailForOtp)}
                    loading={isPending}
                    className="w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-glow cursor-pointer"
                    size="lg"
                  >
                    Send Verification Code <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> Instant Email Verification
                    </div>
                    <p className="text-sm text-slate-600">
                      Code sent to <span className="font-bold text-slate-900">{emailForOtp}</span>
                    </p>
                    <button
                      onClick={() => { setEmailOtpStep('email'); setEmailOtpInput(''); setAuthError(null); }}
                      className="text-xs text-rose-600 hover:underline mt-1 font-bold cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>

                  {authError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100 text-center">
                      {authError}
                    </div>
                  )}

                  <OTPInput
                    value={emailOtpInput}
                    onChange={setEmailOtpInput}
                    disabled={isPending}
                    error={authError ?? undefined}
                  />

                  <Button
                    onClick={handleVerifyEmailOtp}
                    loading={isPending}
                    className="w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-glow cursor-pointer"
                    size="lg"
                  >
                    Verify Code & Sign In
                  </Button>

                  <div className="text-center">
                    {emailResendTimer > 0 ? (
                      <p className="text-xs text-slate-500">
                        Resend code in <strong className="text-rose-600">{emailResendTimer}s</strong>
                      </p>
                    ) : (
                      <button
                        onClick={() => handleSendEmailOtp(emailForOtp)}
                        className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                      >
                        Resend Verification Code
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-rose-600 font-bold hover:text-rose-700">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
