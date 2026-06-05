'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './book.module.css'

const PROPERTY_TYPES = ['Flat', 'Terraced', 'Semi-Detached', 'Detached', 'Bungalow']
const BED_OPTIONS = ['1', '2', '3', '4', '5+']

const PRICE_MAP: Record<string, Record<string, number>> = {
  'Flat':          { '1': 65, '2': 65, '3': 65,  '4': 65,  '5+': 65  },
  'Terraced':      { '1': 70, '2': 70, '3': 80,  '4': 95,  '5+': 110 },
  'Semi-Detached': { '1': 70, '2': 70, '3': 80,  '4': 95,  '5+': 110 },
  'Detached':      { '1': 70, '2': 70, '3': 80,  '4': 95,  '5+': 110 },
  'Bungalow':      { '1': 70, '2': 70, '3': 80,  '4': 95,  '5+': 110 },
}

interface FoundAddress {
  line1: string
  line2: string
  town: string
  county: string
  postcode: string
}

export default function BookingWizardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Service
  const [serviceCategory, setServiceCategory] = useState<'domestic' | 'commercial' | 'sap' | 'air_tightness'>('domestic')

  // Location
  const [postcode, setPostcode] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [town, setTown] = useState('')
  const [county, setCounty] = useState('')
  const [foundAddresses, setFoundAddresses] = useState<FoundAddress[]>([])
  const [lookingUp, setLookingUp] = useState(false)
  const [lookupMsg, setLookupMsg] = useState<string | null>(null)
  const [selectedAddressIdx, setSelectedAddressIdx] = useState<number | 'manual'>('manual')

  // Domestic
  const [propertyType, setPropertyType] = useState('Semi-Detached')
  const [bedCount, setBedCount] = useState('3')
  const [price, setPrice] = useState(80)

  // Commercial
  const [buildingUseType, setBuildingUseType] = useState('Office')
  const [floorArea, setFloorArea] = useState('')
  const [numberOfFloors, setNumberOfFloors] = useState('1')
  const [hasExistingEpc, setHasExistingEpc] = useState(false)
  const [commercialLevel, setCommercialLevel] = useState(3)
  const [isQuoteRequired, setIsQuoteRequired] = useState(false)

  // SAP
  const [sapPropertyType, setSapPropertyType] = useState('New house')
  const [plotCount, setPlotCount] = useState(1)
  const [sapStage, setSapStage] = useState('Full package')
  const [targetStartDate, setTargetStartDate] = useState('')

  // Air Tightness
  const [airTestPropertyType, setAirTestPropertyType] = useState('New-build dwelling')
  const [airTestConstructionType, setAirTestConstructionType] = useState('Masonry')
  const [airTestFloorArea, setAirTestFloorArea] = useState('')
  const [hasDesignSap, setHasDesignSap] = useState(false)
  const [designAirTarget, setDesignAirTarget] = useState('5.0')

  // Date & Contact
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('morning')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [customerType, setCustomerType] = useState<'homeowner' | 'landlord' | 'agent'>('homeowner')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    const pc = searchParams.get('postcode')
    if (pc) setPostcode(pc.toUpperCase())
    const pt = searchParams.get('propType')
    if (pt) {
      if (PROPERTY_TYPES.includes(pt)) setPropertyType(pt)
      else if (pt.toLowerCase().includes('flat')) setPropertyType('Flat')
      else if (pt.toLowerCase().includes('detach')) setPropertyType('Detached')
    }
    const beds = searchParams.get('beds')
    if (beds && BED_OPTIONS.includes(beds)) setBedCount(beds)
    const srv = searchParams.get('service')
    if (srv && ['domestic', 'commercial', 'sap', 'air_tightness'].includes(srv)) {
      setServiceCategory(srv as any)
      setStep(2)
    }
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setPreferredDate(tomorrow.toISOString().split('T')[0])
  }, [searchParams])

  // Recalculate price
  useEffect(() => {
    if (serviceCategory === 'domestic') {
      setPrice(PRICE_MAP[propertyType]?.[bedCount] ?? 80)
      setIsQuoteRequired(false)
    } else if (serviceCategory === 'commercial') {
      const area = parseInt(floorArea) || 0
      if (area < 101) { setPrice(150); setCommercialLevel(3); setIsQuoteRequired(false) }
      else if (area < 251) { setPrice(250); setCommercialLevel(3); setIsQuoteRequired(false) }
      else if (area < 501) { setPrice(350); setCommercialLevel(3); setIsQuoteRequired(false) }
      else { setPrice(0); setCommercialLevel(4); setIsQuoteRequired(true) }
    } else if (serviceCategory === 'sap') {
      if (plotCount > 5) { setIsQuoteRequired(true); setPrice(0) }
      else {
        setIsQuoteRequired(false)
        if (sapStage === 'Design stage only') setPrice(195 * plotCount)
        else if (sapStage === 'As-built only') setPrice(150 * plotCount)
        else setPrice(295 * plotCount)
      }
    } else if (serviceCategory === 'air_tightness') {
      if (airTestPropertyType === 'New-build commercial') {
        const area = parseInt(airTestFloorArea) || 0
        if (area > 500) { setIsQuoteRequired(true); setPrice(0) }
        else { setIsQuoteRequired(false); setPrice(225) }
      } else {
        if (plotCount >= 10) { setIsQuoteRequired(true); setPrice(0) }
        else {
          setIsQuoteRequired(false)
          const base = plotCount === 1 ? 120 : plotCount <= 5 ? 110 : 95
          setPrice(base * plotCount)
        }
      }
    }
  }, [serviceCategory, propertyType, bedCount, floorArea, plotCount, sapStage, airTestPropertyType, airTestFloorArea])

  // ─── Postcode Lookup ──────────────────────────────────────────────────────
  const handleLookupAddress = async () => {
    if (!postcode || postcode.trim().length < 5) {
      setLookupMsg('Please enter a valid UK postcode.')
      return
    }
    setLookingUp(true)
    setLookupMsg(null)
    setFoundAddresses([])
    try {
      const res = await fetch(`/api/address-lookup?postcode=${encodeURIComponent(postcode.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setLookupMsg(data.error || 'Postcode not found. Please enter your address manually.')
        return
      }
      if (data.addresses && data.addresses.length > 0) {
        setFoundAddresses(data.addresses)
        // Pre-fill town / county from first result
        setTown(data.town || '')
        setCounty(data.addresses[0]?.county || '')
        setSelectedAddressIdx('manual')
        setAddressLine1('')
        setAddressLine2('')
      } else {
        // Postcode valid but no addresses returned — autofill town
        if (data.town) setTown(data.town)
        if (data.county) setCounty(data.county)
        setLookupMsg(data.message || 'Postcode validated. Please enter your address below.')
      }
    } catch {
      setLookupMsg('Address lookup failed. Please enter your address manually.')
    } finally {
      setLookingUp(false)
    }
  }

  const handleSelectAddress = (idx: number | 'manual') => {
    setSelectedAddressIdx(idx)
    if (idx === 'manual') {
      setAddressLine1('')
      setAddressLine2('')
    } else {
      const a = foundAddresses[idx as number]
      setAddressLine1(a.line1)
      setAddressLine2(a.line2)
      setTown(a.town)
      setCounty(a.county)
    }
  }

  // ─── Navigation ────────────────────────────────────────────────────────────
  const nextStep = () => {
    setErrorMsg(null)
    if (step === 2 && (!postcode || !addressLine1)) {
      setErrorMsg('Please enter your postcode and full address.')
      return
    }
    if (step === 3) {
      if (serviceCategory === 'commercial' && !floorArea) { setErrorMsg('Please enter the floor area.'); return }
      if (serviceCategory === 'sap' && !targetStartDate) { setErrorMsg('Please select a target start date.'); return }
      if (serviceCategory === 'air_tightness' && !airTestFloorArea) { setErrorMsg('Please enter the floor area per plot.'); return }
    }
    if (step === 4 && !preferredDate) { setErrorMsg('Please select a preferred date.'); return }
    if (step === 5 && (!fullName || !email || !phone)) { setErrorMsg('Please complete all contact fields.'); return }

    if (step === 5 && isQuoteRequired) {
      handleQuoteSubmit()
      return
    }

    setStep(step + 1)
  }

  const prevStep = () => { setErrorMsg(null); setStep(step - 1) }

  // ─── Quote submit (no payment) ─────────────────────────────────────────────
  const handleQuoteSubmit = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceCategory, fullName, email, phone, customerType,
          companyName: customerType === 'agent' ? companyName : null,
          addressLine1, addressLine2, town, county, postcode,
          propertyType, bedCount, preferredDate, preferredTimeSlot,
          priceGbp: null,
          specialInstructions,
          paymentMethod: 'quote',
          quoteRequired: true,
          buildingUseType, floorArea, numberOfFloors, hasExistingEpc, commercialLevel,
          sapPropertyType, plotCount, sapStage, targetStartDate,
          airTestPropertyType, airTestConstructionType, airTestFloorArea, hasDesignSap, designAirTarget
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit quote request')
      setStep(7)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ─── Stripe payment ────────────────────────────────────────────────────────
  const handleStripeCheckout = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/stripe/booking-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceCategory, fullName, email, phone, customerType,
          companyName: customerType === 'agent' ? companyName : null,
          addressLine1, addressLine2, town, county, postcode,
          propertyType, bedCount, preferredDate, preferredTimeSlot,
          priceGbp: price.toString(),
          specialInstructions,
          buildingUseType, floorArea, numberOfFloors, hasExistingEpc, commercialLevel,
          sapPropertyType, plotCount, sapStage, targetStartDate,
          airTestPropertyType, airTestConstructionType, airTestFloorArea, hasDesignSap, designAirTarget
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create payment session')
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setErrorMsg(err.message)
      setLoading(false)
    }
  }

  const serviceName =
    serviceCategory === 'domestic' ? 'Domestic EPC' :
    serviceCategory === 'commercial' ? 'Commercial EPC' :
    serviceCategory === 'sap' ? 'New Build / SAP' :
    'Air Tightness Test'

  return (
    <div className={styles.container}>
      {step < 7 && (
        <div className={styles.wizardGrid}>
          {/* ── LEFT PANEL ─────────────────────────────────── */}
          <div className={styles.formPanel}>
            <div className={styles.wizardHeader}>
              <span className={styles.eyebrow}>EPC Booking</span>
              <div className={styles.stepIndicator}>
                {[1,2,3,4,5,6].map(s => (
                  <div key={s} className={`${styles.stepDot} ${s === step ? styles.dotActive : ''} ${s < step ? styles.dotDone : ''}`}>{s}</div>
                ))}
              </div>
            </div>

            {errorMsg && <div className={styles.error}>{errorMsg}</div>}

            {/* STEP 1 — Service */}
            {step === 1 && (
              <div className={styles.stepContainer}>
                <h2>1. What do you need?</h2>
                <p className={styles.stepDesc}>Select the service you require below to get started.</p>
                <div className={styles.servicesGrid}>
                  <button className={`${styles.serviceCard} ${serviceCategory === 'domestic' ? styles.serviceActive : ''}`} onClick={() => setServiceCategory('domestic')}>
                    <span className={styles.serviceIcon}>🏠</span>
                    <h3>Domestic EPC</h3>
                    <p>For existing homes</p>
                  </button>
                  <button className={`${styles.serviceCard} ${serviceCategory === 'commercial' ? styles.serviceActive : ''}`} onClick={() => setServiceCategory('commercial')}>
                    <span className={styles.serviceIcon}>🏢</span>
                    <h3>Commercial EPC</h3>
                    <p>Shops, offices, industrial</p>
                  </button>
                  <button className={`${styles.serviceCard} ${serviceCategory === 'sap' ? styles.serviceActive : ''}`} onClick={() => setServiceCategory('sap')}>
                    <span className={styles.serviceIcon}>📐</span>
                    <h3>New Build / SAP</h3>
                    <p>Calculations & OC-EPC</p>
                  </button>
                  <button className={`${styles.serviceCard} ${serviceCategory === 'air_tightness' ? styles.serviceActive : ''}`} onClick={() => setServiceCategory('air_tightness')}>
                    <span className={styles.serviceIcon}>💨</span>
                    <h3>Air Tightness Test</h3>
                    <p>Part L Compliance</p>
                  </button>
                </div>
                <button type="button" onClick={nextStep} className={styles.nextButton}>Continue →</button>
              </div>
            )}

            {/* STEP 2 — Location */}
            {step === 2 && (
              <div className={styles.stepContainer}>
                <h2>2. Property Location</h2>
                <p className={styles.stepDesc}>Enter your postcode to find your address automatically.</p>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="postcode">Postcode</label>
                  <div className={styles.inputRow}>
                    <input
                      id="postcode"
                      type="text"
                      className={styles.input}
                      placeholder="e.g. S40 1AA"
                      value={postcode}
                      onChange={e => { setPostcode(e.target.value.toUpperCase()); setFoundAddresses([]); setLookupMsg(null) }}
                      onKeyDown={e => e.key === 'Enter' && handleLookupAddress()}
                      maxLength={8}
                    />
                    <button type="button" onClick={handleLookupAddress} className={styles.lookupButton} disabled={lookingUp}>
                      {lookingUp ? 'Searching…' : 'Find Address'}
                    </button>
                  </div>
                </div>

                {lookupMsg && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    ℹ️ {lookupMsg}
                  </p>
                )}

                {foundAddresses.length > 0 && (
                  <div className={styles.field}>
                    <label className={styles.label}>Select Your Address ({foundAddresses.length} found)</label>
                    <select
                      className={styles.select}
                      value={selectedAddressIdx}
                      onChange={e => handleSelectAddress(e.target.value === 'manual' ? 'manual' : parseInt(e.target.value))}
                    >
                      <option value="manual">— Select an address —</option>
                      {foundAddresses.map((a, i) => (
                        <option key={i} value={i}>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</option>
                      ))}
                      <option value="manual">Enter address manually</option>
                    </select>
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="addr1">Address Line 1</label>
                  <input id="addr1" type="text" className={styles.input} placeholder="e.g. 14 Mill Lane" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="addr2">Address Line 2 <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input id="addr2" type="text" className={styles.input} placeholder="Apartment, flat number, etc." value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="town">Town / City</label>
                    <input id="town" type="text" className={styles.input} placeholder="e.g. Chesterfield" value={town} onChange={e => setTown(e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="county">County <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                    <input id="county" type="text" className={styles.input} placeholder="e.g. Derbyshire" value={county} onChange={e => setCounty(e.target.value)} />
                  </div>
                </div>

                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction}>← Back</button>
                  <button type="button" onClick={nextStep} className={styles.nextButton}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 3 — Property Details */}
            {step === 3 && (
              <div className={styles.stepContainer}>
                <h2>3. Property Details</h2>

                {serviceCategory === 'domestic' && (
                  <>
                    <p className={styles.stepDesc}>These details determine the scope of the assessment and the final price.</p>
                    <div className={styles.field}>
                      <label className={styles.label}>Property Type</label>
                      <div className={styles.radioGrid}>
                        {PROPERTY_TYPES.map(t => (
                          <button key={t} type="button" className={`${styles.radioPill} ${propertyType === t ? styles.radioPillActive : ''}`} onClick={() => setPropertyType(t)}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Number of Bedrooms</label>
                      <div className={styles.radioGrid}>
                        {BED_OPTIONS.map(b => (
                          <button key={b} type="button" className={`${styles.radioPill} ${bedCount === b ? styles.radioPillActive : ''}`} onClick={() => setBedCount(b)}>{b} Bed{b !== '1' ? 's' : ''}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {serviceCategory === 'commercial' && (
                  <>
                    <p className={styles.stepDesc}>Commercial assessments depend on building use and complexity.</p>
                    <div className={styles.field}>
                      <label className={styles.label}>Building Type</label>
                      <div className={styles.radioGrid}>
                        {['Office', 'Retail', 'Industrial', 'Warehouse', 'Healthcare', 'Education', 'Hospitality', 'Other'].map(t => (
                          <button key={t} type="button" className={`${styles.radioPill} ${buildingUseType === t ? styles.radioPillActive : ''}`} onClick={() => setBuildingUseType(t)}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="floorArea">Total Floor Area (m²)</label>
                        <input id="floorArea" type="number" className={styles.input} placeholder="e.g. 250" value={floorArea} onChange={e => setFloorArea(e.target.value)} />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="floors">Number of Floors</label>
                        <input id="floors" type="number" className={styles.input} value={numberOfFloors} onChange={e => setNumberOfFloors(e.target.value)} min="1" />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" checked={hasExistingEpc} onChange={e => setHasExistingEpc(e.target.checked)} />
                        <span>I have an existing EPC for this property</span>
                      </label>
                    </div>
                    {isQuoteRequired && (
                      <div className={styles.alertBox}>
                        <h4>Custom Quote Required</h4>
                        <p>Properties over 500m² require a Level 4 assessment. We will contact you within 2 working hours with a fixed price.</p>
                      </div>
                    )}
                  </>
                )}

                {serviceCategory === 'sap' && (
                  <>
                    <p className={styles.stepDesc}>Provide details of your new build or conversion project.</p>
                    <div className={styles.field}>
                      <label className={styles.label}>Property Type</label>
                      <div className={styles.radioGrid}>
                        {['New house', 'New flat', 'Conversion', 'Extension'].map(t => (
                          <button key={t} type="button" className={`${styles.radioPill} ${sapPropertyType === t ? styles.radioPillActive : ''}`} onClick={() => setSapPropertyType(t)}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.field}>
                        <label className={styles.label}>Number of Plots</label>
                        <div className={styles.stepper}>
                          <button type="button" onClick={() => setPlotCount(Math.max(1, plotCount - 1))}>−</button>
                          <span>{plotCount}</span>
                          <button type="button" onClick={() => setPlotCount(plotCount + 1)}>+</button>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="startDate">Target Start Date</label>
                        <input id="startDate" type="date" className={styles.input} value={targetStartDate} onChange={e => setTargetStartDate(e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Assessment Stage</label>
                      <div className={styles.radioGrid}>
                        {['Design stage only', 'As-built only', 'Full package'].map(t => (
                          <button key={t} type="button" className={`${styles.radioPill} ${sapStage === t ? styles.radioPillActive : ''}`} onClick={() => setSapStage(t)}>{t}</button>
                        ))}
                      </div>
                    </div>
                    {isQuoteRequired && (
                      <div className={styles.alertBox}>
                        <h4>Volume Quote Required</h4>
                        <p>For developments with more than 5 plots, we provide bespoke volume pricing. We will contact you with a fixed quote.</p>
                      </div>
                    )}
                  </>
                )}

                {serviceCategory === 'air_tightness' && (
                  <>
                    <p className={styles.stepDesc}>Details for Part L Air Tightness Testing.</p>
                    <div className={styles.field}>
                      <label className={styles.label}>Property Type</label>
                      <div className={styles.radioGrid}>
                        {['New-build dwelling', 'New-build commercial', 'Retrofit'].map(t => (
                          <button key={t} type="button" className={`${styles.radioPill} ${airTestPropertyType === t ? styles.radioPillActive : ''}`} onClick={() => setAirTestPropertyType(t)}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Construction Type</label>
                      <div className={styles.radioGrid}>
                        {['Timber frame', 'Masonry', 'Steel frame', 'Modular', 'Other'].map(t => (
                          <button key={t} type="button" className={`${styles.radioPill} ${airTestConstructionType === t ? styles.radioPillActive : ''}`} onClick={() => setAirTestConstructionType(t)}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.field}>
                        <label className={styles.label}>Number of Plots</label>
                        <div className={styles.stepper}>
                          <button type="button" onClick={() => setPlotCount(Math.max(1, plotCount - 1))}>−</button>
                          <span>{plotCount}</span>
                          <button type="button" onClick={() => setPlotCount(plotCount + 1)}>+</button>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="airArea">Floor Area per Plot (m²)</label>
                        <input id="airArea" type="number" className={styles.input} placeholder="e.g. 95" value={airTestFloorArea} onChange={e => setAirTestFloorArea(e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" checked={hasDesignSap} onChange={e => setHasDesignSap(e.target.checked)} />
                        <span>I have a design-stage SAP report</span>
                      </label>
                    </div>
                    {hasDesignSap && (
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="airTarget">Design air permeability target (m³/h/m² @ 50Pa)</label>
                        <input id="airTarget" type="number" step="0.1" className={styles.input} value={designAirTarget} onChange={e => setDesignAirTarget(e.target.value)} />
                      </div>
                    )}
                    <div className={styles.alertBox} style={{ borderColor: 'rgba(155,255,89,0.3)', backgroundColor: 'rgba(155,255,89,0.05)' }}>
                      <p><strong style={{ color: 'var(--accent-lime)' }}>Note:</strong> Please ensure the property is at practical completion before the test date — all windows, doors, and sealing must be complete.</p>
                    </div>
                    {isQuoteRequired && (
                      <div className={styles.alertBox}>
                        <h4>Custom Quote Required</h4>
                        <p>Based on your requirements, we will contact you within 2 working hours with a bespoke fixed quote.</p>
                      </div>
                    )}
                  </>
                )}

                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction}>← Back</button>
                  <button type="button" onClick={nextStep} className={styles.nextButton}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 4 — Date & Time */}
            {step === 4 && (
              <div className={styles.stepContainer}>
                <h2>4. Preferred Date & Time</h2>
                <p className={styles.stepDesc}>We will confirm the exact arrival window by phone or email within 24 hours.</p>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="date">Preferred Date</label>
                  <input id="date" type="date" className={styles.input} value={preferredDate} min={new Date().toISOString().split('T')[0]} onChange={e => setPreferredDate(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Preferred Time Slot</label>
                  <div className={styles.radioGrid}>
                    {[
                      { label: 'Morning (8am–12pm)', value: 'morning' },
                      { label: 'Afternoon (12–5pm)', value: 'afternoon' },
                      { label: 'Any — Best Availability', value: 'any' },
                    ].map(slot => (
                      <button key={slot.value} type="button" className={`${styles.radioPill} ${preferredTimeSlot === slot.value ? styles.radioPillActive : ''}`} onClick={() => setPreferredTimeSlot(slot.value)}>
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="instructions">Access Instructions <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <textarea id="instructions" className={styles.textarea} placeholder="e.g. Key safe code 1234, park on driveway, call on arrival…" value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} />
                </div>
                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction}>← Back</button>
                  <button type="button" onClick={nextStep} className={styles.nextButton}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 5 — Contact Details */}
            {step === 5 && (
              <div className={styles.stepContainer}>
                <h2>5. Your Details</h2>
                <p className={styles.stepDesc}>Enter your contact and billing information. We'll use these to send your confirmation and create your portal account.</p>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fullName">Full Name</label>
                  <input id="fullName" type="text" className={styles.input} placeholder="e.g. Sarah Johnson" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">Email Address</label>
                    <input id="email" type="email" className={styles.input} placeholder="sarah@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">Phone Number</label>
                    <input id="phone" type="tel" className={styles.input} placeholder="07700 900000" value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Account Type</label>
                  <select className={styles.select} value={customerType} onChange={(e: any) => setCustomerType(e.target.value)}>
                    <option value="homeowner">Homeowner / Developer</option>
                    <option value="landlord">Landlord</option>
                    <option value="agent">Estate / Letting Agent</option>
                  </select>
                </div>
                {customerType === 'agent' && (
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="company">Company / Agency Name</label>
                    <input id="company" type="text" className={styles.input} placeholder="e.g. Smiths Estate Agents" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                )}
                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction}>← Back</button>
                  <button type="button" onClick={nextStep} className={styles.nextButton} disabled={loading}>
                    {loading ? <LoadingSpinner size={18} /> : isQuoteRequired ? 'Submit Request →' : 'Review & Pay →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6 — Payment */}
            {step === 6 && !isQuoteRequired && (
              <div className={styles.stepContainer}>
                <h2>6. Secure Payment</h2>
                <p className={styles.stepDesc}>You'll be taken to our secure Stripe checkout to complete payment. Your booking reference is created before payment so your slot is held.</p>

                <div className={styles.reviewCard}>
                  <h4 className={styles.reviewTitle}>Booking Summary</h4>
                  <div className={styles.reviewRow}><span>Service</span><strong>{serviceName}</strong></div>
                  <div className={styles.reviewRow}><span>Property</span><strong>{addressLine1}, {town}, {postcode}</strong></div>
                  {serviceCategory === 'domestic' && <div className={styles.reviewRow}><span>Property type</span><strong>{bedCount} Bed {propertyType}</strong></div>}
                  <div className={styles.reviewRow}><span>Date</span><strong>{preferredDate}</strong></div>
                  <div className={styles.reviewRow}><span>Name</span><strong>{fullName}</strong></div>
                  <div className={styles.reviewRow}><span>Email</span><strong>{email}</strong></div>
                  <div className={styles.reviewDivider} />
                  <div className={styles.reviewTotal}>
                    <span>Total (inc. VAT)</span>
                    <strong className={styles.reviewPrice}>£{price}.00</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStripeCheckout}
                  className={styles.payButton}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size={20} /> : `Pay £${price}.00 with Stripe →`}
                </button>

                <p className={styles.secureNote}>🔒 Payments processed securely by Stripe. We never store your card details.</p>

                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction} disabled={loading}>← Back</button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL ─────────────────────────────────── */}
          <div className={styles.summaryPanel}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}><span>Service:</span><strong style={{ textTransform: 'capitalize' }}>{serviceCategory.replace('_', ' ')}</strong></div>
              {serviceCategory === 'domestic' && <div className={styles.summaryRow}><span>Property:</span><strong>{bedCount} Bed {propertyType}</strong></div>}
              {addressLine1 && <div className={styles.summaryRow}><span>Address:</span><strong>{addressLine1}, {town}</strong></div>}
              {preferredDate && <div className={styles.summaryRow}><span>Date:</span><strong>{preferredDate}</strong></div>}
              {fullName && <div className={styles.summaryRow}><span>Contact:</span><strong>{fullName}</strong></div>}
              <div className={styles.summaryDivider} />
              <div className={styles.summaryPriceRow}><span>Includes lodgement & VAT:</span><strong>Yes</strong></div>
              <div className={styles.summaryTotalRow}>
                <span>Total:</span>
                <span>{isQuoteRequired ? 'Quote Pending' : `£${price}.00`}</span>
              </div>
            </div>
            <div className={styles.summaryGuarantees}>
              <p>✓ Accredited Elmhurst/ATTMA assessors</p>
              <p>✓ Certificate delivered within 24 hours</p>
              <p>✓ Secure data processing</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7 — Success (quote only; Stripe has its own /book/success page) */}
      {step === 7 && (
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Quote Request Received!</h2>
          <div className={styles.successBody}>
            <p>Thank you, {fullName}. Our assessment team will review your project and contact you within 2 working hours at <strong>{email}</strong> with a bespoke fixed quote.</p>
            <div className={styles.portalAlert}>
              <h4>Access Your Portal</h4>
              <p>Sign in to track your enquiry and manage future bookings.</p>
              <Link href="/login" className={styles.portalLink}>Go to Client Portal</Link>
            </div>
          </div>
          <Link href="/" className={styles.homeLink}>Return to Homepage</Link>
        </div>
      )}
    </div>
  )
}
