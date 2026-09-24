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
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
      router.refresh()
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
