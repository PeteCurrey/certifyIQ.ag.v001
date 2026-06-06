'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './improve.module.css'

const BANDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const PROP_TYPES = ['Flat', 'Terraced', 'Semi-Detached', 'Detached', 'Bungalow']
const ALREADY_DONE_ITEMS = [
  { id: 'loft_insulation', label: 'Loft Insulation (270mm+)' },
  { id: 'cavity_wall_insulation', label: 'Cavity Wall Insulation' },
  { id: 'solid_wall_insulation', label: 'Solid Wall Insulation' },
  { id: 'floor_insulation', label: 'Suspended Floor Insulation' },
  { id: 'double_glazing', label: 'Modern Double Glazing' },
  { id: 'low_energy_lighting', label: '100% LED Lighting' },
  { id: 'boiler_upgrade', label: 'Condensing Boiler' },
  { id: 'heating_controls', label: 'Smart Heating Controls' },
  { id: 'solar_pv', label: 'Solar PV Panels' }
]

const LOADING_MESSAGES = [
  "Analysing building fabric...",
  "Calculating thermal transmittance...",
  "Evaluating heating system efficiency...",
  "Checking grant eligibility...",
  "Compiling optimal roadmap..."
]

function ImprovementPlannerContent() {
  const searchParams = useSearchParams()
  
  // Configuration State
  const [currentRating, setCurrentRating] = useState('D')
  const [targetRating, setTargetRating] = useState('C')
  const [propertyType, setPropertyType] = useState('Semi-Detached')
  const [ageBand, setAgeBand] = useState('1950-1975')
  const [budgetLimit, setBudgetLimit] = useState(10000)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  
  // View State
  const [loading, setLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Load query params on mount
  useEffect(() => {
    const r = searchParams.get('rating')
    if (r && BANDS.includes(r.toUpperCase())) {
      setCurrentRating(r.toUpperCase())
    }
    const pc = searchParams.get('postcode')
    if (pc) {
      // simulate pre-fill
      setAgeBand('1900-1949')
    }
  }, [searchParams])

  // Rotating loading messages
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length)
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [loading])

  const handleFeatureToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature))
    } else {
      setSelectedFeatures([...selectedFeatures, feature])
    }
  }

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setResult(null)
    setSubmitted(true)
    setLoadingMsgIdx(0)

    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRating,
          targetRating,
          budgetLimit,
          selectedFeatures: [propertyType, ageBand, ...selectedFeatures]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate energy plan')
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while compiling your improvement plan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.planner}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Retrofit Advisor</span>
        <h1 className={styles.title}>Improve your EPC rating</h1>
        <p className={styles.subtext}>
          Find the most cost-effective path to reach Band C or higher. Generate a customized capital plan ranked by return on investment.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Left Side: Parameters Form */}
        <div className={styles.sidebarCard}>
          <h2 className={styles.sidebarTitle}>Configure Property</h2>
          <form onSubmit={handlePlanSubmit} className={styles.form}>
            
            <div className={styles.field}>
              <span className={styles.label}>Current EPC Band</span>
              <div className={styles.bandGrid}>
                {BANDS.map(b => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setCurrentRating(b)}
                    className={`${styles.bandBtn} ${styles['band' + b]} ${currentRating === b ? styles.active : ''}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Target EPC Band</span>
              <div className={styles.bandGrid}>
                {BANDS.map(b => (
                  <button
                    type="button"
                    key={'t'+b}
                    onClick={() => setTargetRating(b)}
                    className={`${styles.bandBtn} ${styles['band' + b]} ${targetRating === b ? styles.active : ''}`}
                    disabled={BANDS.indexOf(b) > BANDS.indexOf(currentRating) && b !== currentRating}
                    style={{ opacity: BANDS.indexOf(b) > BANDS.indexOf(currentRating) && b !== currentRating ? 0.2 : undefined }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Property Type</span>
              <div className={styles.pillGroup}>
                {PROP_TYPES.map(pt => (
                  <button
                    type="button"
                    key={pt}
                    onClick={() => setPropertyType(pt)}
                    className={`${styles.pillBtn} ${propertyType === pt ? styles.activePill : ''}`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Age Band</span>
              <select className={styles.select} value={ageBand} onChange={e => setAgeBand(e.target.value)}>
                <option value="Pre-1900">Pre-1900</option>
                <option value="1900-1949">1900-1949</option>
                <option value="1950-1975">1950-1975</option>
                <option value="1976-1990">1976-1990</option>
                <option value="1991-2006">1991-2006</option>
                <option value="2007+">2007 or newer</option>
              </select>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Already Done (Skip these)</span>
              <span className={styles.subLabel}>Check measures already installed to exclude them from the roadmap.</span>
              <div className={styles.checkboxesGrid}>
                {ALREADY_DONE_ITEMS.map(item => (
                  <label key={item.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(item.id)}
                      onChange={() => handleFeatureToggle(item.id)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Max Budget Limit</span>
              <div className={styles.budgetWrapper}>
                <input 
                  type="range"
                  min="500" max="25000" step="500"
                  className={styles.budgetRange}
                  value={budgetLimit}
                  onChange={e => setBudgetLimit(Number(e.target.value))}
                />
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>£</span>
                  <input 
                    type="number"
                    className={styles.budgetInput}
                    value={budgetLimit}
                    onChange={e => setBudgetLimit(Number(e.target.value))}
                    style={{ paddingLeft: '20px' }}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Simulating Plan...' : 'Generate Roadmap'}
            </button>
          </form>
        </div>

        {/* Right Side: Results Display */}
        <div className={styles.contentArea}>
          {loading && (
            <div className={styles.centerBlock}>
              <LoadingSpinner size={48} />
              <div className={styles.loadingMsg}>{LOADING_MESSAGES[loadingMsgIdx]}</div>
            </div>
          )}

          {!submitted && !loading && (
            <div className={styles.placeholderCard}>
              <h3>Ready to optimise your property?</h3>
              <p>Configure your property parameters on the left and click "Generate Roadmap". Our AI will calculate the most cost-effective path to your target EPC rating based on current SAP methodologies.</p>
            </div>
          )}

          {errorMsg && <div className={styles.error}>{errorMsg}</div>}

          {result && !loading && (
            <div className={styles.results}>
              {result.alreadyCompliant ? (
                <div className={styles.compliantCard}>
                  <h3>Target Already Met!</h3>
                  <p>Your current rating ({currentRating}) already meets or exceeds your target rating ({targetRating}). No additional upgrades are strictly required.</p>
                </div>
              ) : (
                <>
                  {/* Stats Ribbon */}
                  <div className={styles.statsRibbon}>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>Total Cost</span>
                      <span className={styles.statVal}>£{result.summary?.totalCost ?? 0}</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>Annual Saving</span>
                      <span className={styles.statVal} style={{ color: 'var(--accent-lime)' }}>
                        +£{result.summary?.totalSavingAnnual ?? 0}
                      </span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>Est. Payback</span>
                      <span className={styles.statVal}>
                        {result.summary?.paybackYears ?? 0} yrs
                      </span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>CO2 Reduction</span>
                      <span className={styles.statVal}>
                        {result.summary?.totalCO2Reduction ?? 0} t
                      </span>
                    </div>
                  </div>

                  {/* Target Met Status Banner */}
                  <div className={`${styles.statusBanner} ${result.reachedTarget ? styles.bannerSuccess : styles.bannerWarning}`}>
                    {result.reachedTarget ? (
                      <div>
                        <h3 style={{ color: 'var(--accent-lime)' }}>Target Reached: Band {result.finalRating}</h3>
                        <p>With these upgrades, your estimated SAP score rises from {result.currentScore} to {result.finalScore}, putting your property into Band {result.finalRating}.</p>
                      </div>
                    ) : (
                      <div>
                        <h3 style={{ color: '#F5A623' }}>Target Unmet (Budget Limit)</h3>
                        <p>With a £{budgetLimit} budget, you can reach estimated Band {result.finalRating} (SAP {result.finalScore}). To hit Band {targetRating}, you need to increase your budget for more substantial upgrades.</p>
                      </div>
                    )}
                  </div>

                  {/* Roadmap Table */}
                  {result.path && result.path.length > 0 && (
                    <div className={styles.roadmapCard}>
                      <h3 className={styles.roadmapTitle}>Optimal Retrofit Roadmap</h3>
                      <p className={styles.roadmapSub}>Measures are ranked by ROI and logical installation sequence.</p>

                      <div className={styles.tableWrap}>
                        <table className={styles.roadmapTable}>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Measure</th>
                              <th>Cost</th>
                              <th>Saving/yr</th>
                              <th>SAP Gain</th>
                              <th>New Band</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.path.map((step: any, index: number) => (
                              <tr key={index}>
                                <td style={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>{index + 1}</td>
                                <td className={styles.measureCell}>
                                  <span className={styles.measureTitle}>{step.title}</span>
                                  <span className={styles.measureDesc}>{step.description}</span>
                                </td>
                                <td style={{ fontWeight: 'bold' }}>£{step.cost}</td>
                                <td style={{ color: 'var(--accent-lime)', fontWeight: 'bold' }}>+£{step.savingAnnual}</td>
                                <td>+{step.sapPoints}</td>
                                <td>
                                  <div className={styles.bandCell}>
                                    <span className={`${styles.miniBadge} ${styles['band' + step.newBand]}`}>
                                      {step.newBand}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Grants Box */}
                  <div className={styles.grantsBox}>
                    <h4><span style={{ fontSize: '1.2rem' }}>💰</span> Grant Funding Available</h4>
                    <p>Based on your selected upgrades, you may be eligible for the following government schemes to offset the capital costs:</p>
                    <div className={styles.grantsList}>
                      <span className={styles.grantBadge}>Great British Insulation Scheme</span>
                      <span className={styles.grantBadge}>ECO4</span>
                      <span className={styles.grantBadge}>Boiler Upgrade Scheme (£7,500)</span>
                    </div>
                  </div>

                  {/* Email Capture */}
                  <div className={styles.emailCapture}>
                    <h4>Save your roadmap</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Enter your email to receive a PDF copy of this retrofit plan and a link to return anytime.</p>
                    <form className={styles.emailRow} onSubmit={(e) => { e.preventDefault(); alert('Roadmap sent!') }}>
                      <input type="email" placeholder="name@example.com" required className={styles.emailInput} />
                      <button type="submit" className={styles.emailBtn}>Send PDF</button>
                    </form>
                  </div>

                  {/* CTAs */}
                  <div className={styles.ctas}>
                    <Link href="/book" className={styles.ctaPrimary}>
                      Book Official Assessment — £65
                    </Link>
                    <button className={styles.ctaSecondary} onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied!');
                    }}>
                      Copy Link
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EPCPriorityPlannerPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080D18' }}>
        <LoadingSpinner size={48} />
      </div>
    }>
      <ImprovementPlannerContent />
    </Suspense>
  )
}
