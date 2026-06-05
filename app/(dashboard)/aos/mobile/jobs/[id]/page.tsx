'use client'
import React, { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Clock, Camera, Mic, UploadCloud, CheckCircle, ChevronLeft, Navigation, FileText, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'

const JOB_SECTIONS = [
  { id: 'details', label: 'Details' },
  { id: 'photos', label: 'Photos (AI)' },
  { id: 'survey', label: 'Survey' },
  { id: 'audit', label: 'Audit' },
]

export default function MobileJobPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('details')
  const [photos, setPhotos] = useState<any[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [voiceNote, setVoiceNote] = useState('')
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false)

  const fileRef = useRef<HTMLInputElement>(null)

  // Web Speech API for voice notes
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.')
      return
    }

    if (isRecording) {
      setIsRecording(false)
      // Stop logic handled by recognition object normally, but we mock toggle here
    } else {
      setIsRecording(true)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setVoiceNote(prev => prev + (prev ? ' ' : '') + transcript)
        setIsRecording(false)
      }
      
      recognition.onerror = () => setIsRecording(false)
      recognition.start()
    }
  }

  // Mock Photo Upload + AI Analysis
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create local object URL for immediate display
    const url = URL.createObjectURL(file)
    const newPhoto = { id: Date.now(), url, tags: [], status: 'analyzing', file }
    setPhotos(prev => [...prev, newPhoto])
    setAnalyzingPhoto(true)

    // Call AI analysis
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1]
        const res = await fetch('/api/ai/photo-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, type: file.type })
        })
        const data = await res.json()
        
        setPhotos(prev => prev.map(p => 
          p.id === newPhoto.id 
            ? { ...p, tags: data.tags || ['Unknown'], status: 'complete' } 
            : p
        ))
        setAnalyzingPhoto(false)
      }
      reader.readAsDataURL(file)
    } catch {
      setPhotos(prev => prev.map(p => p.id === newPhoto.id ? { ...p, status: 'error' } : p))
      setAnalyzingPhoto(false)
    }
  }

  return (
    <div style={{ background: '#050810', minHeight: '100vh', color: '#E8F4FF', fontFamily: 'Inter, sans-serif', paddingBottom: '80px' }}>
      
      {/* Mobile Header */}
      <div style={{ background: '#0F1628', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #1E2D4A' }}>
        <Link href="/aos" style={{ color: '#E8F4FF' }}><ChevronLeft size={24} /></Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>14 Mill Lane</h1>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#8BA3BF' }}>Domestic EPC</p>
        </div>
        <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>
          En Route
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#0F1628', borderBottom: '1px solid #1E2D4A', overflowX: 'auto' }}>
        {JOB_SECTIONS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, minWidth: '100px', padding: '1rem 0.5rem', background: 'transparent', border: 'none',
              color: activeTab === tab.id ? '#9BFF59' : '#8BA3BF',
              borderBottom: activeTab === tab.id ? '2px solid #9BFF59' : '2px solid transparent',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '1rem' }}>
        
        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <MapPin size={20} color="#60A5FA" style={{ marginTop: '2px' }} />
                <div>
                  <p style={{ margin: '0 0 0.2rem', color: '#8BA3BF', fontSize: '0.8rem' }}>Location</p>
                  <p style={{ margin: 0, fontWeight: 500 }}>14 Mill Lane, Derby, DE1 3EF</p>
                </div>
              </div>
              <button style={{ width: '100%', padding: '0.75rem', background: '#162036', color: '#60A5FA', border: '1px solid #1E2D4A', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Navigation size={16} /> Navigate
              </button>
            </div>

            <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, padding: '1rem' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#9BFF59" /> Access Instructions
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#8BA3BF', lineHeight: 1.5 }}>
                Key is under the front mat. Tenant is away. Please ensure all lights are turned off and back door is locked before leaving.
              </p>
            </div>

            <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, padding: '1rem' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mic size={18} color="#F59E0B" /> Voice Notes
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button 
                  onClick={handleVoiceToggle}
                  style={{ flex: 1, padding: '0.75rem', background: isRecording ? '#EF4444' : '#162036', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Mic size={16} /> {isRecording ? 'Stop Recording' : 'Dictate Note'}
                </button>
              </div>
              {voiceNote && (
                <div style={{ background: '#162036', padding: '1rem', borderRadius: 8, borderLeft: '3px solid #9BFF59' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>"{voiceNote}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PHOTOS TAB */}
        {activeTab === 'photos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(155, 255, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Camera size={24} color="#9BFF59" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Capture Evidence</h3>
              <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#8BA3BF' }}>Claude AI will automatically tag and categorise your photos.</p>
              
              <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
              <button 
                onClick={() => fileRef.current?.click()}
                style={{ width: '100%', padding: '0.85rem', background: '#9BFF59', color: '#080D18', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1rem' }}
              >
                Take Photo
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {photos.map(p => (
                <div key={p.id} style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 8, overflow: 'hidden' }}>
                  <img src={p.url} alt="Evidence" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                  <div style={{ padding: '0.75rem' }}>
                    {p.status === 'analyzing' ? (
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Loader2 size={12} className="spin" /> Analysing...
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {p.tags.map((tag: string, i: number) => (
                          <span key={i} style={{ background: '#162036', color: '#9BFF59', padding: '0.2rem 0.4rem', borderRadius: 4, fontSize: '0.65rem' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SURVEY TAB */}
        {activeTab === 'survey' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#8BA3BF', fontSize: '0.9rem' }}>Structured data capture. AI will pre-fill based on your voice notes and photos.</p>
            
            <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, padding: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8BA3BF', marginBottom: '0.5rem' }}>Main Heating System</label>
              <select style={{ width: '100%', background: '#162036', border: '1px solid #1E2D4A', color: '#FFF', padding: '0.75rem', borderRadius: 8, fontSize: '1rem' }}>
                <option>Gas Condensing Combi</option>
                <option>Electric Storage Heaters</option>
                <option>Air Source Heat Pump</option>
              </select>
              {photos.some(p => p.tags?.includes('Combi Boiler')) && (
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#9BFF59', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={12} /> Auto-filled from photo
                </p>
              )}
            </div>

            <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, padding: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8BA3BF', marginBottom: '0.5rem' }}>Wall Construction</label>
              <select style={{ width: '100%', background: '#162036', border: '1px solid #1E2D4A', color: '#FFF', padding: '0.75rem', borderRadius: 8, fontSize: '1rem' }}>
                <option>Solid Brick (As Built)</option>
                <option>Cavity (Filled)</option>
                <option>Timber Frame</option>
              </select>
            </div>
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
              <AlertTriangle size={32} color="#F59E0B" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem', color: '#FCD34D' }}>AI Audit Checker</h3>
              <p style={{ margin: '0 0 1.5rem', fontSize: '0.9rem', color: '#FDE68A' }}>
                We checked your photos and survey data. 1 warning found.
              </p>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 8, textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#FFF' }}>• Missing photo of the Gas Meter.</p>
              </div>
            </div>

            <button style={{ width: '100%', padding: '1rem', background: '#10B981', color: '#FFF', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> Submit to QA
            </button>
          </div>
        )}

      </div>
      
      {/* Mobile Bottom Action Bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0F1628', borderTop: '1px solid #1E2D4A', padding: '1rem', display: 'flex', gap: '1rem', zIndex: 20 }}>
        <button style={{ flex: 1, padding: '0.75rem', background: '#9BFF59', color: '#080D18', border: 'none', borderRadius: 8, fontWeight: 700 }}>
          Arrived On Site
        </button>
      </div>
    </div>
  )
}

function Sparkles({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4M3 5h4"/>
    </svg>
  )
}
