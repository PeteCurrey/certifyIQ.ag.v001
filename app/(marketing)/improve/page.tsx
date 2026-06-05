'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './improve.module.css'

function ImprovementPlannerContent() {
  const searchParams = useSearchParams()
  
  // State variables
  const [currentRating, setCurrentRating] = useState('D')
  const [targetRating, setTargetRating] = useState('C')
  const [budgetLimit, setBudgetLimit] = useState(10000)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // Load query params on mount
  useEffect(() => {
    const r = searchParams.get('rating')
    if (r) {
      setCurrentRating(r.toUpperCase())
    }
    const pc = searchParams.get('postcode')
    const addr = searchParams.get('address')
    if (pc || addr) {
      // Auto-populate feature checks based on presence of old properties
      setSelectedFeatures(['uninsulated_loft', 'uninsulated_cavity'])
    }
  }, [searchParams])

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

    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRating,
          targetRating,
          budgetLimit,
          selectedFeatures
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
        <span className={styles.eyebrow}>AI Retrofit Advisor</span>
        <h1 className={styles.title}>Improve your EPC rating</h1>
        <p className={styles.subtext}>
          Find the most cost-effective path to reach Band C or higher. Generate a customized capital plan ranked by return on investment.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Left Side: Parameters Form */}
        <div className={styles.sidebarCard}>
          <h2 className={styles.sidebarTitle}>Configure Plan</h2>
          <form onSubmit={handlePlanSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Current EPC Band</label>
              <select 
                className={styles.select}
                value={currentRating}
                onChange={e => setCurrentRating(e.target.value)}
              >
                {['A','B','C','D','E','F','G'].map(b => (
                  <option key={b} value={b}>Band {b}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Target EPC Band</label>
              <select 
                className={styles.select}
                value={targetRating}
                onChange={e => setTargetRating(e.target.value)}
              >
                {['A','B','C','D','E'].map(b => (
                  <option key={b} value={b}>Band {b} (Minimum)</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Max Budget (£)</label>
              <input 
                type="number"
                className={styles.input}
                value={budgetLimit}
                onChange={e => setBudgetLimit(Number(e.target.value))}
                min={100}
                step={500}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Check All That Apply</label>
              <div className={styles.checkboxes}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes('uninsulated_loft')}
                    onChange={() => handleFeatureToggle('uninsulated_loft')}
                  />
                  <span>Loft insulation missing / thin</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes('solid_walls')}
                    onChange={() => handleFeatureToggle('solid_walls')}
                  />
                  <span>Solid brick walls (pre-1930)</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes('uninsulated_cavity')}
                    onChange={() => handleFeatureToggle('uninsulated_cavity')}
                  />
                  <span>Uninsulated cavity walls</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes('single_glazing')}
                    onChange={() => handleFeatureToggle('single_glazing')}
                  />
                  <span>Single glazed windows</span>
                </label>
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
              <LoadingSpinner size={40} />
              <p>Simulating retrofit measures...</p>
            </div>
          )}

          {!submitted && !loading && (
            <div className={styles.placeholderCard}>
              <h3>Enter your property details</h3>
              <p>Fill out the configuration parameters on the left and click &quot;Generate Roadmap&quot; to compile your optimized capital improvements plan.</p>
            </div>
          )}

          {errorMsg && <div className={styles.error}>{errorMsg}</div>}

          {result && !loading && (
            <div className={styles.results}>
              {result.alreadyCompliant ? (
                <div className={styles.compliantCard}>
                  <h3>Target Already Met!</h3>
                  <p>Your current rating band is estimated to meet or exceed your target rating band. No additional upgrades are required to reach Band {targetRating}.</p>
                </div>
              ) : (
                <>
                  {/* Stats Ribbon */}
                  <div className={styles.statsRibbon}>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>Total Cost</span>
                      <span className={styles.statVal}>£{result.summary.totalCost}</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>Annual Saving</span>
                      <span className={styles.statVal} style={{ color: 'var(--accent-lime)' }}>
                        +£{result.summary.totalSavingAnnual}
                      </span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>CO2 Reduction</span>
                      <span className={styles.statVal}>
                        {result.summary.totalCO2Reduction} tonnes
                      </span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statLabel}>Est. Payback</span>
                      <span className={styles.statVal}>
                        {result.summary.paybackYears} years
                      </span>
                    </div>
                  </div>

                  {/* Target Met Status Banner */}
                  <div className={`${styles.statusBanner} ${result.reachedTarget ? styles.bannerSuccess : styles.bannerWarning}`}>
                    {result.reachedTarget ? (
                      <div>
                        <h3>Target Reached: Band {result.finalRating}</h3>
                        <p>With these upgrades, your estimated SAP score rises from {result.currentScore} to {result.finalScore}, putting your property comfortably into Band {result.finalRating}.</p>
                      </div>
                    ) : (
                      <div>
                        <h3>Target Unmet (Budget Limit Hit)</h3>
                        <p>With a £{budgetLimit} budget limit, you can reach estimated Band {result.finalRating} (SAP {result.finalScore}). To hit Band {targetRating}, you need to increase your budget to allow more substantial upgrades like solar panels or insulation.</p>
                      </div>
                    )}
                  </div>

                  {/* Roadmap Timeline */}
                  <div className={styles.roadmapCard}>
                    <h3 className={styles.roadmapTitle}>Optimal Installation Roadmap</h3>
                    <p className={styles.roadmapSub}>Upgrades are arranged sequentially based on cost efficiency and impact.</p>

                    <div className={styles.timeline}>
                      {result.path.map((step: any, index: number) => (
                        <div key={step.id} className={styles.timelineItem}>
                          <div className={styles.timelineStepNumber}>
                            <span>{index + 1}</span>
                          </div>
                          <div className={styles.timelineContent}>
                            <div className={styles.timelineHeader}>
                              <h4>{step.title}</h4>
                              <span className={styles.timelineCost}>£{step.cost}</span>
                            </div>
                            <p className={styles.timelineDesc}>{step.description}</p>
                            <div className={styles.timelineMetrics}>
                              <span>💸 Saving: £{step.savingAnnual}/yr</span>
                              <span>🌱 SAP Points: +{step.sapPoints}</span>
                              <span className={styles.newBadge}>
                                New Rating: <strong>Band {step.newBand}</strong> (SAP {step.newScore})
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Funnel CTAs */}
                  <div className={styles.ctas}>
                    <Link href="/book" className={styles.ctaPrimary}>
                      Book Official Assessment to Confirm
                    </Link>
                    <Link href="/register" className={styles.ctaSecondary}>
                      Save Plan to Account
                    </Link>
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
