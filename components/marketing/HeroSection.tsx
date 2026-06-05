'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

// ── Particle field ──
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      })
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(155,255,89,0.08)'
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className={styles.canvas} />
}

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
  const [postcode, setPostcode] = useState('')
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null)
  const [propType, setPropType] = useState('Semi')
  const [beds, setBeds] = useState('3')
  const [price, setPrice] = useState<number | null>(80)
  const [animPrice, setAnimPrice] = useState<number | null>(null)

  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i

  useEffect(() => {
    if (postcode.length > 2) setPostcodeValid(ukPostcodeRegex.test(postcode.trim()))
    else setPostcodeValid(null)
  }, [postcode])

  useEffect(() => {
    const newPrice = PRICE_MAP[propType]?.[beds] ?? 80
    setPrice(newPrice)
    let start = animPrice ?? newPrice
    const steps = 20
    const diff = (newPrice - start) / steps
    let step = 0
    const t = setInterval(() => {
      step++
      setAnimPrice(Math.round(start + diff * step))
      if (step >= steps) { clearInterval(t); setAnimPrice(newPrice) }
    }, 20)
    return () => clearInterval(t)
  }, [propType, beds])

  const bookingParams = new URLSearchParams({ postcode, propType, beds, price: String(price) }).toString()

  return (
    <div className={styles.calcCard}>
      <p className={styles.calcTitle}>Instant price check</p>

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

      {animPrice !== null && (
        <div className={styles.priceResult}>
          <span className={styles.priceLabel}>Your EPC:</span>
          <span className={styles.price}>£{animPrice}</span>
        </div>
      )}

      <p className={styles.priceSubtext}>Includes assessor visit · certificate · 10-year registration</p>

      <Link href={`/book?${bookingParams}`} className={styles.calcCta} id="hero-book-cta">
        Book this price →
      </Link>

      <p className={styles.noHidden}>No hidden fees. No surprise charges.</p>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <ParticleCanvas />
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>RdSAP 10 Certified Assessors · Chesterfield &amp; Derbyshire</span>
          <h1 className={styles.h1}>Get your EPC.<br />Done properly.</h1>
          <p className={styles.sub}>
            Fast, transparent, fully accredited Energy Performance Certificates for homeowners, landlords and estate agents. Certificate issued within 24 hours of assessment.
          </p>
          <div className={styles.ctas}>
            <Link href="/book" className={styles.ctaPrimary} id="hero-cta-book">Book your EPC — from £65</Link>
            <Link href="/lookup" className={styles.ctaGhost} id="hero-cta-lookup">Check existing EPC</Link>
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
