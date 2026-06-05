'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Info, Sparkles, FileText, ArrowRight, ArrowLeft } from 'lucide-react'
import styles from './sap.module.css'

const SECTIONS = [
  { id: 'project', label: 'Project Info' },
  { id: 'fabric', label: 'Fabric Spec' },
  { id: 'services', label: 'Services Spec' },
  { id: 'compliance', label: 'Compliance & PEA' }
]

const AS_BUILT_SECTIONS = [
  { id: 'variations', label: 'Variations' },
  { id: 'airtest', label: 'Air Tightness' },
  { id: 'final', label: 'Final Compliance & EPC' }
]

export default function SAPAssessmentPage() {
  const params = useParams()
  const bookingId = params.bookingId as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Tab State
  const initialStage = searchParams.get('stage') === 'as_built' ? 'as_built' : 'design'
  const [stage, setStage] = useState<'design' | 'as_built'>(initialStage)
  const [activeSection, setActiveSection] = useState('project')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [booking, setBooking] = useState<any>(null)
  const [assessment, setAssessment] = useState<any>(null)

  // Form inputs
  const [form, setForm] = useState({
    // Project info
    project_name: '',
    developer_name: '',
    architect_name: '',
    building_control_ref: '',
    plot_count: 1,
    dwelling_type: 'house',
    storey_count: 2,
    total_floor_area_sqm: 100,

    // Construction specs
    wall_construction: 'Cavity Wall',
    wall_uvalue: 0.18,
    roof_construction: 'Pitched Roof Insulated at Joists',
    roof_uvalue: 0.13,
    floor_construction: 'Solid Concrete',
    floor_uvalue: 0.15,
    window_uvalue: 1.4,
    window_gvalue: 0.63,
    door_uvalue: 1.2,
    thermal_bridging_method: 'appendix_k_default', // default / accredited
    air_permeability_design_target: 5.0,

    // Services
    heating_system: 'Gas Condensing Boiler',
    heating_fuel: 'mains-gas',
    boiler_model: '',
    hot_water_system: 'Cylinder from Main Boiler',
    ventilation_type: 'natural-fans',
    mvhr_efficiency: 85,
    low_energy_lighting_pct: 100,
    renewable_technology: [] as string[],

    // As Built spec
    has_variations: false,
    as_built_variations: '',
    air_permeability_tested: null as number | null,
    air_test_certificate_ref: '',
    air_test_date: '',
    
    // Outputs
    ter_score: null as number | null,
    der_score: null as number | null,
    tfee_score: null as number | null,
    dfee_score: null as number | null,
    sap_score: null as number | null,
    epc_band: '',
    pea_ref: '',
    epc_ref: ''
  })

  // File Upload fields
  const [drawingsUrl, setDrawingsUrl] = useState<string | null>(null)
  const [attmaCertUrl, setAttmaCertUrl] = useState<string | null>(null)
  const [peaDocUrl, setPeaDocUrl] = useState<string | null>(null)
  const [epcDocUrl, setEpcDocUrl] = useState<string | null>(null)

  // AI Compliance state
  const [calculatingAI, setCalculatingAI] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)

  const setField = useCallback((key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  // Sync URL stage param
  useEffect(() => {
    const stageParam = searchParams.get('stage')
    if (stageParam === 'as_built') {
      setStage('as_built')
      setActiveSection('variations')
    } else {
      setStage('design')
      setActiveSection('project')
    }
  }, [searchParams])

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      try {
        const { data: bookingData, error: bErr } = await supabase
          .from('bookings')
          .select('*, properties(*), customers(*), assessors(*)')
          .eq('id', bookingId)
          .single()

        if (bErr || !bookingData) throw new Error('Booking not found')
        setBooking(bookingData)

        // Fetch or create sap assessment record
        const { data: sapData, error: sErr } = await supabase
          .from('sap_assessments')
          .select('*')
          .eq('booking_id', bookingId)
          .maybeSingle()

        if (sapData) {
          setAssessment(sapData)
          setForm(prev => ({
            ...prev,
            project_name: sapData.project_name || '',
            developer_name: sapData.developer_name || '',
            architect_name: sapData.architect_name || '',
            building_control_ref: sapData.building_control_ref || '',
            plot_count: sapData.plot_count || 1,
            dwelling_type: sapData.dwelling_type || 'house',
            storey_count: sapData.storey_count || 2,
            total_floor_area_sqm: Number(sapData.total_floor_area_sqm) || 100,
            wall_construction: sapData.wall_construction || 'Cavity Wall',
            wall_uvalue: Number(sapData.wall_uvalue) || 0.18,
            roof_construction: sapData.roof_construction || 'Pitched Roof Insulated at Joists',
            roof_uvalue: Number(sapData.roof_uvalue) || 0.13,
            floor_construction: sapData.floor_construction || 'Solid Concrete',
            floor_uvalue: Number(sapData.floor_uvalue) || 0.15,
            window_uvalue: Number(sapData.window_uvalue) || 1.4,
            window_gvalue: Number(sapData.window_gvalue) || 0.63,
            door_uvalue: Number(sapData.door_uvalue) || 1.2,
            air_permeability_design_target: Number(sapData.air_permeability_design_target) || 5.0,
            heating_system: sapData.heating_system || 'Gas Condensing Boiler',
            heating_fuel: sapData.heating_fuel || 'mains-gas',
            hot_water_system: sapData.hot_water_system || 'Cylinder from Main Boiler',
            ventilation_type: sapData.ventilation_type || 'natural-fans',
            renewable_technology: sapData.renewable_technology || [],
            air_permeability_tested: sapData.air_permeability_tested ? Number(sapData.air_permeability_tested) : null,
            air_test_certificate_ref: sapData.air_test_certificate_ref || '',
            air_test_date: sapData.air_test_date || '',
            as_built_variations: sapData.as_built_variations || '',
            ter_score: sapData.ter_score ? Number(sapData.ter_score) : null,
            der_score: sapData.der_score ? Number(sapData.der_score) : null,
            tfee_score: sapData.tfee_score ? Number(sapData.tfee_score) : null,
            dfee_score: sapData.dfee_score ? Number(sapData.dfee_score) : null,
            sap_score: sapData.sap_score ? Number(sapData.sap_score) : null,
            epc_band: sapData.epc_band || '',
            pea_ref: sapData.pea_ref || '',
            epc_ref: sapData.epc_ref || ''
          }))
          setDrawingsUrl(sapData.drawings_url)
          setAttmaCertUrl(sapData.air_test_certificate_ref)
          setPeaDocUrl(sapData.pea_document_url)
          setEpcDocUrl(sapData.epc_document_url)
          
          if (sapData.as_built_variations) {
            setForm(prev => ({ ...prev, has_variations: true }))
          }
        } else {
          // Auto create a blank assessment row
          const { data: newSap, error: createErr } = await supabase
            .from('sap_assessments')
            .insert({
              booking_id: bookingId,
              stage: 'design',
              status: 'not_started'
            })
            .select()
            .single()

          if (createErr) throw createErr
          setAssessment(newSap)
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load assessment')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [bookingId])

  // Live calculation of estimated SAP score range
  const calculateEstimatedSAP = () => {
    let base = 88
    base -= Math.max(0, (form.wall_uvalue - 0.15) * 60)
    base -= Math.max(0, (form.roof_uvalue - 0.11) * 60)
    base -= Math.max(0, (form.floor_uvalue - 0.13) * 60)
    base -= Math.max(0, (form.window_uvalue - 1.2) * 15)
    base -= Math.max(0, (form.air_permeability_design_target - 3.0) * 1.5)
    if (form.renewable_technology.length > 0) base += form.renewable_technology.length * 4
    if (form.heating_fuel === 'electric') base -= 5
    const score = Math.round(Math.max(30, Math.min(100, base)))
    return {
      min: score - 2,
      max: score + 2,
      target: 80,
      margin: score - 80
    }
  }

  const est = calculateEstimatedSAP()

  const handleSave = async (showNotification = true) => {
    setSaving(true)
    try {
      const updateData = {
        project_name: form.project_name,
        developer_name: form.developer_name,
        architect_name: form.architect_name,
        building_control_ref: form.building_control_ref,
        plot_count: form.plot_count,
        dwelling_type: form.dwelling_type,
        storey_count: form.storey_count,
        total_floor_area_sqm: form.total_floor_area_sqm,
        wall_construction: form.wall_construction,
        wall_uvalue: form.wall_uvalue,
        roof_construction: form.roof_construction,
        roof_uvalue: form.roof_uvalue,
        floor_construction: form.floor_construction,
        floor_uvalue: form.floor_uvalue,
        window_uvalue: form.window_uvalue,
        window_gvalue: form.window_gvalue,
        door_uvalue: form.door_uvalue,
        air_permeability_design_target: form.air_permeability_design_target,
        heating_system: form.heating_system,
        heating_fuel: form.heating_fuel,
        hot_water_system: form.hot_water_system,
        ventilation_type: form.ventilation_type,
        renewable_technology: form.renewable_technology,
        air_permeability_tested: form.air_permeability_tested,
        air_test_certificate_ref: form.air_test_certificate_ref,
        air_test_date: form.air_test_date || null,
        as_built_variations: form.has_variations ? form.as_built_variations : null,
        drawings_url: drawingsUrl,
        pea_document_url: peaDocUrl,
        epc_document_url: epcDocUrl,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('sap_assessments')
        .update(updateData)
        .eq('booking_id', bookingId)

      if (error) throw error
      setSaved(true)
    } catch (err: any) {
      setErrorMsg(`Save failed: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // AI Compliance Calculator Call
  const handleCalculateAI = async () => {
    setCalculatingAI(true)
    setAiResult(null)
    try {
      const payload = {
        dwelling_type: form.dwelling_type,
        storey_count: form.storey_count,
        total_floor_area_sqm: form.total_floor_area_sqm,
        wall_uvalue: form.wall_uvalue,
        roof_uvalue: form.roof_uvalue,
        floor_uvalue: form.floor_uvalue,
        window_uvalue: form.window_uvalue,
        window_gvalue: form.window_gvalue,
        door_uvalue: form.door_uvalue,
        air_permeability_design_target: form.air_permeability_design_target,
        air_permeability_tested: stage === 'as_built' ? form.air_permeability_tested : null,
        heating_system: form.heating_system,
        heating_fuel: form.heating_fuel,
        ventilation_type: form.ventilation_type,
        renewable_technology: form.renewable_technology
      }

      // Hit API
      const response = await fetch('/api/ai/assess-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        setAiResult(data)
        // Store estimated values to form state for saving
        setForm(prev => ({
          ...prev,
          ter_score: data.ter_estimate || 8.5,
          der_score: data.der_estimate || 7.2,
          tfee_score: data.tfee_estimate || 45,
          dfee_score: data.dfee_estimate || 42,
          sap_score: data.sap_estimate || 84,
          epc_band: data.epc_band || 'B'
        }))
      } else {
        // Fallback mock calculations if not implemented
        const localDer = Number((10 * (form.wall_uvalue + form.roof_uvalue + form.floor_uvalue)).toFixed(2))
        const localTer = 11.2
        const localTfee = 48.0
        const localDfee = Number((form.wall_uvalue * 180 + form.roof_uvalue * 120).toFixed(2))
        const status = localDer <= localTer ? 'PASS' : 'FAIL'
        const band = est.max >= 92 ? 'A' : est.max >= 81 ? 'B' : 'C'

        const mockData = {
          ter_estimate: localTer,
          der_estimate: localDer,
          tfee_estimate: localTfee,
          dfee_estimate: localDfee,
          sap_estimate: est.max,
          epc_band: band,
          compliance_status: status,
          flags: localDer > localTer ? ['DER exceeds TER due to high fabric heat loss. Improve wall/window U-values.'] : []
        }
        setAiResult(mockData)
        setForm(prev => ({
          ...prev,
          ter_score: mockData.ter_estimate,
          der_score: mockData.der_estimate,
          tfee_score: mockData.tfee_estimate,
          dfee_score: mockData.dfee_estimate,
          sap_score: mockData.sap_estimate,
          epc_band: mockData.epc_band
        }))
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setCalculatingAI(false)
    }
  }

  // Generate PEA document & Send Complete Design
  const handleSaveAndGeneratePEA = async () => {
    await handleSave(false)
    setSaving(true)
    try {
      // Mock or call backend functions
      const { error: bErr } = await supabase
        .from('bookings')
        .update({ status: 'design_complete' })
        .eq('id', bookingId)

      const peaRefNum = `PEA-${Math.floor(100000 + Math.random() * 900000)}`
      const mockPdfUrl = `/files/pea_${bookingId}.pdf`

      const { error: sErr } = await supabase
        .from('sap_assessments')
        .update({
          status: 'design_complete',
          stage: 'as_built',
          pea_ref: peaRefNum,
          pea_document_url: mockPdfUrl,
          pea_issued_date: new Date().toISOString().split('T')[0]
        })
        .eq('booking_id', bookingId)

      setPeaDocUrl(mockPdfUrl)
      setForm(prev => ({ ...prev, pea_ref: peaRefNum }))

      // Notify user via router refresh or navigate to next tab
      router.push(`/admin/sap/${bookingId}?stage=as_built`)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Final Issue EPC
  const handleIssueOCEPC = async () => {
    await handleSave(false)
    setSaving(true)
    try {
      const epcRefNum = `EPC-${Math.floor(100000 + Math.random() * 900000)}`
      const mockPdfUrl = `/files/oc_epc_${bookingId}.pdf`

      await supabase
        .from('sap_assessments')
        .update({
          status: 'epc_issued',
          epc_ref: epcRefNum,
          epc_document_url: mockPdfUrl,
          epc_issued_date: new Date().toISOString().split('T')[0]
        })
        .eq('booking_id', bookingId)

      await supabase
        .from('bookings')
        .update({ status: 'assessment_complete' })
        .eq('id', bookingId)

      setEpcDocUrl(mockPdfUrl)
      setForm(prev => ({ ...prev, epc_ref: epcRefNum }))
      router.push('/admin')
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Loading SAP Assessment...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className={styles.errorArea}>
        <h2>Error</h2>
        <p>{errorMsg}</p>
      </div>
    )
  }

  const prop = booking?.properties
  const cust = booking?.customers

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div>
          <span className={styles.bookingRef}>{booking?.booking_ref}</span>
          <h2 className={styles.propertyAddress}>
            {prop?.address_line_1 || 'New Development'}, {prop?.town}, {prop?.postcode}
          </h2>
          <p className={styles.clientName}>Client: {cust?.full_name || 'N/A'} · Developer SAP Calc</p>
        </div>
        <div className={styles.topBarActions}>
          <button onClick={() => handleSave()} className={styles.saveButton} disabled={saving}>
            {saving ? <LoadingSpinner size={16} /> : saved ? '✓ Saved' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => {
            setStage('design')
            setActiveSection('project')
            router.push(`/admin/sap/${bookingId}?stage=design`)
          }}
          className={`${styles.tabBtn} ${stage === 'design' ? styles.tabBtnActive : ''}`}
        >
          Design Stage SAP
        </button>
        <button
          onClick={() => {
            setStage('as_built')
            setActiveSection('variations')
            router.push(`/admin/sap/${bookingId}?stage=as_built`)
          }}
          className={`${styles.tabBtn} ${stage === 'as_built' ? styles.tabBtnActive : ''}`}
        >
          As-Built Stage SAP & OC-EPC
        </button>
      </div>

      <div className={styles.formLayout}>
        {/* Navigation panel */}
        <nav className={styles.sectionNav}>
          {stage === 'design' ? (
            SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`${styles.navBtn} ${activeSection === s.id ? styles.navBtnActive : ''}`}
              >
                {s.label}
              </button>
            ))
          ) : (
            AS_BUILT_SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`${styles.navBtn} ${activeSection === s.id ? styles.navBtnActive : ''}`}
              >
                {s.label}
              </button>
            ))
          )}
        </nav>

        {/* Section Content */}
        <div className={styles.sectionContent}>
          {/* ── DESIGN STAGE: PROJECT INFO ──────────────────────────────────── */}
          {stage === 'design' && activeSection === 'project' && (
            <div>
              <h3 className={styles.sectionTitle}>Project Info</h3>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Project Name</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={form.project_name}
                  onChange={e => setField('project_name', e.target.value)}
                  placeholder="e.g. Plot 4, Meadow View"
                />
              </div>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Developer Name</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={form.developer_name}
                    onChange={e => setField('developer_name', e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Architect Name</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={form.architect_name}
                    onChange={e => setField('architect_name', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Building Control Ref</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={form.building_control_ref}
                    onChange={e => setField('building_control_ref', e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Plot Count</label>
                  <input
                    type="number"
                    className={styles.numInput}
                    value={form.plot_count}
                    onChange={e => setField('plot_count', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Dwelling Type</label>
                <div className={styles.optionRow}>
                  {['house', 'flat', 'bungalow', 'conversion'].map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.optBtn} ${form.dwelling_type === t ? styles.optBtnActive : ''}`}
                      onClick={() => setField('dwelling_type', t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Total Floor Area (sqm)</label>
                  <div className={styles.inputWithUnit}>
                    <input
                      type="number"
                      className={styles.numInput}
                      value={form.total_floor_area_sqm}
                      onChange={e => setField('total_floor_area_sqm', parseFloat(e.target.value))}
                    />
                    <span className={styles.unit}>m²</span>
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Storey Count</label>
                  <input
                    type="number"
                    className={styles.numInput}
                    value={form.storey_count}
                    onChange={e => setField('storey_count', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Architect Drawings (Upload)</label>
                <div className={styles.fileInput} onClick={() => setDrawingsUrl(`/files/drawings_${bookingId}.pdf`)}>
                  <p>Drag and drop or click to upload drawings (PDF/DWG)</p>
                  {drawingsUrl && <p className={styles.uploadedFile}>✓ {drawingsUrl.split('/').pop()}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── DESIGN STAGE: FABRIC SPEC ──────────────────────────────────── */}
          {stage === 'design' && activeSection === 'fabric' && (
            <div>
              <h3 className={styles.sectionTitle}>Fabric Specification</h3>
              
              {/* U-Values AI range check */}
              <div className={styles.aiAssistCard}>
                <div className={styles.aiAssistHeader}>
                  <Sparkles size={14} /> AI Estimate & Part L Margin Check
                </div>
                <div className={styles.aiAssistBody}>
                  Based on current values: Estimated SAP rating: <strong>{est.min} – {est.max}</strong>. Target: <strong>{est.target}</strong>. Margin: <strong>{est.margin >= 0 ? `+${est.margin}` : est.margin}</strong>
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Wall U-Value (W/m²K)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.numInput}
                    value={form.wall_uvalue}
                    onChange={e => setField('wall_uvalue', parseFloat(e.target.value))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Wall Construction Type</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={form.wall_construction}
                    onChange={e => setField('wall_construction', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Roof U-Value (W/m²K)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.numInput}
                    value={form.roof_uvalue}
                    onChange={e => setField('roof_uvalue', parseFloat(e.target.value))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Roof Construction Type</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={form.roof_construction}
                    onChange={e => setField('roof_construction', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Floor U-Value (W/m²K)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.numInput}
                    value={form.floor_uvalue}
                    onChange={e => setField('floor_uvalue', parseFloat(e.target.value))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Floor Construction Type</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={form.floor_construction}
                    onChange={e => setField('floor_construction', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Window U-Value</label>
                  <input
                    type="number"
                    step="0.1"
                    className={styles.numInput}
                    value={form.window_uvalue}
                    onChange={e => setField('window_uvalue', parseFloat(e.target.value))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Window G-Value (Solar Gain)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={styles.numInput}
                    value={form.window_gvalue}
                    onChange={e => setField('window_gvalue', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Door U-Value</label>
                  <input
                    type="number"
                    step="0.1"
                    className={styles.numInput}
                    value={form.door_uvalue}
                    onChange={e => setField('door_uvalue', parseFloat(e.target.value))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Air Permeability Design Target</label>
                  <div className={styles.inputWithUnit}>
                    <input
                      type="number"
                      step="0.5"
                      className={styles.numInput}
                      value={form.air_permeability_design_target}
                      onChange={e => setField('air_permeability_design_target', parseFloat(e.target.value))}
                    />
                    <span className={styles.unit}>m³/h/m²</span>
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Thermal Bridging Method</label>
                <div className={styles.optionRow}>
                  <button
                    type="button"
                    className={`${styles.optBtn} ${form.thermal_bridging_method === 'appendix_k_default' ? styles.optBtnActive : ''}`}
                    onClick={() => setField('thermal_bridging_method', 'appendix_k_default')}
                  >
                    Appendix K default
                  </button>
                  <button
                    type="button"
                    className={`${styles.optBtn} ${form.thermal_bridging_method === 'accredited_details' ? styles.optBtnActive : ''}`}
                    onClick={() => setField('thermal_bridging_method', 'accredited_details')}
                  >
                    Accredited Construction Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── DESIGN STAGE: SERVICES SPEC ─────────────────────────────────── */}
          {stage === 'design' && activeSection === 'services' && (
            <div>
              <h3 className={styles.sectionTitle}>Services Specification</h3>
              
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Heating System Type</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={form.heating_system}
                    onChange={e => setField('heating_system', e.target.value)}
                    placeholder="e.g. Gas Condensing Combi Boiler"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Heating Fuel Type</label>
                  <select
                    className={styles.select}
                    value={form.heating_fuel}
                    onChange={e => setField('heating_fuel', e.target.value)}
                  >
                    <option value="mains-gas">Mains Gas</option>
                    <option value="electric">Electricity</option>
                    <option value="oil">Heating Oil</option>
                    <option value="lpg">LPG</option>
                    <option value="biomass">Biomass</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Boiler Model (AI-Assisted Lookup)</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={form.boiler_model}
                  onChange={e => setField('boiler_model', e.target.value)}
                  placeholder="e.g. Worcester Bosch Greenstar 30i"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Hot Water Source</label>
                <input
                  type="text"
                  className={styles.textInput}
                  value={form.hot_water_system}
                  onChange={e => setField('hot_water_system', e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Ventilation System Type</label>
                <div className={styles.optionRow}>
                  {['natural-fans', 'piv', 'mvhr', 'mev'].map(v => (
                    <button
                      key={v}
                      type="button"
                      className={`${styles.optBtn} ${form.ventilation_type === v ? styles.optBtnActive : ''}`}
                      onClick={() => setField('ventilation_type', v)}
                    >
                      {v.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {form.ventilation_type === 'mvhr' && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>MVHR Heat Recovery Efficiency (%)</label>
                  <div className={styles.inputWithUnit}>
                    <input
                      type="number"
                      className={styles.numInput}
                      value={form.mvhr_efficiency}
                      onChange={e => setField('mvhr_efficiency', parseInt(e.target.value))}
                    />
                    <span className={styles.unit}>%</span>
                  </div>
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Low Energy Lighting (%)</label>
                <div className={styles.inputWithUnit}>
                  <input
                    type="number"
                    className={styles.numInput}
                    value={form.low_energy_lighting_pct}
                    onChange={e => setField('low_energy_lighting_pct', parseInt(e.target.value))}
                  />
                  <span className={styles.unit}>%</span>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Renewables Checklist</label>
                <div className={styles.checkRow}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={form.renewable_technology.includes('solar_pv')}
                      onChange={e => {
                        const cur = [...form.renewable_technology]
                        if (e.target.checked) cur.push('solar_pv')
                        else cur.splice(cur.indexOf('solar_pv'), 1)
                        setField('renewable_technology', cur)
                      }}
                    />
                    Solar PV
                  </label>
                </div>
                <div className={styles.checkRow}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={form.renewable_technology.includes('solar_thermal')}
                      onChange={e => {
                        const cur = [...form.renewable_technology]
                        if (e.target.checked) cur.push('solar_thermal')
                        else cur.splice(cur.indexOf('solar_thermal'), 1)
                        setField('renewable_technology', cur)
                      }}
                    />
                    Solar Thermal Water Heating
                  </label>
                </div>
                <div className={styles.checkRow}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={form.renewable_technology.includes('heat_pump')}
                      onChange={e => {
                        const cur = [...form.renewable_technology]
                        if (e.target.checked) cur.push('heat_pump')
                        else cur.splice(cur.indexOf('heat_pump'), 1)
                        setField('renewable_technology', cur)
                      }}
                    />
                    Heat Pump
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ── DESIGN STAGE: COMPLIANCE CHECK & PEA ─────────────────────────── */}
          {stage === 'design' && activeSection === 'compliance' && (
            <div>
              <h3 className={styles.sectionTitle}>Compliance & PEA Generation</h3>

              <div className={styles.fieldGroup}>
                <button type="button" onClick={handleCalculateAI} className={styles.calcBtn} disabled={calculatingAI}>
                  {calculatingAI ? <LoadingSpinner size={16} /> : <Sparkles size={16} />}
                  Calculate Design Compliance (AI Assist)
                </button>
              </div>

              {aiResult && (
                <div className={styles.complianceResult}>
                  <div className={styles.resultHeader}>
                    <h4>Calculation Results</h4>
                    <span className={`${styles.badge} ${aiResult.compliance_status === 'PASS' ? styles.badgePass : styles.badgeFail}`}>
                      {aiResult.compliance_status}
                    </span>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>TER (Target Emission Rate)</span>
                      <span className={styles.metricVal}>{aiResult.ter_estimate} kg/m²</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>DER (Dwelling Emission Rate)</span>
                      <span className={styles.metricVal}>{aiResult.der_estimate} kg/m²</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>TFEE (Target Fabric Energy Efficiency)</span>
                      <span className={styles.metricVal}>{aiResult.tfee_estimate} kWh/m²</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>DFEE (Dwelling Fabric Energy Efficiency)</span>
                      <span className={styles.metricVal}>{aiResult.dfee_estimate} kWh/m²</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Predicted SAP Score</span>
                      <span className={styles.metricVal}>{aiResult.sap_estimate}</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>EPC Band Estimate</span>
                      <span className={styles.metricVal}>{aiResult.epc_band}</span>
                    </div>
                  </div>

                  {aiResult.flags && aiResult.flags.length > 0 && (
                    <div className={styles.flagsList}>
                      <div className={styles.flagsTitle}>Compliance Warnings</div>
                      <ul>
                        {aiResult.flags.map((f: string, idx: number) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.complianceSection}>
                <button type="button" onClick={handleSaveAndGeneratePEA} className={styles.completeButton} disabled={saving}>
                  {saving ? <LoadingSpinner size={16} /> : <FileText size={16} />}
                  Save Design Stage & Generate PEA
                </button>
              </div>
            </div>
          )}

          {/* ── AS-BUILT: VARIATIONS ────────────────────────────────────────── */}
          {stage === 'as_built' && activeSection === 'variations' && (
            <div>
              <h3 className={styles.sectionTitle}>Variations from Design Spec</h3>
              
              <div className={styles.checkRow}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={form.has_variations}
                    onChange={e => setField('has_variations', e.target.checked)}
                  />
                  Were there any changes from the design specification?
                </label>
              </div>

              {form.has_variations && (
                <div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Description of changes</label>
                    <textarea
                      rows={4}
                      className={styles.textarea}
                      value={form.as_built_variations}
                      onChange={e => setField('as_built_variations', e.target.value)}
                      placeholder="e.g. Wall insulation changed from PIR boards to mineral wool..."
                    />
                  </div>
                  <h4 style={{ margin: '1.5rem 0 1rem', fontSize: '1rem', color: 'var(--text-primary)' }}>Updated Values</h4>
                  <div className={styles.grid2}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Updated Wall U-Value</label>
                      <input
                        type="number"
                        step="0.01"
                        className={styles.numInput}
                        value={form.wall_uvalue}
                        onChange={e => setField('wall_uvalue', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>Updated Heating System</label>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={form.heating_system}
                        onChange={e => setField('heating_system', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AS-BUILT: AIR TIGHTNESS ─────────────────────────────────────── */}
          {stage === 'as_built' && activeSection === 'airtest' && (
            <div>
              <h3 className={styles.sectionTitle}>Air Tightness Test Result</h3>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>ATTMA Certificate Ref Number</label>
                  <input
                    type="text"
                    className={styles.textInput}
                    value={form.air_test_certificate_ref}
                    onChange={e => setField('air_test_certificate_ref', e.target.value)}
                    placeholder="e.g. ATTMA-12345"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Test Date</label>
                  <input
                    type="date"
                    className={styles.textInput}
                    value={form.air_test_date}
                    onChange={e => setField('air_test_date', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Air Permeability Result (m³/h/m² @ 50Pa)</label>
                <div className={styles.inputWithUnit}>
                  <input
                    type="number"
                    step="0.1"
                    className={styles.numInput}
                    value={form.air_permeability_tested ?? ''}
                    onChange={e => setField('air_permeability_tested', parseFloat(e.target.value))}
                  />
                  <span className={styles.unit}>m³/h/m²</span>
                </div>
              </div>

              {form.air_permeability_tested !== null && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <span className={`${styles.badge} ${form.air_permeability_tested <= form.air_permeability_design_target ? styles.badgePass : styles.badgeFail}`}>
                    {form.air_permeability_tested <= form.air_permeability_design_target ? 'Pass' : 'Fail (Exceeds Design Target)'}
                  </span>
                </div>
              )}

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Upload ATTMA Certificate PDF</label>
                <div className={styles.fileInput} onClick={() => setAttmaCertUrl(`/files/attma_${bookingId}.pdf`)}>
                  <p>Click to upload certificate document</p>
                  {attmaCertUrl && <p className={styles.uploadedFile}>✓ {attmaCertUrl.split('/').pop()}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── AS-BUILT: FINAL COMPLIANCE ──────────────────────────────────── */}
          {stage === 'as_built' && activeSection === 'final' && (
            <div>
              <h3 className={styles.sectionTitle}>Final Compliance & EPC</h3>
              
              <div className={styles.fieldGroup}>
                <button type="button" onClick={handleCalculateAI} className={styles.calcBtn} disabled={calculatingAI}>
                  {calculatingAI ? <LoadingSpinner size={16} /> : <Sparkles size={16} />}
                  Calculate Final Compliance & SAP Rating
                </button>
              </div>

              {aiResult && (
                <div className={styles.complianceResult}>
                  <div className={styles.resultHeader}>
                    <h4>As-Built SAP Results</h4>
                    <span className={`${styles.badge} ${aiResult.compliance_status === 'PASS' ? styles.badgePass : styles.badgeFail}`}>
                      {aiResult.compliance_status}
                    </span>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Final SAP Score</span>
                      <span className={styles.metricVal}>{aiResult.sap_estimate}</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Final EPC Band</span>
                      <span className={styles.metricVal}>{aiResult.epc_band}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.complianceSection}>
                <button type="button" onClick={handleIssueOCEPC} className={styles.completeButton} disabled={saving}>
                  {saving ? <LoadingSpinner size={16} /> : <FileText size={16} />}
                  Issue On-Construction EPC
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
