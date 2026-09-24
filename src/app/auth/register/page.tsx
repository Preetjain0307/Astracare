'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, User, Mail, Phone, Lock, ArrowRight, CheckCircle2, Heart, ShieldCheck } from 'lucide-react'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { OTPInput } from '@/components/auth/OTPInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { z } from 'zod'

const fullRegisterSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^\+?[1-9]\d{9,14}$/.test(val), {
        message: 'Please enter a valid phone number (e.g. 9876543210 or +919876543210)',
      }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FullRegisterFormData = z.infer<typeof fullRegisterSchema>

type FlowStep = 'FORM' | 'EMAIL_OTP' | 'SUCCESS'

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<FlowStep>('FORM')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [authError, setAuthError] = useState<string | null>(null)
  const [devMessage, setDevMessage] = useState<string | null>(null)

  // Registration data state
  const [userData, setUserData] = useState<{ email: string; phone: string; fullName: string }>({
    email: '',
    phone: '',
    fullName: '',
  })

  // OTP States
  const [emailOtp, setEmailOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(60)

  const form = useForm<FullRegisterFormData>({
    resolver: zodResolver(fullRegisterSchema),
    mode: 'onChange',
  })

  const watchPassword = form.watch('password', '')

  const startTimer = () => {
    setResendTimer(60)
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle step 1: Registration Form submission
  const handleRegisterSubmit = (data: FullRegisterFormData) => {
    startTransition(async () => {
      setAuthError(null)
      setDevMessage(null)

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setAuthError(result.error || 'Failed to create account. Please check your details.')
          return
        }

        if (result.warning && result.devOtp) {
          setDevMessage(`[Dev Mode Email Code: ${result.devOtp}]`)
          setEmailOtp(result.devOtp)
        }

        setUserData({
          email: result.email || data.email,
          phone: result.phone || data.phone || '',
          fullName: data.fullName,
        })
        setStep('EMAIL_OTP')
        startTimer()
      } catch {
        setAuthError('Network error occurred during registration. Please try again.')
      }
    })
  }

  // Handle step 2: Email OTP verification & completion
  const handleVerifyEmailOtp = () => {
    if (emailOtp.length !== 6) {
      setAuthError('Please enter the full 6-digit email verification code.')
      return
    }

    startTransition(async () => {
      setAuthError(null)
      setDevMessage(null)

      try {
        const res = await fetch('/api/auth/email/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userData.email, otp: emailOtp }),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setAuthError(result.error || 'Invalid email verification code.')
          return
        }

        setStep('SUCCESS')
        setTimeout(() => {
          router.push(result.redirectTo || '/onboarding')
          router.refresh()
        }, 1500)
      } catch {
        setAuthError('Network error during email verification.')
      }
    })
  }

  if (step === 'SUCCESS') {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center animate-fade-up glass-card rounded-3xl p-8 shadow-glow-lg border border-rose-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm animate-float">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Registration Complete!</h2>
          <p className="text-sm text-slate-600 mb-6">Email verification successful.</p>
          <p className="text-xs text-rose-600 font-semibold animate-pulse">

            Redirecting to AstraCare AI Onboarding...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-mesh flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glow shapes */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse-glow" />

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-800 mb-3 shadow-glow text-white">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your AstraCare account</h1>
          <p className="text-sm text-slate-500 mt-1">AI-based Women&apos;s Health & Predictive Healthcare</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 px-8">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 'FORM' ? 'bg-rose-600 text-white shadow-sm' : 'bg-emerald-500 text-white'}`}>
              {step !== 'FORM' ? '✓' : '1'}
            </div>
            <span className="text-xs font-bold text-slate-700">Account Details</span>
          </div>
          <div className="h-0.5 flex-1 mx-4 bg-rose-200/60" />
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 'EMAIL_OTP' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
              2
            </div>
            <span className="text-xs font-bold text-slate-700">Email OTP</span>
          </div>
        </div>

        {/* Main Glass Card */}
        <div className="glass-card rounded-3xl p-8 space-y-5 border border-rose-100 shadow-glow">
          {step === 'FORM' && (
            <>
              <GoogleAuthButton mode="signup" />
              <Separator label="or register with credentials" className="my-4" />

              <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="reg-fullname" required>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input id="reg-fullname" placeholder="Jane Doe" className="pl-10 rounded-xl bg-white/70"
                      error={form.formState.errors.fullName?.message}
                      {...form.register('fullName')} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reg-email" required>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input id="reg-email" type="email" placeholder="you@example.com" className="pl-10 rounded-xl bg-white/70"
                      error={form.formState.errors.email?.message}
                      {...form.register('email')} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reg-phone">Mobile Number <span className="text-slate-400 text-xs font-normal">(Optional)</span></Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input id="reg-phone" type="tel" placeholder="+91 9876543210" className="pl-10 rounded-xl bg-white/70"
                      error={form.formState.errors.phone?.message}
                      {...form.register('phone')} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reg-password" required>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input id="reg-password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" className="pl-10 pr-10 rounded-xl bg-white/70"
                      error={form.formState.errors.password?.message}
                      {...form.register('password')} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {watchPassword && (
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      {passwordRules.map((rule) => (
                        <div key={rule.label} className={`flex items-center gap-1 text-xs ${rule.test(watchPassword) ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${rule.test(watchPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="reg-confirm" required>Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input id="reg-confirm" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" className="pl-10 pr-10 rounded-xl bg-white/70"
                      error={form.formState.errors.confirmPassword?.message}
                      {...form.register('confirmPassword')} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100 text-center">{authError}</div>
                )}

                <Button type="submit" loading={isPending} className="w-full h-12 text-base font-extrabold rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-glow cursor-pointer">
                  Continue to Verification <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </>
          )}

          {step === 'EMAIL_OTP' && (
            <div className="space-y-6 text-center animate-fade-in">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> Instant Email Verification
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">Verify your email address</h3>
                <p className="text-xs text-slate-500 mt-1">We sent a 6-digit code to <span className="font-bold text-slate-800">{userData.email}</span></p>
              </div>

              {devMessage && (
                <div className="p-3 rounded-xl bg-amber-50 text-xs text-amber-800 border border-amber-200 font-mono">
                  {devMessage}
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100">{authError}</div>
              )}

              <OTPInput value={emailOtp} onChange={(v) => { setEmailOtp(v); setAuthError(null); }} disabled={isPending} />

              <Button onClick={handleVerifyEmailOtp} loading={isPending} className="w-full h-12 text-base font-extrabold rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 text-white shadow-glow cursor-pointer">
                Verify Email & Finish <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="text-xs text-slate-400">
                {resendTimer > 0 ? (
                  <span>Resend available in <strong className="text-rose-600">{resendTimer}s</strong></span>
                ) : (
                  <button onClick={() => { handleRegisterSubmit(form.getValues()) }} className="text-rose-600 font-bold hover:underline cursor-pointer">Resend Code</button>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-rose-600 font-bold hover:text-rose-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
