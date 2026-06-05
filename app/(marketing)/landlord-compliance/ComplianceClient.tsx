'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './compliance.module.css'

const POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

export default function ComplianceClient({ defaultPostcode = '' }: { defaultPostcode?: string }) {
  const [postcode, setPostcode] = useState(defaultPostcode)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [domestic, setDomestic] = useState<any[]>([])
  const [postcodeErr, setPostcodeErr] = useState('')
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setPostcodeErr('')
    if (!POSTCODE_RE.test(postcode)) {
      setPostcodeErr('Please enter a valid UK postcode (e.g. S40 1AA)')
      return
    }
    setLoading(true)
    setErrorMsg(null)
    setSearched(false)
    setDomestic([])

    try {
      const res = await fetch(`/api/epc-lookup?postcode=${encodeURIComponent(postcode.trim())}&address=${encodeURIComponent(address)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to query EPC register')
      
      const results = data.domestic || []
      setDomestic(results)
      setSearched(true)

      if (results.length === 1) {
        handleGenerateReport(results[0])
      }
    } catch (err: any) {
      setErrorMsg(err.message)
      setLoading(false)
    }
  }

  const handleGenerateReport = async (row: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/landlord-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_report',
          lmk_key: row['lmk-key'],
          address: row['address1'],
          postcode: row['postcode'],
          current_rating: row['current-energy-rating'] || 'G',
          potential_rating: row['potential-energy-rating'] || 'G',
          property_data: row
        })
      })
      const data = await res.json()
      if (data.id) {
        router.push(`/landlord-compliance/report/${data.id}`)
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>For Landlords & Property Managers</span>
        <h1 className={styles.title}>Rental Compliance Checker</h1>
        <p className={styles.subtext}>
          Check if your property meets current MEES regulations, assess future risk, and get an AI-driven action plan to reach Band C.
        </p>
      </div>

      <div className={styles.searchCard}>
        <form onSubmit={handleSearch} className={styles.form}>
          <div className={styles.searchGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="postcode">Postcode *</label>
              <input
                id="postcode"
                type="text"
                placeholder="e.g. S40 1AA"
                className={`${styles.input} ${postcodeErr ? styles.inputError : ''}`}
                value={postcode}
                onChange={e => { setPostcode(e.target.value.toUpperCase()); setPostcodeErr('') }}
                maxLength={8}
                required
              />
              {postcodeErr && <p className={styles.fieldError}>{postcodeErr}</p>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="houseNum">House name or number (optional)</label>
              <input
                id="houseNum"
                type="text"
                placeholder="e.g. 42"
                className={styles.input}
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Analysing...' : 'Assess Compliance Risk'}
          </button>
        </form>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <LoadingSpinner size={48} />
          <p style={{ color: '#8BA3BF', marginTop: '1rem' }}>Generating compliance report...</p>
        </div>
      )}

      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      {!loading && searched && domestic.length > 1 && (
        <div className={styles.resultsArea}>
          <h2 className={styles.resultsTitle}>Select property to assess:</h2>
          <div className={styles.resultsList}>
            {domestic.map(row => {
              const fullAddr = [row['address1'], row['address2'], row['postcode']].filter(Boolean).join(', ')
              return (
                <button
                  key={row['lmk-key']}
                  className={styles.addressCard}
                  onClick={() => handleGenerateReport(row)}
                >
                  <div className={styles.addressCardLeft}>
                    <p className={styles.addressCardAddr}>{fullAddr}</p>
                    <p className={styles.addressCardMeta}>{row['property-type']}</p>
                  </div>
                  <div className={styles.addressCardRight}>
                    <span className={styles.viewDetail}>Generate Report →</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      {!loading && searched && domestic.length === 0 && !errorMsg && (
         <div className={styles.noResults}>
           <p className={styles.noResultsText}>No residential EPC found.</p>
           <p style={{ color: '#8BA3BF' }}>You must have a valid domestic EPC to legally rent a residential property.</p>
           <Link href="/book" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#F5A623', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}>
             Book an EPC Assessment
           </Link>
         </div>
      )}
    </div>
  )
}
