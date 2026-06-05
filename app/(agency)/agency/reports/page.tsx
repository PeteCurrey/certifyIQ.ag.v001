'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './reports.module.css'

export default function AgencyReportsPage() {
  const supabase = createClient()
  const [agencyId, setAgencyId] = useState<string>('')
  const [metrics, setMetrics] = useState({
    totalProperties: 0,
    compliantProperties: 0,
    nonCompliantProperties: 0,
    totalJobs: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: agUser } = await supabase.from('agency_users').select('agency_id').eq('auth_user_id', user.id).single()
      if (!agUser) return
      setAgencyId(agUser.agency_id)

      // Fetch properties
      const { data: props } = await supabase.from('agency_properties').select('compliance_status').eq('agency_id', agUser.agency_id)
      const totalProps = props?.length || 0
      const compliantProps = props?.filter(p => p.compliance_status === 'compliant').length || 0
      const nonCompliantProps = props?.filter(p => p.compliance_status === 'non_compliant' || p.compliance_status === 'at_risk').length || 0

      // Fetch jobs
      const { data: jobs } = await supabase.from('agency_jobs').select('price_gbp').eq('agency_id', agUser.agency_id)
      const totalJobs = jobs?.length || 0
      const totalSpent = jobs?.reduce((sum, j) => sum + (j.price_gbp || 0), 0) || 0

      setMetrics({
        totalProperties: totalProps,
        compliantProperties: compliantProps,
        nonCompliantProperties: nonCompliantProps,
        totalJobs,
        totalSpent,
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className={styles.loading}><div className={styles.spinner} /></div>

  const compliancePercentage = metrics.totalProperties > 0 ? Math.round((metrics.compliantProperties / metrics.totalProperties) * 100) : 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reports & Analytics</h1>
          <p className={styles.subtitle}>Portfolio compliance insights and expenditure</p>
        </div>
        <button className={styles.exportBtn}>Export CSV</button>
      </div>

      <div className={styles.grid}>
        {/* Compliance Overview */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Portfolio Compliance</h3>
          <div className={styles.complianceGauge}>
            <div className={styles.gaugeCircle} style={{ background: `conic-gradient(#0F766E ${compliancePercentage}%, #E2E8F0 ${compliancePercentage}%)` }}>
              <div className={styles.gaugeInner}>
                <span className={styles.gaugeValue}>{compliancePercentage}%</span>
                <span className={styles.gaugeLabel}>Compliant</span>
              </div>
            </div>
          </div>
          <div className={styles.complianceStats}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Total Properties:</span>
              <span className={styles.statValue}>{metrics.totalProperties}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Fully Compliant:</span>
              <span className={styles.statValue} style={{ color: '#16A34A' }}>{metrics.compliantProperties}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Action Required:</span>
              <span className={styles.statValue} style={{ color: '#DC2626' }}>{metrics.nonCompliantProperties}</span>
            </div>
          </div>
        </div>

        {/* Expenditure */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Service Expenditure (YTD)</h3>
          <div className={styles.spendTotal}>
            £{metrics.totalSpent.toLocaleString()}
          </div>
          <p className={styles.spendSub}>Total spent across {metrics.totalJobs} service orders.</p>
          
          <div className={styles.spendBreakdown}>
            <div className={styles.spendItem}>
              <div className={styles.spendLabel}>EPC Assessments</div>
              <div className={styles.spendBarWrap}><div className={styles.spendBar} style={{ width: '80%', background: '#0F766E' }} /></div>
            </div>
            <div className={styles.spendItem}>
              <div className={styles.spendLabel}>Floor Plans</div>
              <div className={styles.spendBarWrap}><div className={styles.spendBar} style={{ width: '15%', background: '#64748B' }} /></div>
            </div>
            <div className={styles.spendItem}>
              <div className={styles.spendLabel}>Retrofit Assessments</div>
              <div className={styles.spendBarWrap}><div className={styles.spendBar} style={{ width: '5%', background: '#94A3B8' }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
