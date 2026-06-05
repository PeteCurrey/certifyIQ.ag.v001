'use client'
import React, { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './ai-assistant.module.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'Does this property need a new EPC?',
  'What EPC rating is required for renting in 2028?',
  'Which of my properties have EPCs expiring soon?',
  'What compliance risks should I be aware of?',
  'How do I order a bulk EPC for multiple properties?',
]

export default function AIAssistantPage() {
  const supabase = createClient()
  const [agencyId, setAgencyId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi, I'm Ava — Avorria's AI Compliance Assistant. I have access to your portfolio data and can help with EPC compliance questions, expiry alerts, service recommendations, and UK Building Regulations. What would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: agUser } = await supabase
        .from('agency_users')
        .select('agency_id')
        .eq('auth_user_id', user.id)
        .single()
      if (agUser) setAgencyId(agUser.agency_id)
    }
    load()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return
    const userMsg: Message = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/agency/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          agencyId,
        })
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.avatarArea}>
          <div className={styles.avatarIcon}>✦</div>
          <div>
            <h1 className={styles.title}>AI Compliance Assistant</h1>
            <p className={styles.subtitle}>Powered by Claude 3.5 Sonnet · Access to your portfolio</p>
          </div>
        </div>
        <span className={styles.statusDot}>● Live</span>
      </div>

      <div className={styles.chatLayout}>
        {/* Sidebar with suggestions */}
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Quick Questions</h3>
          <div className={styles.suggestions}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                className={styles.suggestion}
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <div className={styles.disclaimer}>
            <p>Ava provides guidance based on UK Building Regulations and your portfolio data. Always verify critical compliance decisions with a qualified assessor.</p>
          </div>
        </div>

        {/* Chat window */}
        <div className={styles.chatWindow}>
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                {msg.role === 'assistant' && (
                  <div className={styles.msgAvatar}>✦</div>
                )}
                <div className={styles.bubble}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} style={{ margin: j > 0 ? '0.5rem 0 0' : '0' }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.msgAvatar}>✦</div>
                <div className={styles.bubble}>
                  <div className={styles.typing}>
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask about EPC compliance, expiry dates, required services…"
              disabled={loading}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
