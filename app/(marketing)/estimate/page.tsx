'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Info, AlertCircle, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'
import styles from './estimate.module.css'

interface Step {
  id: string
  title: string
  question: string
  options: { label: string; value: string; desc?: string }[]
  context: {
    title: string
    text: string
    help: string
  }
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
    ],
    context: {
      title: 'Why this matters',
      text: 'Property type dictates the heat loss perimeter. A mid-floor flat loses less heat than a detached house because it shares structural boundaries with heated spaces.',
      help: 'If you have a maisonette, select Flat.'
    }
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
    ],
    context: {
      title: 'Building Regulations',
      text: 'The year of construction allows the EPC methodology (SAP) to assume baseline thermal properties for walls, floors, and roofs if no documentary evidence of upgrades exists.',
      help: 'If unsure, check your property deeds or estimate based on neighborhood style.'
    }
  },
  {
    id: 'wallInsulation',
    title: 'Wall Insulation',
    question: 'Are the walls insulated?',
    options: [
      { label: 'None / Unknown', value: 'None/Unknown', desc: 'Typical for older, unretrofitted properties' },
      { label: 'Cavity Filled', value: 'Cavity Filled', desc: 'Insulation blown into the wall cavities' },
      { label: 'Internal or External', value: 'Internal/External Insulation', desc: 'Solid wall insulation added retroactively' }
    ],
    context: {
      title: 'Thermal Transmittance',
      text: 'Uninsulated walls account for approximately 33% of a property\'s heat loss. Adding cavity or solid wall insulation is one of the highest-impact SAP improvements.',
      help: 'Look for injection drill holes in the exterior brickwork for signs of cavity fill.'
    }
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
    ],
    context: {
      title: 'Heat Rises',
      text: 'A quarter of heat is lost through the roof in an uninsulated home. Current building regulations recommend a depth of 270mm for loft insulation.',
      help: 'Measure the depth with a ruler. 100mm is roughly the depth of a standard joist.'
    }
  },
  {
    id: 'heatingFuel',
    title: 'Heating System',
    question: 'What is the main heating source?',
    options: [
      { label: 'Mains Gas Boiler', value: 'Mains Gas Boiler', desc: 'Standard central heating radiators' },
      { label: 'Electric Storage Heaters', value: 'Electric Storage Heaters', desc: 'Night heat storage units' },
      { label: 'Heat Pump', value: 'Heat Pump', desc: 'Air source or ground source heat pump' },
      { label: 'Biomass / Other', value: 'Biomass/Other', desc: 'Wood burner, coal, or community heating' }
    ],
    context: {
      title: 'Fuel Factors',
      text: 'The EPC rating is fundamentally a measure of fuel cost. Because electricity is generally 3-4x more expensive than mains gas per kWh, electric heating often results in a lower EPC band.',
      help: 'Select the primary system that heats the majority of rooms.'
    }
  }
]

