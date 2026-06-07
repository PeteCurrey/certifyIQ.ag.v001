'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, CheckCircle, Clock, Search, ExternalLink } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface AuditLog {
  id: string
  booking_id: string
  assessor_id: string
  overall_status: string
  audit_result: {
    flags: Array<{
      severity: string
      category: string
      field: string
      issue: string
      suggestion: string
    }>
    summary: string
  }
  created_at: string
  bookings: {
    booking_ref: string
    properties: {
      address_line_1: string
      town: string
      postcode: string
    }
  }
  assessors: {
    first_name: string
    last_name: string
  }
}

export default function QaAlertsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'flagged' | 'critical'>('flagged')
  const supabase = createClient()

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('aos_audit_log')
        .select(`
          id, booking_id, assessor_id, overall_status, audit_result, created_at,
          bookings ( booking_ref, properties(address_line_1, town, postcode) ),
          assessors ( first_name, last_name )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data) {
        setLogs(data as any)
      }
      setLoading(false)
    }
    fetchLogs()
  }, [])

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true
    if (filter === 'flagged') return log.overall_status !== 'pass'
    if (filter === 'critical') return log.overall_status === 'fail'
    return true
  })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#E8F4FF', margin: '0 0 0.5rem', fontWeight: 700 }}>
            QA Alerts (AI)
          </h1>
          <p style={{ color: '#8BA3BF', margin: 0, fontSize: '0.95rem' }}>
            Automated compliance checks & lodgement warnings
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', background: '#0F1628', padding: '0.25rem', borderRadius: '8px', border: '1px solid #1E2D4A' }}>
          <button 
            onClick={() => setFilter('all')}
            style={{ padding: '0.5rem 1rem', background: filter === 'all' ? '#162036' : 'transparent', color: filter === 'all' ? '#E8F4FF' : '#8BA3BF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >All</button>
          <button 
            onClick={() => setFilter('flagged')}
            style={{ padding: '0.5rem 1rem', background: filter === 'flagged' ? '#162036' : 'transparent', color: filter === 'flagged' ? '#E8F4FF' : '#8BA3BF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >Flagged</button>
          <button 
            onClick={() => setFilter('critical')}
            style={{ padding: '0.5rem 1rem', background: filter === 'critical' ? '#162036' : 'transparent', color: filter === 'critical' ? '#EF4444' : '#8BA3BF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
          >Critical Only</button>
        </div>
      </div>

      <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}><LoadingSpinner size={32} /></div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#8BA3BF' }}>
            <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No QA alerts found for the current filter.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#162036', borderBottom: '1px solid #1E2D4A' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600 }}>Date / Assessor</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600 }}>Job Details</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600 }}>Status & Summary</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: '#8BA3BF', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const isFail = log.overall_status === 'fail'
                const isWarn = log.overall_status === 'pass_with_warnings'
                const badgeColor = isFail ? '#EF4444' : isWarn ? '#F59E0B' : '#10B981'
                const badgeBg = isFail ? 'rgba(239,68,68,0.1)' : isWarn ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'
                const prop = log.bookings?.properties
                
                return (
                  <React.Fragment key={log.id}>
                    <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ color: '#E8F4FF', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {new Date(log.created_at).toLocaleDateString('en-GB')}
                        </div>
                        <div style={{ color: '#8BA3BF', fontSize: '0.85rem' }}>
                          {log.assessors?.first_name} {log.assessors?.last_name}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ color: '#E8F4FF', fontWeight: 500, marginBottom: '0.25rem' }}>
                          {prop?.address_line_1}, {prop?.town}
                        </div>
                        <div style={{ color: '#8BA3BF', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                          {log.bookings?.booking_ref}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 700, background: badgeBg, color: badgeColor, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          {log.overall_status.replace(/_/g, ' ')}
                        </span>
                        <div style={{ color: '#E8F4FF', fontSize: '0.85rem', lineHeight: 1.4 }}>
                          {log.audit_result?.summary || 'No summary provided.'}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        <Link href={`/aos/jobs/${log.booking_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#0d9488', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                          View Job <ExternalLink size={14} />
                        </Link>
                      </td>
                    </tr>
                    
                    {/* Render critical flags directly if any */}
                    {log.audit_result?.flags?.filter((f: any) => f.severity === 'critical').length > 0 && (
                      <tr style={{ borderBottom: '1px solid #1E2D4A', background: 'rgba(239,68,68,0.03)' }}>
                        <td colSpan={4} style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {log.audit_result.flags.filter((f: any) => f.severity === 'critical').map((flag, i) => (
                              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <AlertTriangle size={16} color="#EF4444" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                                <div>
                                  <strong style={{ color: '#E8F4FF', fontSize: '0.85rem', display: 'block', marginBottom: '0.1rem' }}>
                                    {flag.category.replace(/_/g, ' ').toUpperCase()}: {flag.field}
                                  </strong>
                                  <p style={{ margin: 0, color: '#8BA3BF', fontSize: '0.85rem' }}>{flag.issue}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
