'use client'
import React from 'react'
import Link from 'next/link'
import styles from './AgencyHeader.module.css'

export default function AgencyHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="search"
          placeholder="Search properties, jobs, reports…"
          className={styles.searchInput}
        />
      </div>
      <div className={styles.actions}>
        <Link href="/agency/book" className={styles.orderBtn}>
          + Order Service
        </Link>
        <button className={styles.notifBtn} aria-label="Notifications">
          <span className={styles.notifDot} />
          🔔
        </button>
        <div className={styles.avatar}>JD</div>
      </div>
    </header>
  )
}
