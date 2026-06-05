'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from './jobs.module.css'

const STATUS_OPTIONS = ['all', 'booked', 'assessor_assigned', 'in_progress', 'awaiting_report', 'completed', 'cancelled', 'rebook_required']

const STATUS_BADGES: Record<string, { label: string; bg: string; color: string }> = {
  booked: { label: 'Booked', bg: '#EFF6FF', color: '#3B82F6' },
  assessor_assigned: { label: 'Assessor Assigned', bg: '#FEF3C7', color: '#D97706' },
  in_progress: { label: 'In Progress', bg: '#FEF9C3', color: '#CA8A04' },
  awaiting_report: { label: 'Awaiting Report', bg: '#FDF4FF', color: '#A855F7' },
  completed: { label: 'Completed', bg: '#F0FDF4', color: '#16A34A' },
  cancelled: { label: 'Cancelled', bg: '#FEF2F2', color: '#DC2626' },
  rebook_required: { label: 'Rebook Required', bg: '#FFF7ED', color: '#EA580C' },
}

export default function AgencyJobsPage() {
  const supabase = createClient()
  const [agencyId, setAgencyId] = useState<string>('')
  const [jobs, setJobs] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: agUser } = await supabase.from('agency_users').select('agency_id').eq('auth_user_id', user.id).single()
      if (!agUser) return
      setAgencyId(agUser.agency_id)
      const { data } = await supabase
        .from('agency_jobs')
        .select('*, agency_properties(address_line_1, town, postcode, property_type), agency_branches(branch_name)')
        .eq('agency_id', agUser.agency_id)
        .order('created_at', { ascending: false })
      setJobs(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    let list = jobs
    if (statusFilter !== 'all') list = list.filter(j => j.status === statusFilter)
    if (search) list = list.filter(j => {
      const addr = `${j.agency_properties?.address_line_1 || ''} ${j.agency_properties?.postcode || ''}`.toLowerCase()
      return addr.includes(search.toLowerCase()) || (j.job_ref || '').toLowerCase().includes(search.toLowerCase())
    })
    setFiltered(list)
  }, [statusFilter, search, jobs])

  const badge = (status: string) => {
    const c = STATUS_BADGES[status] || { label: status, bg: '#F1F5F9', color: '#64748B' }
    return <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, background: c.bg, color: c.color, whiteSpace: 'nowrap' }}>{c.label}</span>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Jobs</h1>
          <p className={styles.subtitle}>Track and manage all booked services</p>
        </div>
        <Link href="/agency/book" className={styles.orderBtn}>+ Order New Service</Link>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search by address or ref…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className={styles.filters}>
          {STATUS_OPTIONS.map(s => (
            <button key={s} className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? 'All' : STATUS_BADGES[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.loading}><div className={styles.spinner} /></div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Property</th>
                  <th>Service</th>
                  <th>Branch</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job: any) => (
                  <tr key={job.id} className={styles.row}>
                    <td className={styles.ref}>{job.job_ref || '—'}</td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{job.agency_properties?.address_line_1 || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{job.agency_properties?.postcode}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{job.service_type?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</td>
                    <td style={{ fontSize: '0.875rem', color: '#64748B' }}>{job.agency_branches?.branch_name || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{job.booked_date ? new Date(job.booked_date).toLocaleDateString('en-GB') : '—'}</td>
                    <td>{badge(job.status)}</td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>£{job.price_gbp || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className={styles.empty}><p>No jobs found. Try adjusting your filters.</p></div>
          )}
        </div>
      </div>
    </div>
  )
}
