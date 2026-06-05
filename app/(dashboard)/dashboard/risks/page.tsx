'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { ShieldAlert, AlertTriangle, CheckCircle, TrendingDown, Zap } from 'lucide-react'
import styles from './risks.module.css'

const RISK_DATA = [
  {
    property: '14 Mill Lane, Derby DE1 3EF',
    type: 'Terraced',
    score: 32,
    risk: 'Critical',
    issues: [
      { cert: 'EPC', detail: 'Expired 45 days ago', severity: 'critical', action: 'Cannot legally relet. Book EPC immediately.' },
      { cert: 'EICR', detail: 'No record found', severity: 'high', action: 'Obtain EICR before next tenancy.' },
    ],
    estimatedCost: 185,
  },
  {
    property: 'Unit 4, Sheffield S1 2FF',
    type: 'Commercial',
    score: 41,
    risk: 'High',
    issues: [
      { cert: 'Commercial EPC', detail: 'Expires in 12 days — rated E (MEES risk)', severity: 'high', action: 'Book Commercial EPC immediately. E rating may breach MEES 2027 uplifts.' },
      { cert: 'Fire Risk Assessment', detail: 'No record found', severity: 'high', action: 'Obtain Fire Risk Assessment for commercial premises (legal requirement).' },
    ],
    estimatedCost: 750,
  },
  {
    property: '7 Oak Street, Chesterfield S40 2JL',
    type: 'Semi-Detached',
    score: 48,
    risk: 'High',
    issues: [
      { cert: 'Gas Safety', detail: 'Expires in 18 days', severity: 'high', action: 'Book Gas Safety within 7 days. Tenant must receive copy within 28 days of issue.' },
    ],
    estimatedCost: 65,
  },
  {
    property: '22 Victoria Road, Matlock DE4 3BT',
    type: 'Detached',
    score: 55,
    risk: 'Medium',
    issues: [
      { cert: 'EICR', detail: 'Expires in 28 days', severity: 'medium', action: 'Book EICR within 14 days to avoid gap in compliance.' },
    ],
    estimatedCost: 150,
  },
  {
    property: '31 Beech Drive, Nottingham NG1 4AB',
    type: 'Semi-Detached',
    score: 71,
    risk: 'Medium',
    issues: [
      { cert: 'EPC', detail: 'Expires in 30 days', severity: 'medium', action: 'Renew EPC before expiry to avoid compliance gap.' },
    ],
    estimatedCost: 70,
  },
]

const RISK_COLORS: Record<string, string> = {
  Critical: '#F87171',
  High: '#FB923C',
  Medium: '#F59E0B',
  Low: '#9BFF59',
}

export default function RisksPage() {
  const [selected, setSelected] = useState<number | null>(null)

  const totalCost = RISK_DATA.reduce((sum, r) => sum + r.estimatedCost, 0)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Risk Analysis</h1>
          <p className={styles.pageSub}>AI-generated risk flags across your portfolio</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <span className={styles.hsValue} style={{ color: '#F87171' }}>2</span>
            <span className={styles.hsLabel}>Critical</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.hsValue} style={{ color: '#FB923C' }}>3</span>
            <span className={styles.hsLabel}>High</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.hsValue} style={{ color: '#F59E0B' }}>4</span>
            <span className={styles.hsLabel}>Medium</span>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className={styles.summaryBanner}>
        <div className={styles.bannerLeft}>
          <TrendingDown size={20} color="#F87171" />
          <div>
            <p className={styles.bannerTitle}>Estimated Remediation Cost</p>
            <p className={styles.bannerSub}>Minimum spend to resolve all current risk issues</p>
          </div>
        </div>
        <div className={styles.bannerCost}>£{totalCost.toLocaleString()}</div>
        <Link href="/dashboard/book" className={styles.bannerCta}>Book All Now</Link>
      </div>

      {/* Risk List */}
      <div className={styles.riskList}>
        {RISK_DATA.map((r, i) => (
          <div
            key={i}
            className={`${styles.riskCard} ${selected === i ? styles.expanded : ''}`}
            style={{ borderLeftColor: RISK_COLORS[r.risk] }}
          >
            <div className={styles.riskHeader} onClick={() => setSelected(selected === i ? null : i)}>
              <div className={styles.riskScore} style={{ borderColor: RISK_COLORS[r.risk], color: RISK_COLORS[r.risk] }}>
                {r.score}
              </div>
              <div className={styles.riskInfo}>
                <p className={styles.riskAddress}>{r.property}</p>
                <p className={styles.riskType}>{r.type} — {r.issues.length} issue{r.issues.length !== 1 ? 's' : ''} found</p>
              </div>
              <span className={styles.riskBadge} style={{ background: `${RISK_COLORS[r.risk]}15`, color: RISK_COLORS[r.risk], borderColor: `${RISK_COLORS[r.risk]}40` }}>
                {r.risk}
              </span>
              <span className={styles.riskCost}>£{r.estimatedCost}</span>
              <button className={styles.expandBtn}>{selected === i ? '▲' : '▼'}</button>
            </div>

            {selected === i && (
              <div className={styles.riskDetails}>
                {r.issues.map((issue, j) => (
                  <div key={j} className={`${styles.issueCard} ${styles[`sev_${issue.severity}`]}`}>
                    <div className={styles.issueHeader}>
                      <AlertTriangle size={16} color={
                        issue.severity === 'critical' ? '#F87171' :
                        issue.severity === 'high' ? '#FB923C' : '#F59E0B'
                      } />
                      <strong className={styles.issueCert}>{issue.cert}</strong>
                      <span className={styles.issueDetail}>{issue.detail}</span>
                    </div>
                    <p className={styles.issueAction}><Zap size={12} color="#9BFF59" /> {issue.action}</p>
                    <div className={styles.issueActions}>
                      <Link href={`/book?service=${encodeURIComponent(issue.cert)}&property=${encodeURIComponent(r.property)}`} className={styles.bookIssueBtn}>
                        Book {issue.cert}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
