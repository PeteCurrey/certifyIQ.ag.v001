'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './book.module.css'

const PROPERTY_TYPES = ['Flat', 'Terraced', 'Semi-Detached', 'Detached', 'Bungalow']
const BED_OPTIONS = ['1', '2', '3', '4', '5+']

const PRICE_MAP: Record<string, Record<string, number>> = {
  'Flat':          { '1': 65, '2': 65, '3': 65, '4': 65, '5+': 65 },
  'Terraced':      { '1': 70, '2': 70, '3': 80, '4': 95, '5+': 110 },
  'Semi-Detached': { '1': 70, '2': 70, '3': 80, '4': 95, '5+': 110 },
  'Detached':      { '1': 70, '2': 70, '3': 80, '4': 95, '5+': 110 },
  'Bungalow':      { '1': 70, '2': 70, '3': 80, '4': 95, '5+': 110 },
}

export default function BookingWizardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [bookingSuccessRef, setBookingSuccessRef] = useState<string | null>(null)

  // Service Category Selection
  const [serviceCategory, setServiceCategory] = useState<'domestic' | 'commercial' | 'sap' | 'air_tightness'>('domestic')

  // Location fields
  const [postcode, setPostcode] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [town, setTown] = useState('Chesterfield')
  const [county, setCounty] = useState('Derbyshire')
  const [addresses, setAddresses] = useState<string[]>([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | 'manual'>('manual')

  // Common Property Details
  const [propertyType, setPropertyType] = useState('Semi-Detached')
  const [bedCount, setBedCount] = useState('3')
  const [price, setPrice] = useState(80)

  // Commercial EPC fields
  const [buildingUseType, setBuildingUseType] = useState('Office')
  const [floorArea, setFloorArea] = useState('')
  const [numberOfFloors, setNumberOfFloors] = useState('1')
  const [hasExistingEpc, setHasExistingEpc] = useState(false)
  const [commercialLevel, setCommercialLevel] = useState(3)
  const [isQuoteRequired, setIsQuoteRequired] = useState(false)

  // New Build / SAP fields
  const [sapPropertyType, setSapPropertyType] = useState('New house')
  const [plotCount, setPlotCount] = useState(1)
  const [sapStage, setSapStage] = useState('Full package')
  const [targetStartDate, setTargetStartDate] = useState('')
  const [sapDrawingsFile, setSapDrawingsFile] = useState<File | null>(null)

  // Air Tightness fields
  const [airTestPropertyType, setAirTestPropertyType] = useState('New-build dwelling')
  const [airTestConstructionType, setAirTestConstructionType] = useState('Masonry')
  const [airTestFloorArea, setAirTestFloorArea] = useState('')
  const [hasDesignSap, setHasDesignSap] = useState(false)
  const [designAirTarget, setDesignAirTarget] = useState('5.0')

  // Contact Details
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
      setStep(2) // Skip step 1 if service is in URL
    }
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setPreferredDate(tomorrow.toISOString().split('T')[0])
  }, [searchParams])

  // Update Price & Quote logic dynamically
  useEffect(() => {
    if (serviceCategory === 'domestic') {
      setPrice(PRICE_MAP[propertyType]?.[bedCount] ?? 80)
      setIsQuoteRequired(false)
    } else if (serviceCategory === 'commercial') {
      const area = parseInt(floorArea) || 0
      if (area < 101) { setPrice(150); setCommercialLevel(3); setIsQuoteRequired(false) }
      else if (area < 251) { setPrice(250); setCommercialLevel(3); setIsQuoteRequired(false) }
      else if (area < 501) { setPrice(350); setCommercialLevel(3); setIsQuoteRequired(false) }
      else if (area < 1001) { setPrice(0); setCommercialLevel(4); setIsQuoteRequired(true) }
      else { setPrice(0); setCommercialLevel(4); setIsQuoteRequired(true) }
    } else if (serviceCategory === 'sap') {
      if (plotCount > 5) {
        setIsQuoteRequired(true)
        setPrice(0)
      } else {
        setIsQuoteRequired(false)
        if (sapStage === 'Design stage only') setPrice(195 * plotCount)
        else if (sapStage === 'As-built only') setPrice(150 * plotCount)
        else setPrice(295 * plotCount)
      }
    } else if (serviceCategory === 'air_tightness') {
      let base = 120
      if (airTestPropertyType === 'New-build commercial') {
        base = 225
        const area = parseInt(airTestFloorArea) || 0
        if (area > 500) setIsQuoteRequired(true)
        else setIsQuoteRequired(false)
      } else {
        if (plotCount >= 10) setIsQuoteRequired(true)
        else {
          setIsQuoteRequired(false)
          if (plotCount === 1) base = 120
          else if (plotCount <= 5) base = 110
          else base = 95
        }
      }
      if (!isQuoteRequired) setPrice(base * plotCount)
    }
  }, [serviceCategory, propertyType, bedCount, floorArea, plotCount, sapStage, airTestPropertyType, airTestFloorArea, isQuoteRequired])

  const handleLookupAddress = () => {
    if (!postcode) return
    setAddresses([
      `10 High Street, ${town}, ${postcode}`,
      `12 High Street, ${town}, ${postcode}`,
      `Flat 1, 14 High Street, ${town}, ${postcode}`,
    ])
    setSelectedAddressIndex(0)
    setAddressLine1('10 High Street')
  }

  const handleAddressSelect = (index: number | 'manual') => {
    setSelectedAddressIndex(index)
    if (index === 'manual') setAddressLine1('')
    else setAddressLine1(addresses[index as number].split(',')[0])
  }

  const nextStep = () => {
    setErrorMsg(null)
    if (step === 2 && (!postcode || !addressLine1)) {
      setErrorMsg('Please enter your postcode and address.')
      return
    }
    if (step === 3) {
       // Validate specific step 3 based on category
       if (serviceCategory === 'commercial' && !floorArea) { setErrorMsg('Please enter floor area.'); return; }
       if (serviceCategory === 'sap' && !targetStartDate) { setErrorMsg('Please select a target start date.'); return; }
       if (serviceCategory === 'air_tightness' && !airTestFloorArea) { setErrorMsg('Please enter floor area per plot.'); return; }
    }
    if (step === 4 && (!preferredDate)) {
      setErrorMsg('Please select a preferred date.')
      return
    }
    if (step === 5 && (!fullName || !email || !phone)) {
      setErrorMsg('Please complete all contact fields.')
      return
    }
    
    // Skip payment step if quote required
    if (step === 5 && isQuoteRequired) {
      handleBookSubmit(new Event('submit') as any)
      return
    }

    setStep(step + 1)
  }

  const prevStep = () => { setErrorMsg(null); setStep(step - 1) }

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceCategory,
          fullName, email, phone, customerType,
          companyName: customerType === 'agent' ? companyName : null,
          addressLine1, addressLine2, town, county, postcode,
          propertyType, bedCount, preferredDate, preferredTimeSlot,
          priceGbp: isQuoteRequired ? null : price, 
          specialInstructions, 
          paymentMethod: isQuoteRequired ? 'quote' : 'sandbox',
          quoteRequired: isQuoteRequired,
          // Extra payload
          buildingUseType, floorArea, numberOfFloors, hasExistingEpc, commercialLevel,
          sapPropertyType, plotCount, sapStage, targetStartDate,
          airTestPropertyType, airTestConstructionType, airTestFloorArea, hasDesignSap, designAirTarget
        })
      })
      if (!response.ok) throw new Error('Booking creation failed')
      const data = await response.json()
      if (data.success) { setBookingSuccessRef(data.bookingRef); setStep(7) }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {step < 7 && (
        <div className={styles.wizardGrid}>
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

            {step === 2 && (
              <div className={styles.stepContainer}>
                <h2>2. Property Location</h2>
                <p className={styles.stepDesc}>Enter your postcode to check availability and retrieve address options.</p>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="postcode">Postcode</label>
                  <div className={styles.inputRow}>
                    <input id="postcode" type="text" className={styles.input} placeholder="e.g. S40 1AA" value={postcode} onChange={e => setPostcode(e.target.value.toUpperCase())} maxLength={8} />
                    <button type="button" onClick={handleLookupAddress} className={styles.lookupButton}>Find Address</button>
                  </div>
                </div>
                {addresses.length > 0 && (
                  <div className={styles.field}>
                    <label className={styles.label}>Select Address</label>
                    <select className={styles.select} value={selectedAddressIndex} onChange={e => handleAddressSelect(e.target.value as any)}>
                      {addresses.map((addr, idx) => <option key={idx} value={idx}>{addr}</option>)}
                      <option value="manual">Enter manually</option>
                    </select>
                  </div>
                )}
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="addr1">Address Line 1</label>
                  <input id="addr1" type="text" className={styles.input} placeholder="10 High Street" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="addr2">Address Line 2 (Optional)</label>
                  <input id="addr2" type="text" className={styles.input} placeholder="Apartment 2" value={addressLine2} onChange={e => setAddressLine2(e.target.value)} />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="town">Town</label>
                    <input id="town" type="text" className={styles.input} value={town} onChange={e => setTown(e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="county">County</label>
                    <input id="county" type="text" className={styles.input} value={county} onChange={e => setCounty(e.target.value)} />
                  </div>
                </div>
                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction}>← Back</button>
                  <button type="button" onClick={nextStep} className={styles.nextButton}>Continue →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepContainer}>
                <h2>3. Property Details</h2>
                
                {serviceCategory === 'domestic' && (
                  <>
                    <p className={styles.stepDesc}>These details determine the scope of the assessment and the price.</p>
                    <div className={styles.field}>
                      <label className={styles.label}>Property Type</label>
                      <div className={styles.radioGrid}>
                        {PROPERTY_TYPES.map(t => <button key={t} type="button" className={`${styles.radioPill} ${propertyType === t ? styles.radioPillActive : ''}`} onClick={() => setPropertyType(t)}>{t}</button>)}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Bedrooms</label>
                      <div className={styles.radioGrid}>
                        {BED_OPTIONS.map(b => <button key={b} type="button" className={`${styles.radioPill} ${bedCount === b ? styles.radioPillActive : ''}`} onClick={() => setBedCount(b)}>{b} Beds</button>)}
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
                        <label className={styles.label} htmlFor="floorArea">Floor Area (sqm)</label>
                        <input id="floorArea" type="number" className={styles.input} value={floorArea} onChange={e => setFloorArea(e.target.value)} />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label} htmlFor="floors">Number of Floors</label>
                        <input id="floors" type="number" className={styles.input} value={numberOfFloors} onChange={e => setNumberOfFloors(e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        <input type="checkbox" checked={hasExistingEpc} onChange={e => setHasExistingEpc(e.target.checked)} />
                        {' '}Do you have an existing EPC?
                      </label>
                    </div>
                    {isQuoteRequired && (
                      <div className={styles.alertBox}>
                        <h4>Quote Required</h4>
                        <p>Based on the floor area (&gt;500m²), this may require a Level 4 or Level 5 assessment. We will review your details and contact you within 2 working hours with a fixed price.</p>
                      </div>
                    )}
                  </>
                )}

                {serviceCategory === 'sap' && (
                  <>
                    <p className={styles.stepDesc}>Provide details of your new build project.</p>
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
                          <button type="button" onClick={() => setPlotCount(Math.max(1, plotCount - 1))}>-</button>
                          <span>{plotCount}</span>
                          <button type="button" onClick={() => setPlotCount(plotCount + 1)}>+</button>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Target Start Date</label>
                        <input type="date" className={styles.input} value={targetStartDate} onChange={e => setTargetStartDate(e.target.value)} />
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
                    <div className={styles.field}>
                      <label className={styles.label}>Upload your drawings (Optional for now)</label>
                      <input type="file" className={styles.input} accept=".pdf,.dwg,.zip" onChange={e => {
                        if (e.target.files && e.target.files.length > 0) setSapDrawingsFile(e.target.files[0])
                      }} />
                    </div>
                    {isQuoteRequired && (
                      <div className={styles.alertBox}>
                        <h4>Volume Quote Required</h4>
                        <p>For developments with more than 5 plots, we provide customized volume pricing. We will contact you shortly to provide a fixed quote.</p>
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
                          <button type="button" onClick={() => setPlotCount(Math.max(1, plotCount - 1))}>-</button>
                          <span>{plotCount}</span>
                          <button type="button" onClick={() => setPlotCount(plotCount + 1)}>+</button>
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Floor Area (sqm) per plot</label>
                        <input type="number" className={styles.input} value={airTestFloorArea} onChange={e => setAirTestFloorArea(e.target.value)} />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        <input type="checkbox" checked={hasDesignSap} onChange={e => setHasDesignSap(e.target.checked)} />
                        {' '}Do you have a design-stage SAP report?
                      </label>
                    </div>
                    {hasDesignSap && (
                      <div className={styles.field}>
                        <label className={styles.label}>Design air permeability target (m³/h/m²)</label>
                        <input type="number" step="0.1" className={styles.input} value={designAirTarget} onChange={e => setDesignAirTarget(e.target.value)} />
                      </div>
                    )}
                    <div className={styles.alertBox}>
                      <p><strong>Note:</strong> Please ensure the property is at practical completion before the test date.</p>
                    </div>
                    {isQuoteRequired && (
                      <div className={styles.alertBox}>
                        <h4>Quote Required</h4>
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

            {step === 4 && (
              <div className={styles.stepContainer}>
                <h2>4. Preferred Date & Time</h2>
                <p className={styles.stepDesc}>We will confirm the exact arrival window by phone or email.</p>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="date">Preferred Date</label>
                  <input id="date" type="date" className={styles.input} value={preferredDate} onChange={e => setPreferredDate(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Time Slot</label>
                  <div className={styles.radioGrid}>
                    {[{label:'Morning (8am–12pm)',value:'morning'},{label:'Afternoon (12–5pm)',value:'afternoon'},{label:'Any (Best Availability)',value:'any'}].map(slot => (
                      <button key={slot.value} type="button" className={`${styles.radioPill} ${preferredTimeSlot === slot.value ? styles.radioPillActive : ''}`} onClick={() => setPreferredTimeSlot(slot.value)}>{slot.label}</button>
                    ))}
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="instructions">Access Instructions (Optional)</label>
                  <textarea id="instructions" className={styles.textarea} placeholder="e.g. key code 1234, park on driveway..." value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} />
                </div>
                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction}>← Back</button>
                  <button type="button" onClick={nextStep} className={styles.nextButton}>Continue →</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className={styles.stepContainer}>
                <h2>5. Contact Details</h2>
                <p className={styles.stepDesc}>Enter billing and contact information. These will be used to create your client portal account.</p>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fullName">Full Name</label>
                  <input id="fullName" type="text" className={styles.input} placeholder="John Smith" value={fullName} onChange={e => setFullName(e.target.value)} required />
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input id="email" type="email" className={styles.input} placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">Phone</label>
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
                    <label className={styles.label} htmlFor="company">Company Name</label>
                    <input id="company" type="text" className={styles.input} placeholder="Agency Ltd" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                )}
                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction}>← Back</button>
                  <button type="button" onClick={nextStep} className={styles.nextButton}>{isQuoteRequired ? 'Submit Request →' : 'Review & Pay →'}</button>
                </div>
              </div>
            )}

            {step === 6 && !isQuoteRequired && (
              <div className={styles.stepContainer}>
                <h2>6. Secure Payment</h2>
                <p className={styles.stepDesc}>Payment is processed securely via Stripe. No card data is stored on our servers.</p>
                <div className={styles.sandboxCard}>
                  <h3>Stripe Sandbox Mode</h3>
                  <p>Running in test mode. No real payment is taken. Click below to simulate a successful payment and confirm your booking.</p>
                  <div className={styles.sandboxPriceRow}>
                    <span>Total due:</span>
                    <strong>£{price}.00</strong>
                  </div>
                  <button type="button" onClick={handleBookSubmit} className={styles.sandboxPayButton} disabled={loading}>
                    {loading ? <LoadingSpinner size={20} /> : `Simulate Payment & Confirm Booking`}
                  </button>
                </div>
                <div className={styles.navRow}>
                  <button type="button" onClick={prevStep} className={styles.backButtonAction} disabled={loading}>← Back</button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.summaryPanel}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}><span>Service:</span><strong style={{textTransform:'capitalize'}}>{serviceCategory.replace('_', ' ')}</strong></div>
              {postcode && <div className={styles.summaryRow}><span>Postcode:</span><strong>{postcode}</strong></div>}
              {addressLine1 && <div className={styles.summaryRow}><span>Address:</span><strong>{addressLine1}, {town}</strong></div>}
              
              {serviceCategory === 'domestic' && <div className={styles.summaryRow}><span>Property:</span><strong>{bedCount} Bed {propertyType}</strong></div>}
              {serviceCategory === 'commercial' && <div className={styles.summaryRow}><span>Commercial:</span><strong>{floorArea} sqm {buildingUseType}</strong></div>}
              {serviceCategory === 'sap' && <div className={styles.summaryRow}><span>SAP Package:</span><strong>{sapStage} ({plotCount} plots)</strong></div>}
              {serviceCategory === 'air_tightness' && <div className={styles.summaryRow}><span>Air Test:</span><strong>{plotCount} plots</strong></div>}

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
              <p>✓ Fast turnaround</p>
              <p>✓ Secure data processing</p>
            </div>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>{isQuoteRequired ? 'Quote Request Received!' : 'Booking Confirmed!'}</h2>
          <p className={styles.successRef}>Reference: <strong>{bookingSuccessRef}</strong></p>
          <div className={styles.successBody}>
            <p>
              {isQuoteRequired 
                ? 'We have received your details. Our assessment team will review your project and contact you within 2 working hours with a bespoke fixed quote.'
                : 'Your booking has been registered. An assessor will contact you shortly to confirm the exact visit time.'}
            </p>
            <div className={styles.portalAlert}>
              <h4>Access Your Portal</h4>
              <p>Sign in with your email to track your booking status and download certificates.</p>
              <Link href="/login" className={styles.portalLink}>Go to Client Portal</Link>
            </div>
          </div>
          <Link href="/" className={styles.homeLink}>Return to Homepage</Link>
        </div>
      )}
    </div>
  )
}
