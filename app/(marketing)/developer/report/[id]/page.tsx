import React from 'react'
import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import styles from './report.module.css'

async function getReport(id: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data, error } = await supabase
    .from('developer_compliance_reports')
    .select('*, developer_projects(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

export default async function DeveloperReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const report = await getReport(resolvedParams.id)
  
  if (!report) notFound()

  const project = report.developer_projects
  const services = report.required_services || []
  const timeline = report.compliance_timeline || {}
  const risk = report.risk_analysis || {}

  const riskColor = report.risk_score === 'HIGH' ? '#DC2626' : report.risk_score === 'MEDIUM' ? '#D97706' : '#0F766E'

  return (
    <div className={styles.pageContainer}>
      <div className={styles.printHeader}>
         <h2>Avorria Compliance Planner</h2>
         <p>Project Ref: {project.id.split('-')[0].toUpperCase()}</p>
      </div>

      <div className={styles.topBar}>
        <Link href="/developer" className={styles.backLink}>← Back to Planner</Link>
        <a href={`/api/developer-compliance/pdf/${report.id}`} download className={styles.printBtn}>
          🖨️ Download PDF Plan
        </a>
      </div>

      {/* Hero Summary */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.tagRow}>
            <span className={styles.tag}>{project.project_type}</span>
            <span className={styles.tag}>{project.construction_type}</span>
            <span className={styles.tagLabel}>Stage: {project.project_stage}</span>
          </div>
          <h1 className={styles.projectTitle}>Compliance Roadmap</h1>
          <p className={styles.projectLocation}>
            {project.town}, {project.county} ({project.postcode}) • {project.number_of_units} Unit(s)
          </p>
        </div>
        <div className={styles.riskBadge} style={{ borderColor: riskColor, backgroundColor: `${riskColor}10` }}>
          <span className={styles.riskLabel}>Compliance Risk</span>
          <span className={styles.riskValue} style={{ color: riskColor }}>{report.risk_score}</span>
        </div>
      </section>

      <div className={styles.layoutGrid}>
        <div className={styles.mainCol}>
          
          {/* Timeline Section */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Project Timeline</h2>
            <div className={styles.timelineWrapper}>
              {['planning', 'design', 'pre_construction', 'construction', 'completion'].map((stageKey, idx) => {
                const stageData = timeline[stageKey]
                const stageNames = ['Planning', 'Design', 'Pre-Construction', 'Construction', 'Completion']
                
                return (
                  <div key={stageKey} className={`${styles.timelineNode} ${stageData.active ? styles.active : ''}`}>
                    <div className={styles.nodeIcon}>{idx + 1}</div>
                    <div className={styles.nodeContent}>
                      <h3 className={styles.nodeTitle}>{stageNames[idx]}</h3>
                      {stageData.active ? (
                        <ul className={styles.deliverablesList}>
                          {stageData.deliverables.map((d: string, i: number) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.noDeliverables}>No deliverables</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Required Services */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Required Services</h2>
            <div className={styles.servicesGrid}>
              {services.map((service: any, idx: number) => (
                <div key={idx} className={styles.serviceItem}>
                  <div className={styles.serviceHeader}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    <span className={styles.servicePriority} data-priority={service.priority}>
                      {service.priority}
                    </span>
                  </div>
                  <p className={styles.serviceReason}>{service.reason}</p>
                  <div className={styles.serviceFooter}>
                    <span className={styles.serviceStage}>Due: {service.stage}</span>
                    <span className={styles.serviceCost}>£{service.cost_min} - £{service.cost_max}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Risk Analysis */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Risk Analysis</h2>
            
            {risk.factors?.length > 0 && (
              <div className={styles.riskBlock}>
                <h4>Identified Risk Factors</h4>
                <ul>
                  {risk.factors.map((f: string, i: number) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
            
            {risk.delays?.length > 0 && (
              <div className={`${styles.riskBlock} ${styles.alertBlock}`}>
                <h4>Potential Delays</h4>
                <ul>
                  {risk.delays.map((f: string, i: number) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            {risk.recommendations?.length > 0 && (
              <div className={`${styles.riskBlock} ${styles.successBlock}`}>
                <h4>Recommendations</h4>
                <ul>
                  {risk.recommendations.map((f: string, i: number) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </section>

        </div>

        {/* Sidebar Actions */}
        <div className={styles.sidebarCol}>
          <div className={styles.actionCard}>
            <h3>Total Estimated Cost</h3>
            <p className={styles.costEstimate}>
              £{report.estimated_cost_total_min} - £{report.estimated_cost_total_max}
            </p>
            <p className={styles.costNote}>Indicative pricing for all required services. Final price may vary based on floor plans.</p>
            
            <Link href="/book" className={styles.primaryBtn}>
              Request Formal Quote
            </Link>
            
            <div className={styles.uploadBox}>
               <h4>Have architectural plans?</h4>
               <p>Upload your drawings for a precise, fixed-price quote from our team.</p>
               <button className={styles.secondaryBtn}>Upload Drawings</button>
            </div>
          </div>

          <div className={styles.saveCard}>
            <h3>Save this Roadmap</h3>
            <p>Access this plan anytime, upload documents, and track compliance progress.</p>
            <Link href="/login" className={styles.outlineBtn}>
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
      
      {/* The browser print script has been removed in favor of the new branded server-side PDF generator */}
    </div>
  )
}
