'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className={cn(
            'h-4.5 w-4.5 rounded border-slate-300 text-brand-600',
            'focus:ring-2 focus:ring-brand-500 focus:ring-offset-1',
            'transition-colors cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {label && (
          <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

interface CheckboxGroupProps {
  options: Array<{ value: string; label: string }>
  selectedValues: string[]
  onChange: (values: string[]) => void
  className?: string
  columns?: 1 | 2 | 3
}

export function CheckboxGroup({
  options,
  selectedValues,
  onChange,
  className,
  columns = 2,
}: CheckboxGroupProps) {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value])
    } else {
      onChange(selectedValues.filter((v) => v !== value))
    }
  }

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  }[columns]

  return (
    <div className={cn(`grid gap-2.5`, gridClass, className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all duration-150',
            selectedValues.includes(option.value)
              ? 'border-brand-300 bg-brand-50 text-brand-800'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={selectedValues.includes(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
          />
          <div
            className={cn(
              'h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-all',
              selectedValues.includes(option.value)
                ? 'border-brand-600 bg-brand-600'
                : 'border-slate-300'
            )}
          >
            {selectedValues.includes(option.value) && (
              <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2.5 6.5L5 9l4.5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-sm font-medium">{option.label}</span>
        </label>
      ))}
    </div>
  )
}