export default function AIEstimatorPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showCapture, setShowCapture] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const handleSelectOption = (value: string) => {
    const key = STEPS[currentStep].id
    const updatedAnswers = { ...answers, [key]: value }
    setAnswers(updatedAnswers)

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Completed last step, trigger API calculation and show intercept
      computeEstimate(updatedAnswers)
    }
  }

  const computeEstimate = async (finalAnswers: Record<string, string>) => {
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
      // Done loading, show lead capture instead of results immediately
      setLoading(false)
      setShowCapture(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while analyzing properties.')
      setLoading(false)
    }
  }

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, save email/lead to DB here
    setShowCapture(false) // proceed to show results
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
    setShowCapture(false)
    setErrorMsg(null)
  }

  const progressPct = Math.round(((currentStep) / STEPS.length) * 100)
  const currentStepData = STEPS[currentStep]

  return (
    <div className={styles.container}>
      {!result && !loading && !showCapture && (
        <div className={styles.layout}>
          <div className={styles.wizardCard}>
            <div className={styles.wizardHeader}>
              <span className={styles.eyebrow}>EPC Estimator</span>
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

            <h2 className={styles.question}>{currentStepData.question}</h2>

            <div className={styles.optionsGrid}>
              {currentStepData.options.map((opt) => (
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

          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}><Info size={18} /> {currentStepData.context.title}</h3>
            <p className={styles.sidebarText}>{currentStepData.context.text}</p>
            <p className={styles.sidebarHelpText}>{currentStepData.context.help}</p>
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

      {showCapture && result && !loading && (
        <div className={styles.leadCaptureCard}>
          <div style={{ marginBottom: '1.5rem' }}>
            <CheckCircle size={48} color="var(--accent-lime)" style={{ margin: '0 auto' }} />
          </div>
          <h2>Your estimate is ready</h2>
          <p>We've successfully calculated your property's estimated EPC rating, SAP score, and compliance status. Enter your email to view your results instantly.</p>
          <form className={styles.captureForm} onSubmit={handleCaptureSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.captureInput} 
            />
            <button type="submit" className={styles.captureBtn}>
              Reveal My EPC Score
            </button>
          </form>
          <button type="button" onClick={() => setShowCapture(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.5rem', cursor: 'pointer', textDecoration: 'underline' }}>
            Skip this step
          </button>
        </div>
      )}

      {result && !showCapture && !loading && (
        <div className={styles.resultsWrapper}>
          <div className={styles.resultsHero}>
            <span className={styles.eyebrow}>Analysis Complete</span>
            <h1 className={styles.resultsTitle}>Your Estimated EPC Rating</h1>
            <p className={styles.resultsSub}>
              Based on your answers, here is the simulated Energy Performance Certificate profile for your property.
            </p>
          </div>

          <div className={styles.scoreGrid}>
            {/* Card 1: Estimated Band */}
            <div className={styles.scoreCard}>
              <div className={styles.scoreTitle}>Estimated Rating</div>
              <div className={styles.badgeRow}>
                <RatingBadge rating={result.band} size="lg" />
                <div className={styles.sapScore}>
                  <strong>SAP Score: {result.sapScore}</strong>
                  <span>Scale: 1-100</span>
                </div>
              </div>
            </div>

            {/* Card 2: Current Compliance Status */}
            <div className={styles.scoreCard} style={{ border: result.band <= 'F' ? '1px solid rgba(255,92,92,0.3)' : '1px solid rgba(155,255,89,0.3)' }}>
              <div className={styles.scoreTitle}>Current Legal Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                {result.band <= 'F' ? <AlertCircle color="var(--accent-red)" size={24} /> : <CheckCircle color="var(--accent-lime)" size={24} />}
                <strong style={{ fontSize: '1.2rem', color: result.band <= 'F' ? 'var(--accent-red)' : 'var(--accent-lime)' }}>
                  {result.band <= 'F' ? 'Non-Compliant' : 'Compliant'}
                </strong>
              </div>
              <div className={styles.costDesc}>
                {result.band <= 'F' 
                  ? 'This property cannot be legally let under current MEES regulations (Band E minimum).' 
                  : 'This property meets the current MEES minimum standard of Band E for letting.'}
              </div>
            </div>

            {/* Card 3: 2028 Future Compliance */}
            <div className={styles.scoreCard} style={{ border: result.sapScore < 69 ? '1px solid rgba(245,166,35,0.3)' : '1px solid rgba(155,255,89,0.3)' }}>
              <div className={styles.scoreTitle}>2028 Future Compliance</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                {result.sapScore < 69 ? <TrendingUp color="var(--accent-amber)" size={24} /> : <CheckCircle color="var(--accent-lime)" size={24} />}
                <strong style={{ fontSize: '1.2rem', color: result.sapScore < 69 ? 'var(--accent-amber)' : 'var(--accent-lime)' }}>
                  {result.sapScore < 69 ? 'Action Required' : 'Future-Proof'}
                </strong>
              </div>
              <div className={styles.costDesc}>
                {result.sapScore < 69 
                  ? 'You will need to upgrade to Band C by 2028 to continue legally letting this property.' 
                  : 'This property already meets the proposed 2028 minimum standard of Band C.'}
              </div>
            </div>
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
              href={`/improve?rating=${result.band}`} 
              className={styles.buttonImprove}
            >
              Analyze Upgrades in Planner →
            </Link>
            <Link href="/book" className={styles.buttonBook}>
              Book Official EPC Assessment — £65
            </Link>
            <button className={styles.buttonRestart} onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Results link copied!');
            }}>
              Share Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
