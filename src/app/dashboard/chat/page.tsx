import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AstraCareChatView } from '@/components/chat/AstraCareChatView'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default async function AIChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('user_id', user.id)
    .maybeSingle()

  const firstName = profile?.first_name || user.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen gradient-mesh flex text-slate-800 pb-20 md:pb-8">
      {/* Sidebar Nav */}
      <DashboardSidebar currentTab="/dashboard/chat" />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader firstName={firstName} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 animate-fade-up">
          <AstraCareChatView userFirstName={firstName} />
        </main>
      </div>

      {/* Mobile Nav */}
      <MobileBottomNav currentTab="/dashboard/chat" />
    </div>
  )
}
