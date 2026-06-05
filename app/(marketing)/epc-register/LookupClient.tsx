'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RatingBadge from '@/components/ui/RatingBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './lookup.module.css'

const POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

interface EPCRow {
  'lmk-key': string
  'address1': string
  'address2': string
  'address3': string
  'postcode': string
  'current-energy-rating': string
  'potential-energy-rating': string
  'current-energy-efficiency': number
  'potential-energy-efficiency': number
  'property-type': string
  'built-form': string
  'lodgement-datetime': string
  'total-floor-area': number
  'energy-consumption-current': number
  'lighting-cost-current': number
  'heating-cost-current': number
  'hot-water-cost-current': number
  'co2-emissions-current': number
  'environment-impact-current': number
  'environment-impact-potential': number
  'number-habitable-rooms': number
}

function expiryInfo(lodgement: string) {
  if (!lodgement) return { label: 'Unknown', cls: '' }
  const lodged = new Date(lodgement)
  const expires = new Date(lodged)
  expires.setFullYear(expires.getFullYear() + 10)
  const now = new Date()
  const msLeft = expires.getTime() - now.getTime()
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24))
  const expStr = expires.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  if (daysLeft < 0) return { label: `Expired ${expStr}`, cls: styles.expiryRed }
  if (daysLeft < 180) return { label: `Expires ${expStr}`, cls: styles.expiryRed }
  if (daysLeft < 730) return { label: `Expires ${expStr}`, cls: styles.expiryAmber }
  return { label: `Valid until ${expStr}`, cls: styles.expiryGreen }
}

function EfficiencyBar({ current, potential }: { current: number; potential: number }) {
  const maxVal = Math.max(potential, 100)
  return (
    <div className={styles.effBar}>
      <div className={styles.effBarTrack}>
        <div className={styles.effBarFillCurrent} style={{ width: `${(current / maxVal) * 100}%` }}>
          <span>{current}</span>
        </div>
      </div>
      <div className={styles.effBarTrack} style={{ marginTop: 6 }}>
        <div className={styles.effBarFillPotential} style={{ width: `${(potential / maxVal) * 100}%` }}>
          <span>{potential}</span>
        </div>
      </div>
      <div className={styles.effBarLabels}>
        <span>Current efficiency</span>
        <span>Potential efficiency</span>
      </div>
    </div>
  )
}



function SkeletonCards() {
  return (
    <div className={styles.skeletonList}>
      {[1, 2, 3].map(i => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonLine} style={{ width: '60%', height: 20 }} />
          <div className={styles.skeletonLine} style={{ width: '40%', height: 14, marginTop: 8 }} />
          <div className={styles.skeletonLine} style={{ width: '30%', height: 14, marginTop: 8 }} />
        </div>
      ))}
    </div>
  )
}

