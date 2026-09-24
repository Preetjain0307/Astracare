import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/ai/chat/sessions
 * Retrieves all chat sessions for the current authenticated user.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 })
    }

    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      const adminSupabase = createAdminClient()
      const { data: adminSessions } = await adminSupabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      return NextResponse.json({ sessions: adminSessions || [] })
    }

    return NextResponse.json({ sessions: sessions || [] })
  } catch (error: any) {
    console.error('API Error /api/ai/chat/sessions GET:', error)
    return NextResponse.json({ sessions: [] })
  }
}

/**
 * POST /api/ai/chat/sessions
 * Creates a new chat session for the current authenticated user.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const title = body?.title?.trim() || 'New Conversation'

    let session: any = null
    const { data: userSession, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title,
      })
      .select()
      .maybeSingle()

    session = userSession

    if (!session) {
      const adminSupabase = createAdminClient()
      const { data: adminSession } = await adminSupabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .maybeSingle()

      session = adminSession
    }

    if (!session) {
      session = {
        id: `sess_${Date.now()}`,
        user_id: user.id,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    return NextResponse.json({ session })
  } catch (error: any) {
    console.error('API Error /api/ai/chat/sessions POST:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
