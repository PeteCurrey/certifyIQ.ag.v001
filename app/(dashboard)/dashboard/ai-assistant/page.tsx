'use client'
import React, { useState, useRef } from 'react'
import { Send, Loader2, Bot, User, Sparkles } from 'lucide-react'
import styles from './ai-assistant.module.css'

const SUGGESTED_PROMPTS = [
  'Can I legally let 14 Mill Lane?',
  'What certificates expire in the next 30 days?',
  'What should I renew first?',
  'Which properties are non-compliant?',
  'What will my compliance renewals cost this year?',
  'How do I improve my portfolio compliance score?',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Avorria Compliance AI. I have access to your full portfolio — 47 properties, compliance records, and upcoming expiry dates.\n\nI can tell you which properties can legally be let, what\'s expiring soon, what\'s missing, and what to prioritise. Ask me anything.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/compliance-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, I encountered an error.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Unable to reach AI at this time. Please try again.' }])
    } finally {
      setLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.aiIconLarge}>✨</div>
          <div>
            <h1 className={styles.pageTitle}>AI Compliance Assistant</h1>
            <p className={styles.pageSub}>Powered by Claude 3.5 Sonnet — with access to your full portfolio</p>
          </div>
        </div>
        <div className={styles.statusBadge}>
          <span className={styles.pulseGreen}></span>
          Portfolio Connected
        </div>
      </div>

      <div className={styles.chatLayout}>
        {/* Chat Area */}
        <div className={styles.chatContainer}>
          <div className={styles.messageList}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.assistantMsg}`}>
                <div className={styles.msgAvatar}>
                  {msg.role === 'user' ? <User size={16} /> : <span>✨</span>}
                </div>
                <div className={styles.msgContent}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={styles.msgLine}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className={`${styles.message} ${styles.assistantMsg}`}>
                <div className={styles.msgAvatar}><span>✨</span></div>
                <div className={styles.thinkingDots}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            <textarea
              className={styles.chatInput}
              placeholder="Ask about any property, certificate, or compliance question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
              }}
              rows={1}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              {loading ? <Loader2 size={18} className={styles.spin} /> : <Send size={18} />}
            </button>
          </div>
        </div>

        {/* Sidebar — Suggestions */}
        <div className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}><Sparkles size={16} /> Suggested Questions</h3>
            <div className={styles.suggestions}>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  className={styles.suggestionBtn}
                  onClick={() => sendMessage(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Portfolio Context</h3>
            <div className={styles.contextItems}>
              <div className={styles.contextItem}><span className={styles.ctxLabel}>Properties</span><span className={styles.ctxValue}>47</span></div>
              <div className={styles.contextItem}><span className={styles.ctxLabel}>Compliance Score</span><span className={styles.ctxValue} style={{color:'#F59E0B'}}>78%</span></div>
              <div className={styles.contextItem}><span className={styles.ctxLabel}>Expiring (90d)</span><span className={styles.ctxValue} style={{color:'#FB923C'}}>12</span></div>
              <div className={styles.contextItem}><span className={styles.ctxLabel}>Expired</span><span className={styles.ctxValue} style={{color:'#F87171'}}>3</span></div>
              <div className={styles.contextItem}><span className={styles.ctxLabel}>Missing Certs</span><span className={styles.ctxValue} style={{color:'#F87171'}}>6</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
