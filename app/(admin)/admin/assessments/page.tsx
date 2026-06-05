'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import styles from './assessments.module.css'

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('assessments')
        .select('*, bookings(*, properties(*), customers(*))')
        .order('created_at', { ascending: false })
      setAssessments(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><LoadingSpinner size={40} /></div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Assessments</h2>
      <p className={styles.sub}>All assessment records linked to active and completed bookings.</p>
      {assessments.length === 0 ? (
        <div className={styles.empty}><p>No assessments recorded yet.</p></div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Property</th>
                <th>Client</th>
                <th>Assessment Status</th>
                <th>Started</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map(a => (
                <tr key={a.id}>
                  <td className={styles.ref}>{a.bookings?.booking_ref}</td>
                  <td>
                    <div>{a.bookings?.properties?.address_line_1}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{a.bookings?.properties?.postcode}</div>
                  </td>
                  <td>{a.bookings?.customers?.full_name}</td>
                  <td><span className={`${styles.statusBadge} ${styles['s_' + a.status]}`}>{a.status.replace(/_/g, ' ')}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.started_at ? new Date(a.started_at).toLocaleString('en-GB') : '—'}</td>
                  <td>
                    {a.status !== 'complete' && a.status !== 'exported' ? (
                      <Link href={`/admin/assess/${a.booking_id}`} className={styles.actionBtn}>Open Form</Link>
                    ) : (
                      <span className={styles.completeTag}>Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
