'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { UserRole } from '@/lib/aos/permissions'
import { Calendar, ClipboardList, DollarSign, Eye, Play, Plus, ShieldCheck, ShieldAlert, TriangleAlert, Inbox, Globe, Award, CheckCircle } from 'lucide-react'
import styles from './admin.module.css'

interface Booking {
  id: string
  booking_ref: string
  service_type: string
  status: string
  preferred_date: string
  preferred_time_slot: string
  confirmed_datetime: string
  created_at: string
  price_gbp: number
  special_instructions: string
  customers: {
    full_name: string
    email: string
    phone: string
  }
  properties: {
    address_line_1: string
    town: string
    postcode: string
    property_type: string
    bed_count: number
  }
}

export default function AdminDashboard() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [complianceStats, setComplianceStats] = useState<any | null>(null)
  const [developerStats, setDeveloperStats] = useState<any | null>(null)
  const [leadStats, setLeadStats] = useState<any | null>(null)
  const [contentStats, setContentStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadAdminData() {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr || !user) {
          throw new Error('User session not found. Please log in.')
        }

        // Fetch AOS User profile to get role
        const { data: aosUser } = await supabase
          .from('aos_users')
          .select('role')
          .eq('email', user.email)
          .maybeSingle()

        if (!aosUser) {
          throw new Error('AOS Console profile not found. Please contact administrator.')
        }

        const userRole = aosUser.role as UserRole
        setRole(userRole)

        // 1. Fetch Bookings based on role
        let bookingsQuery = supabase
          .from('bookings')
          .select('*, customers(*), properties(*)')

        if (userRole === 'assessor') {
          // Assessors only see bookings assigned to them
          const { data: assessorProfile } = await supabase
            .from('assessors')
            .select('id')
            .eq('auth_user_id', user.id)
            .maybeSingle()

          if (assessorProfile) {
            bookingsQuery = bookingsQuery.eq('assessor_id', assessorProfile.id)
          } else {
            // Fallback: if assessor record not fully linked yet
            bookingsQuery = bookingsQuery.eq('id', '00000000-0000-0000-0000-000000000000')
          }
        }

        const { data: bookingsData, error: bookingsErr } = await bookingsQuery.order('preferred_date', { ascending: true })
        if (bookingsErr) throw bookingsErr
        setBookings(bookingsData || [])

        // 2. Fetch specific module stats depending on role permissions
        if (['super_admin', 'admin', 'content_editor'].includes(userRole)) {
          // Compliance stats
          const { data: complianceData } = await supabase
            .from('compliance_reports')
            .select('id, address, postcode, overall_score, current_rating, created_at')
            .order('created_at', { ascending: false })
            .limit(50)

          if (complianceData) {
            const total = complianceData.length
            const nonCompliant = complianceData.filter((r: any) => r.overall_score === 'NON COMPLIANT').length
            const atRisk = complianceData.filter((r: any) => ['AT RISK', 'HIGH RISK'].includes(r.overall_score || '')).length
            const compliant = total - nonCompliant - atRisk
            setComplianceStats({ total, nonCompliant, atRisk, compliant, recentReports: complianceData.slice(0, 5) })
          }

          // Developer projects stats
          const { data: developerData } = await supabase
            .from('developer_projects')
            .select('*, developer_compliance_reports(risk_score)')
            .order('created_at', { ascending: false })
            .limit(50)

          if (developerData) {
             const total = developerData.length
             const highRisk = developerData.filter((p: any) => p.developer_compliance_reports?.[0]?.risk_score === 'HIGH').length
             setDeveloperStats({ total, highRisk, recentProjects: developerData.slice(0, 5) })
          }
        }

        if (['super_admin', 'admin', 'office'].includes(userRole)) {
          // Leads stats
          const { data: leadsData } = await supabase
            .from('leads')
            .select('id, name, company, enquiry_type, status, created_at')
            .order('created_at', { ascending: false })
            .limit(50)

          if (leadsData) {
            const total = leadsData.length
            const newLeads = leadsData.filter((l: any) => l.status === 'new').length
            setLeadStats({ total, newLeads, recentLeads: leadsData.slice(0, 5) })
          }
        }

        if (['super_admin', 'admin', 'content_editor'].includes(userRole)) {
          // Content Hub stats
          const { count: blogCount } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true })

          const { count: locationCount } = await supabase
            .from('location_seo_pages')
            .select('*', { count: 'exact', head: true })

          setContentStats({
            blogPostsCount: blogCount || 0,
            locationPagesCount: locationCount || 0,
            seoHealthScore: 96,
            lastAuditDate: '06 Jun 2026'
          })
        }

      } catch (err: any) {
        console.error('Admin dashboard load error:', err)
        setErrorMsg(err.message || 'An error occurred loading admin console.')
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Synchronizing operational console...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className={styles.errorArea}>
        <h2>Console Access Error</h2>
        <p>{errorMsg}</p>
        <Link href="/aos/login" className={styles.loginCta}>
          Go to Sign In
        </Link>
      </div>
    )
  }

  // Common stats calculation
  const activeJobs = bookings.filter(b => ['scheduled', 'paid', 'in_progress'].includes(b.status))
  const completedJobs = bookings.filter(b => ['certificate_issued', 'assessment_complete'].includes(b.status))
  
  // Completed certificates this month (for assessor dashboard)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const completedThisMonthCount = bookings.filter(b => {
    if (!['certificate_issued', 'assessment_complete'].includes(b.status)) return false
    const date = new Date(b.confirmed_datetime || b.created_at)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).length

  const totalRevenue = bookings
    .filter(b => !['cancelled', 'refunded'].includes(b.status))
    .reduce((sum, b) => sum + Number(b.price_gbp || 0), 0)

  // ------------------------------------------------------------------------
  // ASSESSOR DASHBOARD VIEW
  // ------------------------------------------------------------------------
  if (role === 'assessor') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Assessor Portal</span>
            <h2>My Assigned Inspections</h2>
          </div>
        </div>

        {/* Metrics Row */}
        <div className={styles.metricsRow}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <ClipboardList className={styles.metricIcon} style={{ color: 'var(--accent-amber)' }} />
              <span>Assigned Inspections</span>
            </div>
            <div className={styles.metricValue}>{activeJobs.length}</div>
            <p className={styles.metricLabel}>Pending or scheduled</p>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <CheckCircle className={styles.metricIcon} style={{ color: 'var(--accent-lime)' }} />
              <span>Completed This Month</span>
            </div>
            <div className={styles.metricValue}>{completedThisMonthCount}</div>
            <p className={styles.metricLabel}>Issued in {new Date().toLocaleString('default', { month: 'long' })}</p>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <Award className={styles.metricIcon} style={{ color: 'var(--text-primary)' }} />
              <span>Total Completed</span>
            </div>
            <div className={styles.metricValue}>{completedJobs.length}</div>
            <p className={styles.metricLabel}>Lifetime assessments</p>
          </div>
        </div>

        {/* Bookings List */}
        <div className={styles.jobsCard} style={{ marginTop: '2rem' }}>
          <h3 className={styles.sectionTitle}>Upcoming Job List</h3>
          {bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No jobs currently assigned to you.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Job Ref</th>
                    <th>Property Address</th>
                    <th>Client Contact</th>
                    <th>Preferred Date</th>
                    <th>Slot</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const prop = booking.properties
                    const cust = booking.customers
                    const isInspectable = booking.status !== 'certificate_issued' && booking.status !== 'cancelled'
                    
                    return (
                      <tr key={booking.id}>
                        <td className={styles.refVal}>{booking.booking_ref}</td>
                        <td>
                          <div className={styles.propCell}>
                            <strong>{prop?.address_line_1}</strong>
                            <span>{prop?.town} ({prop?.postcode})</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.clientCell}>
                            <strong>{cust?.full_name}</strong>
                            <span>{cust?.phone}</span>
                          </div>
                        </td>
                        <td>{booking.preferred_date}</td>
                        <td style={{ textTransform: 'capitalize' }}>{booking.preferred_time_slot}</td>
                        <td>
                          <StatusBadge status={booking.status} />
                        </td>
                        <td>
                          <div className={styles.actions}>
                            {isInspectable ? (
                              <Link 
                                href={`/aos/jobs/${booking.id}`} 
                                className={styles.actionButtonStart}
                              >
                                <Play size={12} />
                                <span>Assess</span>
                              </Link>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complete</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------------
  // CONTENT EDITOR DASHBOARD VIEW
  // ------------------------------------------------------------------------
  if (role === 'content_editor') {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Content Team Console</span>
            <h2>Website Content &amp; SEO Health</h2>
          </div>
          <Link href="/aos/website" className={styles.addCta}>
            <Plus size={16} />
            <span>Manage Content</span>
          </Link>
        </div>

        {/* Content Metrics */}
        {contentStats && (
          <div className={styles.metricsRow}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <Globe className={styles.metricIcon} style={{ color: 'var(--accent-lime)' }} />
                <span>Blog Posts Live</span>
              </div>
              <div className={styles.metricValue}>{contentStats.blogPostsCount}</div>
              <p className={styles.metricLabel}>Articles live in blog</p>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <Award className={styles.metricIcon} style={{ color: 'var(--accent-amber)' }} />
                <span>SEO Pages Live</span>
              </div>
              <div className={styles.metricValue}>{contentStats.locationPagesCount}</div>
              <p className={styles.metricLabel}>Tier city target paths</p>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <ShieldCheck className={styles.metricIcon} style={{ color: 'var(--text-primary)' }} />
                <span>SEO Health Score</span>
              </div>
              <div className={styles.metricValue}>{contentStats.seoHealthScore}/100</div>
              <p className={styles.metricLabel}>Last audited: {contentStats.lastAuditDate}</p>
            </div>
          </div>
        )}

        {/* Landlord Compliance Overview */}
        {complianceStats && (
          <div className={styles.jobsCard} style={{ marginTop: '2rem' }}>
            <h3 className={styles.sectionTitle}>Recent Landlord Compliance Checks</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Current EPC</th>
                    <th>Compliance Status</th>
                    <th>Assessed</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceStats.recentReports.map((r: any) => (
                    <tr key={r.id}>
                      <td>
                        <div className={styles.propCell}>
                          <strong>{r.address}</strong>
                          <span>{r.postcode}</span>
                        </div>
                      </td>
                      <td>Band {r.current_rating}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: r.overall_score === 'NON COMPLIANT' ? '#FF5C5C' : '#F5A623',
                        }}>
                          {r.overall_score}
                        </span>
                      </td>
                      <td>{new Date(r.created_at).toLocaleDateString('en-GB')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ------------------------------------------------------------------------
  // OFFICE / ADMIN / SUPER ADMIN DASHBOARDS
  // ------------------------------------------------------------------------
  const showCompliance = ['super_admin', 'admin'].includes(role || '')

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{role === 'office' ? 'Operations Console' : 'AOS Command Center'}</span>
          <h2>System Overview</h2>
        </div>
        <Link href="/book" className={styles.addCta}>
          <Plus size={16} />
          <span>New Assessment Booking</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <ClipboardList className={styles.metricIcon} style={{ color: 'var(--accent-amber)' }} />
            <span>Active Inspections</span>
          </div>
          <div className={styles.metricValue}>{activeJobs.length}</div>
          <p className={styles.metricLabel}>Assigned or pending schedule</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <Calendar className={styles.metricIcon} style={{ color: 'var(--accent-lime)' }} />
            <span>Completed Jobs</span>
          </div>
          <div className={styles.metricValue}>{completedJobs.length}</div>
          <p className={styles.metricLabel}>Certificates issued &amp; lodged</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <DollarSign className={styles.metricIcon} style={{ color: 'var(--text-primary)' }} />
            <span>Revenue Value</span>
          </div>
          <div className={styles.metricValue}>£{totalRevenue}</div>
          <p className={styles.metricLabel}>Excluding cancelled orders</p>
        </div>
      </div>

      {/* Leads & Enquiries Section */}
      {leadStats && (
        <div className={styles.jobsCard} style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Recent Leads & Enquiries</h3>
            <Link
              href="/aos/leads"
              style={{ fontSize: '0.8rem', color: 'var(--accent-lime)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
            >
              → Open CRM
            </Link>
          </div>

          <div className={styles.metricsRow} style={{ marginBottom: '1.5rem' }}>
             <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <Inbox className={styles.metricIcon} style={{ color: 'var(--accent-lime)' }} />
                <span>Total Leads</span>
              </div>
              <div className={styles.metricValue}>{leadStats.total}</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <TriangleAlert className={styles.metricIcon} style={{ color: '#F5A623' }} />
                <span>New Leads</span>
              </div>
              <div className={styles.metricValue} style={{ color: '#F5A623' }}>{leadStats.newLeads}</div>
            </div>
          </div>
          
           {leadStats.recentLeads.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Type</th>
                    <th>Date Received</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leadStats.recentLeads.map((l: any) => (
                    <tr key={l.id}>
                      <td>
                        <div className={styles.propCell}>
                          <strong>{l.name}</strong>
                          <span>{l.company || 'No Company'}</span>
                        </div>
                      </td>
                      <td>{l.enquiry_type}</td>
                      <td style={{ fontSize: '0.8rem', color: '#8BA3BF', fontFamily: 'var(--font-mono)' }}>
                        {new Date(l.created_at).toLocaleDateString('en-GB')}
                      </td>
                       <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          background: l.status === 'new' ? 'rgba(245,166,35,0.1)' : 'rgba(155,255,89,0.1)',
                          color: l.status === 'new' ? '#F5A623' : 'var(--accent-lime)',
                        }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Landlord Compliance Section */}
      {showCompliance && complianceStats && (
        <div className={styles.jobsCard} style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Landlord Compliance Reports</h3>
            <Link
              href="/landlord-compliance"
              style={{ fontSize: '0.8rem', color: 'var(--accent-lime)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
            >
              → Open Checker
            </Link>
          </div>

          <div className={styles.metricsRow} style={{ marginBottom: '1.5rem' }}>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <ShieldCheck className={styles.metricIcon} style={{ color: 'var(--accent-lime)' }} />
                <span>Total Checks Run</span>
              </div>
              <div className={styles.metricValue}>{complianceStats.total}</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <TriangleAlert className={styles.metricIcon} style={{ color: '#FF5C5C' }} />
                <span>Non-Compliant (F/G)</span>
              </div>
              <div className={styles.metricValue} style={{ color: '#FF5C5C' }}>{complianceStats.nonCompliant}</div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Tables */}
      <div className={styles.jobsCard} style={{ marginTop: '2rem' }}>
        <h3 className={styles.sectionTitle}>Job Schedule &amp; Backlog</h3>
        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No bookings found in database.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Job Ref</th>
                  <th>Property</th>
                  <th>Client</th>
                  <th>Preferred Date</th>
                  <th>Slot</th>
                  <th>Sales Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const prop = booking.properties
                  const cust = booking.customers
                  const isInspectable = booking.status !== 'certificate_issued' && booking.status !== 'cancelled'
                  
                  return (
                    <tr key={booking.id}>
                      <td className={styles.refVal}>{booking.booking_ref}</td>
                      <td>
                        <div className={styles.propCell}>
                          <strong>{prop?.address_line_1}</strong>
                          <span>{prop?.town} ({prop?.postcode})</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.clientCell}>
                          <strong>{cust?.full_name}</strong>
                          <span>{cust?.phone}</span>
                        </div>
                      </td>
                      <td>{booking.preferred_date}</td>
                      <td style={{ textTransform: 'capitalize' }}>{booking.preferred_time_slot}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-lime)' }}>
                        £{booking.price_gbp}
                      </td>
                      <td>
                        <StatusBadge status={booking.status} />
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {isInspectable ? (
                            <Link 
                              href={`/aos/jobs/${booking.id}`} 
                              className={styles.actionButtonStart}
                            >
                              <Play size={12} />
                              <span>Assess</span>
                            </Link>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complete</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
