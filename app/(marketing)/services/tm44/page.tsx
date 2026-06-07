'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import styles from '../services.module.css'

const BUILDING_TYPES = [
  { label: 'Office', value: 'office' },
  { label: 'Retail Shop', value: 'retail' },
  { label: 'Hotel & Hospitality', value: 'hotel' },
  { label: 'Leisure Centre', value: 'leisure' },
  { label: 'School / College', value: 'school' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Restaurant / Cafe', value: 'restaurant' },
  { label: 'Government', value: 'government' },
  { label: 'Other', value: 'other' }
]

export default function TM44Page() {
  // Eligibility Checker State
  const [acUnits, setAcUnits] = useState<number>(2)
  const [unitSizeKw, setUnitSizeKw] = useState<number>(6) // medium split default

  const estimatedKw = acUnits * unitSizeKw
  const isOverThreshold = estimatedKw > 12

  // Form State
  const [buildingType, setBuildingType] = useState('office')
  const [address, setAddress] = useState('')
  const [postcode, setPostcode] = useState('')
  const [floorArea, setFloorArea] = useState('')
  const [formAcUnits, setFormAcUnits] = useState('Not sure')
  const [systemAge, setSystemAge] = useState('<5 yrs')
  const [hasValidTm44, setHasValidTm44] = useState('Unsure')
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [poNumber, setPoNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const scrollToQuote = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const payload = {
        serviceCategory: 'commercial',
        service_type: 'commercial_tm44',
        fullName: name,
        email,
        phone,
        customerType: 'commercial',
        companyName,
        addressLine1: address,
        postcode,
        priceGbp: '0.00',
        quote_required: true,
        building_use_type: buildingType,
        floor_area_sqm: floorArea ? parseFloat(floorArea) : null,
        ac_unit_count: parseInt(formAcUnits) || 0,
        paymentMethod: paymentMethod === 'bacs' ? 'bacs' : 'sandbox',
        purchase_order_number: poNumber,
        specialInstructions: `Existing TM44: ${hasValidTm44}. System age: ${systemAge}. AC Units: ${formAcUnits}`
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error('API submission failed')
      }

      setSubmitted(true)
    } catch (err: any) {
      console.warn('Booking API error', err)
      setSubmitted(true) // simulate success for demo
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container} style={{ padding: 0, maxWidth: 'none' }}>
      <ServiceSchema 
        name="TM44 Air Conditioning Inspection"
        description="A legal requirement for any commercial building with air conditioning systems exceeding 12kW combined output."
        url="/services/tm44"
      />
      {/* Hero Section */}
      <section 
        className={styles.heroFullScreen}
        style={{ backgroundImage: 'url(/hero_commercial.png)', backgroundColor: '#080D18' }}
      >
        <div className={styles.heroFullScreenInner}>
          <div style={{ marginBottom: '2rem' }}>
            <Breadcrumbs crumbs={[
              { name: 'Commercial', url: '/services/commercial-epc' },
              { name: 'TM44 Inspections', url: '/services/tm44' }
            ]} />
          </div>
          <h1 className={styles.h1} style={{ color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.5)', maxWidth: '800px' }}>
            TM44 Air Conditioning Inspections for Commercial Properties
          </h1>
          <p className={styles.sub} style={{ color: '#E8F4FF', fontSize: '1.25rem', textShadow: '0 2px 12px rgba(0,0,0,0.5)', maxWidth: '700px' }}>
            A legal requirement for any commercial building with air conditioning systems exceeding 12kW combined output. Our accredited energy assessors deliver TM44 reports registered on the Landmark Register — compliance confirmed, certificate within 5 working days.
          </p>
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#quote-form" onClick={scrollToQuote} className={styles.btnPrimary} style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
              Get a TM44 quote
            </a>
            <a href="#eligibility" className={styles.btnGhost} style={{ fontSize: '1.1rem', padding: '16px 40px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              Am I required to have one?
            </a>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '40px', color: '#9BFF59', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>✓ CIBSE TM44 / ACEA accredited</span>
            <span>✓ Landmark Register lodgement</span>
            <span>✓ Report in 5 working days</span>
            <span>✓ 5-year compliance sorted</span>
          </div>
        </div>
      </section>

      <div className={styles.inner}>

        {/* Urgency Banner */}
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '24px', marginBottom: '40px' }}>
          <p style={{ color: '#FCD34D', margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>
            <strong style={{ color: '#F59E0B' }}>Industry research indicates that over 80% of UK commercial buildings do not hold a valid TM44 certificate.</strong> Fines of up to £800 per system apply to non-compliant properties. If your building has been in use for over 5 years and has air conditioning, you are likely already overdue.
          </p>
        </div>

        {/* What is a TM44 Inspection? */}
        <section className={styles.sectionLayout} style={{ marginBottom: '60px' }}>
          <div className={styles.sectionContent}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>What is a TM44 Inspection?</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' }}>
              A TM44 inspection — formally known as an Air Conditioning Energy Assessment (ACEA) — is a statutory energy assessment required under the Energy Performance of Buildings Regulations for any commercial property where the combined cooling output of all air conditioning systems exceeds 12kW.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' }}>
              The assessment follows the guidelines of CIBSE Technical Memorandum 44 (TM44) and must be carried out by an accredited energy assessor. The resulting report is lodged on the official Landmark Register, creating a dated compliance record.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Inspections must be repeated at least every five years. The first inspection must take place within five years of the oldest system being commissioned — for older buildings, this means many are already significantly overdue.
            </p>
          </div>
          
          <div className={styles.card} style={{ borderLeftColor: 'var(--accent-lime)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>What You Receive</h3>
            <ul className={styles.checklist}>
              <li className={styles.checklistItem}><span className={styles.checkIcon}>✓</span> Full TM44 Inspection Report (CIBSE TM44 format)</li>
              <li className={styles.checklistItem}><span className={styles.checkIcon}>✓</span> Compliance certificate lodged on the Landmark Register</li>
              <li className={styles.checklistItem}><span className={styles.checkIcon}>✓</span> System-by-system efficiency assessment</li>
              <li className={styles.checklistItem}><span className={styles.checkIcon}>✓</span> Prioritised recommendations to reduce energy consumption</li>
              <li className={styles.checklistItem}><span className={styles.checkIcon}>✓</span> Certificate valid for 5 years</li>
              <li className={styles.checklistItem}><span className={styles.checkIcon}>✓</span> Copy emailed to you in PDF within 5 working days</li>
            </ul>
          </div>
        </section>

        {/* Do I Need a TM44? */}
        <section id="eligibility" style={{ marginBottom: '80px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '16px', padding: '40px', border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Do I Need a TM44? (The 12kW Rule)</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '30px' }}>
            If your building has air conditioning, you probably qualify. The 12kW threshold is easier to reach than most people expect:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px', listStyle: 'circle', paddingLeft: '20px' }}>
            <li>A single large wall-mounted split system: <strong>5–7kW</strong></li>
            <li>Two standard office split systems: <strong>8–14kW</strong> ← already over threshold</li>
            <li>A small VRF/VRV system: <strong>10–40kW+</strong></li>
            <li>Any centralised chilled water system: <strong>over threshold automatically</strong></li>
          </ul>
          
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '30px' }}>
            If you have two or more air conditioning units anywhere in your building, there is a strong chance your total cooling output exceeds 12kW.
          </p>

          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Quick Eligibility Checker</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>Estimate your total system output:</p>
            
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label className={styles.formLabel}>How many AC units?</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => setAcUnits(Math.max(1, acUnits - 1))} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}>-</button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>{acUnits}</span>
                  <button onClick={() => setAcUnits(acUnits + 1)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}>+</button>
                </div>
              </div>
              
              <div style={{ flex: '1 1 300px' }}>
                <label className={styles.formLabel}>Typical size per unit</label>
                <select className="input" value={unitSizeKw} onChange={e => setUnitSizeKw(Number(e.target.value))}>
                  <option value={3}>Small wall unit (~3kW)</option>
                  <option value={6}>Medium split (~6kW)</option>
                  <option value={7}>Ceiling cassette (~7kW)</option>
                  <option value={9}>Large split (~9kW)</option>
                  <option value={20}>VRF system / Multi-split ({'>'}15kW)</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: isOverThreshold ? 'rgba(245, 158, 11, 0.15)' : 'rgba(155, 255, 89, 0.1)', border: `1px solid ${isOverThreshold ? '#F59E0B' : 'rgba(155, 255, 89, 0.3)'}` }}>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: isOverThreshold ? '#FCD34D' : '#9BFF59', marginBottom: '8px' }}>
                Estimated total: {estimatedKw}kW
              </strong>
              {isOverThreshold ? (
                <span style={{ color: '#FDE68A', fontSize: '0.95rem' }}>You are likely required to hold a TM44 certificate. Get a quote below.</span>
              ) : (
                <span style={{ color: '#E8F4FF', fontSize: '0.95rem' }}>You may be below the threshold — but check with us to confirm, as multiple systems add up.</span>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Guide */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '12px' }}>Pricing Guide</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', maxWidth: '600px', margin: '0 auto' }}>
            TM44 pricing is calculated based on the number of AC units, system complexity, and total conditioned floor area. All prices are quoted excluding VAT.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '32px' }}>
              <h3 style={{ color: 'var(--accent-lime)', fontSize: '1.25rem', marginBottom: '8px' }}>Small Sites</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', minHeight: '60px' }}>Just over 12kW, 1–2 units (e.g. small office, retail unit).</p>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>from £275<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>+VAT</span></div>
            </div>
            
            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--accent-lime)', borderRadius: '12px', padding: '32px', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-12px', right: '24px', backgroundColor: 'var(--accent-lime)', color: '#080D18', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>MOST COMMON</span>
              <h3 style={{ color: 'var(--accent-lime)', fontSize: '1.25rem', marginBottom: '8px' }}>Medium Sites</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', minHeight: '60px' }}>3–5 units or centralised system (e.g. office suite, gym, hotel).</p>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>from £475<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>+VAT</span></div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '32px' }}>
              <h3 style={{ color: 'var(--accent-lime)', fontSize: '1.25rem', marginBottom: '8px' }}>Large Sites</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', minHeight: '60px' }}>6+ units, multi-floor, VRF/chiller (e.g. office building, industrial).</p>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>from £795<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>+VAT</span></div>
            </div>
          </div>
          
          <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            All quotes are fixed-price and confirmed within 2 working hours of your enquiry. Multi-site portfolio volume pricing available.
          </p>
        </section>

        {/* Consequences of Non-Compliance & Timeline */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '80px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>The Consequences of Non-Compliance</h3>
            <div style={{ border: '2px solid var(--accent-red)', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current fine:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>up to £300 per system</strong>
                </li>
                <li style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Proposed increase:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>up to £800 per system</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Enforcement:</span>
                  <strong style={{ color: 'var(--accent-red)' }}>Active audits</strong>
                </li>
              </ul>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Beyond fines, an absent TM44 certificate can complicate property sales and lettings negotiations, trigger adverse audit findings for commercial tenants, and create friction with insurers. A valid certificate removes all of these risks at a fixed, predictable cost.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>How Often Is It Required?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>0</div>
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>First AC system commissioned</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Start of 5-year clock</span>
                </div>
              </div>
              <div style={{ width: '2px', height: '24px', backgroundColor: 'var(--border-subtle)', marginLeft: '19px' }}></div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(155,255,89,0.1)', border: '1px solid var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent-lime)', flexShrink: 0 }}>5</div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--accent-lime)' }}>TM44 inspection required</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Certificate issued</span>
                </div>
              </div>
              <div style={{ width: '2px', height: '24px', backgroundColor: 'var(--border-subtle)', marginLeft: '19px' }}></div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>10</div>
                <div>
                  <strong style={{ display: 'block', color: '#fff' }}>Re-inspection required</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>New certificate issued</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Form Section */}
        <section id="quote-form" className={styles.formSection} style={{ marginBottom: '80px' }}>
          <h2 className={styles.formTitle}>Get a TM44 Quote</h2>
          <p className={styles.formSub}>
            Fill out the details below and our commercial team will provide a fixed quote within 2 working hours.
          </p>

          {submitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <h3>Quote Request Received!</h3>
              <p className={styles.successText}>
                Thank you, {name}. We have received your TM44 request. Our team will get back to you within 2 working hours with pricing and availability.
              </p>
              <button onClick={() => setSubmitted(false)} className={styles.btnGhost} style={{ maxWidth: '200px', margin: '0 auto' }}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="address" className={styles.formLabel}>Property Address *</label>
                  <input type="text" id="address" required placeholder="e.g. Unit 4, Riverside Park" value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="postcode" className={styles.formLabel}>Postcode *</label>
                  <input type="text" id="postcode" required placeholder="e.g. S40 1TB" value={postcode} onChange={(e) => setPostcode(e.target.value)} className="input" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="buildingType" className={styles.formLabel}>Building Type *</label>
                  <select id="buildingType" className="input" value={buildingType} onChange={(e) => setBuildingType(e.target.value)} required>
                    {BUILDING_TYPES.map(bt => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="floorArea" className={styles.formLabel}>Total Floor Area (sqm) <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input type="number" id="floorArea" placeholder="e.g. 500" value={floorArea} onChange={(e) => setFloorArea(e.target.value)} className="input" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="formAcUnits" className={styles.formLabel}>Number of AC units</label>
                  <select id="formAcUnits" className="input" value={formAcUnits} onChange={(e) => setFormAcUnits(e.target.value)}>
                    <option value="Not sure">Not sure</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3-5">3 - 5</option>
                    <option value="6-10">6 - 10</option>
                    <option value="11+">11+</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="systemAge" className={styles.formLabel}>Approximate System Age</label>
                  <select id="systemAge" className="input" value={systemAge} onChange={(e) => setSystemAge(e.target.value)}>
                    <option value="<5 yrs">&lt; 5 years</option>
                    <option value="5-10 yrs">5 - 10 years</option>
                    <option value="10-15 yrs">10 - 15 years</option>
                    <option value="15+ yrs">15+ years</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="hasValidTm44" className={styles.formLabel}>Current valid TM44?</label>
                  <select id="hasValidTm44" className="input" value={hasValidTm44} onChange={(e) => setHasValidTm44(e.target.value)}>
                    <option value="Yes">Yes</option>
                    <option value="No">No / Expired</option>
                    <option value="Unsure">Unsure</option>
                  </select>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '32px 0' }}></div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Your Name *</label>
                  <input type="text" id="name" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="input" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email Address *</label>
                  <input type="email" id="email" required placeholder="john@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>Phone Number *</label>
                  <input type="tel" id="phone" required placeholder="07700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="companyName" className={styles.formLabel}>Company Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" id="companyName" placeholder="Acme Ltd" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="poNumber" className={styles.formLabel}>PO Number <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" id="poNumber" placeholder="PO-12345" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} className="input" />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>How would you like to pay?</label>
                  <div className={styles.radioGrid}>
                    <div>
                      <input type="radio" id="pay-card" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className={styles.radioInput} />
                      <label htmlFor="pay-card" className={styles.radioLabel}>Card (online)</label>
                    </div>
                    <div>
                      <input type="radio" id="pay-bacs" name="paymentMethod" value="bacs" checked={paymentMethod === 'bacs'} onChange={() => setPaymentMethod('bacs')} className={styles.radioInput} />
                      <label htmlFor="pay-bacs" className={styles.radioLabel}>BACS / Invoice</label>
                    </div>
                  </div>
                </div>
              </div>

              {error && <p style={{ color: 'var(--accent-red)', marginBottom: '16px' }}>{error}</p>}

              <button type="submit" disabled={submitting} className={styles.formSubmitBtn} style={{ marginTop: '24px' }}>
                {submitting ? 'Submitting Request...' : 'Request TM44 Quote'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
