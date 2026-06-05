'use client'

import React, { useState } from 'react'
import styles from '../services.module.css'

const FAQS = [
  {
    question: 'When should an air tightness test be scheduled?',
    answer: 'The test should be scheduled when the building envelope is fully sealed, and second-fix electrics/plumbing are completed. All external doors, windows, and light fittings must be installed, and skirting boards sealed. The heating system should ideally be installed and commissioned.'
  },
  {
    question: 'How long does a test take?',
    answer: 'A standard domestic plot test takes about 1 to 2 hours. This includes setup, calibration, taking pressurisation and depressurisation readings, and calculation. Commercial tests can take 2 to 4 hours or longer depending on building volume.'
  },
  {
    question: 'What happens if the building fails the air test?',
    answer: 'If a property fails to meet the target air permeability (typically 5.0 m³/h/m² @ 50Pa), our engineer will use smoke sticks or thermal cameras to locate the main leakage areas. We offer same-day re-testing so that minor leaks can be sealed on-site and the re-test performed immediately at no extra cost.'
  },
  {
    question: 'What is the difference between ATTMA TS1 and TS2 standards?',
    answer: 'ATTMA TS1 is the standard for testing residential (domestic) properties, including new builds and conversions. ATTMA TS2 is the standard for non-domestic (commercial) buildings, which require larger blower door setups, multi-fan arrays, and different calculations.'
  },
  {
    question: 'Is air testing mandatory for all new builds?',
    answer: 'Yes, under Approved Document L of the Building Regulations in England and Wales, air tightness testing is mandatory for all new build dwellings and commercial structures to prove they meet design targets.'
  }
]

const LEAKAGE_AREAS = [
  { area: 'Service penetrations', desc: 'Unsealed pipework under kitchen sinks, baths, vanity units, and utility spaces.' },
  { area: 'Skirting boards & floors', desc: 'Gaps between bottom of plasterboard and floorboards, especially on suspended timber floors.' },
  { area: 'Loft hatches', desc: 'Uninsulated hatches or lack of draft-excluding seals around the hatch opening.' },
  { area: 'Dry lining & ceiling joints', desc: 'Air tracking behind plasterboard dab walls or around ceiling-to-wall interfaces.' },
  { area: 'Window & door frames', desc: 'Poor perimeter sealing or defective gaskets between frames and brickwork masonry.' },
  { area: 'Recessed lighting', desc: 'Unsealed downlights or light fittings piercing the ceiling vapor barrier into loft spaces.' }
]

