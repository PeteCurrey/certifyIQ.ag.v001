import React from 'react'
import Link from 'next/link'
import styles from './AIToolsShowcase.module.css'

const RATINGS = ['A','B','C','D','E','F','G']
const COLORS = ['#9BFF59','#7ED321','#B8E000','#F5A623','#E07020','#D04020','#A01010']

function RatingScale({ highlight }: { highlight: number }) {
  return (
    <div className={styles.scale}>
      {RATINGS.map((r, i) => (
        <div key={r} className={`${styles.scaleBar} ${i === highlight ? styles.scaleBarActive : ''}`} style={{ background: COLORS[i], opacity: i === highlight ? 1 : 0.3, height: `${100 - i * 10}%` }}>
          <span className={styles.scaleLabel}>{r}</span>
        </div>
      ))}
    </div>
  )
}

function ComplianceMeter() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
      <div style={{ position: 'relative', width: '180px', height: '12px', background: '#1E2D4A', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '75%', background: 'linear-gradient(90deg, #FF5C5C 0%, #F5A623 50%, #9BFF59 100%)' }} />
        <div style={{ position: 'absolute', left: '75%', top: '-2px', width: '4px', height: '16px', background: '#E8F4FF', borderRadius: '2px', boxShadow: '0 0 8px #FFF' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '180px', fontSize: '0.7rem', fontFamily: 'DM Mono, monospace', color: '#8BA3BF' }}>
        <span>Fail</span>
        <span>Marginal</span>
        <span style={{ color: '#9BFF59', fontWeight: 600 }}>Pass</span>
      </div>
    </div>
  )
}

export default function AIToolsShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>AI-powered tools</p>
        <h2 className={styles.h2}>Smarter than a standard EPC service</h2>
        <div className={styles.panels}>
          <div className={styles.panel}>
            <div className={styles.visual}><RatingScale highlight={3} /></div>
            <div className={styles.content}>
              <span className={styles.tag}>Free tool</span>
              <h3 className={styles.panelTitle}>Find out your likely rating — before you book</h3>
              <p className={styles.panelDesc}>Answer 8 quick questions about your home and our AI will estimate your likely EPC band, what your energy costs might be, and whether you&apos;re likely to pass minimum rental standards.</p>
              <Link href="/estimate" className={styles.panelCta} id="ai-estimator-cta">Try the free estimator →</Link>
            </div>
          </div>
          <div className={styles.panel}>
            <div className={styles.visual}>
              <div className={styles.beforeAfter}>
                <div className={styles.baItem}><span style={{ background: '#F5A623', color: '#000', borderRadius: 8, padding: '0.5rem 1rem', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>D</span><span className={styles.baLabel}>Current</span></div>
                <div className={styles.baArrow}>→</div>
                <div className={styles.baItem}><span style={{ background: '#B8E000', color: '#000', borderRadius: 8, padding: '0.5rem 1rem', fontFamily: 'DM Mono, monospace', fontWeight: 500 }}>C</span><span className={styles.baLabel}>Potential</span></div>
              </div>
            </div>
            <div className={styles.content}>
              <span className={styles.tag}>Free tool</span>
              <h3 className={styles.panelTitle}>What would it take to reach band C?</h3>
              <p className={styles.panelDesc}>Enter your current EPC details and our AI will calculate the most cost-effective improvements ranked by impact per pound spent — from loft insulation to heat pumps.</p>
              <Link href="/improve" className={styles.panelCta} id="ai-improve-cta">Get your improvement plan →</Link>
            </div>
          </div>
          <div className={styles.panel}>
            <div className={styles.visual}><ComplianceMeter /></div>
            <div className={styles.content}>
              <span className={styles.tag}>Free tool</span>
              <h3 className={styles.panelTitle}>Will your new build pass Part L?</h3>
              <p className={styles.panelDesc}>Enter your proposed construction specification and our AI will estimate whether your design is likely to pass Part L SAP compliance — before you submit to Building Control.</p>
              <Link href="/tools/sap-checker" className={styles.panelCta} id="ai-sap-checker-cta">Check your design →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
