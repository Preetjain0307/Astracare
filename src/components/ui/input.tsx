'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full h-11 rounded-xl border bg-white px-4 py-2.5',
            'text-sm text-slate-900 placeholder:text-slate-400',
            'transition-all duration-150 outline-none',
            'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
