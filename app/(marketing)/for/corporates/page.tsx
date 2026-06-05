import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import EnquiryForm from '../EnquiryForm'
import styles from '../for.module.css'

export const metadata: Metadata = {
  title: 'Avorria — For Corporates | Commercial EPCs & SBEM calculations',
  description: 'Enterprise portfolio energy assessments. Multi-site commercial EPCs (Level 3-5), MEES advisory audits, and SBEM calculations.',
}

export default function CorporatesPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Enterprise Services</span>
        <h1 className={styles.title}>Energy Compliance &amp; Auditing For Corporates</h1>
        <p className={styles.subtitle}>
          Secure and optimize your commercial portfolio. We provide Level 3, 4, and 5 Non-Domestic EPCs, SBEM engineering models, and strategic MEES exposure risk assessments for multi-site companies.
        </p>
        <div className={styles.ctaGroup}>
          <a href="#enquiry" className={styles.ctaPrimary}>Discuss Portfolio Needs</a>
          <Link href="/services/commercial-epc" className={styles.ctaSecondary}>Commercial Services</Link>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Enterprise-Grade Assessment Solutions</h2>
          <p className={styles.sectionDesc}>We audit commercial real estate with high technical precision and minimum operational disruption.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🏢</div>
            <h3 className={styles.cardTitle}>Level 3 to 5 EPCs</h3>
            <p className={styles.cardBody}>
              Certified commercial auditing. We handle everything from basic local retail shops to complex mixed-use high-rise office towers requiring dynamic simulation software (DSM).
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>📊</div>
            <h3 className={styles.cardTitle}>MEES Advisory Audits</h3>
            <p className={styles.cardBody}>
              Identify underperforming buildings early. We deliver detailed projection audits to map out cost-effective pathways to band B/C before statutory deadlines.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🌱</div>
            <h3 className={styles.cardTitle}>ESG Compliance Support</h3>
            <p className={styles.cardBody}>
              Align physical assets with corporate sustainability targets. Get standardized energy performance telemetry to feed into your ESG reporting dashboards.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.splitSection} id="enquiry">
        <div>
          <h2 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            Portfolio-Wide Governance
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Avorria helps corporate landlords, institutional investors, and facilities management companies streamline asset governance. We ensure all commercial properties are fully compliant with current UK building regulations.
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
            <li>✓ Full UK geographic coverage for corporate portfolios</li>
            <li>✓ Integrated RAMS (Risk Assessments &amp; Method Statements)</li>
            <li>✓ Standardized PDF delivery &amp; XML data file export</li>
            <li>✓ Bulk framework agreement pricing structures</li>
          </ul>
        </div>
        
        <EnquiryForm type="Corporate" />
      </section>
    </div>
  )
}
