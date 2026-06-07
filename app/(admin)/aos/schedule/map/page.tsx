'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { format, parseISO } from 'date-fns'
import styles from './map.module.css'

const MapView = dynamic(() => import('@/components/admin/MapView'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading map…</div>
})

export default function AosMapPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [assessors, setAssessors] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [slotsRes, assessorsRes] = await Promise.all([
        supabase
          .from('scheduled_slots')
          .select('*, bookings(booking_ref, service_type, price_gbp, properties(address_line_1, town, postcode, latitude, longitude)), assessors(full_name)')
          .gte('start_datetime', `${filterDate}T00:00:00`)
          .lte('start_datetime', `${filterDate}T23:59:59`)
          .neq('status', 'cancelled'),
        supabase.from('assessors').select('*').eq('is_active', true)
      ])
      setJobs(slotsRes.data || [])
      setAssessors(assessorsRes.data || [])
      setLoading(false)
    }
    load()
  }, [filterDate])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Map View</h1>
          <div className={styles.dateControl}>
            <label htmlFor="mapDate">Date:</label>
            <input
              id="mapDate"
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
        </div>
        <div className={styles.viewSwitcher}>
          <Link href="/aos/schedule/kanban" className={styles.viewTab}>Kanban</Link>
          <Link href="/aos/schedule/calendar" className={styles.viewTab}>Calendar</Link>
          <button className={`${styles.viewTab} ${styles.viewTabActive}`}>Map View</button>
          <Link href="/aos/schedule/settings" className={styles.viewTab}>Settings</Link>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <span className={styles.sidebarTitle}>
            {jobs.length} jobs on {format(parseISO(filterDate + 'T12:00:00'), 'dd MMM yyyy')}
          </span>
          {loading ? (
            <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading…</div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No jobs scheduled for this date.</div>
          ) : (
            <div className={styles.jobList}>
              {jobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelected(selected === job.id ? null : job.id)}
                  className={`${styles.jobChip} ${selected === job.id ? styles.jobChipActive : ''}`}
                >
                  <div className={styles.jobTime}>{format(parseISO(job.start_datetime), 'HH:mm')}</div>
                  <div>
                    <div className={styles.jobRef}>{job.bookings?.booking_ref}</div>
                    <div className={styles.jobAddr}>{job.bookings?.properties?.address_line_1}, {job.bookings?.properties?.postcode}</div>
                    <div className={styles.jobAssessor}>{job.assessors?.full_name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.mapWrapper}>
          <MapView jobs={jobs} selectedJobId={selected} onSelectJob={setSelected} />
        </div>
      </div>
    </div>
  )
}
