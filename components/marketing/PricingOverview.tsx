import React from 'react'
import Link from 'next/link'
import styles from './PricingOverview.module.css'

const ROWS = [
  { label: 'Flat / Studio', price: '£65', desc: 'Any size flat or studio apartment' },
  { label: '1–3 bed house', price: '£70–£80', desc: 'Terraced, semi-detached or detached' },
  { label: '4+ bed house', price: '£95–£110', desc: 'Larger detached & bungalows' },
  { label: 'Commercial', price: 'Quote on request', desc: 'We will contact you within 2 hours', highlight: false },
]

export default function PricingOverview() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Transparent pricing</p>
        <h2 className={styles.h2}>Fixed prices. No surprises.</h2>
        <div className={styles.table}>
          {ROWS.map((row, i) => (
            <div key={i} className={styles.row}>
              <div className={styles.rowLabel}>{row.label}</div>
              <div className={styles.rowDesc}>{row.desc}</div>
              <div className={styles.rowPrice}>{row.price}</div>
            </div>
          ))}
        </div>
        <p className={styles.note}>Same-day assessment available (subject to availability) — small surcharge applies</p>
        <div className={styles.actions}>
          <Link href="/prices" className={styles.linkPrimary} id="pricing-see-full">See full pricing →</Link>
          <Link href="/book" className={styles.linkCta} id="pricing-book-now">Book now</Link>
        </div>
      </div>
    </section>
  )
}
