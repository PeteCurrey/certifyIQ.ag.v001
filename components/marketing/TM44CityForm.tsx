'use client'

import React, { useState } from 'react'
import styles from '@/app/(marketing)/services/services.module.css'

export default function TM44CityForm({ city }: { city: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  if (submitted) {
    return (
      <div style={{ backgroundColor: 'rgba(155,255,89,0.1)', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--accent-lime)' }}>
        <h3 style={{ color: 'var(--accent-lime)', marginBottom: '1rem' }}>Request Received</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Thank you. Our {city} team will contact you within 2 working hours with a quote.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Property Address in {city} *</label>
          <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="input" placeholder={`e.g. 1 High Street, ${city}`} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address *</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@company.com" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number *</label>
          <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="input" placeholder="07700 900000" />
        </div>
        <button type="submit" disabled={submitting} className={styles.btnPrimary} style={{ width: '100%', padding: '1rem', marginTop: '1rem', border: 'none', cursor: 'pointer', fontWeight: 700, borderRadius: '8px' }}>
          {submitting ? 'Submitting...' : `Get TM44 Quote for ${city}`}
        </button>
      </div>
    </form>
  )
}
