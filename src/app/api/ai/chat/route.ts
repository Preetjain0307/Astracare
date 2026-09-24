import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { classifyIntent } from '@/lib/ai/nlp-engine'
import { getSanitizedChatContext } from '@/lib/ai/chat-context-service'
import { getAIProvider } from '@/lib/ai/providers'
import {
  buildAstraCareSystemPrompt,
  getEmergencyResponse,
  validateAndSanitizeResponse,
} from '@/lib/ai/safety-guardrails'
import type { ChatResponse } from '@/types/chat'

// Simple in-memory rate limiting map (userId -> timestamp[])
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20

function isRateLimited(userId: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(userId) || []
  const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  recent.push(now)
  rateLimitMap.set(userId, recent)
  return false
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 })
    }

    const userId = user.id

    // Check rate limit
    if (isRateLimited(userId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before sending another message.' },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const userMessage = body?.message?.trim()
    let sessionId = body?.sessionId

    if (!userMessage) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    if (userMessage.length > 1000) {
      return NextResponse.json({ error: 'Message exceeds maximum length of 1000 characters' }, { status: 400 })
    }

    const adminSupabase = createAdminClient()
    const sessionTitle = userMessage.length > 30 ? `${userMessage.substring(0, 30)}...` : userMessage

    // Ensure session exists or create a new one with fallbacks
    if (!sessionId) {
      // 1. Try standard client
      const { data: newSession, error: createErr } = await supabase
        .from('chat_sessions')
        .insert({ user_id: userId, title: sessionTitle })
        .select()
        .maybeSingle()

      if (newSession && newSession.id) {
        sessionId = newSession.id
      } else {
        // 2. Try admin client fallback (in case of RLS constraints)
        const { data: adminSession, error: adminErr } = await adminSupabase
          .from('chat_sessions')
          .insert({ user_id: userId, title: sessionTitle })
          .select()
          .maybeSingle()

        if (adminSession && adminSession.id) {
          sessionId = adminSession.id
        } else {
          // 3. Ephemeral session fallback (if table chat_sessions not yet created in Supabase)
          console.warn('[Chat Session Warning] Failed to insert chat_session in Supabase. Using ephemeral session.', createErr || adminErr)
          sessionId = `sess_${Date.now()}`
        }
      }
    } else if (!sessionId.startsWith('sess_')) {
      // Update session title if default
      try {
        await supabase
          .from('chat_sessions')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', sessionId)
      } catch (err) {
        // Ignore update error
      }
    }

    // 1. NLP Intent Detection & Emergency Check
    const nlpResult = classifyIntent(userMessage)

    // Handle Emergency Intent directly
    if (nlpResult.isEmergency) {
      const emergencyMessage = getEmergencyResponse()

      // Store in DB safely
      try {
        await adminSupabase.from('chat_messages').insert([
          { session_id: sessionId.startsWith('sess_') ? null : sessionId, user_id: userId, role: 'user', content: userMessage },
          {
            session_id: sessionId.startsWith('sess_') ? null : sessionId,
            user_id: userId,
            role: 'assistant',
            content: emergencyMessage,
            intent: 'emergency',
            sources: ['emergency_safety_rules'],
            confidence: 'high',
          },
        ])
      } catch (e) {
        // Ignore message store failure if table missing
      }

      const response: ChatResponse = {
        sessionId,
        message: emergencyMessage,
        intent: 'emergency',
        sources: ['emergency_safety_rules'],
        confidence: 'high',
        isEmergency: true,
      }

      return NextResponse.json(response)
    }

    // 2. Retrieve Least-Privilege Context
    let context = {}
    let sources: string[] = []
    try {
      const ctxResult = await getSanitizedChatContext(userId, nlpResult.intent)
      context = ctxResult.context
      sources = ctxResult.sources
    } catch (ctxErr) {
      console.warn('[Chat Context Warning] Failed to fetch context:', ctxErr)
    }

    // 3. Retrieve Short-term Conversation History (Last 6 messages)
    let pastMessages: any[] = []
    if (!sessionId.startsWith('sess_')) {
      try {
        const { data } = await supabase
          .from('chat_messages')
          .select('role, content')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })
          .limit(6)
        pastMessages = data || []
      } catch (e) {
        // Ignore history fetch error
      }
    }

    const conversationHistory = pastMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // 4. Generate Response via AI Provider Abstraction
    const systemPrompt = buildAstraCareSystemPrompt(nlpResult.intent)
    const aiProvider = getAIProvider()

    let rawAssistantText = ''
    try {
      rawAssistantText = await aiProvider.generateResponse({
        systemPrompt,
        userMessage,
        conversationHistory,
        contextData: context,
      })
    } catch (aiErr: any) {
      console.error(`AI Provider (${aiProvider.name}) Error:`, aiErr)
      rawAssistantText = `I am experiencing a temporary connection issue with the primary AI service. However, based on your recorded health data, your recent tracking remains safely recorded.`
    }

    // 5. Response Validation & Safety Sanitization
    const finalMessage = validateAndSanitizeResponse(rawAssistantText, nlpResult.isMedicationRelated)

    // 6. Persist Messages to Supabase Safely
    if (!sessionId.startsWith('sess_')) {
      try {
        await adminSupabase.from('chat_messages').insert([
          { session_id: sessionId, user_id: userId, role: 'user', content: userMessage },
          {
            session_id: sessionId,
            user_id: userId,
            role: 'assistant',
            content: finalMessage,
            intent: nlpResult.intent,
            sources,
            confidence: nlpResult.confidence,
          },
        ])
      } catch (e) {
        console.warn('[Chat Message Insert Warning]', e)
      }
    }

    const chatResponse: ChatResponse = {
      sessionId,
      message: finalMessage,
      intent: nlpResult.intent,
      sources,
      confidence: nlpResult.confidence,
      disclaimer: 'AI-generated health information is for informational purposes and does not replace professional medical advice.',
      isEmergency: false,
      isMedicationSafetyNotice: nlpResult.isMedicationRelated,
    }

    return NextResponse.json(chatResponse)
  } catch (error: any) {
    console.error('API Error /api/ai/chat POST:', error)
    return NextResponse.json(
      { error: error?.message || 'An error occurred while processing your query' },
      { status: 500 }
    )
  }
}
