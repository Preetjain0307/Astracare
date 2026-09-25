'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch {}
      // Clear demo cookie
      document.cookie = 'astracare_demo_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
      window.location.href = '/auth/login'
    })
  }


  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      title="Sign out"
    >
      <LogOut className="h-4 w-4" />
    </button>
  )
}
