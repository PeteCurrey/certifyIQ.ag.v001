import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from './prices.module.css'

export const metadata: Metadata = {
  title: 'EPC Pricing | Avorria',
  description: 'Transparent, fixed-price EPC assessments from £65. No hidden fees. Includes assessor visit, national registration and 10-year validity.',
}

const DOMESTIC_TIERS = [
  { type: 'Flat / Apartment', price: 65, note: 'Any size, any floor level' },
  { type: '1–2 Bed House', price: 70, note: 'Terraced, semi, or detached' },
  { type: '3 Bed House', price: 80, note: 'Terraced, semi, or detached' },
  { type: '4 Bed House', price: 95, note: 'Any construction type' },
  { type: '5+ Bed House', price: 110, note: 'Including large detached homes' },
]

const WHAT_INCLUDED = [
  { title: 'Full On-Site Assessment', desc: 'A qualified RdSAP 10 assessor visits your property and carries out a comprehensive physical inspection.' },
  { title: 'National Register Lodgement', desc: 'Your certificate is uploaded to the Government EPC register and is legally valid from issue date.' },
  { title: '10-Year Validity', desc: 'The EPC is valid for 10 years from the date of lodgement, for sale or rental use.' },
  { title: 'Improvement Recommendations', desc: 'Your certificate includes a list of cost-effective improvements to improve the energy rating.' },
  { title: 'PDF Certificate Delivery', desc: 'Emailed directly to you and accessible via your secure client portal within 24 hours of visit.' },
  { title: 'No Hidden Fees', desc: 'The price listed is the total price. There are no booking fees, administration charges, or extras.' },
]

const FAQS = [
  {
    q: 'How quickly will I get my EPC?',
    a: 'We aim to lodge and deliver your certificate within 24 hours of the assessment visit. In most cases, same-day lodgement is possible.'
  },
  {
    q: 'Do I need to be present during the assessment?',
    a: 'Yes, an adult (18+) must be present to grant access. The assessor will need to inspect all rooms, the loft, and any outbuildings that form part of the habitable area.'
  },
  {
    q: 'What areas do you cover?',
    a: 'We primarily cover Chesterfield, Sheffield, Derby, Matlock, Dronfield, and surrounding Derbyshire postcodes including S40–S45, DE1–DE55. Contact us for availability in other areas.'
  },
  {
    q: 'Do you offer bulk discounts for agents or landlords?',
    a: 'Yes — we offer discounted rates for portfolios of 3 or more properties booked together. Contact us for a bespoke quote or set up an agent account for ongoing discounts.'
  },
  {
    q: 'What is RdSAP 10?',
    a: 'RdSAP 10 (Reduced Data Standard Assessment Procedure, version 10) is the latest government-approved methodology for calculating the energy performance of existing domestic properties in England and Wales. All EPCs issued from 2024 onwards must use this method.'
  },
]

export default function PricingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Transparent Pricing</span>
        <h1 className={styles.title}>Simple, fixed-price EPCs</h1>
        <p className={styles.subtitle}>
          No booking fees. No hidden extras. The price you see is the price you pay — includes assessor visit, national registration, and PDF delivery.
        </p>
      </div>

      {/* Domestic Pricing Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Domestic EPC Pricing</h2>
        <div className={styles.pricingGrid}>
          {DOMESTIC_TIERS.map((tier) => (
            <div key={tier.type} className={styles.priceCard}>
              <div className={styles.priceCardTop}>
                <h3 className={styles.priceType}>{tier.type}</h3>
                <p className={styles.priceNote}>{tier.note}</p>
              </div>
              <div className={styles.priceAmount}>
                £{tier.price}
              </div>
              <Link
                href={`/book?propType=${encodeURIComponent(tier.type)}`}
                className={styles.bookBtn}
                id={`book-${tier.type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                Book from £{tier.price}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Commercial Banner */}
      <section className={styles.commercialBanner}>
        <div className={styles.commercialContent}>
          <h2>Commercial EPC</h2>
          <p>Commercial Energy Performance Certificates for offices, retail units, and industrial buildings. Priced on inspection based on floor area and complexity.</p>
          <Link href="/book" className={styles.contactCta}>Get a quote →</Link>
        </div>
        <div className={styles.commercialNote}>
          <span className={styles.commercialTag}>MEES Compliance</span>
          <p>From April 2023, it is unlawful to lease a commercial property with an EPC rating below E. We can assess your property and advise on required improvements.</p>
        </div>
      </section>

      {/* What's Included */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What&apos;s included in every EPC</h2>
        <div className={styles.includedGrid}>
          {WHAT_INCLUDED.map((item) => (
            <div key={item.title} className={styles.includedCard}>
              <span className={styles.checkMark}>✓</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {FAQS.map((faq) => (
            <details key={faq.q} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>{faq.q}</summary>
              <p className={styles.faqAnswer}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className={styles.bottomCta}>
        <h2>Ready to book your EPC?</h2>
        <p>Fast, local, accredited — certificate in 24 hours.</p>
        <Link href="/book" className={styles.bottomCtaBtn}>Book Now — From £65</Link>
      </div>
    </div>
  )
}
