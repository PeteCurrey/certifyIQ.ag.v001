import React from 'react'
import Link from 'next/link'
import styles from './AIToolsShowcase.module.css'

const RATINGS = ['A','B','C','D','E','F','G']
const COLORS = [
  'var(--epc-a)',
  'var(--epc-b)',
  'var(--epc-c)',
  'var(--epc-d)',
  'var(--epc-e)',
  'var(--epc-f)',
  'var(--epc-g)'
]

function RatingScale({ highlight }: { highlight: number }) {
  return (
    <div className={styles.scale}>
      {RATINGS.map((r, i) => (
        <div 
          key={r} 
          className={`${styles.scaleBar} ${i === highlight ? styles.scaleBarActive : ''}`} 
          style={{ 
            background: COLORS[i], 
            opacity: i === highlight ? 1 : 0.35, 
            height: `${100 - i * 10}%` 
          }}
        >
          <span className={styles.scaleLabel}>{r}</span>
        </div>
      ))}
    </div>
  )
}

function ComplianceMeter() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
      <div style={{ position: 'relative', width: '180px', height: '12px', background: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '75%', background: 'linear-gradient(90deg, var(--epc-f) 0%, var(--epc-d) 50%, var(--accent-lime) 100%)' }} />
        <div style={{ position: 'absolute', left: '75%', top: '-2px', width: '4px', height: '16px', background: 'var(--text-primary)', borderRadius: '2px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '180px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
        <span>Fail</span>
        <span>Marginal</span>
        <span style={{ color: 'var(--accent-lime)', fontWeight: 600 }}>Pass</span>
      </div>
    </div>
  )
}

export default function AIToolsShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Smart Tools</p>
        <h2 className={styles.h2}>Interactive tools to make EPC planning simple</h2>
        <div className={styles.panels}>
          <div className={styles.panel}>
            <div className={styles.visual}><RatingScale highlight={3} /></div>
            <div className={styles.content}>
              <span className={styles.tag}>Free tool</span>
              <h3 className={styles.panelTitle}>Find out your likely rating — before you book</h3>
              <p className={styles.panelDesc}>Answer 8 quick questions about your home and our online estimator will project your likely EPC band, estimated energy costs, and whether you meet minimum standards.</p>
              <Link href="/estimate" className={styles.panelCta} id="ai-estimator-cta">Try the free estimator →</Link>
            </div>
          </div>
          <div className={styles.panel}>
            <div className={styles.visual}>
              <div className={styles.beforeAfter}>
                <div className={styles.baItem}>
                  <span style={{ background: 'var(--epc-d)', color: '#000', borderRadius: 8, padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>D</span>
                  <span className={styles.baLabel}>Current</span>
                </div>
                <div className={styles.baArrow}>→</div>
                <div className={styles.baItem}>
                  <span style={{ background: 'var(--epc-c)', color: '#000', borderRadius: 8, padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>C</span>
                  <span className={styles.baLabel}>Potential</span>
                </div>
              </div>
            </div>
            <div className={styles.content}>
              <span className={styles.tag}>Free tool</span>
              <h3 className={styles.panelTitle}>What would it take to reach band C?</h3>
              <p className={styles.panelDesc}>Enter your current EPC details and our planning engine will calculate the most cost-effective improvements ranked by impact per pound spent — from loft insulation to heat pumps.</p>
              <Link href="/improve" className={styles.panelCta} id="ai-improve-cta">Get your improvement plan →</Link>
            </div>
          </div>
          <div className={styles.panel}>
            <div className={styles.visual}><ComplianceMeter /></div>
            <div className={styles.content}>
              <span className={styles.tag}>Free tool</span>
              <h3 className={styles.panelTitle}>Will your new build pass Part L?</h3>
              <p className={styles.panelDesc}>Enter your proposed construction specification and our checker will calculate whether your design is likely to pass Part L SAP compliance — before you submit to Building Control.</p>
              <Link href="/tools/sap-checker" className={styles.panelCta} id="ai-sap-checker-cta">Check your design →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
