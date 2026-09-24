'use client'

import React, { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
}

export function OTPInput({ length = 6, value, onChange, disabled, error }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const digits = value.split('').slice(0, length)
  while (digits.length < length) digits.push('')

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) {
      // Handle backspace
      const newDigits = [...digits]
      newDigits[index] = ''
      onChange(newDigits.join(''))
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      return
    }

    const char = val[val.length - 1]
    const newDigits = [...digits]
    newDigits[index] = char
    onChange(newDigits.join(''))

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted.padEnd(length, '').slice(0, length))
      const lastFilledIndex = Math.min(pasted.length - 1, length - 1)
      inputRefs.current[lastFilledIndex]?.focus()
    }
  }

  return (
    <div>
      <div className="flex gap-3 justify-center" aria-label="OTP Input">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            aria-label={`OTP digit ${index + 1}`}
            className={cn(
              'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none',
              'text-slate-900 bg-white transition-all duration-150',
              digit
                ? 'border-brand-400 bg-brand-50'
                : 'border-slate-200 focus:border-brand-500',
              'focus:ring-2 focus:ring-brand-100',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}
