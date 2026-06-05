'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, ShieldAlert, AlertTriangle, Lightbulb, Download, Calendar, Activity, RefreshCw, MessageSquare, Send, ChevronRight, Zap
} from 'lucide-react'
import styles from './results.module.css'

export default function AnalysisResultsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      // 1. Try session storage first for immediate load
      const sessionData = sessionStorage.getItem(`analysis_${id}`)
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        setData(parsed)
        setLoading(false)
        loadChatHistory()
        return
      }

      // 2. Fetch from DB if not in session
      const supabase = createClient()
      const { data: dbData, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('id', id)
        .single()

      if (dbData) {
        setData({
          extraction: dbData.raw_extraction,
          analysis: dbData.analysis_result,
          health_score: dbData.health_score,
          compliance_rating: dbData.compliance_rating,
          services_recommended: dbData.services_recommended
        })
        loadChatHistory()
      } else {
        router.push('/tools/ai-analyser')
      }
      setLoading(false)
    }
    loadData()
  }, [id, router])

  const loadChatHistory = async () => {
    const supabase = createClient()
    const { data: chatData } = await supabase
      .from('analysis_chats')
      .select('messages')
      .eq('analysis_id', id)
      .single()
    
    if (chatData?.messages) {
      setChatMessages(chatData.messages)
    } else {
      setChatMessages([{
        role: 'assistant',
        content: 'I have analysed your document. What specific questions do you have about the findings or recommended improvements?'
      }])
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    
    setChatMessages(prev => [...prev, { role: 'user', content: msg }])
    setChatInput('')
    setChatLoading(true)

    try {
      const res = await fetch('/api/ai/document-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis_id: id,
          message: msg,
          extraction: data.extraction,
          analysis: data.analysis
        })
      })
      const result = await res.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.reply || 'Sorry, I encountered an error.' }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setChatLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <RefreshCw size={32} className={styles.spin} color="#9BFF59" />
        <p>Loading your analysis...</p>
      </div>
    )
  }

  if (!data) return null

  const ext = data.extraction
  const ans = data.analysis

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10B981' // Green
    if (score >= 70) return '#3B82F6' // Blue
    if (score >= 55) return '#F59E0B' // Orange
    return '#EF4444' // Red
  }

  return (
    <div className={styles.page}>
      
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link href="/tools/ai-analyser" className={styles.backLink}>← Upload Another</Link>
          <button 
            className={styles.downloadBtn}
            onClick={() => window.open(`/api/ai/generate-report/${id}`, '_blank')}
          >
            <Download size={16} /> Download Full Report
          </button>
        </div>
      </div>

      <div className={styles.container}>
        
        {/* Left Column: Analysis */}
        <div className={styles.mainCol}>
          
          {/* Header Card */}
          <div className={styles.card}>
            <div className={styles.heroGrid}>
              <div className={styles.scoreGauge} style={{ borderColor: getScoreColor(data.health_score) }}>
                <span className={styles.scoreNum} style={{ color: getScoreColor(data.health_score) }}>
                  {data.health_score}
                </span>
                <span className={styles.scoreLabel}>Health Score</span>
              </div>
              <div className={styles.heroInfo}>
                <h1 className={styles.heroTitle}>{ans.headline || 'Document Analysed'}</h1>
                <p className={styles.heroAddress}>{ext.property_address || 'Address not found'}</p>
                <div className={styles.heroTags}>
                  <span className={styles.tag}>{ext.document_type || 'Document'}</span>
                  <span className={styles.tag} style={{ background: `${getScoreColor(data.health_score)}15`, color: getScoreColor(data.health_score) }}>
                    {data.compliance_rating}
                  </span>
                  {ext.current_rating && <span className={styles.tag}>Rating: {ext.current_rating}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Plain English Summary */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><FileText size={20} color="#9BFF59" /> Executive Summary</h2>
            <p className={styles.summaryText}>{ans.plain_english_summary}</p>
            {ans.compliance_position && (
              <div className={styles.complianceBox}>
                <ShieldAlert size={18} color="#F59E0B" />
                <p>{ans.compliance_position}</p>
              </div>
            )}
            {ans.mees_position && (
              <p className={styles.meesText}><strong>MEES Position:</strong> {ans.mees_position}</p>
            )}
          </div>

          {/* Extracted Data Grid */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}><Activity size={20} color="#60A5FA" /> Extracted Data</h2>
            <div className={styles.dataGrid}>
              {ext.current_rating && <div className={styles.dataItem}><span className={styles.dataLabel}>Current Rating</span><span className={styles.dataVal}>{ext.current_rating}</span></div>}
              {ext.potential_rating && <div className={styles.dataItem}><span className={styles.dataLabel}>Potential</span><span className={styles.dataVal}>{ext.potential_rating}</span></div>}
              {ext.expiry_date && <div className={styles.dataItem}><span className={styles.dataLabel}>Expiry Date</span><span className={styles.dataVal}>{ext.expiry_date}</span></div>}
              {ext.floor_area_sqm && <div className={styles.dataItem}><span className={styles.dataLabel}>Floor Area</span><span className={styles.dataVal}>{ext.floor_area_sqm} m²</span></div>}
              {ext.primary_heating && <div className={styles.dataItem}><span className={styles.dataLabel}>Heating</span><span className={styles.dataVal}>{ext.primary_heating}</span></div>}
              {ext.test_result && <div className={styles.dataItem}><span className={styles.dataLabel}>Test Result</span><span className={styles.dataVal}>{ext.test_result}</span></div>}
            </div>
          </div>

          {/* Risks */}
          {ans.risks && ans.risks.length > 0 && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}><AlertTriangle size={20} color="#EF4444" /> Compliance Risks</h2>
              <div className={styles.riskList}>
                {ans.risks.map((r: any, i: number) => (
                  <div key={i} className={`${styles.riskItem} ${styles['risk' + r.severity]}`}>
                    <h3 className={styles.riskTitle}>{r.title} — {r.severity}</h3>
                    <p className={styles.riskDesc}>{r.description}</p>
                    {r.regulatory_ref && <span className={styles.riskRef}>{r.regulatory_ref}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Improvement Roadmap */}
          {(ans.quick_wins?.length > 0 || ans.medium_term?.length > 0) && (
            <div className={styles.card}>
              <h2 className={styles.cardTitle}><Lightbulb size={20} color="#10B981" /> AI Improvement Roadmap</h2>
              
              {ans.quick_wins?.length > 0 && (
                <div className={styles.roadmapSection}>
                  <h3 className={styles.roadmapHeader}>⚡ Quick Wins</h3>
                  {ans.quick_wins.map((w: any, i: number) => (
                    <div key={i} className={styles.impCard}>
                      <h4 className={styles.impTitle}>{w.title}</h4>
                      <p className={styles.impDesc}>{w.description}</p>
                      <div className={styles.impMeta}>
                        <span className={styles.impMetaBadge}>Cost: {w.estimated_cost}</span>
                        <span className={styles.impMetaBadge}>Impact: {w.impact}</span>
                        {w.payback && <span className={styles.impMetaBadge}>Payback: {w.payback}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ans.medium_term?.length > 0 && (
                <div className={styles.roadmapSection}>
                  <h3 className={styles.roadmapHeader}>🚀 Medium Term</h3>
                  {ans.medium_term.map((w: any, i: number) => (
                    <div key={i} className={styles.impCard}>
                      <h4 className={styles.impTitle}>{w.title}</h4>
                      <p className={styles.impDesc}>{w.description}</p>
                      <div className={styles.impMeta}>
                        <span className={styles.impMetaBadge}>Cost: {w.estimated_cost}</span>
                        <span className={styles.impMetaBadge}>Impact: {w.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: AI Chat & Actions */}
        <div className={styles.sideCol}>
          
          {/* Action Callout */}
          {ans.next_action && (
            <div className={styles.actionCard}>
              <h3 className={styles.actionTitle}>Recommended Next Step</h3>
              <p className={styles.actionText}>{ans.next_action}</p>
              
              {data.services_recommended?.length > 0 && (
                <div className={styles.servicesList}>
                  {data.services_recommended.slice(0, 2).map((s: string) => (
                    <Link key={s} href={`/book?service=${encodeURIComponent(s)}`} className={styles.serviceBtn}>
                      Book {s} <ChevronRight size={14} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AI Chat */}
          <div className={styles.chatCard}>
            <div className={styles.chatHeader}>
              <MessageSquare size={16} color="#9BFF59" />
              <span>Ask the AI Document Expert</span>
            </div>
            
            <div className={styles.chatWindow}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`${styles.chatMsg} ${msg.role === 'user' ? styles.msgUser : styles.msgAi}`}>
                  {msg.role === 'assistant' && <span className={styles.msgAvatar}>✨</span>}
                  <div className={styles.msgBubble}>
                    {msg.content.split('\n').map((line: string, j: number) => (
                      <p key={j} className={styles.msgLine}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className={`${styles.chatMsg} ${styles.msgAi}`}>
                  <span className={styles.msgAvatar}>✨</span>
                  <div className={styles.msgBubble}>
                    <div className={styles.dots}><span></span><span></span><span></span></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className={styles.chatInputArea}>
              <textarea
                className={styles.chatInput}
                placeholder="Ask a question about this document..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage() }
                }}
                rows={1}
              />
              <button 
                className={styles.chatSendBtn} 
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || chatLoading}
              >
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
