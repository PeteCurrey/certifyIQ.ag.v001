'use client'

import React from 'react'
import Link from 'next/link'
import styles from '../services.module.css'

export default function DomesticEpcPage() {
  return (
    <div className={styles.container} style={{ padding: 0, maxWidth: 'none' }}>
      {/* Hero Section */}
      <section 
        className={styles.heroFullScreen}
        style={{ backgroundImage: 'url(/hero_domestic.png)' }}
      >
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow} style={{ color: '#9BFF59' }}>Residential Services</span>
          <h1 className={styles.h1} style={{ color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>Domestic EPC Assessments.</h1>
          <p className={styles.sub} style={{ color: '#E8F4FF', fontSize: '1.25rem', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            Fast, professional Energy Performance Certificates for homeowners, landlords, and estate agents across the UK. Book online in 60 seconds.
          </p>
          <div style={{ marginTop: '40px' }}>
            <Link href="/book?service=domestic" className={styles.btnPrimary} style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
              Book an EPC Now
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.inner}>
        {/* Intro Media Section */}
        <section className={styles.mediaSection}>
          <div>
            <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>What is a Domestic EPC?</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' }}>
              An Energy Performance Certificate (EPC) provides information about a property’s energy use and typical energy costs. It also gives recommendations on how to reduce energy use and save money.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
              Properties are rated on a scale from A to G, with 'A' being the most efficient. An EPC is legally required whenever a property is built, sold, or rented. You must order an EPC for potential buyers and tenants before you market your property to sell or rent.
            </p>
            <ul className={styles.checklist}>
              <li className={styles.checklistItem}>
                <span className={styles.checkIcon}>✓</span> Valid for 10 years
              </li>
              <li className={styles.checklistItem}>
                <span className={styles.checkIcon}>✓</span> Needed to sell or rent your property
              </li>
              <li className={styles.checklistItem}>
                <span className={styles.checkIcon}>✓</span> Contains cost-effective energy saving tips
              </li>
            </ul>
          </div>
          <div className={styles.mediaImageContainer}>
            <img src="/how_it_works_interior.png" alt="Interior home energy assessment" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        </section>

        {/* Pricing & Booking Steps */}
        <section className={styles.gridSection}>
          <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
          <p className={styles.sectionSub}>No hidden fees. Next-day appointments often available.</p>
          
          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}>🏠</div>
                <h3 className={styles.cardTitle}>Standard EPC</h3>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>£55<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}> inc. VAT</span></div>
              <p className={styles.cardDesc}>Perfect for standard 1-3 bedroom residential properties.</p>
              <ul className={styles.facts}>
                <li className={styles.fact}><span className={styles.bullet}>•</span> 30-40 minute survey</li>
                <li className={styles.fact}><span className={styles.bullet}>•</span> Certificate within 24hrs</li>
                <li className={styles.fact}><span className={styles.bullet}>•</span> Fully accredited assessor</li>
              </ul>
              <div className={styles.ctas}>
                <Link href="/book?service=domestic" className={styles.btnPrimary}>Book Now</Link>
              </div>
            </div>

            <div className={styles.card} style={{ borderColor: 'var(--accent-lime)' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-lime)', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>MOST POPULAR</div>
              <div className={styles.cardHeader}>
                <div className={styles.icon}>🏡</div>
                <h3 className={styles.cardTitle}>Large Property</h3>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>£65<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}> inc. VAT</span></div>
              <p className={styles.cardDesc}>For 4+ bedroom homes or complex residential layouts.</p>
              <ul className={styles.facts}>
                <li className={styles.fact}><span className={styles.bullet}>•</span> 45-60 minute survey</li>
                <li className={styles.fact}><span className={styles.bullet}>•</span> Certificate within 24hrs</li>
                <li className={styles.fact}><span className={styles.bullet}>•</span> Fully accredited assessor</li>
              </ul>
              <div className={styles.ctas}>
                <Link href="/book?service=domestic" className={styles.btnPrimary}>Book Now</Link>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}>🏢</div>
                <h3 className={styles.cardTitle}>Landlord Bundle</h3>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>£99<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}> inc. VAT</span></div>
              <p className={styles.cardDesc}>Combine your EPC with a Gas Safety Record (CP12).</p>
              <ul className={styles.facts}>
                <li className={styles.fact}><span className={styles.bullet}>•</span> 1 site visit, 2 certificates</li>
                <li className={styles.fact}><span className={styles.bullet}>•</span> Save £25 compared to booking separately</li>
                <li className={styles.fact}><span className={styles.bullet}>•</span> Ensure full MEES compliance</li>
              </ul>
              <div className={styles.ctas}>
                <Link href="/book?service=domestic" className={styles.btnPrimary}>Book Now</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection} style={{ marginBottom: '80px' }}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                How long does the assessment take?
              </div>
              <div className={styles.faqAnswer}>
                A typical domestic EPC assessment takes between 30 and 45 minutes depending on the size of the property. The assessor will need access to all rooms, including the loft if possible, to measure the property and inspect the heating system and insulation.
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                When will I receive my certificate?
              </div>
              <div className={styles.faqAnswer}>
                Your digital EPC will be lodged on the central government register and emailed to you within 24 hours of the physical survey being completed.
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                What happens if my property gets a low rating?
              </div>
              <div className={styles.faqAnswer}>
                If your property receives a low rating, the certificate will include a list of recommended measures to improve the energy efficiency. If you are a landlord, you must achieve at least an 'E' rating to legally let the property (unless an exemption applies). Our assessors can advise you on the most cost-effective improvements.
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
