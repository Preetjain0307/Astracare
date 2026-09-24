'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Heart,
  Bot,
  User,
  ShieldAlert,
  Info,
  Clock,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import type { ChatMessage, ChatSession, ChatResponse } from '@/types/chat'

interface AstraCareChatViewProps {
  userFirstName?: string
  initialSessionId?: string
}

const QUICK_ACTIONS = [
  { label: 'How was my sleep this week?', icon: '🌙' },
  { label: 'When is my next period?', icon: '🩸' },
  { label: 'Analyze my stress', icon: '🧠' },
  { label: 'How much water did I drink?', icon: '💧' },
  { label: 'Explain my health insights', icon: '✨' },
]

export function AstraCareChatView({ userFirstName = 'there', initialSessionId }: AstraCareChatViewProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(initialSessionId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSessionsLoading, setIsSessionsLoading] = useState(true)
  const [errorNotice, setErrorNotice] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Load Sessions List
  const fetchSessions = async () => {
    try {
      setIsSessionsLoading(true)
      const res = await fetch('/api/ai/chat/sessions')
      const json = await res.json()
      if (res.ok && json.sessions) {
        setSessions(json.sessions)
        if (!currentSessionId && json.sessions.length > 0) {
          setCurrentSessionId(json.sessions[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to load chat sessions:', err)
    } finally {
      setIsSessionsLoading(false)
    }
  }

  // Load Messages for Active Session
  const fetchMessages = async (sessionId: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/ai/chat/sessions/${sessionId}`)
      const json = await res.json()
      if (res.ok && json.messages) {
        setMessages(json.messages)
      }
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  useEffect(() => {
    if (currentSessionId) {
      fetchMessages(currentSessionId)
    } else {
      setMessages([])
    }
  }, [currentSessionId])

  const handleStartNewSession = async () => {
    try {
      setErrorNotice(null)
      const res = await fetch('/api/ai/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      })
      const json = await res.json()
      if (res.ok && json.session) {
        setSessions((prev) => [json.session, ...prev])
        setCurrentSessionId(json.session.id)
        setMessages([])
      }
    } catch (err) {
      console.error('Failed to create new session:', err)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/ai/chat/sessions/${sessionId}`, { method: 'DELETE' })
      if (res.ok) {
        const remaining = sessions.filter((s) => s.id !== sessionId)
        setSessions(remaining)
        if (currentSessionId === sessionId) {
          setCurrentSessionId(remaining[0]?.id || undefined)
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err)
    }
  }

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim()
    if (!textToSend || isLoading) return

    setInputMessage('')
    setErrorNotice(null)

    // Optimistically add user message to UI
    const tempUserMsg: ChatMessage = {
      id: `temp_user_${Date.now()}`,
      session_id: currentSessionId || 'temp',
      user_id: 'me',
      role: 'user',
      content: textToSend,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, tempUserMsg])
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          sessionId: currentSessionId,
        }),
      })

      const data: ChatResponse | { error: string } = await res.json()

      if (!res.ok || 'error' in data) {
        const errorMsg = 'error' in data ? data.error : 'Failed to send message'
        setErrorNotice(errorMsg)
        setIsLoading(false)
        return
      }

      const chatData = data as ChatResponse

      if (!currentSessionId) {
        setCurrentSessionId(chatData.sessionId)
        fetchSessions()
      }

      // Add assistant response to UI
      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        session_id: chatData.sessionId,
        user_id: 'assistant',
        role: 'assistant',
        content: chatData.message,
        intent: chatData.intent,
        sources: chatData.sources,
        confidence: chatData.confidence,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: any) {
      console.error('Chat error:', err)
      setErrorNotice('Network connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-6rem)] max-w-7xl mx-auto rounded-3xl overflow-hidden glass-card border border-rose-100 shadow-glow bg-white/70 backdrop-blur-xl">
      {/* Sidebar - Sessions History */}
      <div className="hidden md:flex flex-col w-72 border-r border-rose-100/80 bg-rose-50/40 p-4">
        <button
          onClick={handleStartNewSession}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-extrabold text-xs shadow-glow hover:opacity-95 transition-all cursor-pointer mb-4"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-600 px-2 py-1 block">
            Recent Conversations
          </span>
          {isSessionsLoading ? (
            <div className="p-4 text-center text-xs text-slate-600">Loading history...</div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-600">No chat history yet</div>
          ) : (
            sessions.map((sess) => {
              const isActive = sess.id === currentSessionId
              return (
                <div
                  key={sess.id}
                  onClick={() => setCurrentSessionId(sess.id)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-rose-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-rose-700'}`} />
                    <span className="truncate">{sess.title}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSession(sess.id)
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-opacity ${
                      isActive ? 'hover:bg-rose-700 text-white' : 'hover:bg-rose-200 text-rose-600'
                    }`}
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-white/60">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-100/80 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-glow">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">AstraCare AI Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                  NLP Enabled
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Conversational Women's Health & Wellness Guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartNewSession}
              className="md:hidden p-2 rounded-xl bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-6 animate-fade-up py-8">
              <div className="w-16 h-16 rounded-3xl bg-rose-100 border border-rose-200/60 flex items-center justify-center text-rose-700 shadow-glow">
                <Heart className="w-8 h-8 fill-rose-600 text-rose-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900">How can I help you today, {userFirstName}?</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ask me anything about your cycle history, sleep trends, stress levels, hydration goals, or general women's health.
                </p>
              </div>

              {/* Quick Action Chips */}
              <div className="w-full space-y-2 pt-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 block">
                  Suggested Questions:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_ACTIONS.map((qa) => (
                    <button
                      key={qa.label}
                      onClick={() => handleSendMessage(qa.label)}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200/80 hover:border-rose-400 text-slate-700 text-xs font-bold shadow-sm hover:shadow-glow transition-all cursor-pointer text-left"
                    >
                      <span>{qa.icon}</span>
                      <span>{qa.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user'
            return (
              <div
                key={msg.id || idx}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                    isUser
                      ? 'bg-slate-800'
                      : msg.intent === 'emergency'
                      ? 'bg-rose-700'
                      : 'bg-gradient-to-br from-rose-600 to-pink-600 shadow-glow'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1.5 max-w-xl">
                  <div
                    className={`rounded-3xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium rounded-tr-none'
                        : msg.intent === 'emergency'
                        ? 'bg-rose-100 border border-rose-300 text-rose-900 rounded-tl-none font-medium'
                        : 'bg-white border border-rose-100/90 text-slate-800 rounded-tl-none font-normal'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Sources Transparency Pill */}
                    {!isUser && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-rose-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                          Data Sources:
                        </span>
                        {msg.sources.map((src) => (
                          <span
                            key={src}
                            className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200/60 text-rose-700 text-[10px] font-bold"
                          >
                            {src.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center text-white shadow-glow">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-3xl rounded-tl-none px-5 py-3.5 bg-white border border-rose-100/90 text-slate-500 text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                <span>AstraCare AI is thinking...</span>
              </div>
            </div>
          )}

          {errorNotice && (
            <div className="p-3.5 rounded-2xl bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 max-w-lg mx-auto">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-rose-100/80 bg-white/80">
          <div className="max-w-4xl mx-auto flex items-end gap-2 bg-white rounded-2xl p-2 border border-rose-200/80 shadow-sm focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-200 transition-all">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AstraCare AI about your sleep, cycle, stress, hydration..."
              rows={1}
              className="flex-1 bg-transparent border-0 outline-none resize-none px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 max-h-32 min-h-[38px]"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-glow hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer flex-shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4 fill-white" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-600 mt-2 font-medium">
            AstraCare AI provides evidence-aware health information and does not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
