'use client'
import React, { useState } from 'react'
import styles from '../commercial-city.module.css'

interface CityQuoteFormProps {
  city: string
}

export default function CityQuoteForm({ city }: CityQuoteFormProps) {
  const [formData, setFormData] = useState({
    buildingType: 'office',
    floorArea: '',
    address: '',
    name: '',
    email: '',
    phone: '',
    paymentPreference: 'card'
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setErrorMsg(null)

    if (!formData.address || !formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Please complete all required fields.')
      setLoading(false)
      return
    }

    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        customerType: 'commercial_landlord',
        addressLine1: formData.address,
        town: city.charAt(0).toUpperCase() + city.slice(1),
        postcode: '',
        propertyType: 'commercial',
        priceGbp: '0.00',
        quote_required: true,
        commercial_epc_level: formData.floorArea && parseFloat(formData.floorArea) > 500 ? 4 : 3,
        building_use_type: formData.buildingType,
        floor_area_sqm: formData.floorArea ? parseFloat(formData.floorArea) : null,
        number_of_floors: 1,
        paymentMethod: formData.paymentPreference === 'bacs' ? 'bacs' : 'sandbox',
        specialInstructions: `Commercial City Quote Request for ${city}. Payment preference: ${formData.paymentPreference}`
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error('Quote submission failed. Our team has been alerted.')
      }

      setSuccess(true)
      setFormData({
        buildingType: 'office',
        floorArea: '',
        address: '',
        name: '',
        email: '',
        phone: '',
        paymentPreference: 'card'
      })
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your quote request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formBox} id="quote-form">
      <h3 className={styles.formTitle}>Get a commercial EPC quote for {city.charAt(0).toUpperCase() + city.slice(1)}</h3>
      <p className={styles.formSub}>Accredited assessors. Standard 5 working day turnaround. Pricing from £185+VAT.</p>
      
      {success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          Thank you! Your quote request has been received. One of our Non-Domestic Energy Assessors will respond within 2 hours.
        </div>
      )}
      {errorMsg && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Building Type</label>
          <select
            className={styles.select}
            value={formData.buildingType}
            onChange={e => setFormData({ ...formData, buildingType: e.target.value })}
          >
            <option value="office">Office Space</option>
            <option value="retail">Retail Unit</option>
            <option value="industrial">Industrial / Warehouse</option>
            <option value="public">Public / Civic Building</option>
            <option value="leisure">Leisure / Hospitality</option>
            <option value="mixed">Mixed-Use Development</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Floor Area (approx. sqm)</label>
          <input
            type="number"
            className={styles.input}
            placeholder="e.g. 250"
            value={formData.floorArea}
            onChange={e => setFormData({ ...formData, floorArea: e.target.value })}
          />
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label}>Property Address *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Full building address and postcode"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Your Name *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="John Smith"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email Address *</label>
          <input
            type="email"
            className={styles.input}
            placeholder="name@company.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Phone Number *</label>
          <input
            type="tel"
            className={styles.input}
            placeholder="e.g. 020 7123 4567"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Payment Preference</label>
          <select
            className={styles.select}
            value={formData.paymentPreference}
            onChange={e => setFormData({ ...formData, paymentPreference: e.target.value })}
          >
            <option value="card">Credit / Debit Card</option>
            <option value="bacs">BACS / Purchase Order (Invoice terms)</option>
          </select>
        </div>

        <div className={`${styles.field} ${styles.fullWidth}`} style={{ marginTop: '1rem' }}>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Submitting quote request...' : `Request ${city.charAt(0).toUpperCase() + city.slice(1)} Commercial Quote`}
          </button>
        </div>
      </form>
    </div>
  )
}
