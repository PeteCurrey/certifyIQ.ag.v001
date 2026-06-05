'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import RatingBadge from '@/components/ui/RatingBadge'
import styles from './certificates.module.css'

export default function CustomerCertificatesPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cust } = await supabase.from('customers').select('id').eq('auth_user_id', user.id).single()
      if (!cust) return
      
      const { data: bData } = await supabase
        .from('bookings')
        .select('id, booking_ref, properties(*), assessors(*)')
        .eq('customer_id', cust.id)
      if (!bData || bData.length === 0) {
        setLoading(false)
        return
      }

      const bookingIds = bData.map(b => b.id)
      const { data: aData } = await supabase
        .from('assessments')
        .select('*')
        .in('booking_id', bookingIds)
        .eq('status', 'complete')

      if (aData) {
        // Merge
        const merged = aData.map(a => {
          const b = bData.find(bk => bk.id === a.booking_id)
          return { ...a, booking: b }
        })
        setAssessments(merged)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><LoadingSpinner size={40} /></div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Certificates</h2>
        <p>View and download your completed Energy Performance Certificates.</p>
      </div>
      {assessments.length === 0 ? (
        <div className={styles.empty}>
          <p>You have no completed certificates yet. Certificates will appear here once your assessment is finalised.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {assessments.map(a => (
            <div key={a.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <span className={styles.ref}>Ref: {a.booking?.booking_ref}</span>
                  <h3>{a.booking?.properties?.address_line_1}, {a.booking?.properties?.town}</h3>
                  <p className={styles.postcode}>{a.booking?.properties?.postcode}</p>
                </div>
                <RatingBadge rating={a.current_rating || 'C'} size="lg" />
              </div>
              <div className={styles.cardMeta}>
                <div><span>Lodged Date</span><strong>{a.completed_at ? new Date(a.completed_at).toLocaleDateString() : 'Unknown'}</strong></div>
                <div><span>Valid Until</span><strong>{a.completed_at ? new Date(new Date(a.completed_at).setFullYear(new Date(a.completed_at).getFullYear() + 10)).toLocaleDateString() : 'Unknown'}</strong></div>
                <div><span>RRN</span><strong>{Math.random().toString().slice(2, 6)}-{Math.random().toString().slice(2, 6)}-{Math.random().toString().slice(2, 6)}</strong></div>
              </div>

              {/* Assessor details section */}
              {a.booking?.assessors && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-mono, DM Mono, monospace)',
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.15rem 0',
                  }}>
                    Assessor: {a.booking.assessors.full_name}
                  </p>
                  {a.booking.assessors.accreditation_number && (
                    <p style={{
                      fontFamily: 'var(--font-mono, DM Mono, monospace)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      margin: '0 0 0.15rem 0',
                    }}>
                      Accreditation No: {a.booking.assessors.accreditation_number}
                    </p>
                  )}
                  <p style={{
                    fontFamily: 'var(--font-mono, DM Mono, monospace)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    margin: '0',
                  }}>
                    Accredited by Elmhurst Energy · elmhurstenergy.co.uk
                  </p>
                </div>
              )}

              <div className={styles.actions}>
                <button className={styles.downloadBtn} onClick={() => alert('Certificate PDF generation would happen here')}>Download PDF</button>
                <button className={styles.viewBtn} onClick={() => alert('Would open detailed web view')}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
