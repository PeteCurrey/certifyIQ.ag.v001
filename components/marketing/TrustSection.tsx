import React from 'react'
import ElmhurstBadge from '@/components/ui/ElmhurstBadge'
import styles from './TrustSection.module.css'

export default function TrustSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Accreditations</p>
        <h2 className={styles.h2}>Fully certified. Nationally registered.</h2>
        <p className={styles.body}>
          All our assessors are fully accredited members of Elmhurst Energy —
          the UK's largest government-approved EPC accreditation scheme,
          responsible for over half of all certificates issued nationally.
          Every certificate we produce is lodged directly to the official
          government EPC register via Elmhurst accreditation.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <ElmhurstBadge />
        </div>
      </div>
    </section>
  )
}
