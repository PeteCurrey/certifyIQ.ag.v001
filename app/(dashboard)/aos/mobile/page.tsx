'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Clipboard, FileEdit, Camera, Mic, Send, ChevronLeft, Navigation, MapPin, Clock, Loader2, CheckCircle, AlertTriangle, X, Wifi, WifiOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { compressImage, fileToBase64 } from '@/lib/compress-image'

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Photo {
  id: number
  url: string
  file: File
  status: 'analyzing' | 'complete' | 'error'
  tags: string[]
  primaryElement: string
  confidence: string
  flagCount: number
  noteSuggestion: string
  evidenceQuality: string
}

interface Job {
  id: string
  address: string
  service: string
  time: string
  status: string
  accessInstructions?: string
}

// Mock jobs — replace with Supabase query in production
const MOCK_JOBS: Job[] = [
  { id: 'j1', address: '14 Mill Lane, Derby DE1 3EF', service: 'Domestic EPC', time: '09:00', status: 'en_route', accessInstructions: 'Key under front mat. Please lock back door when leaving.' },
  { id: 'j2', address: '7 Oak Street, Chesterfield S40 2JL', service: 'Gas Safety', time: '14:00', status: 'not_started' },
]

const REQUIRED_PHOTOS = [
  { id: 'front', label: 'Front of property', tags: ['Front Elevation'] },
  { id: 'boiler', label: 'Boiler (with label)', tags: ['Combi Boiler', 'Regular Boiler', 'Back Boiler', 'Heat Pump ASHP'] },
  { id: 'loft', label: 'Loft / hatch', tags: ['Roof Space', 'Loft Insulation', 'No Loft Insulation'] },
  { id: 'windows', label: 'Windows', tags: ['Single Glazed', 'Double Glazed', 'Triple Glazed'] },
  { id: 'meter', label: 'Meter(s)', tags: ['Gas Meter', 'Electric Meter', 'Smart Meter'] },
  { id: 'walls', label: 'External wall', tags: ['Cavity Wall', 'Solid Wall', 'External Wall Insulation'] },
]

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function AosMobileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = searchParams.get('tab') || 'jobs'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [isOnline, setIsOnline] = useState(true)
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<Record<string, string>>({})

  // Photos state
  const [photos, setPhotos] = useState<Photo[]>([])
  const [analyzingCount, setAnalyzingCount] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  // Voice state
  const [isListening, setIsListening] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const [textNotes, setTextNotes] = useState('')

  // Survey state
  const [surveySection, setSurveySection] = useState(0)
  const [surveyData, setSurveyData] = useState<Record<string, any>>({})
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  // Audit state
  const [auditResult, setAuditResult] = useState<any>(null)
  const [auditLoading, setAuditLoading] = useState(false)
  const [submitDone, setSubmitDone] = useState(false)

  const activeJob = MOCK_JOBS.find(j => j.id === activeJobId) || MOCK_JOBS[0]

  // Register service worker & online/offline detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
    setVoiceSupported(!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-save survey data to localStorage
  useEffect(() => {
    if (Object.keys(surveyData).length > 0) {
      try {
        localStorage.setItem(`aos_survey_${activeJobId || 'j1'}`, JSON.stringify(surveyData))
        setLastSaved(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
      } catch {}
    }
  }, [surveyData, activeJobId])

  // ─── VOICE DICTATION ────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    if (!voiceSupported) {
      setVoiceError('Voice not available in this browser')
      setTimeout(() => setVoiceError(null), 5000)
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-GB'
    rec.onstart = () => setIsListening(true)
    rec.onend = () => { setIsListening(false); setInterimText('') }
    rec.onerror = (e: any) => {
      setIsListening(false)
      setInterimText('')
      if (e.error === 'not-allowed') setVoiceError('Microphone permission denied')
      else if (e.error === 'network') setVoiceError('Network required for voice')
      else if (e.error !== 'no-speech' && e.error !== 'aborted') setVoiceError(`Error: ${e.error}`)
      setTimeout(() => setVoiceError(null), 5000)
    }
    rec.onresult = (e: any) => {
      let interim = '', final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      if (final) setVoiceTranscript(p => p + (p ? ' ' : '') + final.trim())
      setInterimText(interim)
    }
    rec.start()
    recognitionRef.current = rec
  }, [voiceSupported, isListening])

  // ─── PHOTO CAPTURE ──────────────────────────────────────────────────────────
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (fileRef.current) fileRef.current.value = ''

    const url = URL.createObjectURL(file)
    const newPhoto: Photo = { id: Date.now(), url, file, status: 'analyzing', tags: [], primaryElement: '', confidence: 'low', flagCount: 0, noteSuggestion: '', evidenceQuality: 'good' }
    setPhotos(prev => [...prev, newPhoto])
    setAnalyzingCount(c => c + 1)

    try {
      const compressed = await compressImage(file)
      const base64 = await fileToBase64(compressed)
      const res = await fetch('/api/ai/photo-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg', surveyContext: surveyData })
      })
      const data = await res.json()

      // Upload to Supabase Storage
      const supabase = createClient()
      const fileName = `${activeJobId || 'j1'}/${newPhoto.id}.jpg`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('survey-photos')
        .upload(fileName, compressed, { contentType: 'image/jpeg' })
      
      let publicUrl = url
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from('survey-photos').getPublicUrl(fileName)
        publicUrl = urlData.publicUrl
      }

      setPhotos(prev => prev.map(p =>
        p.id === newPhoto.id ? {
          ...p,
          status: 'complete',
          url: publicUrl,
          tags: data.tags || [],
          primaryElement: data.primary_element || 'Unknown',
          confidence: data.confidence || 'low',
          flagCount: (data.flags || []).length,
          noteSuggestion: data.assessor_note_suggestion || '',
          evidenceQuality: data.evidence_quality || 'good'
        } : p
      ))
    } catch {
      setPhotos(prev => prev.map(p => p.id === newPhoto.id ? { ...p, status: 'error' } : p))
    } finally {
      setAnalyzingCount(c => c - 1)
    }
  }

  // ─── REQUIRED PHOTOS CHECK ─────────────────────────────────────────────────
  const completedRequired = REQUIRED_PHOTOS.map(req => ({
    ...req,
    done: photos.some(p =>
      p.status === 'complete' && p.tags.some(t => req.tags.includes(t))
    )
  }))
  const requiredDoneCount = completedRequired.filter(r => r.done).length

  // ─── AUDIT CHECK ────────────────────────────────────────────────────────────
  const runAuditCheck = async () => {
    setAuditLoading(true)
    setAuditResult(null)
    try {
      const res = await fetch('/api/ai/audit-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyData,
          photoTags: photos.filter(p => p.status === 'complete').map(p => p.tags),
          photoNotes: photos.filter(p => p.status === 'complete').map(p => p.noteSuggestion),
          bookingRef: activeJob?.id || 'unknown',
          serviceType: 'domestic'
        })
      })
      const result = await res.json()
      setAuditResult(result)
    } catch {
      setAuditResult({ overall_status: 'fail', can_submit: false, summary: 'Audit check failed. Please try again.', flags: [], required_actions_before_submit: ['Please re-run the audit.'], positive_notes: [] })
    } finally {
      setAuditLoading(false)
    }
  }

  const handleSubmit = async () => {
    const supabase = createClient()
    try {
      await supabase.from('bookings').update({
        assessor_status: 'submitted_qa',
        status: 'assessment_complete',
        assessor_status_updated_at: new Date().toISOString()
      }).eq('id', activeJobId || 'j1')
    } catch {
      // Ignore — submission errors are non-blocking on mobile
    }
    setSubmitDone(true)
  }

  // ─── SURVEY SECTIONS ───────────────────────────────────────────────────────
  const SURVEY_SECTIONS = [
    { id: 'property', label: 'Property' },
    { id: 'walls', label: 'Walls' },
    { id: 'roof', label: 'Roof' },
    { id: 'windows', label: 'Windows' },
    { id: 'heating', label: 'Heating' },
    { id: 'hotwater', label: 'Hot Water' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'renewables', label: 'Renewables' },
  ]

  const updateSurvey = (field: string, value: any) => setSurveyData(p => ({ ...p, [field]: value }))

  // ─── STYLES ────────────────────────────────────────────────────────────────
  const s = {
    page: { background: '#050810', minHeight: '100vh', color: '#E8F4FF', fontFamily: 'Inter, sans-serif', paddingBottom: '80px', maxWidth: '480px', margin: '0 auto' } as React.CSSProperties,
    header: { background: '#0F1628', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E2D4A', position: 'sticky' as const, top: 0, zIndex: 20 },
    tabBar: { position: 'fixed' as const, bottom: 0, left: 0, right: 0, background: '#0F1628', borderTop: '1px solid #1E2D4A', display: 'flex', zIndex: 20, maxWidth: '480px', margin: '0 auto' },
    tab: (active: boolean) => ({ flex: 1, padding: '0.75rem 0.25rem 0.5rem', background: 'transparent', border: 'none', color: active ? '#0d9488' : '#4A6280', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.25rem', borderTop: active ? '2px solid #0d9488' : '2px solid transparent', transition: 'all 0.15s' }),
    card: { background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, padding: '1rem', marginBottom: '1rem' } as React.CSSProperties,
    btn: (variant: 'primary' | 'secondary' | 'danger') => ({ width: '100%', padding: '0.875rem', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: variant === 'primary' ? '#0d9488' : variant === 'danger' ? '#EF4444' : '#162036', color: variant === 'secondary' ? '#E8F4FF' : '#fff', transition: 'opacity 0.15s' }),
    pill: (color: string) => ({ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 600, background: color + '20', color }),
    label: { fontSize: '0.8rem', color: '#8BA3BF', display: 'block', marginBottom: '0.4rem' },
    select: { width: '100%', background: '#162036', border: '1px solid #1E2D4A', color: '#E8F4FF', padding: '0.75rem', borderRadius: 8, fontSize: '0.95rem', marginBottom: '1rem' } as React.CSSProperties,
    input: { width: '100%', background: '#162036', border: '1px solid #1E2D4A', color: '#E8F4FF', padding: '0.75rem', borderRadius: 8, fontSize: '0.95rem', marginBottom: '1rem', boxSizing: 'border-box' as const } as React.CSSProperties,
  }

  const TABS = [
    { id: 'jobs', label: 'Jobs', Icon: Clipboard },
    { id: 'survey', label: 'Survey', Icon: FileEdit },
    { id: 'photos', label: 'Photos', Icon: Camera },
    { id: 'notes', label: 'Notes', Icon: Mic },
    { id: 'submit', label: 'Submit', Icon: Send },
  ]

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#E8F4FF' }}>Avorria AOS</div>
          <div style={{ fontSize: '0.75rem', color: '#8BA3BF' }}>{activeJob?.address || 'No job selected'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isOnline
            ? <span style={{ ...s.pill('#10B981'), display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Wifi size={10} /> Online</span>
            : <span style={{ ...s.pill('#EF4444'), display: 'flex', alignItems: 'center', gap: '0.3rem' }}><WifiOff size={10} /> Offline</span>
          }
        </div>
      </div>

      <div style={{ padding: '1rem' }}>

        {/* ── JOBS TAB ─────────────────────────────────────────────────────── */}
        {activeTab === 'jobs' && (
          <div>
            <p style={{ color: '#8BA3BF', fontSize: '0.9rem', margin: '0 0 1rem' }}>Today's schedule — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            {MOCK_JOBS.map(job => (
              <div key={job.id} style={{ ...s.card, borderLeft: `3px solid ${job.status === 'en_route' ? '#F59E0B' : job.status === 'on_site' ? '#10B981' : '#4A6280'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#8BA3BF', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {job.time}</span>
                  <span style={s.pill(job.status === 'en_route' ? '#F59E0B' : job.status === 'on_site' ? '#10B981' : '#4A6280')}>{job.status.replace('_', ' ')}</span>
                </div>
                <h3 style={{ margin: '0 0 0.3rem', fontSize: '0.95rem', color: '#E8F4FF' }}>{job.address}</h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#8BA3BF' }}>{job.service}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    style={{ ...s.btn('primary'), flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
                    onClick={() => { setActiveJobId(job.id); setActiveTab('survey') }}
                  >
                    {job.status === 'not_started' ? 'Start Job' : 'Continue'}
                  </button>
                  <a
                    href={`https://maps.google.com?q=${encodeURIComponent(job.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...s.btn('secondary'), flex: 'none' as any, width: 44, padding: '0.65rem', borderRadius: 8, border: '1px solid #1E2D4A', textDecoration: 'none' }}
                  >
                    <Navigation size={16} color="#0d9488" />
                  </a>
                </div>
                {job.accessInstructions && (
                  <div style={{ marginTop: '0.75rem', background: '#162036', padding: '0.75rem', borderRadius: 8, fontSize: '0.8rem', color: '#8BA3BF', borderLeft: '3px solid #0d9488' }}>
                    <strong style={{ color: '#E8F4FF' }}>Access: </strong>{job.accessInstructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── SURVEY TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'survey' && (
          <div>
            {/* Section Pills */}
            <div style={{ overflowX: 'auto', display: 'flex', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
              {SURVEY_SECTIONS.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => setSurveySection(idx)}
                  style={{ flexShrink: 0, padding: '0.4rem 0.8rem', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: surveySection === idx ? '#0d9488' : '#162036', color: surveySection === idx ? '#fff' : '#8BA3BF', transition: 'all 0.15s' }}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {lastSaved && <p style={{ fontSize: '0.72rem', color: '#4A6280', marginBottom: '1rem', textAlign: 'right' }}>Saved locally {lastSaved}</p>}

            {/* Property Section */}
            {surveySection === 0 && (
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Property Details</h3>
                <label style={s.label}>Property Type</label>
                <select style={s.select} value={surveyData.propertyType || ''} onChange={e => updateSurvey('propertyType', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>Flat</option><option>Terraced</option><option>Semi-Detached</option><option>Detached</option><option>Bungalow</option>
                </select>
                <label style={s.label}>Construction Year Band</label>
                <select style={s.select} value={surveyData.constructionYear || ''} onChange={e => updateSurvey('constructionYear', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>Pre 1900</option><option>1900-1929</option><option>1930-1949</option><option>1950-1966</option>
                  <option>1967-1975</option><option>1976-1982</option><option>1983-1990</option><option>1991-1995</option>
                  <option>1996-2002</option><option>2003-2006</option><option>2007-2011</option><option>2012 onwards</option>
                </select>
                <label style={s.label}>Total Floor Area (m²)</label>
                <input type="number" style={s.input} value={surveyData.floorArea || ''} onChange={e => updateSurvey('floorArea', e.target.value)} placeholder="e.g. 85" />
              </div>
            )}

            {/* Walls Section */}
            {surveySection === 1 && (
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Walls</h3>
                {photos.some(p => p.tags.includes('Cavity Wall') || p.tags.includes('Solid Wall')) && (
                  <div style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.8rem', color: '#0d9488' }}>✨ Auto-suggested from photo analysis</div>
                )}
                <label style={s.label}>Wall Construction</label>
                <select style={s.select} value={surveyData.wallType || ''} onChange={e => updateSurvey('wallType', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>Solid Brick</option><option>Cavity (Unfilled)</option><option>Cavity (Filled)</option>
                  <option>Timber Frame</option><option>Stone</option><option>System Built</option>
                </select>
                <label style={s.label}>Wall Insulation</label>
                <select style={s.select} value={surveyData.wallInsulation || ''} onChange={e => updateSurvey('wallInsulation', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>No insulation</option><option>Cavity fill</option><option>External insulation</option><option>Internal insulation</option>
                </select>
              </div>
            )}

            {/* Roof Section */}
            {surveySection === 2 && (
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Roof & Loft</h3>
                <label style={s.label}>Roof Type</label>
                <select style={s.select} value={surveyData.roofType || ''} onChange={e => updateSurvey('roofType', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>Pitched — accessible loft</option><option>Pitched — no loft</option><option>Flat</option><option>Room in roof</option>
                </select>
                <label style={s.label}>Loft Insulation Thickness</label>
                <select style={s.select} value={surveyData.roofInsulation || ''} onChange={e => updateSurvey('roofInsulation', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>None</option><option>12mm</option><option>25mm</option><option>50mm</option><option>75mm</option>
                  <option>100mm</option><option>150mm</option><option>200mm+</option>
                </select>
              </div>
            )}

            {/* Windows Section */}
            {surveySection === 3 && (
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Windows & Glazing</h3>
                <label style={s.label}>Glazing Type</label>
                <select style={s.select} value={surveyData.windowType || ''} onChange={e => updateSurvey('windowType', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>Single glazed</option><option>Double glazed — pre 2002</option><option>Double glazed — 2002 or later</option>
                  <option>Triple glazed</option><option>Secondary glazing</option>
                </select>
              </div>
            )}

            {/* Heating Section */}
            {surveySection === 4 && (
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Heating System</h3>
                {photos.some(p => p.tags.some(t => ['Combi Boiler','Regular Boiler','Heat Pump ASHP'].includes(t))) && (
                  <div style={{ background: 'rgba(13,148,136,0.1)', border: '1px solid rgba(13,148,136,0.3)', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.8rem', color: '#0d9488' }}>✨ Heating type detected from photo</div>
                )}
                <label style={s.label}>Main Heating System</label>
                <select style={s.select} value={surveyData.mainHeatType || ''} onChange={e => updateSurvey('mainHeatType', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>Gas condensing combi boiler</option><option>Gas condensing regular boiler</option>
                  <option>Gas back boiler</option><option>Air source heat pump</option><option>Ground source heat pump</option>
                  <option>Electric storage heaters</option><option>Electric panel heaters</option><option>Oil boiler</option><option>LPG boiler</option>
                </select>
                <label style={s.label}>Heating Controls</label>
                <select style={s.select} value={surveyData.heatingControls || ''} onChange={e => updateSurvey('heatingControls', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>Programmer + room thermostat + TRVs</option><option>Programmer + room thermostat</option>
                  <option>Smart controls (e.g. Nest/Hive)</option><option>Programmer only</option><option>No controls</option>
                </select>
              </div>
            )}

            {/* Hot Water */}
            {surveySection === 5 && (
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Hot Water</h3>
                <label style={s.label}>Hot Water System</label>
                <select style={s.select} value={surveyData.hotWaterSystem || ''} onChange={e => updateSurvey('hotWaterSystem', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>From same boiler (combi)</option><option>From boiler + cylinder (regular)</option>
                  <option>Immersion heater</option><option>Heat pump</option><option>Solar thermal + boiler backup</option>
                </select>
              </div>
            )}

            {/* Lighting */}
            {surveySection === 6 && (
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Lighting</h3>
                <label style={s.label}>% of fixed light fittings with low-energy bulbs</label>
                <select style={s.select} value={surveyData.lightingPct || ''} onChange={e => updateSurvey('lightingPct', e.target.value)}>
                  <option value=''>Select...</option>
                  <option>0%</option><option>25%</option><option>50%</option><option>75%</option><option>100% (all LED/CFL)</option>
                </select>
              </div>
            )}

            {/* Renewables */}
            {surveySection === 7 && (
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Renewables & Generation</h3>
                {['Solar PV panels', 'Solar thermal', 'Wind turbine', 'None'].map(option => (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', cursor: 'pointer', color: '#E8F4FF', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={surveyData.renewables?.includes(option)}
                      onChange={e => {
                        const curr = surveyData.renewables || []
                        if (e.target.checked) updateSurvey('renewables', [...curr, option])
                        else updateSurvey('renewables', curr.filter((r: string) => r !== option))
                      }}
                      style={{ width: 20, height: 20, accentColor: '#0d9488' }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button style={{ ...s.btn('secondary'), flex: 1, opacity: surveySection === 0 ? 0.4 : 1 }} onClick={() => setSurveySection(p => Math.max(0, p - 1))} disabled={surveySection === 0}>
                ← Previous
              </button>
              <button style={{ ...s.btn('primary'), flex: 1, opacity: surveySection === SURVEY_SECTIONS.length - 1 ? 0.4 : 1 }} onClick={() => setSurveySection(p => Math.min(SURVEY_SECTIONS.length - 1, p + 1))} disabled={surveySection === SURVEY_SECTIONS.length - 1}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── PHOTOS TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'photos' && (
          <div>
            {/* Required checklist */}
            <div style={s.card}>
              <h3 style={{ fontSize: '0.95rem', color: '#E8F4FF', margin: '0 0 0.75rem' }}>Evidence Checklist ({requiredDoneCount}/{REQUIRED_PHOTOS.length})</h3>
              {completedRequired.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <CheckCircle size={16} color={r.done ? '#10B981' : '#4A6280'} />
                  <span style={{ fontSize: '0.85rem', color: r.done ? '#E8F4FF' : '#8BA3BF' }}>{r.label}</span>
                </div>
              ))}
            </div>

            <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handlePhotoCapture} style={{ display: 'none' }} />
            <button style={{ ...s.btn('primary'), marginBottom: '1rem' }} onClick={() => fileRef.current?.click()}>
              <Camera size={18} /> Take Photo
            </button>

            {/* Photo grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {photos.map(p => (
                <div key={p.id} style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={p.url} alt="Evidence" style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                    {p.status === 'analyzing' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,13,24,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Loader2 size={20} color="#0d9488" style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontSize: '0.65rem', color: '#E8F4FF' }}>Analysing...</span>
                      </div>
                    )}
                    {p.evidenceQuality === 'unusable' && (
                      <div style={{ position: 'absolute', top: 4, right: 4 }}>
                        <span style={{ background: '#EF4444', color: '#fff', fontSize: '0.6rem', padding: '0.15rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>RETAKE</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '0.5rem' }}>
                    {p.status === 'complete' && (
                      <>
                        <div style={{ fontSize: '0.72rem', color: '#E8F4FF', fontWeight: 600, marginBottom: '0.3rem' }}>{p.primaryElement}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                          {p.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} style={{ background: '#162036', color: '#0d9488', padding: '0.1rem 0.35rem', borderRadius: 3, fontSize: '0.6rem' }}>{tag}</span>
                          ))}
                        </div>
                      </>
                    )}
                    {p.status === 'error' && <span style={{ fontSize: '0.72rem', color: '#EF4444' }}>Analysis failed</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NOTES TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'notes' && (
          <div>
            {/* Voice Notes */}
            <div style={s.card}>
              <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Voice Dictation</h3>
              <button
                onClick={toggleVoice}
                disabled={!voiceSupported}
                style={{
                  width: 72, height: 72, borderRadius: '50%', border: 'none', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: voiceSupported ? 'pointer' : 'not-allowed',
                  background: !voiceSupported ? '#162036' : isListening ? '#EF4444' : '#0d9488',
                  boxShadow: isListening ? '0 0 0 8px rgba(239,68,68,0.2)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Mic size={28} color="#fff" />
              </button>
              {!voiceSupported && <p style={{ color: '#8BA3BF', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1rem' }}>Voice not available — use text notes below</p>}
              {isListening && <p style={{ color: '#EF4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '0.5rem' }}>● Listening... speak clearly in English</p>}
              {interimText && <p style={{ color: '#8BA3BF', fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>{interimText}</p>}
              {voiceError && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{voiceError}</p>}
              {voiceTranscript && (
                <div style={{ background: '#162036', padding: '0.75rem', borderRadius: 8, borderLeft: '3px solid #0d9488', marginBottom: '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>"{voiceTranscript}"</p>
                </div>
              )}
              {isListening && (
                <button style={{ ...s.btn('danger'), marginTop: '0.5rem' }} onClick={toggleVoice}>Stop Recording</button>
              )}
            </div>

            {/* Text Notes */}
            <div style={s.card}>
              <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 0.75rem' }}>Additional Notes</h3>
              <textarea
                style={{ ...s.input, height: 120, resize: 'none', marginBottom: 0 }}
                placeholder="Add observations, special circumstances, access notes..."
                value={textNotes}
                onChange={e => { setTextNotes(e.target.value); updateSurvey('assessorNotes', e.target.value) }}
              />
              <p style={{ fontSize: '0.72rem', color: '#4A6280', textAlign: 'right', margin: '0.25rem 0 0' }}>{textNotes.length} chars</p>
            </div>
          </div>
        )}

        {/* ── SUBMIT TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'submit' && (
          <div>
            {submitDone ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={64} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                <h2 style={{ color: '#E8F4FF', margin: '0 0 0.5rem' }}>Survey Submitted!</h2>
                <p style={{ color: '#8BA3BF', marginBottom: '2rem' }}>Your survey has been sent for QA review. The certificate process begins now.</p>
                <button style={s.btn('secondary')} onClick={() => { setActiveTab('jobs'); setSubmitDone(false) }}>Back to Jobs</button>
              </div>
            ) : (
              <>
                {/* Pre-submit checklist */}
                <div style={s.card}>
                  <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: '0 0 1rem' }}>Pre-Submission Checklist</h3>
                  {[
                    { label: 'Property details entered', done: !!(surveyData.propertyType && surveyData.constructionYear) },
                    { label: 'Heating system recorded', done: !!surveyData.mainHeatType },
                    { label: `Photos captured (${photos.filter(p => p.status === 'complete').length} total)`, done: photos.filter(p => p.status === 'complete').length >= 3 },
                    { label: `Required evidence (${requiredDoneCount}/${REQUIRED_PHOTOS.length})`, done: requiredDoneCount >= 4 },
                    { label: 'Notes added', done: !!(voiceTranscript || textNotes) },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <CheckCircle size={16} color={item.done ? '#10B981' : '#4A6280'} />
                      <span style={{ fontSize: '0.9rem', color: item.done ? '#E8F4FF' : '#8BA3BF' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Audit Checker */}
                <button
                  style={{ ...s.btn('primary'), marginBottom: '1rem' }}
                  onClick={runAuditCheck}
                  disabled={auditLoading}
                >
                  {auditLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Running AI Audit...</> : '🔍 Run AI Audit Check'}
                </button>

                {auditResult && (
                  <div style={s.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: 0 }}>Audit Results</h3>
                      <span style={{
                        padding: '0.3rem 0.8rem', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 700,
                        background: auditResult.overall_status === 'pass' ? 'rgba(16,185,129,0.15)' : auditResult.overall_status === 'pass_with_warnings' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: auditResult.overall_status === 'pass' ? '#10B981' : auditResult.overall_status === 'pass_with_warnings' ? '#F59E0B' : '#EF4444'
                      }}>
                        {auditResult.overall_status === 'pass' ? '✓ PASS' : auditResult.overall_status === 'pass_with_warnings' ? '⚠ WARNINGS' : '✗ ISSUES FOUND'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#8BA3BF', marginBottom: '1rem' }}>{auditResult.summary}</p>

                    {/* Critical flags */}
                    {(auditResult.flags || []).filter((f: any) => f.severity === 'critical').map((f: any, i: number) => (
                      <div key={i} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', padding: '0.75rem', borderRadius: 8, marginBottom: '0.5rem' }}>
                        <p style={{ margin: '0 0 0.25rem', fontWeight: 700, color: '#EF4444', fontSize: '0.85rem' }}>⛔ {f.field}: {f.issue}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#8BA3BF' }}>{f.suggestion}</p>
                      </div>
                    ))}

                    {/* Warning flags */}
                    {(auditResult.flags || []).filter((f: any) => f.severity === 'warning').map((f: any, i: number) => (
                      <div key={i} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.75rem', borderRadius: 8, marginBottom: '0.5rem' }}>
                        <p style={{ margin: '0 0 0.25rem', fontWeight: 600, color: '#F59E0B', fontSize: '0.85rem' }}>⚠ {f.field}: {f.issue}</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#8BA3BF' }}>{f.suggestion}</p>
                      </div>
                    ))}

                    {/* Positive notes */}
                    {(auditResult.positive_notes || []).length > 0 && (
                      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.75rem', borderRadius: 8, marginTop: '0.75rem' }}>
                        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: '#10B981', fontSize: '0.85rem' }}>✓ Well done</p>
                        {(auditResult.positive_notes || []).map((n: string, i: number) => (
                          <p key={i} style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#8BA3BF' }}>• {n}</p>
                        ))}
                      </div>
                    )}

                    <button
                      style={{ ...s.btn('primary'), marginTop: '1.25rem', opacity: auditResult.can_submit ? 1 : 0.4, cursor: auditResult.can_submit ? 'pointer' : 'not-allowed' }}
                      onClick={auditResult.can_submit ? handleSubmit : undefined}
                    >
                      <Send size={16} /> {auditResult.can_submit ? 'Submit to QA' : 'Resolve Issues First'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>

      {/* Bottom Tab Bar */}
      <div style={s.tabBar}>
        {TABS.map(tab => (
          <button key={tab.id} style={s.tab(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
            <tab.Icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function AosMobilePage() {
  return (
    <React.Suspense fallback={<div style={{ display: 'flex', height: '100vh', backgroundColor: '#080D18', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={48} style={{ color: '#9BFF59', animation: 'spin 1s linear infinite' }} /></div>}>
      <AosMobileContent />
    </React.Suspense>
  )
}
