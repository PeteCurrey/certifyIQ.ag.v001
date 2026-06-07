import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import EnquiryForm from '../EnquiryForm'
import styles from '../for.module.css'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://avorria.co.uk/for/landlords',
  },
  openGraph: {
    url: 'https://avorria.co.uk/for/landlords',
  },
  title: 'For Landlords & Property Managers | MEES Compliance',
  description: 'Stay MEES compliant. EPC portfolio management for landlords and residential managers. Unlock bulk discount rates and upgrade advisory reports.',
}

export default function LandlordsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Landlord Program</span>
        <h1 className={styles.title}>EPC Portfolio Solutions For Landlords</h1>
        <p className={styles.subtitle}>
          Protect your rental income. Keep your residential portfolio fully compliant with MEES regulations. Access bulk landlord rates, detailed retrofitting pathways, and multi-property management tools.
        </p>
        <div className={styles.ctaGroup}>
          <a href="#enquiry" className={styles.ctaPrimary}>Unlock Portfolio Rates</a>
          <Link href="/book" className={styles.ctaSecondary}>Book A Single EPC</Link>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Compliance &amp; Portfolio Management</h2>
          <p className={styles.sectionDesc}>We simplify compliance for buy-to-let investors and professional property managers.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🛡️</div>
            <h3 className={styles.cardTitle}>MEES Compliance Safeguards</h3>
            <p className={styles.cardBody}>
              Ensure your properties comply with the statutory Minimum Energy Efficiency Standard (MEES) before letting or renewing tenancies.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🛠️</div>
            <h3 className={styles.cardTitle}>Retrofitting Advisory</h3>
            <p className={styles.cardBody}>
              Not just an EPC. We provide practical cost-benefit analysis on insulation, heating upgrades, and heat pumps to raise ratings to Band C.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>🗂️</div>
            <h3 className={styles.cardTitle}>Multi-Property Portal</h3>
            <p className={styles.cardBody}>
              A single client log-in to monitor certificate expiry dates across your entire portfolio and retrieve documents instantly when requested.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.splitSection} id="enquiry">
        <div>
          <h2 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            Maximize Yield, Minimize Energy Loss
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            We work around your tenant schedules. Our polite, certified assessors carry out the inspections with minimal disruption, coordinating directly with letting agents or tenants as preferred.
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
            <li>✓ Multi-property volume discounts starting at just 3 properties</li>
            <li>✓ Access to certified RdSAP 10 energy assessors</li>
            <li>✓ Clear, actionable retrofit checklists for EPC bands E, F, G</li>
            <li>✓ Automated booking confirmation &amp; reminder texts for tenants</li>
          </ul>
        </div>
        
        <EnquiryForm type="Landlord" />
      </section>
    </div>
  )
}
