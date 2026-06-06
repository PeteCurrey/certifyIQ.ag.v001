'use client'
import React, { useState } from 'react'
import styles from './enterprise.module.css'

export default function EnterpriseForm() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    jobTitle: '',
    email: '',
    phone: '',
    office: '',
    volume: '<10',
    propertyTypes: [] as string[],
    services: [] as string[],
    urgency: 'Exploring',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleCheckboxChange = (field: 'propertyTypes' | 'services', value: string) => {
    const current = formData[field]
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(item => item !== value) })
    } else {
      setFormData({ ...formData, [field]: [...current, value] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setErrorMsg(null)

    if (!formData.company || !formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Please fill out all required fields (*).')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          volume: formData.volume,
          type: 'Enterprise Consultation',
          source: 'enterprise_enquiry',
          message: formData.message,
          job_title: formData.jobTitle,
          office_location: formData.office,
          property_types: formData.propertyTypes,
          services_required: formData.services,
          urgency: formData.urgency
        })
      })

      if (!response.ok) {
        throw new Error('Enquiry submission failed.')
      }

      setSuccess(true)
      // Reset form
      setFormData({
        company: '',
        name: '',
        jobTitle: '',
        email: '',
        phone: '',
        office: '',
        volume: '<10',
        propertyTypes: [],
        services: [],
        urgency: 'Exploring',
        message: ''
      })
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your enquiry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formGrid}>
      <div className={styles.fieldGroup}>
        {success && (
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            Thank you! Your portfolio consultation request has been submitted. Our team will contact you within 2 hours.
          </div>
        )}
        {errorMsg && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            {errorMsg}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="company">Organisation Name *</label>
          <input
            id="company"
            type="text"
            className={styles.input}
            placeholder="e.g. Knight Frank / Asset Managers Ltd"
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">Your Name *</label>
          <input
            id="name"
            type="text"
            className={styles.input}
            placeholder="John Smith"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="jobTitle">Job Title *</label>
          <input
            id="jobTitle"
            type="text"
            className={styles.input}
            placeholder="e.g. Portfolio Manager / Operations Director"
            value={formData.jobTitle}
            onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="name@firm.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <span className={styles.professionalNote}>We'll respond within 2 hours</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Phone *</label>
          <input
            id="phone"
            type="tel"
            className={styles.input}
            placeholder="020 7123 4567"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="office">Which office? (Optional)</label>
          <select
            id="office"
            className={styles.select}
            value={formData.office}
            onChange={e => setFormData({ ...formData, office: e.target.value })}
          >
            <option value="">Select location...</option>
            <option value="London">London</option>
            <option value="Manchester">Manchester</option>
            <option value="Birmingham">Birmingham</option>
            <option value="Sheffield">Sheffield</option>
            <option value="Nottingham">Nottingham</option>
            <option value="Derby">Derby</option>
            <option value="Other">Other UK Office</option>
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label className={styles.label}>Number of properties managed</label>
          <select
            className={styles.select}
            value={formData.volume}
            onChange={e => setFormData({ ...formData, volume: e.target.value })}
          >
            <option value="<10">Less than 10 properties</option>
            <option value="10-50">10 to 50 properties</option>
            <option value="50-200">50 to 200 properties</option>
            <option value="200+">More than 200 properties</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Types of property</label>
          <div className={styles.checkboxGrid}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.propertyTypes.includes('Offices')}
                onChange={() => handleCheckboxChange('propertyTypes', 'Offices')}
              />
              <span>Offices</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.propertyTypes.includes('Retail')}
                onChange={() => handleCheckboxChange('propertyTypes', 'Retail')}
              />
              <span>Retail</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.propertyTypes.includes('Industrial')}
                onChange={() => handleCheckboxChange('propertyTypes', 'Industrial')}
              />
              <span>Industrial</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.propertyTypes.includes('Mixed use')}
                onChange={() => handleCheckboxChange('propertyTypes', 'Mixed use')}
              />
              <span>Mixed use</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.propertyTypes.includes('Public')}
                onChange={() => handleCheckboxChange('propertyTypes', 'Public')}
              />
              <span>Public buildings</span>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Services required</label>
          <div className={styles.checkboxGrid}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.services.includes('Commercial EPCs')}
                onChange={() => handleCheckboxChange('services', 'Commercial EPCs')}
              />
              <span>Commercial EPCs</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.services.includes('TM44')}
                onChange={() => handleCheckboxChange('services', 'TM44')}
              />
              <span>TM44 Inspections</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.services.includes('DECs')}
                onChange={() => handleCheckboxChange('services', 'DECs')}
              />
              <span>DECs</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.services.includes('MEES')}
                onChange={() => handleCheckboxChange('services', 'MEES')}
              />
              <span>MEES Review</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.services.includes('SAP')}
                onChange={() => handleCheckboxChange('services', 'SAP')}
              />
              <span>SAP/New Build</span>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Urgency</label>
          <div className={styles.radioGrid}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="urgency"
                value="Exploring"
                checked={formData.urgency === 'Exploring'}
                onChange={e => setFormData({ ...formData, urgency: e.target.value })}
              />
              <span>Exploring</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="urgency"
                value="Active"
                checked={formData.urgency === 'Active'}
                onChange={e => setFormData({ ...formData, urgency: e.target.value })}
              />
              <span>Active</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="urgency"
                value="Urgent"
                checked={formData.urgency === 'Urgent'}
                onChange={e => setFormData({ ...formData, urgency: e.target.value })}
              />
              <span>Urgent</span>
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="message">Message</label>
          <textarea
            id="message"
            className={styles.textarea}
            placeholder="Tell us about your portfolio scale and locations..."
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Submitting request...' : 'Request a portfolio consultation'}
        </button>
      </div>
    </form>
  )
}
