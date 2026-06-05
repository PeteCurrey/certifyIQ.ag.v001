'use client'
import React, { useEffect, useState } from 'react'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import styles from './schedule.module.css'

export default function AdminSchedulePage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('bookings')
        .select('*, customers(*), properties(*)')
        .in('status', ['paid', 'scheduled', 'in_progress'])
        .order('preferred_date', { ascending: true })
      setBookings(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><LoadingSpinner size={40} /></div>

  // Group by date
  const byDate = bookings.reduce((acc, b) => {
    const d = b.preferred_date || 'Unscheduled'
    if (!acc[d]) acc[d] = []
    acc[d].push(b)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Job Schedule</h2>
      <p className={styles.sub}>Active and upcoming assessments requiring scheduling or attendance.</p>
      {Object.entries(byDate).length === 0 ? (
        <div className={styles.empty}><p>No active jobs in schedule.</p></div>
      ) : (
        Object.entries(byDate).map(([date, jobs]) => (
          <div key={date} className={styles.dateGroup}>
            <h3 className={styles.dateLabel}>{date}</h3>
            <div className={styles.jobsList}>
              {(jobs as any[]).map(b => (
                <div key={b.id} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <div>
                      <span className={styles.ref}>{b.booking_ref}</span>
                      <h4>{b.properties?.address_line_1}, {b.properties?.town} ({b.properties?.postcode})</h4>
                    </div>
                    <div className={styles.jobMeta}>
                      <StatusBadge status={b.status} />
                      <span className={styles.slot} style={{ textTransform: 'capitalize' }}>{b.preferred_time_slot}</span>
                    </div>
                  </div>
                  <div className={styles.clientRow}>
                    <span>{b.customers?.full_name}</span>
                    <span>{b.customers?.phone}</span>
                    <span>{b.customers?.email}</span>
                  </div>
                  <div className={styles.actions}>
                    <Link href={`/aos/assess/${b.id}`} className={styles.assessBtn}>Start Assessment →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
