'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation, Clock, CheckCircle, AlertTriangle, Smartphone, MapPin, Calendar as CalIcon, Loader2, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Job {
  id: string
  booking_ref: string
  property_address: string
  service_type: string
  preferred_time_slot: string
  assessor_status: string
  status: string
  price_gbp: number
  customer_name: string
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AosDashboardPage() {
  const [activeTab, setActiveTab] = useState('dispatch')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [onlineAssessors, setOnlineAssessors] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    
    // Fetch initial today's jobs
    const fetchJobs = async () => {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, booking_ref, service_type, preferred_time_slot, assessor_status, status, price_gbp,
          customers ( full_name ), properties ( address_line_1, town, postcode )
        `)
        .gte('preferred_date', today)
        .order('preferred_time_slot')
      
      if (!error && data) {
        const formatted = data.map((b: any) => ({
          id: b.id,
          booking_ref: b.booking_ref,
          property_address: `${b.properties?.address_line_1 || ''}, ${b.properties?.town || ''}`,
          service_type: b.service_type,
          preferred_time_slot: b.preferred_time_slot,
          assessor_status: b.assessor_status || 'not_started',
          status: b.status,
          price_gbp: b.price_gbp,
          customer_name: b.customers?.full_name || 'Unknown'
        }))
        setJobs(formatted)
        
        // Count assessors with active jobs today
        const activeCount = formatted.filter(j => ['en_route', 'on_site'].includes(j.assessor_status)).length
        setOnlineAssessors(Math.max(1, activeCount)) // Mock at least 1 for UI
      }
      setLoading(false)
    }

    fetchJobs()

    // Realtime subscription
    const channel = supabase
      .channel('dispatch-jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, payload => {
        if (payload.eventType === 'UPDATE') {
          setJobs(prev => prev.map(j => j.id === payload.new.id ? { ...j, assessor_status: payload.new.assessor_status, status: payload.new.status } : j))
        } else if (payload.eventType === 'INSERT') {
          // Simplistic insert handling — in reality needs join fetch
          fetchJobs()
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const stats = {
    notStarted: jobs.filter(j => j.assessor_status === 'not_started').length,
    enRoute: jobs.filter(j => j.assessor_status === 'en_route').length,
    onSite: jobs.filter(j => j.assessor_status === 'on_site').length,
    completed: jobs.filter(j => ['survey_complete', 'submitted_qa', 'done'].includes(j.assessor_status)).length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return { bg: 'rgba(74,98,128,0.1)', color: '#8BA3BF', border: '#1E2D4A', label: 'Not Started' }
      case 'en_route': return { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'transparent', label: 'En Route' }
      case 'on_site': return { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: 'transparent', label: 'On Site' }
      case 'survey_complete': 
      case 'submitted_qa': return { bg: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'transparent', label: 'Complete' }
      default: return { bg: 'rgba(74,98,128,0.1)', color: '#8BA3BF', border: '#1E2D4A', label: status.replace('_', ' ') }
    }
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', color: '#E8F4FF', margin: '0 0 0.5rem', fontWeight: 700 }}>
            Avorria AOS
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#8BA3BF', fontSize: '0.95rem' }}>
            <span>Central Dispatch</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4A6280' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CalIcon size={14} /> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4A6280' }} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} /> {onlineAssessors} Assessors Online</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#162036', color: '#E8F4FF', border: '1px solid #1E2D4A', padding: '0.75rem 1.5rem', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Plus size={18} /> Manual Booking
          </button>
          <Link href="/aos/mobile?tab=jobs" style={{ background: '#0d9488', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={18} /> Open Field App
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Not Started', count: stats.notStarted, color: '#8BA3BF', bg: '#162036' },
          { label: 'En Route', count: stats.enRoute, color: '#3B82F6', bg: '#162036' },
          { label: 'On Site', count: stats.onSite, color: '#F59E0B', bg: '#162036' },
          { label: 'Complete', count: stats.completed, color: '#10B981', bg: '#162036' },
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, border: '1px solid #1E2D4A', borderRadius: 12, padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = stat.color} onMouseLeave={e => e.currentTarget.style.borderColor = '#1E2D4A'}>
            <span style={{ color: '#E8F4FF', fontWeight: 600 }}>{stat.label}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.count}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Main Job List */}
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1E2D4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#E8F4FF', margin: 0 }}>Live Dispatch Queue</h2>
            {loading && <Loader2 size={16} color="#0d9488" style={{ animation: 'spin 1s linear infinite' }} />}
          </div>

          {jobs.length === 0 && !loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8BA3BF' }}>No jobs scheduled for today.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#162036', borderBottom: '1px solid #1E2D4A' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600 }}>Time</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600 }}>Address & Customer</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600 }}>Service</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const s = getStatusColor(job.assessor_status)
                  return (
                    <tr key={job.id} style={{ borderBottom: '1px solid #1E2D4A', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#162036'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1rem 1.5rem', color: '#E8F4FF', fontWeight: 600 }}>{job.preferred_time_slot}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ color: '#E8F4FF', fontWeight: 500, marginBottom: '0.2rem' }}>{job.property_address}</div>
                        <div style={{ color: '#8BA3BF', fontSize: '0.85rem' }}>{job.customer_name} — {job.booking_ref}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#E8F4FF' }}>{job.service_type}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ display: 'inline-block', padding: '0.3rem 0.75rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button style={{ background: 'transparent', border: 'none', color: '#0d9488', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>View Details</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Audit Warnings Panel */}
          <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #1E2D4A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#EF4444" /> QA Alerts
              </h3>
              <span style={{ background: '#EF4444', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: 9999 }}>1 New</span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              {/* Mock alert — in reality map over recent critical audit_log entries */}
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '1rem', borderRadius: 8, borderLeft: '3px solid #EF4444', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>CRITICAL</span>
                  <span style={{ fontSize: '0.75rem', color: '#8BA3BF' }}>10 mins ago</span>
                </div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#E8F4FF', fontWeight: 600 }}>Missing Boiler Evidence</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#8BA3BF', lineHeight: 1.4 }}>Assessor submitted "Combi Boiler" but no matching photo evidence was found. Ref: AVR-20231024-X8F2</p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #1E2D4A' }}>
              <h3 style={{ fontSize: '1rem', color: '#E8F4FF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="#0d9488" /> Assessor Map
              </h3>
            </div>
            <div style={{ height: 250, background: '#162036', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <MapPin size={32} color="#4A6280" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ color: '#8BA3BF', fontSize: '0.85rem', margin: 0 }}>Enable GPS tracking in mobile app settings to show live assessor positions here.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
