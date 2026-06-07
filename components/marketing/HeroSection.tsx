'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

// ── Price Calculator ──
const PROPERTY_TYPES = ['Flat', 'Terraced', 'Semi', 'Detached', 'Bungalow']
const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5+']

const PRICE_MAP: Record<string, Record<string, number>> = {
  Flat:      { '1': 65, '2': 65, '3': 65, '4': 65, '5+': 65 },
  Terraced:  { '1': 70, '2': 70, '3': 80, '4': 95, '5+': 110 },
  Semi:      { '1': 70, '2': 70, '3': 80, '4': 95, '5+': 110 },
  Detached:  { '1': 70, '2': 70, '3': 80, '4': 95, '5+': 110 },
  Bungalow:  { '1': 70, '2': 70, '3': 80, '4': 95, '5+': 110 },
}

function PriceCalculator() {
  const [tab, setTab] = useState<'domestic' | 'commercial'>('domestic')

  // Domestic state
  const [postcode, setPostcode] = useState('')
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null)
  const [propType, setPropType] = useState('Semi')
  const [beds, setBeds] = useState('3')
  const [domPrice, setDomPrice] = useState<number | null>(80)
  const [animDomPrice, setAnimDomPrice] = useState<number | null>(null)

  // Commercial state
  const [commPostcode, setCommPostcode] = useState('')
  const [commPostcodeValid, setCommPostcodeValid] = useState<boolean | null>(null)
  const [area, setArea] = useState('150')
  const [unit, setUnit] = useState<'sqm' | 'sqft'>('sqm')
  const [commPrice, setCommPrice] = useState<number | null>(null)
  const [animCommPrice, setAnimCommPrice] = useState<number | null>(null)

  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

  // Validation
  useEffect(() => {
    if (postcode.length > 2) setPostcodeValid(ukPostcodeRegex.test(postcode.trim()))
    else setPostcodeValid(null)
  }, [postcode])

  useEffect(() => {
    if (commPostcode.length > 2) setCommPostcodeValid(ukPostcodeRegex.test(commPostcode.trim()))
    else setCommPostcodeValid(null)
  }, [commPostcode])

  // Domestic price animation
  useEffect(() => {
    const newPrice = PRICE_MAP[propType]?.[beds] ?? 80
    setDomPrice(newPrice)
    let start = animDomPrice ?? newPrice
    const steps = 20
    const diff = (newPrice - start) / steps
    let step = 0
    const t = setInterval(() => {
      step++
      setAnimDomPrice(Math.round(start + diff * step))
      if (step >= steps) { clearInterval(t); setAnimDomPrice(newPrice) }
    }, 20)
    return () => clearInterval(t)
  }, [propType, beds])

  // Commercial price — banded pricing table (exc. VAT)
  // Up to 100m²: £185  |  101-250: £275  |  251-500: £375
  // 501-750: £475  |  751-1000: £595  |  1000+: Quote
  useEffect(() => {
    const numericArea = parseFloat(area)
    if (isNaN(numericArea) || numericArea <= 0) {
      setCommPrice(null)
      setAnimCommPrice(null)
      return
    }
    const areaSqm = unit === 'sqft' ? numericArea / 10.764 : numericArea

    let newPrice: number | null
    if (areaSqm <= 100)       newPrice = 185
    else if (areaSqm <= 250)  newPrice = 275
    else if (areaSqm <= 500)  newPrice = 375
    else if (areaSqm <= 750)  newPrice = 475
    else if (areaSqm <= 1000) newPrice = 595
    else                       newPrice = null  // Quote on request

    setCommPrice(newPrice)
    if (newPrice === null) { setAnimCommPrice(null); return }

    let start = animCommPrice ?? newPrice
    const steps = 20
    const diff = (newPrice - start) / steps
    let step = 0
    const t = setInterval(() => {
      step++
      setAnimCommPrice(Math.round(start + diff * step))
      if (step >= steps) { clearInterval(t); setAnimCommPrice(newPrice as number) }
    }, 20)
    return () => clearInterval(t)
  }, [area, unit])

  const domBookingParams = new URLSearchParams({ postcode, propType, beds, price: String(domPrice) }).toString()
  const commBookingParams = new URLSearchParams({ type: 'commercial', postcode: commPostcode, area, unit, price: String(commPrice) }).toString()

  return (
    <div className={styles.calcCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <p className={styles.calcTitle} style={{ margin: 0 }}>Instant price check</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'domestic' ? styles.tabActive : ''}`}
          onClick={() => setTab('domestic')}
        >
          Domestic
        </button>
        <button
          className={`${styles.tab} ${tab === 'commercial' ? styles.tabActive : ''}`}
          onClick={() => setTab('commercial')}
        >
          Commercial
        </button>
      </div>

      {tab === 'domestic' && (
        <>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Your postcode</label>
            <div className={styles.postcodeWrap}>
              <input
                className={`${styles.postcodeInput} ${postcodeValid === false ? styles.invalid : postcodeValid === true ? styles.valid : ''}`}
                type="text"
                placeholder="e.g. S40 1AA"
                value={postcode}
                onChange={e => setPostcode(e.target.value.toUpperCase())}
                maxLength={8}
                id="hero-postcode"
              />
              {postcodeValid === true && <span className={styles.validMark}>✓</span>}
              {postcodeValid === false && <span className={styles.invalidMark}>✗</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Property type</label>
            <div className={styles.pills}>
              {PROPERTY_TYPES.map(t => (
                <button key={t} id={`proptype-${t.toLowerCase()}`} className={`${styles.pill} ${propType === t ? styles.pillActive : ''}`} onClick={() => setPropType(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Bedrooms</label>
            <div className={styles.pills}>
              {BEDROOM_OPTIONS.map(b => (
                <button key={b} id={`beds-${b}`} className={`${styles.pill} ${beds === b ? styles.pillActive : ''}`} onClick={() => setBeds(b)}>{b}</button>
              ))}
            </div>
          </div>

          {animDomPrice !== null && (
            <div className={styles.priceResult}>
              <span className={styles.priceLabel}>Your EPC:</span>
              <span className={styles.price}>£{animDomPrice}</span>
            </div>
          )}

          <p className={styles.priceSubtext}>Includes assessor visit · certificate · 10-year registration</p>

          <Link href={`/book?${domBookingParams}`} className={styles.calcCta} id="hero-book-cta">
            Book this price →
          </Link>
        </>
      )}

      {tab === 'commercial' && (
        <>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Site postcode</label>
            <div className={styles.postcodeWrap}>
              <input
                className={`${styles.postcodeInput} ${commPostcodeValid === false ? styles.invalid : commPostcodeValid === true ? styles.valid : ''}`}
                type="text"
                placeholder="e.g. S40 1AA"
                value={commPostcode}
                onChange={e => setCommPostcode(e.target.value.toUpperCase())}
                maxLength={8}
              />
              {commPostcodeValid === true && <span className={styles.validMark}>✓</span>}
              {commPostcodeValid === false && <span className={styles.invalidMark}>✗</span>}
            </div>
          </div>

          <div className={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className={styles.fieldLabel} style={{ margin: 0 }}>Floor area</label>
              <div className={styles.pills} style={{ gap: '0.25rem' }}>
                <button
                  className={`${styles.pill} ${unit === 'sqm' ? styles.pillActive : ''}`}
                  onClick={() => setUnit('sqm')}
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                >
                  sq/m
                </button>
                <button
                  className={`${styles.pill} ${unit === 'sqft' ? styles.pillActive : ''}`}
                  onClick={() => setUnit('sqft')}
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                >
                  sq/ft
                </button>
              </div>
            </div>
            <input
              className={styles.postcodeInput}
              type="number"
              placeholder={`e.g. 150`}
              value={area}
              onChange={e => setArea(e.target.value)}
              min={1}
            />
          </div>

          <div className={styles.priceResult}>
            <span className={styles.priceLabel}>Estimated Price:</span>
            {commPrice === null && parseFloat(area) > 1000 ? (
              <span className={styles.price} style={{ fontSize: '1rem', color: 'var(--accent-amber)' }}>Quote on request</span>
            ) : (
              <span className={styles.price}>
                {animCommPrice ? `£${animCommPrice}` : '—'}
                {animCommPrice && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>+VAT</span>}
              </span>
            )}
          </div>

          {commPrice === null && parseFloat(area) > 1000 ? (
            <p className={styles.priceSubtext}>Level 3 buildings over 1,000m² · Level 4 &amp; 5 — bespoke quote within 2 hrs</p>
          ) : (
            <p className={styles.priceSubtext}>Commercial EPC (SBEM Level 3) · Includes assessor visit and Landmark lodgement · exc. VAT</p>
          )}

          <Link href={`/book?${commBookingParams}`} className={styles.calcCta}>
            {commPrice === null && parseFloat(area) > 1000 ? 'Request a quote →' : 'Book Assessment →'}
          </Link>
        </>
      )}

      <p className={styles.noHidden}>No hidden fees. No surprise charges.</p>
    </div>
  )
}

export default function HeroSection() {
  const ROTATING_WORDS = ["home's", "business", "commercial building", "public building"]
  const [wordIndex, setWordIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
        setIsFading(false)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className={styles.hero}>
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
        poster="/hero-bg.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      {/* Light overlay */}
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>RdSAP 10 Certified Assessors · Chesterfield &amp; Derbyshire</span>
          <h1 className={styles.h1}>
            Your <span className={`${styles.rotatingWord} ${isFading ? styles.fadeOut : styles.fadeIn}`}>{ROTATING_WORDS[wordIndex]}</span> energy<br />certificate, sorted.
          </h1>
          <p className={styles.sub}>
            Fully accredited Energy Performance Certificates for homeowners, landlords and estate agents across Chesterfield &amp; Derbyshire. Certificate issued within 24 hours of your assessment.
          </p>
          <div className={styles.ctas}>
            <Link href="/book" className={styles.ctaPrimary} id="hero-cta-book">Book your EPC — from £65</Link>
            <Link href="/epc-register" className={styles.ctaGhost} id="hero-cta-lookup">Check existing EPC</Link>
          </div>
          <div className={styles.trustBar}>
            <span>✓ Elmhurst Energy accredited</span>
            <span>✓ Same-day available</span>
            <span>✓ Certificate in 24hrs</span>
            <span>✓ 10-year validity</span>
          </div>
        </div>
        <div className={styles.right}>
          <PriceCalculator />
        </div>
      </div>
    </section>
  )
}
