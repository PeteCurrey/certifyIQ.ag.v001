'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, ShieldAlert } from 'lucide-react'
import styles from '../admin.module.css'

interface Event {
  id: string
  booking_ref: string
  preferred_date: string
  preferred_time_slot: string
  status: string
  address: string
  clientName: string
  assessor_name: string
}

interface Assessor {
  id: string
  full_name: string
}

export default function CalendarPage() {
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [assessors, setAssessors] = useState<Assessor[]>([])
  const [selectedAssessor, setSelectedAssessor] = useState('all')
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([])
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadCalendarData() {
      try {
        const { data: bookings, error: bookingsErr } = await supabase
          .from('bookings')
          .select('*, customers(full_name), properties(address_line_1), assessors(full_name)')

        if (bookingsErr) throw bookingsErr

        const parsedEvents: Event[] = (bookings || []).map(b => ({
          id: b.id,
          booking_ref: b.booking_ref,
          preferred_date: b.preferred_date,
          preferred_time_slot: b.preferred_time_slot,
          status: b.status,
          address: b.properties?.address_line_1 || 'Unknown Address',
          clientName: b.customers?.full_name || 'Client',
          assessor_name: b.assessors?.full_name || 'Unassigned',
        }))

        setEvents(parsedEvents)

        const { data: assessorsData, error: assessorsErr } = await supabase
          .from('assessors')
          .select('id, full_name')
          .eq('is_active', true)

        if (assessorsErr) throw assessorsErr
        setAssessors(assessorsData || [])
      } catch (err) {
        console.error('Error loading calendar:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCalendarData()
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const days = new Date(year, month + 1, 0).getDate()
    
    // adjust firstDay for Monday start (0=Sunday -> 6=Saturday)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1
    return { adjustedFirstDay, days }
  }

  const { adjustedFirstDay, days } = getDaysInMonth(currentDate)
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const yearName = currentDate.getFullYear()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const filteredEvents = events.filter(e => {
    if (selectedAssessor === 'all') return true
    if (selectedAssessor === 'unassigned') return e.assessor_name === 'Unassigned'
    const assessor = assessors.find(a => a.id === selectedAssessor)
    return e.assessor_name === assessor?.full_name
  })

  const handleDayClick = (dayNum: number) => {
    const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    const dayEvents = filteredEvents.filter(e => e.preferred_date === dayStr)
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents)
      setDetailModalOpen(true)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Synchronizing scheduling console...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header} style={{ marginBottom: '2rem' }}>
        <div>
          <span className={styles.eyebrow}>Planner Control</span>
          <h2>Availability &amp; Jobs Calendar</h2>
        </div>
        
        {/* Assessor Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <User size={16} style={{ color: 'var(--text-secondary)' }} />
          <select
            value={selectedAssessor}
            onChange={(e) => setSelectedAssessor(e.target.value)}
            style={{ background: '#080d18', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 1rem', borderRadius: '8px', outline: 'none' }}
          >
            <option value="all">All Inspectors</option>
            <option value="unassigned">Unassigned</option>
            {assessors.map(a => (
              <option key={a.id} value={a.id}>{a.full_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Header Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        background: 'linear-gradient(145deg, #0d1527 0%, #030712 100%)',
        border: '1px solid var(--border-color)',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
      }}>
        <h3 style={{ fontFamily: 'var(--font-headings)', color: '#fff', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarIcon size={18} style={{ color: 'var(--accent-lime)' }} />
          <span>{monthName} {yearName}</span>
        </h3>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handlePrevMonth} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleNextMonth} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        background: 'linear-gradient(145deg, #0c1425 0%, #020510 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        overflowX: 'auto',
      }}>
        <div style={{ minWidth: '700px' }}>
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {/* Empty padding days */}
            {Array.from({ length: adjustedFirstDay }).map((_, idx) => (
              <div key={`empty-${idx}`} style={{ minHeight: '100px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px' }} />
            ))}

            {/* Calendar Days */}
            {Array.from({ length: days }).map((_, idx) => {
              const dayNum = idx + 1
              const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
              const dayEvents = filteredEvents.filter(e => e.preferred_date === dayStr)

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => handleDayClick(dayNum)}
                  style={{
                    minHeight: '100px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                    transition: 'border-color 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (dayEvents.length > 0) e.currentTarget.style.borderColor = 'var(--accent-lime)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: dayEvents.length > 0 ? '#fff' : 'var(--text-secondary)', fontWeight: 600 }}>
                    {dayNum}
                  </span>

                  {/* Events list */}
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {dayEvents.slice(0, 2).map((ev, eIdx) => {
                      const color = ev.status === 'certificate_issued' ? 'var(--accent-lime)' : 'var(--accent-amber)'
                      return (
                        <div key={eIdx} style={{
                          fontSize: '0.7rem',
                          background: 'rgba(255,255,255,0.03)',
                          borderLeft: `2px solid ${color}`,
                          padding: '0.15rem 0.35rem',
                          borderRadius: '3px',
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {ev.booking_ref}
                        </div>
                      )
                    })}
                    {dayEvents.length > 2 && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {detailModalOpen && selectedDayEvents.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#0d1527',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
          }}>
            <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Scheduled Inspections — {selectedDayEvents[0].preferred_date}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {selectedDayEvents.map((ev, idx) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--accent-lime)' }}>{ev.booking_ref}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {ev.preferred_time_slot}
                    </span>
                  </div>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#fff' }}>
                    <strong>Client:</strong> {ev.clientName}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#fff' }}>
                    <strong>Property:</strong> {ev.address}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#fff' }}>
                    <strong>Assigned To:</strong> {ev.assessor_name}
                  </p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                      Status: {ev.status}
                    </span>
                    <Link href={`/admin/jobs/${ev.id}`} style={{ fontSize: '0.8rem', color: 'var(--accent-lime)', textDecoration: 'none', fontWeight: 600 }}>
                      Manage Job →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDetailModalOpen(false)}
                style={{ background: 'var(--accent-lime)', color: '#000', fontWeight: 600, border: 'none', borderRadius: '6px', padding: '0.5rem 1.25rem', cursor: 'pointer' }}
              >
                Close Planner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
