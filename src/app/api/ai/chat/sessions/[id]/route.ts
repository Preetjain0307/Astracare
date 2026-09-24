import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/ai/chat/sessions/[id]
 * Fetches message history for a specific session.
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id: sessionId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 })
    }

    if (sessionId.startsWith('sess_')) {
      return NextResponse.json({ session: { id: sessionId, title: 'Conversation' }, messages: [] })
    }

    const adminSupabase = createAdminClient()

    // Fetch session
    let { data: session } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!session) {
      const { data: adminSession } = await adminSupabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle()
      session = adminSession
    }

    if (!session) {
      return NextResponse.json({ session: { id: sessionId, title: 'Conversation' }, messages: [] })
    }

    // Fetch messages
    let { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (!messages) {
      const { data: adminMsgs } = await adminSupabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      messages = adminMsgs
    }

    return NextResponse.json({ session, messages: messages || [] })
  } catch (error: any) {
    console.error('API Error /api/ai/chat/sessions/[id] GET:', error)
    return NextResponse.json({ session: { id: 'temp', title: 'Conversation' }, messages: [] })
  }
}

/**
 * DELETE /api/ai/chat/sessions/[id]
 * Deletes a session and its message history.
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id: sessionId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 })
    }

    if (!sessionId.startsWith('sess_')) {
      const adminSupabase = createAdminClient()
      await adminSupabase.from('chat_sessions').delete().eq('id', sessionId).eq('user_id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API Error /api/ai/chat/sessions/[id] DELETE:', error)
    return NextResponse.json({ success: fontSuccessFallback() })
  }
}

function fontSuccessFallback() {
  return true
}
