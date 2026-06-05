'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './estimate.module.css'

interface Step {
  id: string
  title: string
  question: string
  options: { label: string; value: string; desc?: string }[]
}

const STEPS: Step[] = [
  {
    id: 'propertyType',
    title: 'Property Type',
    question: 'What type of property is it?',
    options: [
      { label: 'Flat / Apartment', value: 'Flat', desc: 'Saves energy due to shared walls' },
      { label: 'Terraced House', value: 'Terraced', desc: 'Mid or end terrace house' },
      { label: 'Semi-Detached House', value: 'Semi-Detached', desc: 'Shared wall with one neighbor' },
      { label: 'Detached House', value: 'Detached', desc: 'No shared external walls' },
      { label: 'Bungalow', value: 'Bungalow', desc: 'Single-storey detached or semi-detached' }
    ]
  },
  {
    id: 'constructionPeriod',
    title: 'Construction Period',
    question: 'When was the property built?',
    options: [
      { label: 'Pre-1900', value: 'Pre-1900', desc: 'Usually solid brick, no insulation' },
      { label: '1900 - 1949', value: '1900-1949', desc: 'Solid wall or early uninsulated cavity' },
      { label: '1950 - 1975', value: '1950-1966', desc: 'Usually uninsulated cavity' },
      { label: '1976 - 1990', value: '1976-1982', desc: 'Building regulations start adding insulation' },
      { label: '1991 - 2006', value: '1996-2002', desc: 'Modern standards, insulated walls/loft' },
      { label: '2007 or Newer', value: '2012+', desc: 'Highly efficient, double glazed' }
    ]
  },
  {
    id: 'wallType',
    title: 'Wall Type',
    question: 'What is the main wall structure?',
    options: [
      { label: 'Solid Brick', value: 'Solid Brick', desc: 'Common in pre-1930 properties' },
      { label: 'Cavity Wall', value: 'Cavity Wall', desc: 'Standard for post-1930 properties' },
      { label: 'Timber Frame', value: 'Timber Frame', desc: 'Wood structural frame with external cladding' },
      { label: 'Don\'t Know', value: 'Cavity Wall', desc: 'We will assume standard for building age' }
    ]
  },
  {
    id: 'wallInsulation',
    title: 'Wall Insulation',
    question: 'Are the walls insulated?',
    options: [
      { label: 'None / Unknown', value: 'None/Unknown', desc: 'Typical for older, unretrofitted properties' },
      { label: 'Cavity Filled', value: 'Cavity Filled', desc: 'Insulation blown into the wall cavities' },
      { label: 'Internal or External', value: 'Internal/External Insulation', desc: 'Solid wall insulation added retroactively' }
    ]
  },
  {
    id: 'roofInsulation',
    title: 'Roof / Loft Insulation',
    question: 'What is the status of your roof/loft insulation?',
    options: [
      { label: 'No Loft / Flat Roof', value: 'No loft/Flat roof', desc: 'No access or flat roof design' },
      { label: 'No Insulation', value: 'Loft with no insulation', desc: 'Empty loft hatch area' },
      { label: 'Thin Insulation (< 100mm)', value: 'Under 100mm', desc: 'Older or shallow insulation layers' },
      { label: 'Medium Insulation (100-200mm)', value: '100mm-200mm', desc: 'Partial or medium insulation' },
      { label: 'Modern Insulation (250mm+)', value: '250mm+ / Modern', desc: 'Deep insulation filling the joists' }
    ]
  },
  {
    id: 'glazing',
    title: 'Glazing',
    question: 'What type of windows are installed?',
    options: [
      { label: 'Single Glazing', value: 'Single Glazing', desc: 'Original sash or metal frame single panes' },
      { label: 'Older Double Glazing', value: 'Double Glazing pre-2002', desc: 'Double glazing installed pre-2002' },
      { label: 'Modern Double / Triple', value: 'Double Glazing post-2002 / Triple Glazing', desc: 'Modern high-efficiency glazing units' }
    ]
  },
  {
    id: 'heatingFuel',
    title: 'Heating System',
    question: 'What is the main heating source?',
    options: [
      { label: 'Mains Gas Boiler', value: 'Mains Gas Boiler', desc: 'Standard central heating radiators' },
      { label: 'Oil Boiler', value: 'Oil Boiler', desc: 'External or internal oil fuel boiler' },
      { label: 'Electric Storage Heaters', value: 'Electric Storage Heaters', desc: 'Night heat storage units' },
      { label: 'Heat Pump', value: 'Heat Pump', desc: 'Air source or ground source heat pump' },
      { label: 'Biomass / Other', value: 'Biomass/Other', desc: 'Wood burner, coal, or community heating' }
    ]
  },
  {
    id: 'heatingControls',
    title: 'Heating Controls',
    question: 'What heating controls do you have?',
    options: [
      { label: 'None / Programmer Only', value: 'No programmer/thermostat', desc: 'Simple dial timer or manual control' },
      { label: 'Programmer + TRVs', value: 'Programmer & TRVs', desc: 'Timer and thermostatic radiator valves' },
      { label: 'Smart Thermostat', value: 'Smart Thermostat e.g. Nest/Hive', desc: 'App-controlled smart heating system' }
    ]
  }
]

