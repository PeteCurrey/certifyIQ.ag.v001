'use client'
import React, { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Upload, FileText, Sparkles, Building2, User, HardHat, ShoppingBag, ChevronRight, Shield, Zap, Clock } from 'lucide-react'
import styles from './analyser.module.css'

const MODES = [
  { id: 'auto', label: 'Auto-Detect', icon: Sparkles, desc: 'Let AI identify your document type' },
  { id: 'epc', label: 'EPC / Energy', icon: Zap, desc: 'Domestic EPC, energy ratings, improvements' },
  { id: 'landlord', label: 'Landlord', icon: User, desc: 'MEES compliance, letting position, risks' },
  { id: 'commercial', label: 'Commercial', icon: ShoppingBag, desc: 'Commercial EPC, BRUKL, SBEM analysis' },
  { id: 'developer', label: 'Developer', icon: HardHat, desc: 'SAP, Part L, Air Test, Water Calc' },
]

const SUPPORTED_DOCS = [
  'Domestic EPC', 'Commercial EPC', 'SAP Calculations', 'BRUKL Reports',
  'Part L Reports', 'Air Tightness Reports', 'Water Calculations',
  'Overheating Assessments', 'Gas Safety Certificates', 'EICR Reports',
  'Fire Risk Assessments', 'Building Compliance Reports',
]

const STATS = [
  { value: '14+', label: 'Document Types' },
  { value: '60s', label: 'Avg. Analysis Time' },
  { value: 'A+', label: 'Claude AI Model' },
  { value: '100%', label: 'Plain English' },
]

export default function AiAnalyserPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState('auto')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<string>('')
  const [error, setError] = useState('')

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }, [])

  const handleAnalyse = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    setProgress('Uploading document...')

    const sessionId = typeof window !== 'undefined'
      ? (localStorage.getItem('avorria_session') || crypto.randomUUID())
      : ''
    if (typeof window !== 'undefined') localStorage.setItem('avorria_session', sessionId)

    try {
      setProgress('Claude AI is reading your document...')
      const form = new FormData()
      form.append('file', file)
      form.append('mode', mode)
      form.append('session_id', sessionId)

      const res = await fetch('/api/ai/analyse-document', { method: 'POST', body: form })

      setProgress('Building your compliance report...')
      const data = await res.json()

      if (!res.ok || data.error) throw new Error(data.error || 'Analysis failed')

      // Store in session for the results page
      sessionStorage.setItem(`analysis_${data.analysis_id}`, JSON.stringify(data))
      router.push(`/tools/ai-analyser/results/${data.analysis_id}`)

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setUploading(false)
      setProgress('')
    }
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot}></span>
            Powered by Claude 3.5 Sonnet
          </div>
          <h1 className={styles.heroTitle}>
            Upload any property document.<br />
            <span className={styles.heroGradient}>Understand it instantly.</span>
          </h1>
          <p className={styles.heroSub}>
            The UK's most advanced AI compliance interpretation engine. Upload an EPC, SAP report, BRUKL, Gas Safety, or any compliance document and receive a plain-English analysis in under 60 seconds.
          </p>
          <div className={styles.heroStats}>
            {STATS.map(s => (
              <div key={s.label} className={styles.heroStat}>
                <span className={styles.heroStatVal}>{s.value}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Upload Widget */}
      <section className={styles.uploadSection}>
        <div className={styles.uploadWidget}>
          {/* Mode Selector */}
          <div className={styles.modeSection}>
            <p className={styles.modeLabel}>Analysis Mode</p>
            <div className={styles.modeGrid}>
              {MODES.map(m => {
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnActive : ''}`}
                    onClick={() => setMode(m.id)}
                  >
                    <Icon size={18} />
                    <span className={styles.modeBtnLabel}>{m.label}</span>
                    <span className={styles.modeBtnDesc}>{m.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Upload Zone */}
          <div
            className={`${styles.dropZone} ${dragging ? styles.dragging : ''} ${file ? styles.hasFile : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !file && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,image/png,image/jpeg,image/webp,image/heic"
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />

            {!file ? (
              <div className={styles.dropContent}>
                <div className={styles.dropIconWrap}>
                  <Upload size={36} className={styles.dropIcon} />
                </div>
                <p className={styles.dropTitle}>Drop your document here</p>
                <p className={styles.dropSub}>PDF, PNG, JPG, WEBP — or take a photo on mobile</p>
                <button className={styles.dropBrowse} onClick={e => { e.stopPropagation(); fileRef.current?.click() }}>
                  Browse Files
                </button>
              </div>
            ) : (
              <div className={styles.filePreview}>
                <div className={styles.fileIconWrap}>
                  <FileText size={28} color="#9BFF59" />
                </div>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB · Ready to analyse</p>
                </div>
                <button className={styles.fileChange} onClick={e => { e.stopPropagation(); setFile(null) }}>Change</button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && <div className={styles.errorBox}>{error}</div>}

          {/* Uploading State */}
          {uploading && (
            <div className={styles.loadingBox}>
              <div className={styles.loadingDots}>
                <span></span><span></span><span></span>
              </div>
              <p className={styles.loadingText}>{progress}</p>
              <p className={styles.loadingHint}>This usually takes 20–60 seconds depending on document complexity</p>
            </div>
          )}

          {/* Analyse Button */}
          {!uploading && (
            <button
              className={styles.analyseBtn}
              onClick={handleAnalyse}
              disabled={!file}
            >
              <Sparkles size={18} />
              Analyse Document with AI
              <ChevronRight size={18} />
            </button>
          )}

          <p className={styles.uploadFooter}>
            <Shield size={13} /> Secure. Your document is processed by Claude AI and stored encrypted.
          </p>
        </div>

        {/* Side: Supported Documents */}
        <div className={styles.sidePanel}>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Supported Documents</h3>
            <ul className={styles.docList}>
              {SUPPORTED_DOCS.map(d => (
                <li key={d} className={styles.docItem}>
                  <span className={styles.docTick}>✓</span> {d}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>What You'll Receive</h3>
            {[
              'Plain-English explanation of your document',
              'Property Health Score (0–100)',
              'Risk identification with severity ratings',
              'AI Improvement Roadmap with cost estimates',
              'MEES & regulatory exposure analysis',
              'Interactive AI chat to ask follow-up questions',
              'Downloadable branded compliance report',
            ].map((item, i) => (
              <div key={i} className={styles.benefitItem}>
                <span className={styles.benefitNum}>{i + 1}</span>
                <span className={styles.benefitText}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustGrid}>
          {[
            { icon: '🔒', title: 'Secure & Encrypted', desc: 'All documents processed over encrypted connections and stored securely.' },
            { icon: '🧠', title: 'Expert AI Model', desc: 'Claude 3.5 Sonnet trained on thousands of UK compliance documents.' },
            { icon: '⚡', title: 'Instant Results', desc: 'Full analysis in under 60 seconds — no waiting, no appointments.' },
            { icon: '🇬🇧', title: 'UK Compliance Specialist', desc: 'Built specifically for UK Building Regulations, MEES, and EPC requirements.' },
          ].map(t => (
            <div key={t.title} className={styles.trustCard}>
              <span className={styles.trustIcon}>{t.icon}</span>
              <h4 className={styles.trustTitle}>{t.title}</h4>
              <p className={styles.trustDesc}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