export default function LookupClient({ defaultPostcode = '' }: { defaultPostcode?: string }) {
  const [postcode, setPostcode] = useState(defaultPostcode)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [domestic, setDomestic] = useState<EPCRow[]>([])
  const [nonDomestic, setNonDomestic] = useState<any[]>([])
  const router = useRouter()
  const [postcodeErr, setPostcodeErr] = useState('')

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
    setNonDomestic([])

    try {
      const res = await fetch(
        `/api/epc-lookup?postcode=${encodeURIComponent(postcode.trim())}&address=${encodeURIComponent(address)}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to query EPC register')
      setDomestic(data.domestic || [])
      setNonDomestic(data.nonDomestic || [])
      setSearched(true)

      // Log the search
      fetch('/api/epc-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_search',
          postcode: postcode.trim(),
          address_query: address.trim(),
        })
      }).catch(err => console.error('Failed to log search', err))

      // Auto-redirect if only one result
      if ((data.domestic || []).length === 1) {
        router.push(`/epc-register/result/${data.domestic[0]['lmk-key']}`)
      }
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Auto-run search if a defaultPostcode is provided and it looks valid
  useEffect(() => {
    if (defaultPostcode && POSTCODE_RE.test(defaultPostcode) && !searched && !loading) {
      handleSearch(new Event('submit') as any)
    }
  }, [defaultPostcode])

  const total = domestic.length + nonDomestic.length

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>EPC Register</span>
        <h1 className={styles.title}>Find an Energy Performance Certificate</h1>
        <p className={styles.subtext}>
          Search the official Government EPC Register. Data covers England &amp; Wales.
          Results reflect the most recent lodged certificate.
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
            {loading ? 'Searching…' : 'Search EPC Register'}
          </button>
        </form>
        <p className={styles.formNote}>
          Searches the official Government EPC Register. Data covers England &amp; Wales only.{' '}
          <Link href="https://www.scottishepcregister.org.uk" target="_blank" rel="noopener noreferrer" className={styles.scotLink}>
            Scotland uses a separate register →
          </Link>
        </p>
      </div>

      {loading && <SkeletonCards />}
      {errorMsg && <div className={styles.error}>{errorMsg}</div>}



      {/* Results list */}
      {searched && !loading && !errorMsg && (
        <div className={styles.resultsArea}>
          <h2 className={styles.resultsTitle}>
            {total === 0 ? 'No results found' : `${total} certificate${total !== 1 ? 's' : ''} found`}
          </h2>

          {/* Domestic results */}
          {domestic.length > 0 && (
            <div className={styles.resultsList}>
              {domestic.map(row => {
                const lodgedYear = row['lodgement-datetime']
                  ? new Date(row['lodgement-datetime']).getFullYear() : '—'
                const fullAddr = [row['address1'], row['address2'], row['address3'], row['postcode']]
                  .filter(Boolean).join(', ')
                return (
                  <button
                    key={row['lmk-key']}
                    className={styles.addressCard}
                    onClick={() => router.push(`/epc-register/result/${row['lmk-key']}`)}
                  >
                    <div className={styles.addressCardLeft}>
                      <p className={styles.addressCardAddr}>{fullAddr}</p>
                      <p className={styles.addressCardMeta}>
                        {row['built-form']} {row['property-type']} · Lodged {lodgedYear}
                      </p>
                    </div>
                    <div className={styles.addressCardRight}>
                      <RatingBadge rating={row['current-energy-rating'] || 'G'} size="md" />
                      <span className={styles.viewDetail}>View →</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Non-domestic results */}
          {nonDomestic.length > 0 && domestic.length === 0 && (
            <div className={styles.nonDomSection}>
              <div className={styles.nonDomBadge}>Commercial EPC found</div>
              {nonDomestic.map((row, i) => (
                <div key={i} className={styles.addressCard} style={{ cursor: 'default' }}>
                  <div className={styles.addressCardLeft}>
                    <p className={styles.addressCardAddr}>
                      {[row['address1'], row['address2'], row['postcode']].filter(Boolean).join(', ')}
                    </p>
                    <p className={styles.addressCardMeta}>
                      {row['property-type']} · Lodged {row['lodgement-datetime']
                        ? new Date(row['lodgement-datetime']).getFullYear() : '—'}
                    </p>
                  </div>
                  <div className={styles.addressCardRight}>
                    <RatingBadge rating={row['asset-rating-band'] || row['current-energy-rating'] || 'G'} size="md" />
                  </div>
                </div>
              ))}
              <div className={`${styles.ctaBand} ${styles.ctaBandNeutral}`} style={{ marginTop: 16 }}>
                <div>
                  <strong>Need a commercial EPC?</strong>
                  <p>We carry out Level 3, 4 and 5 non-domestic assessments.</p>
                </div>
                <Link href="/book?service=commercial" className={styles.ctaBandBtn}>Get a quote →</Link>
              </div>
            </div>
          )}

          {/* No results */}
          {total === 0 && (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>No EPC found for this address.</p>
              <p className={styles.noResultsSub}>
                This property may never have had an EPC, or may not be in England or Wales.
              </p>
              <div className={styles.noResultsActions}>
                <Link href="/book" className={styles.noResultsBookBtn}>
                  Book a new EPC — from £65
                </Link>
                <Link
                  href="https://www.scottishepcregister.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.noResultsScotBtn}
                >
                  Scottish EPC register →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
