'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3',
            'text-sm text-slate-900 placeholder:text-slate-400',
            'transition-all duration-150 outline-none resize-none',
            'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50',
            'min-h-[100px]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
