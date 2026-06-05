import React from 'react'
import Link from 'next/link'
import styles from './LandlordBand.module.css'

export default function LandlordBand() {
  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.badge}>⏱ EPC expiry tracker — free for landlords</span>
          <h2 className={styles.h2}>Landlords: minimum C rating required from 2028. Don&apos;t wait for enforcement.</h2>
        </div>
        <Link href="/portal" className={styles.cta} id="landlord-band-cta">Check your portfolio →</Link>
      </div>
    </section>
  )
}
