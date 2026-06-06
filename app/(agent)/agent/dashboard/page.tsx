'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Home, AlertCircle, Clock, CheckCircle2, AlertTriangle, Send } from 'lucide-react'
import styles from './dashboard.module.css'

export default function AgentDashboard() {
  const [firstName, setFirstName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    needed: 0,
    inProgress: 0,
    issued: 0,
    valid: 0,
    expiring: 0
  })
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: agentAccount } = await supabase
        .from('agent_accounts')
        .select('agency_name')
        .eq('auth_user_id', user.id)
        .single()
        
      if (agentAccount) {
        setAgencyName(agentAccount.agency_name)
        // Extract first name from email as fallback since we don't store first name explicitly yet
        setFirstName(user.email?.split('@')[0].split('.')[0].replace(/^\w/, c => c.toUpperCase()) || 'Agent')
      }

      // Fetch properties for stats (placeholder logic for now)
      // In reality, this would query agent_properties
      setStats({
        total: 142,
        needed: 8,
        inProgress: 14,
        issued: 27,
        valid: 105,
        expiring: 15
      })
    }
    loadData()
  }, [supabase])

  const validPct = Math.round((stats.valid / stats.total) * 100) || 0
  const inProgPct = Math.round((stats.inProgress / stats.total) * 100) || 0
  const neededPct = Math.round((stats.needed / stats.total) * 100) || 0
  const expPct = Math.round((stats.expiring / stats.total) * 100) || 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>Good morning, {firstName}</h1>
        <p className={styles.subGreeting}>{agencyName}</p>
      </div>

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Home size={18} color="var(--text-secondary)" />
            Total Properties
          </div>
          <div className={styles.kpiValue}>{stats.total}</div>
          <div className={styles.kpiLabel}>Synced from CRM</div>
        </div>
        
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <AlertCircle size={18} color="#ff4757" />
            EPCs Needed
          </div>
          <div className={styles.kpiValue} style={{ color: '#ff4757' }}>{stats.needed}</div>
          <div className={styles.kpiLabel}>Action required</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <Clock size={18} color="#45aaf2" />
            In Progress
          </div>
          <div className={styles.kpiValue} style={{ color: '#45aaf2' }}>{stats.inProgress}</div>
          <div className={styles.kpiLabel}>Assessments booked</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <CheckCircle2 size={18} color="var(--accent-lime)" />
            Issued This Month
          </div>
          <div className={styles.kpiValue} style={{ color: 'var(--accent-lime)' }}>{stats.issued}</div>
          <div className={styles.kpiLabel}>Certificates delivered</div>
        </div>
      </div>

      <div className={styles.statusCard}>
        <h3 className={styles.cardTitle}>Property Status Breakdown</h3>
        <div className={styles.statusBar}>
          <div className={styles.statusSegment} style={{ width: `${validPct}%`, backgroundColor: 'var(--accent-lime)' }} />
          <div className={styles.statusSegment} style={{ width: `${inProgPct}%`, backgroundColor: '#45aaf2' }} />
          <div className={styles.statusSegment} style={{ width: `${expPct}%`, backgroundColor: '#feca57' }} />
          <div className={styles.statusSegment} style={{ width: `${neededPct}%`, backgroundColor: '#ff4757' }} />
        </div>
        <div className={styles.statusLegend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: 'var(--accent-lime)' }} />
            Valid EPC ({stats.valid})
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#45aaf2' }} />
            In Progress ({stats.inProgress})
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#feca57' }} />
            Expiring Soon ({stats.expiring})
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#ff4757' }} />
            No EPC ({stats.needed})
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div>
          {stats.needed > 0 && (
            <div className={styles.attentionCard}>
              <div className={styles.attentionHeader}>
                <AlertTriangle size={20} />
                <span>Properties Requiring Attention</span>
              </div>
              <div className={styles.attentionList}>
                <div className={styles.attentionItem}>
                  <div className={styles.attentionInfo}>
                    <strong>22 Ashgate Road</strong>
                    <span>No EPC — Sale</span>
                  </div>
                  <button className={styles.attentionCta}>Chase vendor</button>
                </div>
                <div className={styles.attentionItem}>
                  <div className={styles.attentionInfo}>
                    <strong>7 Station Road</strong>
                    <span>Payment link expired</span>
                  </div>
                  <button className={styles.attentionCta}>Resend link</button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.statusCard}>
            <h3 className={styles.cardTitle}>Current Invoice Preview</h3>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              This month so far: <strong>12 EPCs completed</strong>
            </div>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              £780.00
            </div>
            <button style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              View full invoice →
            </button>
          </div>
        </div>

        <div className={styles.activityFeed}>
          <h3 className={styles.cardTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}><CheckCircle2 size={16} color="var(--accent-lime)" /></div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>EPC Issued — 14 Church Lane</div>
                <div className={styles.activityTime}>Just now</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}><Send size={16} color="#45aaf2" /></div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Vendor contacted — 7 Station Rd</div>
                <div className={styles.activityTime}>2 hours ago</div>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}><Home size={16} /></div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>New property detected — The Old Vicarage</div>
                <div className={styles.activityTime}>3 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
