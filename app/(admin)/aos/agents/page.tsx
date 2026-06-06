'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import adminStyles from '../admin.module.css'

interface AgentAccount {
  id: string
  agency_name: string
  email: string
  phone: string
  crm_type: string | null
  crm_connected: boolean
  status: string
  billing_preference: string
  onboarding_complete: boolean
  created_at: string
  crm_last_sync_at: string | null
}

const STATUS_COLORS: Record<string, string> = {
  active: 'rgba(155,255,89,0.1)',
  pending_setup: 'rgba(254,202,87,0.1)',
  suspended: 'rgba(255,71,87,0.1)',
  churned: 'rgba(255,255,255,0.05)',
}

const STATUS_TEXT: Record<string, string> = {
  active: '#9bff59',
  pending_setup: '#feca57',
  suspended: '#ff4757',
  churned: '#888',
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function loadAgents() {
      const { data } = await supabase
        .from('agent_accounts')
        .select('id, agency_name, email, phone, crm_type, crm_connected, status, billing_preference, onboarding_complete, created_at, crm_last_sync_at')
        .order('created_at', { ascending: false })
      setAgents(data || [])
      setLoading(false)
    }
    loadAgents()
  }, [supabase])

  const filtered = agents.filter(a =>
    a.agency_name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalActive = agents.filter(a => a.status === 'active').length
  const totalPending = agents.filter(a => a.status === 'pending_setup').length
  const totalConnected = agents.filter(a => a.crm_connected).length

  return (
    <div className={adminStyles.container}>
      <div className={adminStyles.header}>
        <div>
          <span className={adminStyles.eyebrow}>AOS — Agent Management</span>
          <h2>Agent Accounts</h2>
        </div>
        <Link href="/agent/onboarding" className={adminStyles.addCta}>+ Invite Agent</Link>
      </div>

      <div className={adminStyles.metricsRow}>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricHeader}>Total Agents</div>
          <div className={adminStyles.metricValue}>{agents.length}</div>
          <p className={adminStyles.metricLabel}>Registered accounts</p>
        </div>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricHeader}>Active</div>
          <div className={adminStyles.metricValue} style={{ color: '#9bff59' }}>{totalActive}</div>
          <p className={adminStyles.metricLabel}>{totalPending} pending setup</p>
        </div>
        <div className={adminStyles.metricCard}>
          <div className={adminStyles.metricHeader}>CRM Connected</div>
          <div className={adminStyles.metricValue} style={{ color: '#45aaf2' }}>{totalConnected}</div>
          <p className={adminStyles.metricLabel}>{agents.length - totalConnected} not yet connected</p>
        </div>
      </div>

      <div className={adminStyles.jobsCard}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <h3 className={adminStyles.sectionTitle} style={{ margin: 0, flex: 1 }}>All Agents</h3>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--bg-obsidian)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              width: '260px',
            }}
          />
        </div>

        {loading ? (
          <div className={adminStyles.loadingArea}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className={adminStyles.emptyState}>
            <p>No agent accounts found.</p>
          </div>
        ) : (
          <div className={adminStyles.tableWrap}>
            <table className={adminStyles.table}>
              <thead>
                <tr>
                  <th>Agency</th>
                  <th>Status</th>
                  <th>CRM</th>
                  <th>Billing</th>
                  <th>Onboarding</th>
                  <th>Last Sync</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(agent => (
                  <tr key={agent.id}>
                    <td>
                      <div className={adminStyles.clientCell}>
                        <strong>{agent.agency_name}</strong>
                        <span>{agent.email}</span>
                        {agent.phone && <span>{agent.phone}</span>}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: STATUS_COLORS[agent.status] || 'rgba(255,255,255,0.05)',
                        color: STATUS_TEXT[agent.status] || '#888',
                      }}>
                        {agent.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      {agent.crm_connected ? (
                        <span style={{ color: '#9bff59', fontWeight: 600 }}>
                          ✓ {agent.crm_type || 'Connected'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>
                          {agent.crm_type ? `${agent.crm_type} (not connected)` : 'None'}
                        </span>
                      )}
                    </td>
                    <td style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                      {agent.billing_preference || 'agency'}
                    </td>
                    <td>
                      {agent.onboarding_complete ? (
                        <span style={{ color: '#9bff59' }}>✓ Complete</span>
                      ) : (
                        <span style={{ color: '#feca57' }}>In progress</span>
                      )}
                    </td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {agent.crm_last_sync_at
                        ? new Date(agent.crm_last_sync_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td>
                      <div className={adminStyles.actions}>
                        <Link
                          href={`/aos/agents/${agent.id}`}
                          className={adminStyles.actionButtonStart}
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
