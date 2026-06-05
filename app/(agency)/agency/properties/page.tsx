'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from './properties.module.css'

export default function AgencyPropertiesPage() {
  const supabase = createClient()
  const [properties, setProperties] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: agUser } = await supabase.from('agency_users').select('agency_id').eq('auth_user_id', user.id).single()
      if (!agUser) return
      const { data } = await supabase
        .from('agency_properties')
        .select('*, agency_branches(branch_name)')
        .eq('agency_id', agUser.agency_id)
        .order('created_at', { ascending: false })
      setProperties(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!search) { setFiltered(properties); return }
    setFiltered(properties.filter(p => `${p.address_line_1} ${p.postcode} ${p.town}`.toLowerCase().includes(search.toLowerCase())))
  }, [search, properties])

  const complianceColor = (status: string) => ({
    compliant: { bg: '#F0FDF4', color: '#16A34A' },
    at_risk: { bg: '#FEF9C3', color: '#CA8A04' },
    non_compliant: { bg: '#FEF2F2', color: '#DC2626' },
  }[status] || { bg: '#F1F5F9', color: '#64748B' })

  const ratingColor = (r: string) => ['A','B','C'].includes(r) ? '#16A34A' : ['D','E'].includes(r) ? '#CA8A04' : '#DC2626'

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Properties</h1>
          <p className={styles.subtitle}>Your complete property portfolio and compliance records</p>
        </div>
        <Link href="/agency/book" className={styles.orderBtn}>+ Order EPC</Link>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search by address, postcode or town…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className={styles.loading}><div className={styles.spinner} /></div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⌂</div>
          <h3>No Properties Yet</h3>
          <p>Properties are added automatically when you book a service. Order your first EPC to get started.</p>
          <Link href="/agency/book" className={styles.emptyBtn}>Order an EPC</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p: any) => {
            const daysLeft = p.epc_expiry_date ? Math.ceil((new Date(p.epc_expiry_date).getTime() - Date.now()) / 86400000) : null
            const compliance = complianceColor(p.compliance_status)
            return (
              <div key={p.id} className={styles.propCard}>
                <div className={styles.propCardTop}>
                  <div className={styles.propAddress}>
                    <h3>{p.address_line_1}</h3>
                    <p>{p.town}, {p.postcode}</p>
                  </div>
                  {p.current_epc_rating && (
                    <div className={styles.ratingBadge} style={{ background: `${ratingColor(p.current_epc_rating)}20`, color: ratingColor(p.current_epc_rating) }}>
                      {p.current_epc_rating}
                    </div>
                  )}
                </div>
                <div className={styles.propMeta}>
                  <span>{p.property_type || 'Property'}</span>
                  <span>{p.agency_branches?.branch_name || 'No branch'}</span>
                </div>
                {p.epc_expiry_date && (
                  <div className={styles.expiryRow} style={{ color: daysLeft !== null && daysLeft < 0 ? '#DC2626' : daysLeft !== null && daysLeft < 90 ? '#CA8A04' : '#64748B' }}>
                    <span>EPC expires: {new Date(p.epc_expiry_date).toLocaleDateString('en-GB')}</span>
                    {daysLeft !== null && <span>{daysLeft < 0 ? `(Expired ${Math.abs(daysLeft)}d ago)` : `(${daysLeft} days)`}</span>}
                  </div>
                )}
                <div className={styles.propFooter}>
                  <span style={{ background: compliance.bg, color: compliance.color, padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {p.compliance_status?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Unknown'}
                  </span>
                  <Link href="/agency/book" className={styles.renewLink}>Renew EPC</Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
