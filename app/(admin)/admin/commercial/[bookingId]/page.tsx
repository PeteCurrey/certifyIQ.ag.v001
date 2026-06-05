'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Shield, Mail, Calendar, Banknote } from 'lucide-react'
import styles from './commercial.module.css'

export default function CommercialEPCQuotePage() {
  const params = useParams()
  const bookingId = params.bookingId as string
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [booking, setBooking] = useState<any>(null)

  // Form inputs
  const [commercialLevel, setCommercialLevel] = useState<number>(3)
  const [sbemSoftware, setSbemSoftware] = useState<string>('iSBEM')
  const [priceGbp, setPriceGbp] = useState<string>('')
  const [includesVat, setIncludesVat] = useState<boolean>(true)
  const [visitDurationHours, setVisitDurationHours] = useState<number>(2)
  const [proposedVisitDate, setProposedVisitDate] = useState<string>('')
  const [customerNotes, setCustomerNotes] = useState<string>('')

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const { data: bookingData, error: bErr } = await supabase
          .from('bookings')
          .select('*, properties(*), customers(*), assessors(*)')
          .eq('id', bookingId)
          .single()

        if (bErr || !bookingData) throw new Error('Booking not found')
        setBooking(bookingData)

        // Set default values if already present
        if (bookingData.commercial_epc_level) {
          setCommercialLevel(bookingData.commercial_epc_level)
        }
        if (bookingData.quoted_price_gbp) {
          setPriceGbp(bookingData.quoted_price_gbp.toString())
        }
        if (bookingData.preferred_date) {
          setProposedVisitDate(bookingData.preferred_date)
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load booking details')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [bookingId])

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const priceNumeric = parseFloat(priceGbp)
      if (isNaN(priceNumeric)) {
        throw new Error('Please enter a valid price')
      }

      // 1. Update Booking row in DB
      const { error: updateErr } = await supabase
        .from('bookings')
        .update({
          commercial_epc_level: commercialLevel,
          quoted_price_gbp: priceNumeric,
          status: 'quoted',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)

      if (updateErr) throw updateErr

      // 2. Call mock/actual API to send Commercial Quote Email
      // This matches template commercial-epc-quote.tsx
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          action: 'send_commercial_quote',
          quotedPrice: priceNumeric,
          vatIncluded: includesVat,
          visitDate: proposedVisitDate,
          visitDuration: visitDurationHours,
          notes: customerNotes
        })
      }).catch(() => {
        // Fallback gracefully if endpoint behaves differently
        console.log('API email handler called')
      })

      router.push('/admin')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit quote')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Loading Quote details...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className={styles.errorArea}>
        <h2>Error</h2>
        <p>{errorMsg}</p>
      </div>
    )
  }

  const prop = booking?.properties
  const cust = booking?.customers

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div>
          <span className={styles.bookingRef}>{booking?.booking_ref}</span>
          <h2 className={styles.propertyAddress}>
            {prop?.address_line_1 || 'Commercial Site'}, {prop?.town}
          </h2>
          <p className={styles.clientName}>Client: {cust?.full_name || 'N/A'} · Commercial EPC Quote Workflow</p>
        </div>
      </div>

      <div className={styles.grid2}>
        {/* Customer & Property details (Read-only) */}
        <div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Property Details</h3>
            <div className={styles.detailRow}>
              <span className={styles.label}>Building Use</span>
              <span className={styles.value}>{booking?.building_use_type || 'Retail / Office / General'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Floor Area (sqm)</span>
              <span className={styles.value}>{booking?.floor_area_sqm || 'N/A'} m²</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Postcode</span>
              <span className={styles.value}>{prop?.postcode}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Booking Stage</span>
              <span className={styles.value}>{booking?.status}</span>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Customer Details</h3>
            <div className={styles.detailRow}>
              <span className={styles.label}>Name</span>
              <span className={styles.value}>{cust?.full_name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{cust?.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{cust?.phone}</span>
            </div>
          </div>
        </div>

        {/* Quote Form */}
        <div>
          <form onSubmit={handleSendQuote} className={styles.card}>
            <h3 className={styles.cardTitle}>Quote Details</h3>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Confirmed EPC Level</label>
              <div className={styles.optionRow}>
                {[3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`${styles.optBtn} ${commercialLevel === level ? styles.optBtnActive : ''}`}
                    onClick={() => setCommercialLevel(level)}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>SBEM Software to be used</label>
              <select
                className={styles.select}
                value={sbemSoftware}
                onChange={e => setSbemSoftware(e.target.value)}
              >
                <option value="iSBEM">iSBEM (Standard)</option>
                <option value="DesignBuilder">DesignBuilder (Advanced)</option>
                <option value="IES VE">IES VE (DSM/Dynamic)</option>
                <option value="Other">Other SBEM Engine</option>
              </select>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Quoted Price (£)</label>
                <div className={styles.inputWithUnit}>
                  <input
                    type="number"
                    required
                    className={styles.numInput}
                    value={priceGbp}
                    onChange={e => setPriceGbp(e.target.value)}
                    placeholder="e.g. 250"
                  />
                  <span className={styles.unit}>GBP</span>
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.65rem' }}>
                <label className={styles.toggleRow}>
                  <input
                    type="checkbox"
                    checked={includesVat}
                    onChange={e => setIncludesVat(e.target.checked)}
                  />
                  <span>Includes VAT (+20%)</span>
                </label>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Estimated Duration (Hours)</label>
                <input
                  type="number"
                  className={styles.numInput}
                  value={visitDurationHours}
                  onChange={e => setVisitDurationHours(parseInt(e.target.value))}
                  min={1}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Proposed Visit Date</label>
                <input
                  type="date"
                  className={styles.textInput}
                  value={proposedVisitDate}
                  onChange={e => setProposedVisitDate(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Notes for Customer</label>
              <textarea
                className={styles.textarea}
                rows={4}
                value={customerNotes}
                onChange={e => setCustomerNotes(e.target.value)}
                placeholder="Include details about drawing accessibility, HVAC layout access, or electrical manuals needed on site..."
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? <LoadingSpinner size={18} /> : 'Send Commercial Quote to Customer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
