'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import styles from './wizard.module.css'

export default function WizardClient() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [projectType, setProjectType] = useState('')
  const [postcode, setPostcode] = useState('')
  const [town, setTown] = useState('')
  const [county, setCounty] = useState('')
  const [numUnits, setNumUnits] = useState(1)
  const [floorArea, setFloorArea] = useState('')
  const [numStoreys, setNumStoreys] = useState(1)
  const [constructionType, setConstructionType] = useState('')
  const [heatingStrategy, setHeatingStrategy] = useState('')
  const [ventilationStrategy, setVentilationStrategy] = useState('')
  const [projectStage, setProjectStage] = useState('')

  const handleNext = () => setStep(prev => prev + 1)
  const handlePrev = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/developer-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_type: projectType,
          postcode,
          town,
          county,
          number_of_units: numUnits,
          floor_area_sqm: floorArea,
          number_of_storeys: numStoreys,
          construction_type: constructionType,
          heating_strategy: heatingStrategy,
          ventilation_strategy: ventilationStrategy,
          project_stage: projectStage
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate compliance report')

      router.push(`/developer/report/${data.report_id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  // --- Step Content Renderers ---

  const renderStep1 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>What are you building?</h2>
      <p className={styles.stepDesc}>Select the option that best describes your development project.</p>
      
      <div className={styles.optionsGrid}>
        {[
          { id: 'Single Dwelling', icon: '🏠' },
          { id: 'Multiple Dwellings', icon: '🏘️' },
          { id: 'Apartment Block', icon: '🏢' },
          { id: 'Extension', icon: '🏗️' },
          { id: 'Conversion', icon: '🔄' },
          { id: 'Commercial Building', icon: '🏭' },
          { id: 'Mixed Use Development', icon: '🏙️' },
          { id: 'Industrial Unit', icon: '🏭' },
          { id: 'Retail Unit', icon: '🏪' },
          { id: 'Office Building', icon: '💼' },
          { id: 'Other', icon: '✨' }
        ].map(opt => (
          <button
            key={opt.id}
            className={`${styles.optionCard} ${projectType === opt.id ? styles.selected : ''}`}
            onClick={() => { setProjectType(opt.id); handleNext() }}
          >
            <span className={styles.optionIcon}>{opt.icon}</span>
            <span className={styles.optionLabel}>{opt.id}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Project Location</h2>
      <p className={styles.stepDesc}>Where is the development located?</p>
      
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Postcode</label>
          <input 
            type="text" 
            placeholder="e.g. DE1 1AA"
            value={postcode}
            onChange={e => setPostcode(e.target.value.toUpperCase())}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>Town / City</label>
          <input 
            type="text" 
            value={town}
            onChange={e => setTown(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>County</label>
          <input 
            type="text" 
            value={county}
            onChange={e => setCounty(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>
      
      <div className={styles.actionRow}>
        <button onClick={handlePrev} className={styles.backBtn}><ArrowLeft size={16} /> Back</button>
        <button 
          onClick={handleNext} 
          className={styles.nextBtn}
          disabled={!postcode || !town}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Development Details</h2>
      <p className={styles.stepDesc}>Help us understand the scale and construction method.</p>
      
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Number of Units</label>
          <input 
            type="number" 
            min="1"
            value={numUnits}
            onChange={e => setNumUnits(parseInt(e.target.value) || 1)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label>Estimated Total Floor Area (m²)</label>
          <input 
            type="number" 
            placeholder="Optional"
            value={floorArea}
            onChange={e => setFloorArea(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.field} style={{ marginTop: '2rem' }}>
        <label>Primary Construction Type</label>
        <div className={styles.optionsGridSm}>
          {['Timber Frame', 'Masonry', 'Steel Frame', 'SIPS', 'ICF', 'Other'].map(type => (
            <button
              key={type}
              className={`${styles.optionCardSm} ${constructionType === type ? styles.selected : ''}`}
              onClick={() => setConstructionType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actionRow}>
        <button onClick={handlePrev} className={styles.backBtn}><ArrowLeft size={16} /> Back</button>
        <button 
          onClick={handleNext} 
          className={styles.nextBtn}
          disabled={!constructionType}
        >
          Next <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Heating Strategy</h2>
      <p className={styles.stepDesc}>What is the primary heat source for the development?</p>
      
      <div className={styles.optionsGrid}>
        {[
          { id: 'Gas Boiler', icon: '🔥' },
          { id: 'Heat Pump', icon: '⚡' },
          { id: 'Electric', icon: '🔌' },
          { id: 'District Heating', icon: '🏢' },
          { id: 'Hybrid', icon: '🔄' },
          { id: 'Unknown', icon: '❓' }
        ].map(opt => (
          <button
            key={opt.id}
            className={`${styles.optionCard} ${heatingStrategy === opt.id ? styles.selected : ''}`}
            onClick={() => { setHeatingStrategy(opt.id); handleNext() }}
          >
            <span className={styles.optionIcon}>{opt.icon}</span>
            <span className={styles.optionLabel}>{opt.id}</span>
          </button>
        ))}
      </div>
      
      <div className={styles.actionRow}>
        <button onClick={handlePrev} className={styles.backBtn}><ArrowLeft size={16} /> Back</button>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Ventilation Strategy</h2>
      <p className={styles.stepDesc}>How will the property be ventilated?</p>
      
      <div className={styles.optionsGrid}>
        {[
          { id: 'Natural Ventilation', icon: '🪟' },
          { id: 'Mechanical Extract (MEV)', icon: '💨' },
          { id: 'MVHR', icon: '🔄' },
          { id: 'Unknown', icon: '❓' }
        ].map(opt => (
          <button
            key={opt.id}
            className={`${styles.optionCard} ${ventilationStrategy === opt.id ? styles.selected : ''}`}
            onClick={() => { setVentilationStrategy(opt.id); handleNext() }}
          >
            <span className={styles.optionIcon}>{opt.icon}</span>
            <span className={styles.optionLabel}>{opt.id}</span>
          </button>
        ))}
      </div>

      <div className={styles.actionRow}>
        <button onClick={handlePrev} className={styles.backBtn}><ArrowLeft size={16} /> Back</button>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className={styles.stepContainer}>
      <h2 className={styles.stepTitle}>Project Stage</h2>
      <p className={styles.stepDesc}>What stage is the project currently at?</p>
      
      <div className={styles.timelineSelector}>
        {[
          'Planning Stage',
          'Design Stage',
          'Building Regulations Stage',
          'Construction Stage',
          'Completion Stage'
        ].map((stage, idx) => (
          <button
            key={stage}
            className={`${styles.timelineNode} ${projectStage === stage ? styles.selected : ''}`}
            onClick={() => setProjectStage(stage)}
          >
            <div className={styles.nodeCircle}>{idx + 1}</div>
            <div className={styles.nodeLabel}>{stage}</div>
          </button>
        ))}
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.actionRow}>
        <button onClick={handlePrev} className={styles.backBtn} disabled={loading}><ArrowLeft size={16} /> Back</button>
        <button 
          onClick={handleSubmit} 
          className={styles.submitBtn}
          disabled={!projectStage || loading}
        >
          {loading ? <><Loader2 className={styles.spin} size={16} /> Generating...</> : 'Generate Compliance Plan'}
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.wizardPage}>
      {/* Top Header */}
      <header className={styles.header}>
        <Link href="/developer" className={styles.logo}>Avorria</Link>
        <span className={styles.headerTitle}>Compliance Planner</span>
        <button onClick={() => router.push('/developer')} className={styles.closeBtn}>Exit</button>
      </header>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>Step {step} of 6</div>
      </div>

      {/* Main Form Area */}
      <main className={styles.mainArea}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}
      </main>
    </div>
  )
}
