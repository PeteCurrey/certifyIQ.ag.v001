'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { Calendar, ClipboardList, DollarSign, Eye, Play, Plus, User } from 'lucide-react'
import styles from './admin.module.css'

interface Booking {
  id: string
  booking_ref: string
  service_type: string
  status: string
  preferred_date: string
  confirmed_datetime: string
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
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadAdminData() {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr || !user) {
          throw new Error('Assessor session not found. Please log in.')
        }

        const { data: curAssessor } = await supabase
          .from('assessors')
          .select('is_super_admin')
          .eq('auth_user_id', user.id)
          .single()
        if (curAssessor?.is_super_admin) {
          setIsSuperAdmin(true)
        }

        // Fetch all bookings (since assessors can see all bookings)
        const { data, error } = await supabase
          .from('bookings')
          .select('*, customers(*), properties(*)')
          .order('preferred_date', { ascending: true })

        if (error) {
          throw error
        }

        setBookings(data || [])
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
        <p>Synchronizing assessor console...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className={styles.errorArea}>
        <h2>Console Access Error</h2>
        <p>{errorMsg}</p>
        <Link href="/login" className={styles.loginCta}>
          Go to Sign In
        </Link>
      </div>
    )
  }

  // Calculate dashboard stats
  const activeJobs = bookings.filter(b => b.status === 'scheduled' || b.status === 'paid' || b.status === 'in_progress')
  const completedJobs = bookings.filter(b => b.status === 'certificate_issued' || b.status === 'assessment_complete')
  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled' && b.status !== 'refunded')
    .reduce((sum, b) => sum + Number(b.price_gbp || 0), 0)

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Assessor Portal</span>
          <h2>Job Management</h2>
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
            <span>Total Value</span>
          </div>
          <div className={styles.metricValue}>£{totalRevenue}</div>
          <p className={styles.metricLabel}>Excluding cancelled orders</p>
        </div>
      </div>

      {/* Jobs Tables */}
      <div className={styles.jobsCard}>
        <h3 className={styles.sectionTitle}>Job Schedule &amp; Backlog</h3>
        
        {bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No bookings found in database. Seed or create bookings to start.</p>
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
                  {isSuperAdmin && (
                    <>
                      <th>Sales Price</th>
                      <th>Payment Date</th>
                    </>
                  )}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const prop = booking.properties
                  const cust = booking.customers
                  const isInspectable = booking.status !== 'certificate_issued' && booking.status !== 'cancelled'
                  
                  // Payment Date calculation: confirmed_datetime or created_at for paid items
                  const hasPaid = booking.status !== 'pending_payment' && booking.status !== 'cancelled'
                  const paymentDate = hasPaid ? (booking.confirmed_datetime || booking.created_at) : null

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
                      {isSuperAdmin && (
                        <>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-lime)' }}>
                            £{booking.price_gbp}
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                            {paymentDate ? new Date(paymentDate).toLocaleDateString('en-GB') : '—'}
                          </td>
                        </>
                      )}
                      <td>
                        <StatusBadge status={booking.status} />
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {isInspectable ? (
                            <Link 
                              href={`/admin/jobs/${booking.id}`} 
                              className={styles.actionButtonStart}
                              title="Start/Resume Assessment Form"
                            >
                              <Play size={12} />
                              <span>Assess</span>
                            </Link>
                          ) : (
                            <button 
                              className={styles.actionButtonDisabled}
                              title="Assessment Complete / PDF Issued"
                              disabled
                            >
                              <Eye size={12} />
                              <span>Complete</span>
                            </button>
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
