'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from '../book.module.css'

function BookSuccessContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') || '—'

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✓</div>
        <h2>Booking Confirmed!</h2>
        <p className={styles.successRef}>Reference: <strong>{ref}</strong></p>
        <div className={styles.successBody}>
          <p>Your booking has been registered and payment received. An assessor will contact you shortly to confirm your exact visit time.</p>
          <div className={styles.portalAlert}>
            <h4>Access Your Portal</h4>
            <p>Sign in with your email to track your booking status and download your certificate when ready.</p>
            <Link href="/login" className={styles.portalLink}>Go to Client Portal</Link>
          </div>
        </div>
        <Link href="/" className={styles.homeLink}>Return to Homepage</Link>
      </div>
    </div>
  )
}

export default function BookSuccessPage() {
  return (
    <React.Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}>Loading...</div>}>
      <BookSuccessContent />
    </React.Suspense>
  )
}