export default function AIEstimatorPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSelectOption = (value: string) => {
    const key = STEPS[currentStep].id
    const updatedAnswers = { ...answers, [key]: value }
    setAnswers(updatedAnswers)

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Completed last step, trigger API calculation
      submitAnswers(updatedAnswers)
    }
  }

  const submitAnswers = async (finalAnswers: Record<string, string>) => {
    setLoading(true)
    setErrorMsg(null)

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalAnswers),
      })

      if (!response.ok) {
        throw new Error('Failed to compute AI energy estimate')
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while analyzing properties.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const restartEstimator = () => {
    setAnswers({})
    setCurrentStep(0)
    setResult(null)
    setErrorMsg(null)
  }

  const progressPct = Math.round(((currentStep) / STEPS.length) * 100)

  return (
    <div className={styles.container}>
      {!result && !loading && (
        <div className={styles.wizardCard}>
          <div className={styles.wizardHeader}>
            <span className={styles.eyebrow}>AI EPC Estimator</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
            <div className={styles.stepInfo}>
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              {currentStep > 0 && (
                <button onClick={handleBack} className={styles.backButton}>
                  ← Back
                </button>
              )}
            </div>
          </div>

          <h2 className={styles.question}>{STEPS[currentStep].question}</h2>

          <div className={styles.optionsGrid}>
            {STEPS[currentStep].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className={styles.optionCard}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
                {opt.desc && <span className={styles.optionDesc}>{opt.desc}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.loadingCard}>
          <LoadingSpinner size={48} />
          <h2>Analyzing property parameters...</h2>
          <p>Running thermal heat loss algorithms and checking building guidelines.</p>
        </div>
      )}

      {errorMsg && (
        <div className={styles.errorCard}>
          <h2>Calculation Error</h2>
          <p>{errorMsg}</p>
          <button onClick={restartEstimator} className={styles.retryButton}>
            Start Over
          </button>
        </div>
      )}

      {result && !loading && (
        <div className={styles.resultsWrapper}>
          <div className={styles.resultsHero}>
            <span className={styles.eyebrow}>Analysis Complete</span>
            <h1 className={styles.resultsTitle}>Your Estimated EPC Rating</h1>
            <p className={styles.resultsSub}>
              Based on your answers, here is the simulated Energy Performance Certificate profile for your property.
            </p>
          </div>

          <div className={styles.scoreGrid}>
            <div className={styles.scoreCard}>
              <div className={styles.scoreTitle}>Estimated Band</div>
              <div className={styles.badgeRow}>
                <RatingBadge rating={result.band} size="lg" />
                <div className={styles.sapScore}>
                  <strong>SAP Score: {result.sapScore}</strong>
                  <span>Scale: 1-100 (Higher is more efficient)</span>
                </div>
              </div>
            </div>

            <div className={styles.scoreCard}>
              <div className={styles.scoreTitle}>Estimated Costs</div>
              <div className={styles.costAmount}>
                £{result.estimatedCostAnnual}
                <span className={styles.perYear}>/ year</span>
              </div>
              <div className={styles.costDesc}>Approximate annual fuel &amp; power expenses</div>
            </div>
          </div>

          {/* Landlord Compliance Alert */}
          <div className={`${styles.complianceAlert} ${result.band <= 'F' ? styles.alertFail : styles.alertPass}`}>
            <h3>Landlord Legal Compliance</h3>
            <p className={styles.complianceRow}>
              <strong>Current (Min Band E):</strong>{' '}
              <span className={result.band <= 'F' ? styles.redText : styles.greenText}>
                {result.compliance}
              </span>
            </p>
            <p className={styles.complianceRow}>
              <strong>Proposed 2028 (Min Band C):</strong>{' '}
              <span className={result.sapScore < 69 ? styles.amberText : styles.greenText}>
                {result.futureCompliance}
              </span>
            </p>
          </div>

          {/* Recommendations Table */}
          <div className={styles.recsCard}>
            <h2 className={styles.recsTitle}>Top Recommended Energy Upgrades</h2>
            <p className={styles.recsSub}>These measures are selected by impact on carbon reductions and annual bills.</p>
            
            <div className={styles.tableWrap}>
              <table className={styles.recsTable}>
                <thead>
                  <tr>
                    <th>Upgrade Measure</th>
                    <th>Est. Cost</th>
                    <th>Est. Saving</th>
                    <th>SAP Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {result.recommendations.map((rec: any, i: number) => (
                    <tr key={i}>
                      <td className={styles.recMeasure}>{rec.title}</td>
                      <td>{rec.cost}</td>
                      <td className={styles.greenText}>{rec.saving}</td>
                      <td>
                        <span className={`${styles.impactBadge} ${styles['impact' + rec.impact.replace(/\s+/g, '')]}`}>
                          {rec.impact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTAs */}
          <div className={styles.ctas}>
            <button onClick={restartEstimator} className={styles.buttonRestart}>
              Estimate Another Property
            </button>
            <Link 
              href={`/improve?postcode=S401AA&rating=${result.band}`} 
              className={styles.buttonImprove}
            >
              Analyze Upgrades in AI Planner →
            </Link>
            <Link href="/book" className={styles.buttonBook}>
              Book Official EPC Assessment — £65
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