export default function AirTightnessPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [plotCount, setPlotCount] = useState(1)
  const [isCommercial, setIsCommercial] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Calculate pricing based on logic
  const calculatePrice = () => {
    if (isCommercial) {
      return 'Quote Required'
    }
    // Domestic pricing tiers: 1 plot = £120, 2-5 plots = £100 each, 6+ plots = £85 each
    if (plotCount === 1) return '£120 + VAT'
    if (plotCount <= 5) return `£${plotCount * 100} + VAT (£100 per plot)`
    return `£${plotCount * 85} + VAT (£85 per plot)`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={styles.container} style={{ padding: 0, maxWidth: 'none' }}>
      {/* Hero Section */}
      <section 
        className={styles.heroFullScreen}
        style={{ backgroundImage: 'url(/hero_air_tightness.png)' }}
      >
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow} style={{ color: '#9BFF59' }}>ATTMA Accredited Engineers</span>
          <h1 className={styles.h1} style={{ color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>Air Tightness Testing (Part L)</h1>
          <p className={styles.sub} style={{ color: '#E8F4FF', fontSize: '1.25rem', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            Accredited air permeability testing to satisfy Building Regulations Approved Document L. Same-day retests and certification for builders and self-builders.
          </p>
          <div style={{ marginTop: '40px' }}>
            <a href="#calculator" className={styles.btnPrimary} style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
              Calculate Testing Fee
            </a>
          </div>
        </div>
      </section>

      <div className={styles.inner}>

      {/* Standards details and Explanation */}
      <section className={styles.sectionLayout}>
        <div className={styles.sectionContent}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>What is Air Tightness Testing?</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' }}>
            Air tightness testing (also known as air permeability or blower door testing) measures the volume of air that escapes through gaps and cracks in the building envelope.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' }}>
            It is measured as the rate of air leakage in cubic meters per hour per square meter of building envelope area at a reference pressure of 50 Pascals (m³/h/m² @ 50Pa). Under current Part L regulations, new houses must achieve a test result below their design target (typically 5.0 or lower).
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(155, 255, 89, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
              <strong style={{ color: 'var(--accent-lime)', display: 'block', marginBottom: '8px' }}>ATTMA TS1</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Applicable to residential properties (dwellings, flats, bungalows, house conversions).</span>
            </div>
            <div style={{ flex: 1, backgroundColor: 'rgba(245, 166, 35, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
              <strong style={{ color: 'var(--accent-amber)', display: 'block', marginBottom: '8px' }}>ATTMA TS2</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>For commercial non-domestic developments (offices, retail, industrial units).</span>
            </div>
          </div>
        </div>

        <div className={styles.card} style={{ borderLeftColor: 'var(--accent-lime)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Step-by-Step Testing Process</h3>
          <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Site Setup:</strong> Temporary sealing is applied only to mechanical ventilation and extraction fans. Internal doors are propped open to create a single air pressure zone.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Blower Door Installation:</strong> A high-power fan is sealed inside an external doorway frame using an adjustable canvas frame.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Pressurisation & Depressurisation:</strong> The fan is turned on to blow air into (and then suck air out of) the property, checking air flow rates at 50Pa.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>On-Site Results:</strong> Measurements are recorded, and target compliance is calculated instantly. Certification is generated same-day.
            </li>
          </ol>
        </div>
      </section>

      {/* Common Leakage Areas */}
      <section style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '12px' }}>Common Air Leakage Pathways</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Avoid failures by sealing these typical weak points in the building envelope before the test engineer arrives.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {LEAKAGE_AREAS.map((item, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px' }}>
              <h4 style={{ color: 'var(--accent-lime)', marginBottom: '8px', fontSize: '1.05rem' }}>{item.area}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Volume pricing & Booking Form Section */}
      <section id="calculator" className={styles.formSection} style={{ borderLeft: '4px solid var(--accent-lime)' }}>
        <h2 className={styles.formTitle}>Air Tightness Test & Quote Estimator</h2>
        <p className={styles.formSub}>
          Select your testing requirements below to view estimated pricing and submit a booking request.
        </p>

        {submitted ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h3>Air Tightness Booking Submitted!</h3>
            <p className={styles.successText}>
              Thank you, {name}. We have received your booking request for {plotCount} {isCommercial ? 'commercial' : 'residential'} plot(s). An ATTMA engineer will contact you shortly to confirm dates and details.
            </p>
            <button onClick={() => setSubmitted(false)} className={styles.btnGhost} style={{ maxWidth: '200px', margin: '0 auto' }}>
              Reset Calculator
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Property Type</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCommercial(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: !isCommercial ? 'rgba(155, 255, 89, 0.1)' : 'var(--bg-surface-elevated)',
                      color: !isCommercial ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      borderColor: !isCommercial ? 'var(--accent-lime)' : 'var(--border-subtle)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Residential (TS1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCommercial(true)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: isCommercial ? 'rgba(155, 255, 89, 0.1)' : 'var(--bg-surface-elevated)',
                      color: isCommercial ? 'var(--accent-lime)' : 'var(--text-secondary)',
                      borderColor: isCommercial ? 'var(--accent-lime)' : 'var(--border-subtle)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Commercial (TS2)
                  </button>
                </div>
              </div>

              {!isCommercial && (
                <div className={styles.formGroup}>
                  <label htmlFor="plots" className={styles.formLabel}>Number of Plots / Dwellings</label>
                  <input
                    type="number"
                    id="plots"
                    min="1"
                    value={plotCount}
                    onChange={(e) => setPlotCount(Math.max(1, parseInt(e.target.value, 10)))}
                    className="input"
                  />
                </div>
              )}
            </div>

            {/* Live Pricing Estimation Display */}
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px', margin: '24px 0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '4px' }}>Estimated testing cost</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-lime)', fontFamily: 'var(--font-headings)' }}>
                {calculatePrice()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                *Volume pricing discounts are calculated automatically. Subject to terms & travel.
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Contact Details</h4>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>Your Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  required
                  placeholder="e.g. 07123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <button type="submit" className={styles.formSubmitBtn} style={{ marginTop: '16px' }}>
              Submit Air Test Request
            </button>
          </form>
        )}
      </section>

      {/* FAQ Accordion Section */}
      <section className={styles.faqSection}>
        <h2 className={styles.sectionTitle}>Air Tightness Testing FAQs</h2>
        <p className={styles.sectionSub}>Frequently asked questions about air pressure testing and building control sign-off.</p>
        <div className={styles.faqList}>
          {FAQS.map((faq, idx) => (
            <div key={idx} className={styles.faqItem}>
              <button onClick={() => toggleFaq(idx)} className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span className={styles.faqToggleIcon}>
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className={styles.faqAnswer}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  )
}
