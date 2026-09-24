'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validation/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const handleSubmit = (data: ForgotPasswordFormData) => {
    startTransition(async () => {
      setError(null)
      try {
        const res = await fetch('/api/auth/password-reset/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email }),
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          setError(result.error || 'Failed to process request.')
          return
        }

        // Navigate to reset password page with email
        router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`)
      } catch {
        setError('Network error occurred.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 mb-4">
            <Mail className="w-6 h-6 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your email to receive a 6-digit reset code</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-rose-100 p-8">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="forgot-email" required>Email address</Label>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="rounded-xl"
                error={form.formState.errors.email?.message}
                {...form.register('email')}
              />
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 text-xs text-rose-700 border border-rose-100">{error}</div>
            )}

            <Button type="submit" loading={isPending} className="w-full h-12 rounded-2xl font-semibold bg-gradient-to-r from-brand-600 to-rose-600 text-white" size="lg">
              Send Reset Code <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
