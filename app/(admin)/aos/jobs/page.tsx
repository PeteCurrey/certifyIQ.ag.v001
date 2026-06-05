'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Search, Filter, ArrowUpDown, Download, Plus, Edit } from 'lucide-react'
import styles from '../admin.module.css'

interface Job {
  id: string
  booking_ref: string
  service_type: string
  status: string
  preferred_date: string
  price_gbp: number
  assessor_id: string | null
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
  }
}

interface Assessor {
  id: string
  full_name: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [assessors, setAssessors] = useState<Assessor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assessorFilter, setAssessorFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [targetAssessor, setTargetAssessor] = useState('')

  const supabase = createClient()
  const itemsPerPage = 25

  useEffect(() => {
    async function loadJobsData() {
      try {
        const { data: bookingsData, error: bookingsErr } = await supabase
          .from('bookings')
          .select('*, customers(*), properties(*)')
          .order('preferred_date', { ascending: false })

        if (bookingsErr) throw bookingsErr
        setJobs(bookingsData || [])

        const { data: assessorsData, error: assessorsErr } = await supabase
          .from('assessors')
          .select('id, full_name')
          .eq('is_active', true)

        if (assessorsErr) throw assessorsErr
        setAssessors(assessorsData || [])
      } catch (err: any) {
        console.error('Failed to load jobs page data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadJobsData()
  }, [])

  const handleAssignAssessor = async () => {
    if (!selectedJob) return
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          assessor_id: targetAssessor || null,
          status: targetAssessor ? 'scheduled' : 'paid',
        })
        .eq('id', selectedJob.id)

      if (error) throw error

      setJobs(prev => prev.map(job => {
        if (job.id === selectedJob.id) {
          return {
            ...job,
            assessor_id: targetAssessor || null,
            status: targetAssessor ? 'scheduled' : 'paid',
          }
        }
        return job
      }))
      setAssignModalOpen(false)
      setSelectedJob(null)
    } catch (err) {
      console.error('Error assigning assessor:', err)
      alert('Failed to reassign assessor')
    }
  }

  // Filters logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.booking_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customers?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.properties?.address_line_1?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.properties?.postcode?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    const matchesAssessor = assessorFilter === 'all' || 
      (assessorFilter === 'unassigned' && !job.assessor_id) || 
      job.assessor_id === assessorFilter

    return matchesSearch && matchesStatus && matchesAssessor
  })

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const exportCSV = () => {
    const headers = ['Ref', 'Client', 'Email', 'Phone', 'Address', 'Postcode', 'Service', 'Date', 'Price', 'Status']
    const rows = filteredJobs.map(j => [
      j.booking_ref,
      j.customers?.full_name || '',
      j.customers?.email || '',
      j.customers?.phone || '',
      j.properties?.address_line_1 || '',
      j.properties?.postcode || '',
      j.service_type,
      j.preferred_date,
      j.price_gbp,
      j.status
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `avorria_jobs_export_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Loading assessor job queues...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header} style={{ marginBottom: '2rem' }}>
        <div>
          <span className={styles.eyebrow}>Console Operations</span>
          <h2>Inspections Desk</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={exportCSV} className={styles.ctaSecondary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <Link href="/book" className={styles.addCta} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} />
            <span>Book Assessment</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'linear-gradient(145deg, #0d1527 0%, #030712 100%)',
        border: '1px solid var(--border-color)',
        padding: '1.25rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '250px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
          <Search size={16} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by ref, client, address, postcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: '#080d18', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 1rem', borderRadius: '8px', outline: 'none' }}
        >
          <option value="all">All Statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="paid">Paid (Unassigned)</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="assessment_complete">Assessment Complete</option>
          <option value="certificate_issued">Certificate Issued</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={assessorFilter}
          onChange={(e) => setAssessorFilter(e.target.value)}
          style={{ background: '#080d18', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 1rem', borderRadius: '8px', outline: 'none' }}
        >
          <option value="all">All Assessors</option>
          <option value="unassigned">Unassigned</option>
          {assessors.map(a => (
            <option key={a.id} value={a.id}>{a.full_name}</option>
          ))}
        </select>
      </div>

      {/* Table Card */}
      <div className={styles.jobsCard}>
        {paginatedJobs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No matching assessment jobs found.</p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Property Details</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Assessor Allocation</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedJobs.map((job) => (
                    <tr key={job.id}>
                      <td className={styles.refVal}>{job.booking_ref}</td>
                      <td>
                        <div className={styles.propCell}>
                          <strong>{job.properties?.address_line_1}</strong>
                          <span>{job.properties?.town} ({job.properties?.postcode})</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.clientCell}>
                          <strong>{job.customers?.full_name}</strong>
                          <span>{job.customers?.phone}</span>
                        </div>
                      </td>
                      <td>{job.preferred_date}</td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedJob(job)
                            setTargetAssessor(job.assessor_id || '')
                            setAssignModalOpen(true)
                          }}
                          style={{
                            background: job.assessor_id ? 'rgba(155, 255, 89, 0.1)' : 'rgba(255, 92, 92, 0.1)',
                            border: '1px solid ' + (job.assessor_id ? 'var(--accent-lime)' : 'var(--accent-red)'),
                            color: job.assessor_id ? 'var(--accent-lime)' : 'var(--accent-red)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Edit size={12} />
                          <span>{assessors.find(a => a.id === job.assessor_id)?.full_name || 'Unassigned'}</span>
                        </button>
                      </td>
                      <td>
                        <StatusBadge status={job.status} />
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link href={`/aos/jobs/${job.id}`} className={styles.actionButtonStart}>
                            <span>Manage</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', paddingBottom: '1rem' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Previous
                </button>
                <span style={{ alignSelf: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Assignment Modal */}
      {assignModalOpen && selectedJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#0d1527',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '400px',
          }}>
            <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '1.25rem', color: '#fff', marginBottom: '1rem' }}>
              Assign Assessor
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Reallocate inspection job <strong>{selectedJob.booking_ref}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Inspector</label>
              <select
                value={targetAssessor}
                onChange={(e) => setTargetAssessor(e.target.value)}
                style={{ background: '#080d18', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 1rem', borderRadius: '8px', outline: 'none', width: '100%' }}
              >
                <option value="">Unassigned / Vacant</option>
                {assessors.map(a => (
                  <option key={a.id} value={a.id}>{a.full_name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setAssignModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignAssessor}
                style={{ background: 'var(--accent-lime)', color: '#000', fontWeight: 600, border: 'none', borderRadius: '6px', padding: '0.5rem 1.25rem', cursor: 'pointer' }}
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
