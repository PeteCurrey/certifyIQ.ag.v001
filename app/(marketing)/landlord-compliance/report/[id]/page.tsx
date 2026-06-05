import React from 'react'
import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import styles from './report.module.css'

async function getReport(id: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )
  const { data, error } = await supabase.from('compliance_reports').select('*').eq('id', id).single()
  if (error || !data) return null
  
  // Try to fetch recommendations from Gov API for the AI Improvement Planner
  let recommendations = []
  try {
    const email = process.env.EPC_API_EMAIL
    const key = process.env.EPC_API_KEY
    if (email && key) {
      const auth = 'Basic ' + Buffer.from(`${email}:${key}`).toString('base64')
      const recRes = await fetch(`https://epc.opendatacommunities.org/api/v1/domestic/recommendations/${encodeURIComponent(data.lmk_key)}`, {
        headers: { Accept: 'application/json', Authorization: auth },
        next: { revalidate: 3600 }
      })
      if (recRes.ok) {
        const recData = await recRes.json()
        recommendations = recData.rows || []
      }
    }
  } catch (err) {}

  return { report: data, recommendations }
}

export default async function ComplianceReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const data = await getReport(id)
  
  if (!data) notFound()

  const { report, recommendations } = data
  const prop = report.report_data.property_data || {}
  const insights = report.report_data.insights || {}

  const overallClass = 
    report.overall_score === 'NON COMPLIANT' ? styles.statusDanger :
    report.overall_score === 'HIGH RISK' ? styles.statusWarning :
    report.overall_score === 'AT RISK' ? styles.statusWarning : styles.statusGood

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.topBar}>
          <Link href="/landlord-compliance" className={styles.backLink}>← New Assessment</Link>
          <span className={styles.docId}>Report Ref: {report.id.split('-')[0].toUpperCase()}</span>
        </div>
        <h1 className={styles.title}>Rental Compliance Report</h1>
        <p className={styles.address}>{report.address}, {report.postcode}</p>
        <div className={`${styles.mainStatusBadge} ${overallClass}`}>
          {report.overall_score}
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Col */}
        <div className={styles.mainCol}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Current Position</h2>
            <div className={styles.statusGrid}>
              <div className={styles.statusBox}>
                <span className={styles.statusLabel}>Current EPC</span>
                <RatingBadge rating={report.current_rating} size="lg" />
              </div>
              <div className={styles.statusBox}>
                <span className={styles.statusLabel}>Potential EPC</span>
                <RatingBadge rating={report.potential_rating} size="md" />
              </div>
              <div className={styles.statusBox}>
                <span className={styles.statusLabel}>MEES Status</span>
                <span className={`${styles.statusText} ${report.mees_status.includes('COMPLIANT') && !report.mees_status.includes('NON') ? styles.textGood : styles.textDanger}`}>
                  {report.mees_status}
                </span>
              </div>
            </div>
            {report.overall_score === 'NON COMPLIANT' && (
              <p className={styles.alertText}>
                <strong>ILLEGAL TO RENT:</strong> This property does not meet the Minimum Energy Efficiency Standard (MEES) requirement of Band E. You must carry out improvements or register an exemption before granting a new tenancy.
              </p>
            )}
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Future Readiness (EPC Band C)</h2>
            <div className={styles.readinessRow}>
              <div className={styles.gapBox}>
                <span className={styles.gapNumber}>{report.band_c_gap}</span>
                <span className={styles.gapLabel}>Band Gap to C</span>
              </div>
              <div className={styles.readinessText}>
                <p><strong>Legislative Risk: {insights.future_risk}</strong></p>
                <p>The Government has signaled intentions to raise the minimum standard to Band C by 2030. {
                  report.band_c_gap > 0 
                    ? `You currently have a gap of ${report.band_c_gap} band(s). You should plan upgrades now to avoid being caught out.` 
                    : "Your property already meets proposed future standards."
                }</p>
              </div>
            </div>
          </section>

          {recommendations.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>AI Improvement Planner</h2>
              <p style={{ color: '#8BA3BF', marginBottom: '1.5rem' }}>Calculated roadmap to maximize efficiency and achieve Band C.</p>
              <div className={styles.recList}>
                {recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className={styles.recItem}>
                    <div className={styles.recHeader}>
                      <span className={styles.recName}>{rec['improvement-summary-text']}</span>
                      <span className={styles.recBadge}>Priority {rec['improvement-id-text']}</span>
                    </div>
                    <div className={styles.recDetails}>
                      <div>
                        <span className={styles.recLabel}>Est. Cost</span>
                        <span className={styles.recVal}>£{rec['indicative-cost'] || '?'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Col */}
        <div className={styles.sideCol}>
          <section className={`${styles.card} ${styles.ctaCard}`}>
            <h3 className={styles.ctaTitle}>Landlord Action Plan</h3>
            <div className={styles.actionSteps}>
              {report.overall_score === 'NON COMPLIANT' ? (
                <>
                  <div className={styles.actionStep}>1. Halt new tenancies</div>
                  <div className={styles.actionStep}>2. Book urgent EPC Upgrade Assessment</div>
                  <div className={styles.actionStep}>3. Execute works</div>
                </>
              ) : report.band_c_gap > 0 ? (
                <>
                  <div className={styles.actionStep}>1. Review Improvement Planner</div>
                  <div className={styles.actionStep}>2. Budget for upgrades before 2028</div>
                  <div className={styles.actionStep}>3. Book an Advisory Call</div>
                </>
              ) : (
                <>
                  <div className={styles.actionStep}>1. Ensure EPC is in date</div>
                  <div className={styles.actionStep}>2. Save report to records</div>
                </>
              )}
            </div>
            
            <Link href="/book" className={styles.primaryBtn}>
              {report.overall_score === 'NON COMPLIANT' ? 'Book Urgent EPC (£65)' : 'Book Consultancy Call'}
            </Link>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Portfolio Management</h3>
            <p style={{ color: '#8BA3BF', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Are you managing multiple properties? Save this report to your Avorria Landlord Portfolio to track risk across all your assets.
            </p>
            <Link href="/login?redirect=/portal/portfolio" className={styles.secondaryBtn}>
              Save to Portfolio
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
