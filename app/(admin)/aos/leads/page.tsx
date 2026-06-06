'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Inbox } from 'lucide-react'
import styles from './leads.module.css'

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  source: string
  enquiry_type: string
  message: string | null
  volume: string | null
  status: string
  priority: string
  notes: string | null
  created_at: string
}

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser()
      if (userErr || !user) throw new Error('Not authenticated')

      const { data: curAssessor } = await supabase
        .from('assessors')
        .select('is_super_admin')
        .eq('auth_user_id', user.id)
        .single()

      if (!curAssessor?.is_super_admin) {
        throw new Error('Access denied: Super Admin only')
      }

      const res = await fetch('/api/enquiries?limit=200')
      const json = await res.json()
      if (json.error) throw new Error(json.error)

      setLeads(json.leads || [])
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      // Optimistic UI update
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))

      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      
    } catch (err: any) {
      console.error('Failed to update lead:', err)
      // Revert optimistic update by refetching
      fetchLeads()
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Loading Leads CRM...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className={styles.container}>
        <h2>Access Denied</h2>
        <p>{errorMsg}</p>
      </div>
    )
  }

  const filteredLeads = filter === 'all' 
    ? leads 
    : filter === 'active' 
      ? leads.filter(l => ['new', 'contacted', 'qualified'].includes(l.status))
      : leads.filter(l => l.status === filter)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>CRM</span>
          <h1 className={styles.title}>Leads &amp; Enquiries</h1>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <Inbox size={24} color="var(--accent-lime)" />
        </div>
      </div>

      <div className={styles.filters}>
        {['all', 'active', 'new', 'converted', 'lost'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Enquiry Detail</th>
              <th>Source</th>
              <th>Received</th>
              <th>Status</th>
              <th>Admin Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id}>
                <td>
                  <div className={styles.nameCell}>
                    <span className={styles.name}>{lead.name}</span>
                    <span className={styles.email}>{lead.email}</span>
                    {lead.phone && <span className={styles.email}>{lead.phone}</span>}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--accent-lime)' }}>{lead.enquiry_type}</strong>
                    {lead.company && <div>Company: {lead.company}</div>}
                    {lead.volume && <div>Volume: {lead.volume}</div>}
                  </div>
                </td>
                <td style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{lead.source}</td>
                <td style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  {new Date(lead.created_at).toLocaleDateString('en-GB')}
                </td>
                <td>
                  <select 
                    className={styles.statusSelect}
                    value={lead.status}
                    onChange={(e) => handleUpdateLead(lead.id, { status: e.target.value })}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </td>
                <td>
                  <input 
                    type="text" 
                    className={styles.notesInput}
                    placeholder="Add internal note..."
                    value={lead.notes || ''}
                    onChange={(e) => {
                      // Only update local state on change, send to server on blur
                      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, notes: e.target.value } : l))
                    }}
                    onBlur={(e) => handleUpdateLead(lead.id, { notes: e.target.value })}
                  />
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className={styles.emptyState}>
                    <p>No leads found matching "{filter}".</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
