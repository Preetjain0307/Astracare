import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-5 w-5 text-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
        <Spinner className="text-brand-600 h-6 w-6" />
      </div>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner className="text-brand-600 h-8 w-8" />
    </div>
  )
}
