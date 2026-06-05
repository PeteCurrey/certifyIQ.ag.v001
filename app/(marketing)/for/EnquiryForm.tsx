'use client'
import React, { useState } from 'react'
import styles from './for.module.css'

interface EnquiryFormProps {
  type: 'Developer' | 'Agent' | 'Corporate' | 'Landlord'
}

export default function EnquiryForm({ type }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    volume: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type,
        }),
      })

      const result = await response.json()
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to submit enquiry')
      }

      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.successMsg}>
        <h3>Enquiry Submitted Successfully ✓</h3>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
          Thank you for contacting Avorria. Our partner relations team will review your requirements and reach out to you within 2 working hours.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.formCard}>
      <h3 className={styles.formTitle}>Request Partner Pricing</h3>
      <p className={styles.formDesc}>Submit your estimated annual volume to unlock bulk rates and dedicated portal access.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="name">Full Name *</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Jenkins"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">Work Email *</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. sarah@company.com"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className={styles.input}
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 07700 900000"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="company">Company Name</label>
            <input
              type="text"
              name="company"
              id="company"
              className={styles.input}
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Apex Developments Ltd"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="volume">Estimated Monthly Inspections</label>
          <select
            name="volume"
            id="volume"
            className={styles.select}
            value={formData.volume}
            onChange={handleChange}
          >
            <option value="">Select range...</option>
            <option value="1-5">1 to 5 jobs / month</option>
            <option value="6-20">6 to 20 jobs / month</option>
            <option value="21-50">21 to 50 jobs / month</option>
            <option value="50+">50+ jobs / month</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="message">Requirements Description</label>
          <textarea
            name="message"
            id="message"
            rows={4}
            className={styles.textarea}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your portfolio, timelines, or specific service needs..."
          />
        </div>

        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Submitting request...' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  )
}
