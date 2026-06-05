'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './sap-checker.module.css'

export default function SapComplianceCheckerPage() {
  const [formData, setFormData] = useState({
    propertyType: 'house',
    floorArea: '85',
    storeys: '2',
    wallUValue: '0.18',
    roofUValue: '0.13',
    floorUValue: '0.15',
    windowUValue: '1.4',
    heatingSystem: 'Mains Gas Boiler',
    heatingFuel: 'gas',
    renewables: [] as string[],
    airPermeability: '5.0',
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRenewablesChange = (val: string) => {
    setFormData((prev) => {
      const current = [...prev.renewables]
      if (val === 'none') {
        return { ...prev, renewables: [] }
      }
      if (current.includes(val)) {
        return { ...prev, renewables: current.filter((x) => x !== val) }
      } else {
        return { ...prev, renewables: [...current.filter((x) => x !== 'none'), val] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const response = await fetch('/api/ai/sap-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to run SAP compliance simulation')
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during calculation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <span className={styles.eyebrow}>AI Compliance Tools</span>
        <h1 className={styles.title}>SAP Compliance Checker</h1>
        <p className={styles.subtitle}>
          Estimate your new build or conversion's Part L SAP performance before submitting plans to Building Control.
        </p>
      </div>

      <div className={styles.checkerLayout}>
        {/* Form panel */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Construction Specification</h2>
          
          <div className={styles.formGrid}>
            {/* Q1: Property Type */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="propertyType">Q1: Property Type</label>
              <select
                name="propertyType"
                id="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="house">House</option>
                <option value="flat">Flat / Apartment</option>
                <option value="bungalow">Bungalow</option>
                <option value="conversion">Conversion / Extension</option>
              </select>
            </div>

            {/* Q2: Total Floor Area */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="floorArea">Q2: Total Floor Area (m²)</label>
              <input
                type="number"
                name="floorArea"
                id="floorArea"
                min="1"
                max="1000"
                value={formData.floorArea}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Q3: Storeys */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="storeys">Q3: Number of Storeys</label>
              <input
                type="number"
                name="storeys"
                id="storeys"
                min="1"
                max="10"
                value={formData.storeys}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Q4: Wall U-value */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="wallUValue">Q4: Wall U-value (W/m²K)</label>
              <span className={styles.guide}>typical cavity = 0.18, good = 0.15</span>
              <input
                type="number"
                name="wallUValue"
                id="wallUValue"
                step="0.01"
                min="0.05"
                max="1.50"
                value={formData.wallUValue}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Q5: Roof U-value */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="roofUValue">Q5: Roof U-value (W/m²K)</label>
              <span className={styles.guide}>270mm mineral wool = ~0.13</span>
              <input
                type="number"
                name="roofUValue"
                id="roofUValue"
                step="0.01"
                min="0.05"
                max="1.00"
                value={formData.roofUValue}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Q6: Floor U-value */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="floorUValue">Q6: Floor U-value (W/m²K)</label>
              <span className={styles.guide}>typical insulated floor = 0.13 - 0.18</span>
              <input
                type="number"
                name="floorUValue"
                id="floorUValue"
                step="0.01"
                min="0.05"
                max="1.00"
                value={formData.floorUValue}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Q7: Window U-value */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="windowUValue">Q7: Window U-value (W/m²K)</label>
              <span className={styles.guide}>modern double = 1.4, triple = 0.8</span>
              <input
                type="number"
                name="windowUValue"
                id="windowUValue"
                step="0.01"
                min="0.5"
                max="3.0"
                value={formData.windowUValue}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Air Permeability design target */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="airPermeability">Air Permeability Target (m³/h/m²)</label>
              <span className={styles.guide}>Part L limit = 8.0, standard target = 5.0</span>
              <input
                type="number"
                name="airPermeability"
                id="airPermeability"
                step="0.1"
                min="0.5"
                max="15.0"
                value={formData.airPermeability}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Q8: Heating System */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="heatingSystem">Q8: Heating System Type</label>
              <select
                name="heatingSystem"
                id="heatingSystem"
                value={formData.heatingSystem}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="Mains Gas Boiler">Mains Gas Boiler</option>
                <option value="Oil Boiler">Oil Boiler</option>
                <option value="Electric Storage Heaters">Electric Storage Heaters</option>
                <option value="Heat Pump">Air Source Heat Pump</option>
                <option value="Biomass/Other">Biomass Boiler / Wood Burner</option>
              </select>
            </div>

            {/* Q9: Heating Fuel */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="heatingFuel">Q9: Heating Fuel Type</label>
              <select
                name="heatingFuel"
                id="heatingFuel"
                value={formData.heatingFuel}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="gas">Mains Gas</option>
                <option value="electricity">Electricity</option>
                <option value="oil">Heating Oil</option>
                <option value="biomass">Biomass / Wood</option>
                <option value="heat_pump">Electricity (for Heat Pump)</option>
              </select>
            </div>

            {/* Q10: Renewables Checklist */}
            <div className={styles.formGroupFull}>
              <label className={styles.label}>Q10: Any renewable technologies installed?</label>
              <div className={styles.checkboxGrid}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.renewables.includes('solar_pv')}
                    onChange={() => handleRenewablesChange('solar_pv')}
                    className={styles.checkboxInput}
                  />
                  Solar PV (Electricity)
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.renewables.includes('solar_thermal')}
                    onChange={() => handleRenewablesChange('solar_thermal')}
                    className={styles.checkboxInput}
                  />
                  Solar Thermal (Hot Water)
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.renewables.includes('heat_pump')}
                    onChange={() => handleRenewablesChange('heat_pump')}
                    className={styles.checkboxInput}
                  />
                  Heat Pump
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.renewables.length === 0}
                    onChange={() => handleRenewablesChange('none')}
                    className={styles.checkboxInput}
                  />
                  None
                </label>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Simulating SAP 10.2 Model...' : 'Check Compliance Rating'}
          </button>
        </form>

        {/* Results / status panel */}
        <div className={styles.resultsSticky}>
          {loading && (
            <div className={`${styles.resultsCard} ${styles.loadingBox}`}>
              <LoadingSpinner size={40} />
              <div className={styles.loadingText}>
                Evaluating thermal envelopes, emission targets (DER vs TER) and calculating dwelling compliance factors...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className={styles.errorCard}>
              <h3>Calculation failed</h3>
              <p>{errorMsg}</p>
            </div>
          )}

          {!result && !loading && (
            <div className={styles.resultsPlaceholder}>
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H9.75M8.25 21h8.25A2.25 2.25 0 0018.75 18.75V5.25A2.25 2.25 0 0016.5 3H7.5A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21z" />
              </svg>
              <h3>Compliance Report Ready</h3>
              <p>Complete the form on the left and submit to view estimated scores, pass/fail status, and optimized compliance recommendations.</p>
            </div>
          )}

          {result && !loading && (
            <div className={styles.resultsCard}>
              <div className={styles.badgeRow}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Compliance Verdict</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated from inputs</span>
                </div>
                <span className={`${styles.complianceBadge} ${styles['badge' + result.compliance_status]}`}>
                  {result.compliance_status}
                </span>
              </div>

              <div className={styles.ratesGrid}>
                {/* DER Box */}
                <div className={styles.rateBox}>
                  <div className={styles.rateLabel}>Emissions (DER)</div>
                  <div className={styles.rateVal}>{result.der_estimate}</div>
                  <div className={styles.rateTarget}>Target Limit: ~{result.ter_typical_range.split(' - ')[1]}</div>
                </div>

                {/* DFEE Box */}
                <div className={styles.rateBox}>
                  <div className={styles.rateLabel}>Fabric (DFEE)</div>
                  <div className={styles.rateVal}>{result.dfee_estimate}</div>
                  <div className={styles.rateTarget}>Target Limit: ~{result.tfee_typical_range.split(' - ')[1]}</div>
                </div>
              </div>

              {/* Compliance Note */}
              <div className={`${styles.complianceNoteBox} ${styles['border' + result.compliance_status]}`}>
                {result.compliance_note}
              </div>

              {/* SAP Score and EPC estimate */}
              <div className={styles.scoreRow}>
                <div className={styles.scoreInfo}>
                  <span className={styles.scoreVal}>Est. SAP Score: {result.sap_score_estimate}</span>
                  <span className={styles.scoreSub}>Scale 1-100</span>
                </div>
                <RatingBadge rating={result.epc_band} size="md" />
              </div>

              {/* Recommendation Box */}
              {result.recommended_change && (
                <div className={styles.recommendationBox}>
                  <div className={styles.recTitle}>Recommended Improvement</div>
                  <div className={styles.recText}>{result.recommended_change}</div>
                  <div className={styles.recCost}>Estimated Cost: {result.recommended_change_cost_estimate}</div>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Link href="/book" className={styles.submitButton} style={{ textDecoration: 'none', textAlign: 'center', margin: 0 }}>
                  Book Official SAP Assessment
                </Link>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  This tool provides estimates only. A registered OCDEA assessor is required to issue official PEAs and OC-EPCs.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
