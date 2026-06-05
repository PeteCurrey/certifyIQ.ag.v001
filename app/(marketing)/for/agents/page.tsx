import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import EnquiryForm from '../EnquiryForm'
import styles from '../for.module.css'

export const metadata: Metadata = {
  title: 'Avorria — For Estate & Letting Agents | EPC Partnerships',
  description: 'Fast, professional EPC assessments for estate agents and letting brokers. Automated order tracking, volume discounts, and 24-hour delivery.',
}

export default function AgentsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Agency Network</span>
        <h1 className={styles.title}>EPC Partnerships For Estate &amp; Letting Agents</h1>
        <p className={styles.subtitle}>
          Provide a seamless compliance experience for your landlords and vendors. Partner with Avorria for priority scheduling, discounted wholesale rates, and automated certificate delivery.
        </p>
        <div className={styles.ctaGroup}>
          <a href="#enquiry" className={styles.ctaPrimary}>Partner With Us</a>
          <Link href="/book" className={styles.ctaSecondary}>Book Individual EPC</Link>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Agents Recommend Avorria</h2>
          <p className={styles.sectionDesc}>We represent your brand with absolute professionalism during home visits.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>⏱️</div>
            <h3 className={styles.cardTitle}>24-Hour Turnaround</h3>
            <p className={styles.cardBody}>
              Never delay a listing. We deliver fully lodged digital certificates within 24 hours of completing our on-site inspection.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>⚙️</div>
            <h3 className={styles.cardTitle}>Portal Integration</h3>
            <p className={styles.cardBody}>
              Order, track, and download all property certificates in one secure dashboard. We can link with your agency CRM.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>💼</div>
            <h3 className={styles.cardTitle}>Flexible Billing</h3>
            <p className={styles.cardBody}>
              Choose from monthly consolidated invoicing, white-label client billing, or direct referral commission structures.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.splitSection} id="enquiry">
        <div>
          <h2 className={styles.sectionTitle} style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            Elevate Your Client Experience
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Avorria makes listing compliance effortless. When your agents secure a new sales or letting mandate, our assessors are ready to book within hours, leaving your staff free to focus on closing deals.
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', paddingLeft: '1.25rem', marginBottom: '2rem' }}>
            <li>✓ Smart notifications keeping tenants &amp; owners updated</li>
            <li>✓ Elmhurst energy assessors carrying full liability cover</li>
            <li>✓ Co-branded download links for client convenience</li>
            <li>✓ Transparent pricing structure with no hidden fees</li>
          </ul>
        </div>
        
        <EnquiryForm type="Agent" />
      </section>
    </div>
  )
}
