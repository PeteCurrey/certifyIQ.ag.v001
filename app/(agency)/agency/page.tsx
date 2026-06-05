'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from './dashboard.module.css'

export default function AgencyDashboard() {
  const [agency, setAgency] = useState<any>(null)
  const [stats, setStats] = useState({ inProgress: 0, completed: 0, properties: 0, alerts: 0 })
  const [jobs, setJobs] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: agencyUser } = await supabase
        .from('agency_users')
        .select('*, agencies(*)')
        .eq('auth_user_id', user.id)
        .single()

      if (!agencyUser) { setLoading(false); return }
      setAgency(agencyUser)
      const agencyId = agencyUser.agency_id

      const { data: jobData } = await supabase
        .from('agency_jobs')
        .select('*, agency_properties(address_line_1, town, postcode), agency_branches(branch_name)')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false })
        .limit(20)

      setJobs(jobData || [])

      const inProg = (jobData || []).filter((j: any) => ['booked', 'assessor_assigned', 'in_progress', 'awaiting_report'].includes(j.status)).length
      const done = (jobData || []).filter((j: any) => j.status === 'completed').length

      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() + 90)
      const { data: alertData } = await supabase
        .from('agency_properties')
        .select('id, address_line_1, town, postcode, epc_expiry_date, current_epc_rating')
        .eq('agency_id', agencyId)
        .lte('epc_expiry_date', cutoff.toISOString())
        .order('epc_expiry_date', { ascending: true })
        .limit(5)

      setAlerts(alertData || [])

      const { count } = await supabase
        .from('agency_properties')
        .select('id', { count: 'exact', head: true })
        .eq('agency_id', agencyId)

      setStats({ inProgress: inProg, completed: done, properties: count || 0, alerts: (alertData || []).length })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading your portal…</p>
      </div>
    )
  }

  if (!agency) {
    return (
      <div className={styles.noAgency}>
        <h2>Agency Not Found</h2>
        <p>Your account is not linked to an agency. Please contact Avorria support.</p>
      </div>
    )
  }

  const activeJobs = jobs.filter(j => ['booked', 'assessor_assigned', 'in_progress', 'awaiting_report'].includes(j.status))
  const recentJobs = jobs.slice(0, 8)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, {agency.full_name?.split(' ')[0] || 'Agent'}</h1>
          <p className={styles.subtitle}>{agency.agencies?.name} — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <Link href="/agency/book" className={styles.orderBtn}>+ Order New Service</Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#EFF6FF' }}>
            <span style={{ color: '#3B82F6', fontSize: '1.25rem' }}>◫</span>
          </div>
          <div>
            <div className={styles.statValue}>{stats.inProgress}</div>
            <div className={styles.statLabel}>Jobs In Progress</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#F0FDF4' }}>
            <span style={{ color: '#22C55E', fontSize: '1.25rem' }}>✓</span>
          </div>
          <div>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Completed Jobs</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#F0FDFA' }}>
            <span style={{ color: '#0F766E', fontSize: '1.25rem' }}>⌂</span>
          </div>
          <div>
            <div className={styles.statValue}>{stats.properties}</div>
            <div className={styles.statLabel}>Properties Managed</div>
          </div>
        </div>
        <div className={styles.statCard} style={{ borderColor: stats.alerts > 0 ? '#FCA5A5' : '#E2E8F0' }}>
          <div className={styles.statIconWrap} style={{ background: '#FEF2F2' }}>
            <span style={{ color: '#EF4444', fontSize: '1.25rem' }}>!</span>
          </div>
          <div>
            <div className={styles.statValue} style={{ color: stats.alerts > 0 ? '#EF4444' : undefined }}>{stats.alerts}</div>
            <div className={styles.statLabel}>Compliance Alerts</div>
          </div>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Active Jobs</h2>
            <Link href="/agency/jobs" className={styles.viewAll}>View all →</Link>
          </div>
          {activeJobs.length === 0 ? (
            <div className={styles.empty}>
              <p>No active jobs. Ready to order?</p>
              <Link href="/agency/book" className={styles.emptyBtn}>Order Now</Link>
            </div>
          ) : (
            <div className={styles.jobList}>
              {activeJobs.map((job: any) => (
                <div key={job.id} className={styles.jobRow}>
                  <div className={styles.jobInfo}>
                    <p className={styles.jobAddress}>{job.agency_properties?.address_line_1 || 'No address'}, {job.agency_properties?.postcode}</p>
                    <p className={styles.jobMeta}>{job.service_type?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} • {job.agency_branches?.branch_name}</p>
                  </div>
                  <JobStatusBadge status={job.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Compliance Alerts</h2>
            <Link href="/agency/properties" className={styles.viewAll}>Manage →</Link>
          </div>
          {alerts.length === 0 ? (
            <div className={styles.empty}>
              <p style={{ color: '#22C55E' }}>✔ All properties are compliant</p>
            </div>
          ) : (
            <div className={styles.alertList}>
              {alerts.map((a: any) => {
                const daysLeft = Math.ceil((new Date(a.epc_expiry_date).getTime() - Date.now()) / 86400000)
                return (
                  <div key={a.id} className={styles.alertRow}>
                    <div className={styles.alertIcon}>{daysLeft < 0 ? '⛔' : '⚠️'}</div>
                    <div className={styles.alertInfo}>
                      <p className={styles.alertAddress}>{a.address_line_1}, {a.postcode}</p>
                      <p className={styles.alertMeta}>
                        EPC Band {a.current_epc_rating} • {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : `Expires in ${daysLeft} days`}
                      </p>
                    </div>
                    <Link href="/agency/book" className={styles.renewBtn}>Renew</Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '2rem' }}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Activity</h2>
          <Link href="/agency/jobs" className={styles.viewAll}>View all jobs →</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Job Ref</th>
                <th>Property</th>
                <th>Service</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job: any) => (
                <tr key={job.id}>
                  <td className={styles.jobRef}>{job.job_ref || '—'}</td>
                  <td>{job.agency_properties?.address_line_1 || '—'}, {job.agency_properties?.postcode || ''}</td>
                  <td>{job.service_type?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</td>
                  <td>{job.agency_branches?.branch_name || '—'}</td>
                  <td><JobStatusBadge status={job.status} /></td>
                  <td style={{ color: '#64748B', fontSize: '0.8rem' }}>{new Date(job.created_at).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentJobs.length === 0 && (
            <div className={styles.empty}><p>No jobs yet. Place your first order.</p></div>
          )}
        </div>
      </div>
    </div>
  )
}

function JobStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    booked: { label: 'Booked', bg: '#EFF6FF', color: '#3B82F6' },
    assessor_assigned: { label: 'Assessor Assigned', bg: '#FEF3C7', color: '#D97706' },
    in_progress: { label: 'In Progress', bg: '#FEF9C3', color: '#CA8A04' },
    awaiting_report: { label: 'Awaiting Report', bg: '#FDF4FF', color: '#A855F7' },
    completed: { label: 'Completed', bg: '#F0FDF4', color: '#16A34A' },
    cancelled: { label: 'Cancelled', bg: '#FEF2F2', color: '#DC2626' },
    rebook_required: { label: 'Rebook Required', bg: '#FFF7ED', color: '#EA580C' },
  }
  const c = cfg[status] || { label: status, bg: '#F1F5F9', color: '#64748B' }
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: '100px',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: c.bg,
      color: c.color,
      whiteSpace: 'nowrap',
    }}>{c.label}</span>
  )
}
