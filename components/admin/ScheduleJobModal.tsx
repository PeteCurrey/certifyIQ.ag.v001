'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format, parseISO, addMinutes } from 'date-fns'
import { X, Clock, User, CheckCircle, AlertTriangle, Loader } from 'lucide-react'

interface ScheduleJobModalProps {
  bookingId: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (slotId?: string) => void
}

interface AvailableSlot {
  slotId: string
  assessorId: string
  assessorName: string
  startDatetime: string
  endDatetime: string
  assessmentEnd: string
  travelMinutes: number
  distanceMiles: number
  requiresOvernight: boolean
  rank: number
}

export default function ScheduleJobModal({ bookingId, isOpen, onClose, onConfirm }: ScheduleJobModalProps) {
  const [booking, setBooking] = useState<any>(null)
  const [step, setStep] = useState<'search' | 'slots' | 'confirm' | 'done'>('search')
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [notes, setNotes] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (!isOpen || !bookingId) return
    setStep('search')
    setSlots([])
    setSelectedSlot(null)
    setError(null)

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const twoWeeks = new Date(tomorrow)
    twoWeeks.setDate(twoWeeks.getDate() + 14)
    setDateFrom(tomorrow.toISOString().split('T')[0])
    setDateTo(twoWeeks.toISOString().split('T')[0])

    supabase
      .from('bookings')
      .select('*, properties(address_line_1, town, postcode), customers(full_name)')
      .eq('id', bookingId)
      .maybeSingle()
      .then(({ data }) => setBooking(data))
  }, [bookingId, isOpen])

  async function searchSlots() {
    if (!dateFrom || !dateTo) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/schedule/available-slots?bookingId=${bookingId}&from=${dateFrom}&to=${dateTo}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setSlots(json.slots || [])
      setStep('slots')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function confirmSlot() {
    if (!selectedSlot) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/schedule/confirm-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, slot: selectedSlot, adminNotes: notes })
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setStep('done')
      setTimeout(() => {
        onConfirm(selectedSlot.slotId)
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 100, backdropFilter: 'blur(4px)'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw', maxWidth: 620, zIndex: 101, borderRadius: 16,
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden',
        fontFamily: 'var(--font-body)'
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-headings)' }}>
              {step === 'done' ? 'Scheduled!' : 'Schedule Job'}
            </h2>
            {booking && (
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {booking.booking_ref} · {booking.properties?.address_line_1}, {booking.properties?.postcode}
              </p>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Progress steps */}
        <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {['search', 'slots', 'confirm'].map((s, i) => (
            <React.Fragment key={s}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                background: ['search', 'slots', 'confirm'].indexOf(step) >= i ? '#0d9488' : 'var(--bg-surface-elevated)',
                color: ['search', 'slots', 'confirm'].indexOf(step) >= i ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s'
              }}>{i + 1}</div>
              <span style={{ fontSize: '0.75rem', color: step === s ? '#0d9488' : 'var(--text-muted)', fontWeight: step === s ? 600 : 400, textTransform: 'capitalize' }}>{s}</span>
              {i < 2 && <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

          {/* STEP: SEARCH */}
          {step === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Choose a date range and the engine will find available assessor slots based on location, service type, and capacity.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>From</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '0.6rem 0.75rem', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.875rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>To</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '0.6rem 0.75rem', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
              {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.75rem', color: '#ef4444', fontSize: '0.85rem' }}>{error}</div>}
            </div>
          )}

          {/* STEP: SLOTS */}
          {step === 'slots' && (
            <div>
              {slots.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  <AlertTriangle size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                  <p style={{ margin: 0 }}>No available slots found for this period.</p>
                  <button onClick={() => setStep('search')} style={{
                    marginTop: 12, background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '0.5rem 1rem',
                    cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.85rem'
                  }}>
                    Try different dates
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {slots.length} slots found. Sorted by travel efficiency.
                  </p>
                  {slots.map((slot, i) => (
                    <div
                      key={slot.slotId || i}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        background: selectedSlot === slot ? 'rgba(13,148,136,0.08)' : 'var(--bg-surface-elevated)',
                        border: `1px solid ${selectedSlot === slot ? '#0d9488' : 'var(--border-subtle)'}`,
                        borderRadius: 8, padding: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      {i === 0 && (
                        <span style={{
                          position: 'absolute', top: -8, right: 8, background: '#0d9488', color: '#fff',
                          fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4, fontWeight: 700
                        }}>BEST MATCH</span>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
                            {format(parseISO(slot.startDatetime), 'EEEE d MMM')}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={12} />
                            {format(parseISO(slot.startDatetime), 'HH:mm')} → {format(parseISO(slot.assessmentEnd || slot.endDatetime), 'HH:mm')}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <User size={12} />
                            {slot.assessorName}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🚗 {slot.distanceMiles || 0} mi</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{slot.travelMinutes || 0} min travel</div>
                          {slot.requiresOvernight && (
                            <div style={{ fontSize: '0.7rem', color: '#d97706', marginTop: 2 }}>🌙 Overnight</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP: CONFIRM */}
          {step === 'confirm' && selectedSlot && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.2)', borderRadius: 10, padding: '1.25rem' }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#0d9488', fontWeight: 700 }}>Confirm Slot</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
                  <div><strong>Date:</strong> {format(parseISO(selectedSlot.startDatetime), 'EEEE d MMMM yyyy')}</div>
                  <div><strong>Time:</strong> {format(parseISO(selectedSlot.startDatetime), 'HH:mm')} – {format(parseISO(selectedSlot.assessmentEnd || selectedSlot.endDatetime), 'HH:mm')}</div>
                  <div><strong>Assessor:</strong> {selectedSlot.assessorName}</div>
                  <div><strong>Travel:</strong> ~{selectedSlot.travelMinutes}min · ~{selectedSlot.distanceMiles} miles</div>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Admin Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special instructions for the assessor…"
                  style={{ width: '100%', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '0.6rem 0.75rem', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
              {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.75rem', color: '#ef4444', fontSize: '0.85rem' }}>{error}</div>}
            </div>
          )}

          {/* STEP: DONE */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <CheckCircle size={48} color="#0d9488" style={{ marginBottom: 16 }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontFamily: 'var(--font-headings)' }}>Job Scheduled!</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                The assessor and customer will be notified automatically.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step !== 'done' && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (step === 'slots') setStep('search')
                else if (step === 'confirm') setStep('slots')
                else onClose()
              }}
              style={{ background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0.6rem 1.25rem', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
            >
              {step === 'search' ? 'Cancel' : '← Back'}
            </button>

            <button
              disabled={loading || (step === 'slots' && !selectedSlot)}
              onClick={() => {
                if (step === 'search') searchSlots()
                else if (step === 'slots') { if (selectedSlot) setStep('confirm') }
                else if (step === 'confirm') confirmSlot()
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.5rem',
                background: '#0d9488', color: '#fff', border: 'none', borderRadius: 8,
                cursor: loading || (step === 'slots' && !selectedSlot) ? 'not-allowed' : 'pointer',
                opacity: (step === 'slots' && !selectedSlot) ? 0.5 : 1,
                fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit'
              }}
            >
              {loading && <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />}
              {step === 'search' && 'Find Available Slots →'}
              {step === 'slots' && 'Select This Slot →'}
              {step === 'confirm' && 'Confirm & Notify →'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
