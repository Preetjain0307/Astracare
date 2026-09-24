import { cn } from '@/lib/utils'

interface SeparatorProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export function Separator({ className, orientation = 'horizontal', label }: SeparatorProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
    )
  }

  return (
    <div
      role="separator"
      className={cn(
        orientation === 'horizontal' ? 'h-px w-full bg-slate-200' : 'w-px h-full bg-slate-200',
        className
      )}
    />
  )
}
