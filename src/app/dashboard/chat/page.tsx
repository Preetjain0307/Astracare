import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AstraCareChatView } from '@/components/chat/AstraCareChatView'
import { DashboardSidebar, MobileBottomNav } from '@/components/dashboard/DashboardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default async function AIChatPage() {
  const cookieStore = await cookies()
  const demoCookie = cookieStore.get('astracare_demo_user')?.value

  let demoPersona: any = null
  if (demoCookie) {
    try {
      demoPersona = JSON.parse(demoCookie)
    } catch {
      demoPersona = { role: 'patient', fullName: 'Elena Rostova', email: 'demo.patient@astracare.ai' }
    }
  }

  let user: any = null
  let firstName = demoPersona?.fullName ? demoPersona.fullName.split(' ')[0] : 'Elena'

  if (!demoPersona) {
    try {
      const supabase = await createClient()
      const userPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: { user: null } }), 1000))
      const authRes: any = await Promise.race([userPromise, timeoutPromise])
      user = authRes?.data?.user

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('user_id', user.id)
          .maybeSingle()
        firstName = profile?.first_name || user.email?.split('@')[0] || 'there'
      }
    } catch (e) {
      console.warn('[Chat Supabase Auth Notice]', e)
    }
  }

  if (!user && !demoPersona) redirect('/auth/login')


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
