import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import EnquiryForm from '../EnquiryForm'
import styles from '../for.module.css'

export const metadata: Metadata = {
  title: 'Avorria — For Developers | SAP Calculations & Air Testing',
  description: 'Fast, Elmhurst-accredited Part L compliance for homebuilders and developers. On-construction SAP, PEAs, and air tightness testing.',
}

export default function DevelopersPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Partner Program</span>
        <h1 className={styles.title}>SAP Assessments &amp; Air Testing For Developers</h1>
        <p className={styles.subtitle}>
          Accelerate building control sign-offs. We deliver end-to-end Part L compliance support, from design-stage SAP calculations (PEAs) to final on-construction EPCs and air leakage tests.
        </p>
        <div className={styles.ctaGroup}>
          <a href="#enquiry" className={styles.ctaPrimary}>Request Developer Rates</a>
          <Link href="/book" className={styles.ctaSecondary}>Book Single SAP</Link>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Built For Modern Construction Cycles</h2>
          <p className={styles.sectionDesc}>Our integrated compliance services keep your new build developments moving on schedule.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📐</div>
            <h3 className={styles.cardTitle}>Design-Stage SAP (PEA)</h3>
            <p className={styles.cardBody}>
              Avoid costly alterations. We review your architectural drawings and specifications early to ensure your designs meet Part L targets before ground-break.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>💨</div>
            <h3 className={styles.cardTitle}>Air Tightness Testing</h3>
            <p className={styles.cardBody}>
              Accredited air integrity checks. We run diagnostic smoke tests and official air leakage measurements to certify building envelope efficiency.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>⚡</div>
            <h3 className={styles.cardTitle}>As-Built EPCs</h3>
            <p className={styles.cardBody}>
              Immediate lodgement on completion. We convert your design files into final lodged Energy Performance Certificates as soon as sign-off is needed.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.splitSection} id="enquiry">
        <div>
          <h2 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            Scale Your Compliance. Reduce Friction.
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Avorria supports independent residential builders, main contractors, and housing associations. We act as your compliance partner, ensuring you don't face last-minute handover delays.
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
            <li>✓ Elmhurst energy assessors certified in RdSAP &amp; SAP 10</li>
            <li>✓ Bulk assessment discounts based on annual plots</li>
            <li>✓ Interactive developer portal for certificate retrieval</li>
            <li>✓ Dedicated account managers and technical support desk</li>
          </ul>
        </div>
        
        <EnquiryForm type="Developer" />
      </section>
    </div>
  )
}
