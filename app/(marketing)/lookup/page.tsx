'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './lookup.module.css'

interface EPCRecord {
  'address1': string
  'address2': string
  'address3': string
  'postcode': string
  'current-energy-rating': string
  'potential-energy-rating': string
  'current-energy-efficiency': string
  'potential-energy-efficiency': string
  'property-type': string
  'built-form': string
  'inspection-date': string
  'lodgement-datetime': string
  'uprn': string
  'lmk-key': string
}

export default function EPCLookupPage() {
  const [postcode, setPostcode] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<EPCRecord[]>([])
  const [searched, setSearched] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postcode) return

    setLoading(true)
    setErrorMsg(null)
    setResults([])
    setSearched(true)

    try {
      const formattedPostcode = postcode.trim().replace(/\s+/g, '')
      const response = await fetch(`/api/lookup?postcode=${formattedPostcode}&address=${encodeURIComponent(address)}`)
      
      if (!response.ok) {
        throw new Error('Failed to query EPC register')
      }

      const data = await response.json()
      setResults(data.rows || [])
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during lookup.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>EPC Database Lookup</span>
        <h1 className={styles.title}>Find an Energy Performance Certificate</h1>
        <p className={styles.subtext}>
          Search the official database for properties in Chesterfield &amp; Derbyshire. Find current ratings, expiry dates, and potential improvement bands.
        </p>
      </div>

      <div className={styles.searchCard}>
        <form onSubmit={handleLookup} className={styles.form}>
          <div className={styles.searchGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="postcode">Postcode *</label>
              <input
                id="postcode"
                type="text"
                placeholder="e.g. S40 1AA"
                className={styles.input}
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                maxLength={8}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="address">House Name or Number (Optional)</label>
              <input
                id="address"
                type="text"
                placeholder="e.g. 10"
                className={styles.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Searching Database...' : 'Search EPC Register'}
          </button>
        </form>
      </div>

      {loading && (
        <div className={styles.spinnerArea}>
          <LoadingSpinner size={40} />
          <p>Scanning national database...</p>
        </div>
      )}

      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      {searched && !loading && !errorMsg && (
        <div className={styles.resultsArea}>
          <h2 className={styles.resultsTitle}>
            Search Results ({results.length})
          </h2>

          {results.length === 0 ? (
            <div className={styles.noResultsCard}>
              <p>No certificates found matching your search. This might mean the property has not been assessed recently or the postcode was typed incorrectly.</p>
              <div className={styles.noResultsCta}>
                <Link href="/book" className={styles.bookCta}>
                  Book a new assessment now →
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.resultsList}>
              {results.map((item) => {
                const currentRating = item['current-energy-rating'] || 'G'
                const potentialRating = item['potential-energy-rating'] || 'C'
                const isEpcExpired = false // Simplification for display

                return (
                  <div key={item['lmk-key']} className={styles.resultCard}>
                    <div className={styles.resultHeader}>
                      <div className={styles.addressBlock}>
                        <h3>{item.address1}</h3>
                        <p className={styles.postcode}>{item.postcode}</p>
                        <p className={styles.uprn}>UPRN: {item.uprn || 'Not Registered'}</p>
                      </div>
                      <div className={styles.ratingBadgeBlock}>
                        <div className={styles.badgeLabel}>Current</div>
                        <RatingBadge rating={currentRating} size="md" />
                      </div>
                    </div>

                    <div className={styles.resultBody}>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Inspection Date:</span>
                        <span className={styles.statVal}>{item['inspection-date']}</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Potential Band:</span>
                        <span className={styles.statVal} style={{ color: 'var(--accent-lime)', fontWeight: 600 }}>
                          {potentialRating}
                        </span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Property Type:</span>
                        <span className={styles.statVal}>
                          {item['built-form']} {item['property-type']}
                        </span>
                      </div>
                    </div>

                    <div className={styles.resultActions}>
                      <Link 
                        href={`/improve?postcode=${item.postcode}&address=${item.address1}&rating=${currentRating}`} 
                        className={styles.actionButtonSecondary}
                      >
                        Plan upgrades to Band C
                      </Link>
                      <Link 
                        href={`/book?postcode=${item.postcode}&propType=${item['property-type']}`} 
                        className={styles.actionButtonPrimary}
                      >
                        Book New assessment
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
