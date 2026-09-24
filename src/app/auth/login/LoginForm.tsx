'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight, Sparkles, Heart, ShieldCheck } from 'lucide-react'
import { loginSchema, phoneSchema, type LoginFormData, type PhoneFormData } from '@/lib/validation/auth'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { OTPInput } from '@/components/auth/OTPInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type LoginTab = 'email' | 'phone'
type EmailSubMode = 'password' | 'otp'
type PhoneSubMode = 'otp' | 'password'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackError = searchParams.get('error')

  const [activeTab, setActiveTab] = useState<LoginTab>('email')
  const [emailMode, setEmailMode] = useState<EmailSubMode>('password')
  const [phoneMode, setPhoneMode] = useState<PhoneSubMode>('otp')

  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [authError, setAuthError] = useState<string | null>(null)

  // Email OTP state
  const [emailOtpStep, setEmailOtpStep] = useState<'email' | 'otp'>('email')
  const [emailOtpInput, setEmailOtpInput] = useState('')
  const [emailForOtp, setEmailForOtp] = useState('')
  const [emailResendTimer, setEmailResendTimer] = useState(0)

  // Phone OTP state
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneOtpValue, setPhoneOtpValue] = useState('')
  const [phoneResendTimer, setPhoneResendTimer] = useState(0)
  const [phoneWarning, setPhoneWarning] = useState<string | null>(null)

  const emailForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
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

  // 1. Password Login Submission (Email / Phone)
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

  // 4. Request Phone OTP for Login
  const handleSendPhoneOtp = (data: PhoneFormData) => {
    startTransition(async () => {
      setAuthError(null)
      setPhoneWarning(null)

      try {
        const res = await fetch('/api/auth/phone/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: data.phone }),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setAuthError(result.error || 'Failed to send mobile OTP.')
          return
        }

        if (result.warning) setPhoneWarning(result.warning)
        if (result.devOtp) setPhoneOtpValue(result.devOtp)

        setPhoneNumber(result.phone || data.phone)
        setPhoneStep('otp')
        startTimer(setPhoneResendTimer)
      } catch {
        setAuthError('Network error while requesting mobile OTP.')
      }
    })
  }

  // 5. Verify Phone OTP for Login
  const handleVerifyPhoneOtp = () => {
    startTransition(async () => {
      setAuthError(null)
      if (phoneOtpValue.length !== 6) {
        setAuthError('Please enter the complete 6-digit mobile OTP code.')
        return
      }

      try {
        const res = await fetch('/api/auth/phone/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneNumber, otp: phoneOtpValue }),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setAuthError(result.error || 'Invalid or expired mobile OTP code.')
          return
        }

        router.push(result.redirectTo || '/dashboard')
        router.refresh()
      } catch {
        setAuthError('Network error while verifying mobile OTP.')
      }
    })
  }

  return (
    <div className="min-h-screen gradient-mesh flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow shapes */}
      <div className="absolute top-12 left-1/3 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-12 right-1/3 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse-glow" />

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 mb-4 shadow-glow text-white">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your AstraCare AI account</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-rose-100 shadow-glow">

          {/* Callback Error */}
          {callbackError && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-700">
              Authentication failed. Please try again.
            </div>
          )}

          {/* Google OAuth */}
          <GoogleAuthButton mode="signin" />

          <Separator label="or sign in with" className="my-5" />

          {/* Primary Tabs: Email vs Phone */}
          <div className="flex rounded-2xl bg-slate-100/80 p-1 mb-5 border border-rose-100/50">
            {(['email', 'phone'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setAuthError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-rose-700 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                {tab === 'email' ? 'Email' : 'Phone'}
              </button>
            ))}
          </div>

          {/* TAB 1: EMAIL LOGIN */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3 mb-3">
                <span className="text-slate-500 font-medium">Email Sign In Method:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setEmailMode('password'); setAuthError(null); }}
                    className={`px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                      emailMode === 'password'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmailMode('otp'); setAuthError(null); }}
                    className={`px-3 py-1 rounded-lg transition-all font-bold flex items-center gap-1 cursor-pointer ${
                      emailMode === 'otp'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-rose-600" /> Login by OTP
                  </button>
                </div>
              </div>

              {/* Password Login */}
              {emailMode === 'password' && (
                <form onSubmit={emailForm.handleSubmit(handlePasswordLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" required>Email address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="rounded-xl bg-white/70"
                      error={emailForm.formState.errors.email?.message}
                      {...emailForm.register('email')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password" required>Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="pr-10 rounded-xl bg-white/70"
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

                  <Button type="submit" loading={isPending} className="w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 text-white shadow-glow cursor-pointer" size="lg">
                    Sign in with Password <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}

              {/* Email OTP Login */}
              {emailMode === 'otp' && (
                <div className="space-y-4">
                  {emailOtpStep === 'email' ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email-otp-input" required>Email address</Label>
                        <Input
                          id="email-otp-input"
                          type="email"
                          placeholder="you@example.com"
                          className="rounded-xl bg-white/70"
                          value={emailForOtp}
                          onChange={(e) => setEmailForOtp(e.target.value)}
                        />
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
                        Send Email OTP <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-2">
                          <ShieldCheck className="w-3.5 h-3.5" /> Instant Email Verification
                        </div>

                        <p className="text-sm text-slate-600">OTP sent to <span className="font-bold text-slate-900">{emailForOtp}</span></p>
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
                        Verify Email OTP & Sign In
                      </Button>

                      <div className="text-center">
                        {emailResendTimer > 0 ? (
                          <p className="text-xs text-slate-500">Resend code in <strong className="text-rose-600">{emailResendTimer}s</strong></p>
                        ) : (
                          <button
                            onClick={() => handleSendEmailOtp(emailForOtp)}
                            className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Resend Email OTP
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PHONE LOGIN */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3 mb-3">
                <span className="text-slate-500 font-medium">Mobile Sign In Method:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setPhoneMode('otp'); setAuthError(null); }}
                    className={`px-3 py-1 rounded-lg transition-all font-bold flex items-center gap-1 cursor-pointer ${
                      phoneMode === 'otp'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-rose-600" /> Login by OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhoneMode('password'); setAuthError(null); }}
                    className={`px-3 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                      phoneMode === 'password'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Password
                  </button>
                </div>
              </div>

              {/* Phone OTP Login */}
              {phoneMode === 'otp' && (
                <div className="space-y-4">
                  {phoneStep === 'phone' ? (
                    <form onSubmit={phoneForm.handleSubmit(handleSendPhoneOtp)} className="space-y-4">
                      <div>
                        <Label htmlFor="login-phone" required>Mobile number</Label>
                        <Input
                          id="login-phone"
                          type="tel"
                          inputMode="numeric"
                          placeholder="+91 9876543210"
                          className="rounded-xl bg-white/70"
                          error={phoneForm.formState.errors.phone?.message}
                          {...phoneForm.register('phone')}
                        />
                      </div>

                      {authError && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100 text-center">
                          {authError}
                        </div>
                      )}

                      <Button type="submit" loading={isPending} className="w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-glow cursor-pointer" size="lg">
                        Send Mobile OTP <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-5">
                      <div className="text-center">
                        <p className="text-sm text-slate-600">OTP sent to <span className="font-bold text-slate-900">{phoneNumber}</span></p>
                        <button
                          onClick={() => { setPhoneStep('phone'); setPhoneOtpValue(''); setPhoneWarning(null); }}
                          className="text-xs text-rose-600 hover:underline mt-1 font-bold cursor-pointer"
                        >
                          Change Number
                        </button>
                      </div>

                      {phoneWarning && (
                        <div className="p-3 rounded-2xl bg-amber-50 text-xs text-amber-800 border border-amber-200 text-center leading-relaxed">
                          ⚠️ {phoneWarning}
                        </div>
                      )}

                      <OTPInput
                        value={phoneOtpValue}
                        onChange={setPhoneOtpValue}
                        disabled={isPending}
                        error={authError ?? undefined}
                      />

                      <Button
                        onClick={handleVerifyPhoneOtp}
                        loading={isPending}
                        className="w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-glow cursor-pointer"
                        size="lg"
                      >
                        Verify Mobile OTP & Sign In
                      </Button>

                      <div className="text-center">
                        {phoneResendTimer > 0 ? (
                          <p className="text-xs text-slate-500">Resend code in <strong className="text-rose-600">{phoneResendTimer}s</strong></p>
                        ) : (
                          <button
                            onClick={() => phoneForm.handleSubmit(handleSendPhoneOtp)()}
                            className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Resend Mobile OTP
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Phone/Password Login */}
              {phoneMode === 'password' && (
                <form onSubmit={emailForm.handleSubmit(handlePasswordLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="phone-login-identifier" required>Email or Phone Number</Label>
                    <Input
                      id="phone-login-identifier"
                      type="text"
                      placeholder="you@example.com or +919876543210"
                      className="rounded-xl bg-white/70"
                      error={emailForm.formState.errors.email?.message}
                      {...emailForm.register('email')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone-login-password" required>Password</Label>
                    <div className="relative">
                      <Input
                        id="phone-login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pr-10 rounded-xl bg-white/70"
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

                  <Button type="submit" loading={isPending} className="w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-glow cursor-pointer" size="lg">
                    Sign in with Password <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
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
