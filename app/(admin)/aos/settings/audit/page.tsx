'use client'
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { Download, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import styles from './audit.module.css'

interface AuditLog {
  id: string
  created_at: string
  user_id: string | null
  user_email: string
  action: string
  target_table: string | null
  target_id: string | null
  previous_value: any
  new_value: any
  ip_address: string | null
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)

  // Filters state
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  const supabase = createClient()

  async function fetchAuditLogs() {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      let queryParams = []
      if (filterUser) queryParams.push(`user=${encodeURIComponent(filterUser)}`)
      if (filterAction) queryParams.push(`action=${encodeURIComponent(filterAction)}`)
      if (filterStartDate) queryParams.push(`startDate=${encodeURIComponent(filterStartDate)}`)
      if (filterEndDate) queryParams.push(`endDate=${encodeURIComponent(filterEndDate)}`)

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : ''
      const response = await fetch(`/api/aos/audit${queryString}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setLogs(data)
      } else {
        setErrorMsg(data.error || 'Failed to load audit logs.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Network error occurred loading audit logs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditLogs()
  }, [filterAction, filterStartDate, filterEndDate]) // trigger reload on dropdowns or dates change

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchAuditLogs()
  }

  const handleResetFilters = () => {
    setFilterUser('')
    setFilterAction('')
    setFilterStartDate('')
    setFilterEndDate('')
    // We let the useEffect trigger or manually call
    setTimeout(() => {
      fetchAuditLogs()
    }, 50)
  }

  const handleToggleRow = (id: string) => {
    setExpandedLogId(prev => prev === id ? null : id)
  }

  const exportToCSV = () => {
    if (logs.length === 0) return

    const headers = ['Timestamp', 'User Email', 'Action', 'Target Table', 'Target ID', 'IP Address']
    const csvRows = [headers.join(',')]

    for (const log of logs) {
      const row = [
        new Date(log.created_at).toLocaleString('en-GB'),
        `"${log.user_email || ''}"`,
        `"${log.action || ''}"`,
        `"${log.target_table || ''}"`,
        `"${log.target_id || ''}"`,
        `"${log.ip_address || ''}"`
      ]
      csvRows.push(row.join(','))
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `aos_audit_log_${new Date().toISOString().slice(0,10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && logs.length === 0) return <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}><LoadingSpinner size={40} /></div>
  if (errorMsg) return <div className={styles.error}>{errorMsg}</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Console Operations Audit</span>
          <h2>System Audit Trail</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className={styles.exportBtn} onClick={fetchAuditLogs} title="Refresh Logs">
            <RefreshCw size={16} />
          </button>
          <button className={styles.exportBtn} onClick={exportToCSV}>
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Control Box */}
      <form onSubmit={handleSearchSubmit} className={styles.filterCard}>
        <div className={styles.formGroup}>
          <label>Filter User (Email)</label>
          <input 
            type="text" 
            value={filterUser} 
            onChange={e => setFilterUser(e.target.value)} 
            placeholder="Search email..." 
          />
        </div>
        <div className={styles.formGroup}>
          <label>Filter Action</label>
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)}>
            <option value="">All Actions</option>
            <option value="user.invited">user.invited</option>
            <option value="user.updated">user.updated</option>
            <option value="user.deleted">user.deleted</option>
            <option value="booking.status_changed">booking.status_changed</option>
            <option value="booking.notes_updated">booking.notes_updated</option>
            <option value="pricing.updated">pricing.updated</option>
            <option value="schema.updated">schema.updated</option>
            <option value="page.published">page.published</option>
            <option value="apikey.updated">apikey.updated</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Start Date</label>
          <input 
            type="date" 
            value={filterStartDate} 
            onChange={e => setFilterStartDate(e.target.value)} 
          />
        </div>
        <div className={styles.formGroup}>
          <label>End Date</label>
          <input 
            type="date" 
            value={filterEndDate} 
            onChange={e => setFilterEndDate(e.target.value)} 
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className={styles.exportBtn} style={{ background: 'var(--accent-lime)', color: '#000', border: 'none' }}>
            Apply
          </button>
          <button type="button" className={styles.resetBtn} onClick={handleResetFilters}>
            Reset
          </button>
        </div>
      </form>

      {/* Audit Logs Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Timestamp</th>
                <th>User Account</th>
                <th>Action Type</th>
                <th>Target Reference</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No audit records found matching selected filters.
                  </td>
                </tr>
              ) : (
                logs.map(log => {
                  const isExpanded = expandedLogId === log.id
                  return (
                    <React.Fragment key={log.id}>
                      <tr className={styles.rowExpandable} onClick={() => handleToggleRow(log.id)}>
                        <td>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                        <td className={styles.timestamp}>
                          {new Date(log.created_at).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className={styles.userCell}>{log.user_email}</td>
                        <td>
                          <span className={styles.actionBadge}>{log.action}</span>
                        </td>
                        <td className={styles.monoCell}>
                          {log.target_table ? `${log.target_table} : ${log.target_id?.slice(0, 8)}...` : '—'}
                        </td>
                        <td className={styles.monoCell}>{log.ip_address || '—'}</td>
                      </tr>
                      
                      {isExpanded && (
                        <tr className={styles.expandedRow}>
                          <td colSpan={6} onClick={e => e.stopPropagation()}>
                            <div className={styles.diffContainer}>
                              <div className={styles.diffBox}>
                                <h4>Previous Value</h4>
                                <pre>
                                  {log.previous_value 
                                    ? JSON.stringify(log.previous_value, null, 2) 
                                    : 'None / Null'}
                                </pre>
                              </div>
                              <div className={styles.diffBox}>
                                <h4>New Value</h4>
                                <pre>
                                  {log.new_value 
                                    ? JSON.stringify(log.new_value, null, 2) 
                                    : 'None / Null'}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
