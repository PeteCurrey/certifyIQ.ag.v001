'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Info } from 'lucide-react'
import styles from './assess.module.css'

// ── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'overview',    label: 'Property Overview' },
  { id: 'walls',       label: 'Walls & Insulation' },
  { id: 'roof',        label: 'Roof / Loft' },
  { id: 'floor',       label: 'Floor' },
  { id: 'windows',     label: 'Windows & Glazing' },
  { id: 'heating',     label: 'Heating System' },
  { id: 'hotwater',    label: 'Hot Water' },
  { id: 'renewables',  label: 'Renewables' },
  { id: 'notes',       label: 'Notes & Review' },
]

// ── Option helpers ─────────────────────────────────────────────────────────
function OptionGroup({
  label, options, value, onChange, name
}: {
  label: string
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  name: string
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.optionRow}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`${styles.optBtn} ${value === opt.value ? styles.optBtnActive : ''}`}
            onClick={() => onChange(opt.value)}
            id={`${name}-${opt.value.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function NumberInput({ label, value, onChange, unit, min, max, step }: {
  label: string; value: number | null; onChange: (v: number) => void;
  unit?: string; min?: number; max?: number; step?: number
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.inputWithUnit}>
        <input
          type="number"
          className={styles.numInput}
          value={value ?? ''}
          onChange={e => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step ?? 0.1}
        />
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
    </div>
  )
}

// ── Main Assessment Form ──────────────────────────────────────────────────────
export default function LiveAssessmentPage() {
  const params = useParams()
  const bookingId = params.bookingId as string
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [booking, setBooking] = useState<any>(null)
  const [assessment, setAssessment] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('overview')

  // Form state — all RdSAP 10 data fields
  const [form, setForm] = useState({
    // Property Overview
    property_type: '',
    property_age_band: '',
    detachment_type: '',
    storey_count: null as number | null,
    floor_area_ground: null as number | null,
    floor_area_first: null as number | null,
    floor_area_second: null as number | null,
    // Walls
    wall_type: '',
    wall_insulation: '',
    wall_insulation_thickness_mm: null as number | null,
    // Roof
    roof_type: '',
    roof_insulation_location: '',
    roof_insulation_thickness_mm: null as number | null,
    // Floor
    floor_type: '',
    floor_insulation: '',
    // Windows
    window_type: '',
    window_area_percentage: '',
    // Heating
    main_heat_type: '',
    main_heat_fuel: '',
    boiler_type: '',
    boiler_efficiency_band: '',
    boiler_age_band: '',
    secondary_heat_type: '',
    secondary_heat_fuel: '',
    // Hot Water
    hot_water_source: '',
    solar_hw_panel: false,
    solar_hw_panel_area_sqm: null as number | null,
    // Renewables
    solar_pv: false,
    solar_pv_kwp: null as number | null,
    solar_pv_facing: '',
    wind_turbine: false,
    wind_turbine_kw: null as number | null,
    // Notes
    assessor_notes: '',
    low_energy_lighting_pct: 0,
    ventilation_type: '',
  })

  const setField = useCallback((key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  // Load booking and assessment data
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

        const { data: assessmentData } = await supabase
          .from('assessments')
          .select('*')
          .eq('booking_id', bookingId)
          .single()

        if (assessmentData) {
          setAssessment(assessmentData)
          // Populate form with existing assessment data
          setForm(prev => ({
            ...prev,
            property_type: assessmentData.property_type || '',
            property_age_band: assessmentData.property_age_band || '',
            detachment_type: assessmentData.detachment_type || '',
            storey_count: assessmentData.storey_count,
            floor_area_ground: assessmentData.floor_area_ground,
            floor_area_first: assessmentData.floor_area_first,
            floor_area_second: assessmentData.floor_area_second,
            wall_type: assessmentData.wall_type || '',
            wall_insulation: assessmentData.wall_insulation || '',
            wall_insulation_thickness_mm: assessmentData.wall_insulation_thickness_mm,
            roof_type: assessmentData.roof_type || '',
            roof_insulation_location: assessmentData.roof_insulation_location || '',
            roof_insulation_thickness_mm: assessmentData.roof_insulation_thickness_mm,
            floor_type: assessmentData.floor_type || '',
            floor_insulation: assessmentData.floor_insulation || '',
            window_type: assessmentData.window_type || '',
            window_area_percentage: assessmentData.window_area_percentage || '',
            main_heat_type: assessmentData.main_heat_type || '',
            main_heat_fuel: assessmentData.main_heat_fuel || '',
            boiler_type: assessmentData.boiler_type || '',
            boiler_efficiency_band: assessmentData.boiler_efficiency_band || '',
            boiler_age_band: assessmentData.boiler_age_band || '',
            secondary_heat_type: assessmentData.secondary_heat_type || '',
            secondary_heat_fuel: assessmentData.secondary_heat_fuel || '',
            hot_water_source: assessmentData.hot_water_source || '',
            solar_hw_panel: assessmentData.solar_hw_panel || false,
            solar_hw_panel_area_sqm: assessmentData.solar_hw_panel_area_sqm,
            solar_pv: assessmentData.solar_pv || false,
            solar_pv_kwp: assessmentData.solar_pv_kwp,
            solar_pv_facing: assessmentData.solar_pv_facing || '',
            wind_turbine: assessmentData.wind_turbine || false,
            wind_turbine_kw: assessmentData.wind_turbine_kw,
            assessor_notes: assessmentData.assessor_notes || '',
            low_energy_lighting_pct: assessmentData.low_energy_lighting_pct || 0,
            ventilation_type: assessmentData.ventilation_type || '',
          }))
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load assessment')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [bookingId])

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!saved && !saving && assessment) {
        handleSave(false)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [form, saved, saving, assessment])

  const handleSave = async (showConfirm = true) => {
    setSaving(true)
    try {
      const totalArea = (form.floor_area_ground || 0) + (form.floor_area_first || 0) + (form.floor_area_second || 0)

      const updateData = {
        ...form,
        floor_area_total: totalArea,
        status: 'in_progress',
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('assessments')
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

  const handleCompleteAssessment = async () => {
    await handleSave(false)
    
    setSaving(true)
    try {
      const response = await fetch('/api/assessments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      })
      if (!response.ok) throw new Error('Failed to complete assessment')
      router.push('/admin')
    } catch (err: any) {
      setErrorMsg(`Complete failed: ${err.message}`)
      setSaving(false)
    }
  }

  const handleExportData = () => {
    const exportData = {
      ...form,
      booking_ref: booking?.booking_ref,
      property_address: {
        address_line_1: booking?.properties?.address_line_1,
        address_line_2: booking?.properties?.address_line_2,
        town: booking?.properties?.town,
        county: booking?.properties?.county,
        postcode: booking?.properties?.postcode,
      },
      client: {
        name: booking?.customers?.full_name,
        email: booking?.customers?.email,
        phone: booking?.customers?.phone,
      },
      assessor: {
        name: booking?.assessors?.full_name,
        email: booking?.assessors?.email,
        accreditation_body: booking?.assessors?.accreditation_body || 'elmhurst',
        accreditation_number: booking?.assessors?.accreditation_number || 'EES[PLACEHOLDER]',
      }
    }

    const jsonStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rdsap_export_${booking?.booking_ref || bookingId}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Loading assessment data...</p>
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
      {/* Top Info Bar */}
      <div className={styles.topBar}>
        <div className={styles.jobInfo}>
          <span className={styles.bookingRef}>{booking?.booking_ref}</span>
          <h2 className={styles.propertyAddress}>
            {prop?.address_line_1}, {prop?.town}, {prop?.postcode}
          </h2>
          <p className={styles.clientName}>Client: {cust?.full_name} · {cust?.phone}</p>
        </div>
        <div className={styles.topBarActions}>
          <button
            onClick={() => handleSave()}
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? <LoadingSpinner size={16} /> : saved ? '✓ Saved' : 'Save Draft'}
          </button>
          <button
            onClick={handleCompleteAssessment}
            className={styles.completeButton}
          >
            Mark Complete →
          </button>
        </div>
      </div>

      <div className={styles.formLayout}>
        {/* Section Navigation */}
        <nav className={styles.sectionNav}>
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`${styles.navBtn} ${activeSection === sec.id ? styles.navBtnActive : ''}`}
            >
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Section Content */}
        <div className={styles.sectionContent}>
          {/* ── PROPERTY OVERVIEW ─────────────────────────────────────── */}
          {activeSection === 'overview' && (
            <div>
              <h3 className={styles.sectionTitle}>Property Overview</h3>
              <OptionGroup
                name="property_type"
                label="Property Type"
                value={form.property_type}
                onChange={v => setField('property_type', v)}
                options={[
                  { label: 'Detached', value: 'detached' },
                  { label: 'Semi-Detached', value: 'semi-detached' },
                  { label: 'Terraced', value: 'terraced' },
                  { label: 'Flat', value: 'flat' },
                  { label: 'Bungalow', value: 'bungalow' },
                ]}
              />
              <OptionGroup
                name="property_age_band"
                label="Age Band (Construction Period)"
                value={form.property_age_band}
                onChange={v => setField('property_age_band', v)}
                options={[
                  { label: 'Pre-1900', value: 'A' },
                  { label: '1900-1929', value: 'B' },
                  { label: '1930-1949', value: 'C' },
                  { label: '1950-1966', value: 'D' },
                  { label: '1967-1975', value: 'E' },
                  { label: '1976-1982', value: 'F' },
                  { label: '1983-1990', value: 'G' },
                  { label: '1991-1995', value: 'H' },
                  { label: '1996-2002', value: 'I' },
                  { label: '2003-2006', value: 'J' },
                  { label: '2007-2011', value: 'K' },
                  { label: '2012+', value: 'L' },
                ]}
              />
              <OptionGroup
                name="detachment_type"
                label="Detachment"
                value={form.detachment_type}
                onChange={v => setField('detachment_type', v)}
                options={[
                  { label: 'Detached', value: 'detached' },
                  { label: 'Semi-Detached', value: 'semi-detached' },
                  { label: 'Mid-Terrace', value: 'mid-terrace' },
                  { label: 'End-Terrace', value: 'end-terrace' },
                  { label: 'Enclosed Mid-Terrace', value: 'enclosed-mid-terrace' },
                ]}
              />
              <NumberInput
                label="Number of Storeys"
                value={form.storey_count}
                onChange={v => setField('storey_count', v)}
                min={1} max={5} step={1}
              />
              <div className={styles.areaGrid}>
                <NumberInput
                  label="Ground Floor Area (m²)"
                  value={form.floor_area_ground}
                  onChange={v => setField('floor_area_ground', v)}
                  unit="m²" min={0}
                />
                <NumberInput
                  label="First Floor Area (m²)"
                  value={form.floor_area_first}
                  onChange={v => setField('floor_area_first', v)}
                  unit="m²" min={0}
                />
                <NumberInput
                  label="Second Floor Area (m²)"
                  value={form.floor_area_second}
                  onChange={v => setField('floor_area_second', v)}
                  unit="m²" min={0}
                />
              </div>
              <div className={styles.totalArea}>
                Total Floor Area: <strong>{(
                  (form.floor_area_ground || 0) + (form.floor_area_first || 0) + (form.floor_area_second || 0)
                ).toFixed(1)} m²</strong>
              </div>
            </div>
          )}

          {/* ── WALLS ─────────────────────────────────────────────────── */}
          {activeSection === 'walls' && (
            <div>
              <h3 className={styles.sectionTitle}>Walls & Insulation</h3>
              <OptionGroup
                name="wall_type"
                label="Wall Construction Type"
                value={form.wall_type}
                onChange={v => setField('wall_type', v)}
                options={[
                  { label: 'Solid Brick', value: 'solid-brick' },
                  { label: 'Solid Stone', value: 'solid-stone' },
                  { label: 'Cavity (Unfilled)', value: 'cavity-unfilled' },
                  { label: 'Cavity (Filled)', value: 'cavity-filled' },
                  { label: 'Timber Frame', value: 'timber-frame' },
                  { label: 'Cob / Clad / Other', value: 'other' },
                ]}
              />
              <OptionGroup
                name="wall_insulation"
                label="Wall Insulation Status"
                value={form.wall_insulation}
                onChange={v => setField('wall_insulation', v)}
                options={[
                  { label: 'No Insulation', value: 'none' },
                  { label: 'Cavity Filled', value: 'cavity-filled' },
                  { label: 'Internal Insulation', value: 'internal' },
                  { label: 'External Insulation', value: 'external' },
                  { label: 'Unknown', value: 'unknown' },
                ]}
              />
              {(form.wall_insulation === 'internal' || form.wall_insulation === 'external' || form.wall_insulation === 'cavity-filled') && (
                <NumberInput
                  label="Insulation Thickness (mm)"
                  value={form.wall_insulation_thickness_mm}
                  onChange={v => setField('wall_insulation_thickness_mm', v)}
                  unit="mm" min={0} max={600} step={10}
                />
              )}
            </div>
          )}

          {/* ── ROOF ────────────────────────────────────────────────────── */}
          {activeSection === 'roof' && (
            <div>
              <h3 className={styles.sectionTitle}>Roof / Loft</h3>
              <OptionGroup
                name="roof_type"
                label="Roof Type"
                value={form.roof_type}
                onChange={v => setField('roof_type', v)}
                options={[
                  { label: 'Pitched (Accessible Loft)', value: 'pitched-accessible' },
                  { label: 'Pitched (Inaccessible)', value: 'pitched-inaccessible' },
                  { label: 'Flat Roof', value: 'flat' },
                  { label: 'Room in Roof', value: 'room-in-roof' },
                ]}
              />
              <OptionGroup
                name="roof_insulation_location"
                label="Insulation Location"
                value={form.roof_insulation_location}
                onChange={v => setField('roof_insulation_location', v)}
                options={[
                  { label: 'None', value: 'none' },
                  { label: 'At Joists (Flat Ceiling)', value: 'at-joists' },
                  { label: 'At Rafters (Sloped Ceiling)', value: 'at-rafters' },
                  { label: 'Both Rafters & Joists', value: 'both' },
                  { label: 'Flat Roof Insulated', value: 'flat-roof' },
                ]}
              />
              <NumberInput
                label="Insulation Thickness (mm)"
                value={form.roof_insulation_thickness_mm}
                onChange={v => setField('roof_insulation_thickness_mm', v)}
                unit="mm" min={0} max={600} step={25}
              />
            </div>
          )}

          {/* ── FLOOR ──────────────────────────────────────────────────── */}
          {activeSection === 'floor' && (
            <div>
              <h3 className={styles.sectionTitle}>Floor</h3>
              <OptionGroup
                name="floor_type"
                label="Ground Floor Construction"
                value={form.floor_type}
                onChange={v => setField('floor_type', v)}
                options={[
                  { label: 'Suspended Timber', value: 'suspended-timber' },
                  { label: 'Solid Concrete', value: 'solid-concrete' },
                  { label: 'Solid with Insulation', value: 'solid-insulated' },
                  { label: 'Suspended Timber + Insulation', value: 'suspended-insulated' },
                ]}
              />
              <OptionGroup
                name="floor_insulation"
                label="Floor Insulation"
                value={form.floor_insulation}
                onChange={v => setField('floor_insulation', v)}
                options={[
                  { label: 'No Insulation', value: 'none' },
                  { label: 'Insulated', value: 'insulated' },
                  { label: 'Unknown', value: 'unknown' },
                ]}
              />
            </div>
          )}

          {/* ── WINDOWS ──────────────────────────────────────────────── */}
          {activeSection === 'windows' && (
            <div>
              <h3 className={styles.sectionTitle}>Windows & Glazing</h3>
              <OptionGroup
                name="window_type"
                label="Glazing Type (Majority)"
                value={form.window_type}
                onChange={v => setField('window_type', v)}
                options={[
                  { label: 'Single', value: 'single' },
                  { label: 'Double (Pre-2002)', value: 'double-pre2002' },
                  { label: 'Double (Post-2002)', value: 'double-post2002' },
                  { label: 'Triple', value: 'triple' },
                  { label: 'Secondary Glazing', value: 'secondary' },
                ]}
              />
              <OptionGroup
                name="window_area_percentage"
                label="Window Area (% of Total Floor Area)"
                value={form.window_area_percentage}
                onChange={v => setField('window_area_percentage', v)}
                options={[
                  { label: 'Up to 20%', value: 'up-to-20' },
                  { label: '21–30%', value: '21-30' },
                  { label: '31–40%', value: '31-40' },
                  { label: 'More than 40%', value: '40+' },
                ]}
              />
            </div>
          )}

          {/* ── HEATING ──────────────────────────────────────────────── */}
          {activeSection === 'heating' && (
            <div>
              <h3 className={styles.sectionTitle}>Heating System</h3>
              <OptionGroup
                name="main_heat_type"
                label="Main Heat Emitter"
                value={form.main_heat_type}
                onChange={v => setField('main_heat_type', v)}
                options={[
                  { label: 'Radiators (Wet)', value: 'radiators' },
                  { label: 'Underfloor (Wet)', value: 'underfloor-wet' },
                  { label: 'Underfloor (Electric)', value: 'underfloor-electric' },
                  { label: 'Storage Heaters', value: 'storage-heaters' },
                  { label: 'Fan Coil Units', value: 'fan-coil' },
                  { label: 'Warm Air', value: 'warm-air' },
                ]}
              />
              <OptionGroup
                name="main_heat_fuel"
                label="Main Heating Fuel"
                value={form.main_heat_fuel}
                onChange={v => setField('main_heat_fuel', v)}
                options={[
                  { label: 'Mains Gas', value: 'mains-gas' },
                  { label: 'Oil', value: 'oil' },
                  { label: 'Bottled LPG', value: 'lpg' },
                  { label: 'Standard Electric', value: 'electric' },
                  { label: 'Heat Pump (ASHP)', value: 'heat-pump-air' },
                  { label: 'Heat Pump (GSHP)', value: 'heat-pump-ground' },
                  { label: 'Biomass', value: 'biomass' },
                  { label: 'Community Heat', value: 'community' },
                ]}
              />
              {['mains-gas', 'oil', 'lpg'].includes(form.main_heat_fuel) && (
                <>
                  <OptionGroup
                    name="boiler_type"
                    label="Boiler Type"
                    value={form.boiler_type}
                    onChange={v => setField('boiler_type', v)}
                    options={[
                      { label: 'Regular (Open Flue)', value: 'regular-open' },
                      { label: 'Regular (Room Sealed)', value: 'regular-sealed' },
                      { label: 'Combi Boiler', value: 'combi' },
                      { label: 'Back Boiler', value: 'back-boiler' },
                    ]}
                  />
                  <OptionGroup
                    name="boiler_efficiency_band"
                    label="Boiler Efficiency Band (SEDBUK)"
                    value={form.boiler_efficiency_band}
                    onChange={v => setField('boiler_efficiency_band', v)}
                    options={[
                      { label: 'A (>= 90%)', value: 'A' },
                      { label: 'B (86–90%)', value: 'B' },
                      { label: 'C (82–86%)', value: 'C' },
                      { label: 'D (78–82%)', value: 'D' },
                      { label: 'E (74–78%)', value: 'E' },
                      { label: 'F (70–74%)', value: 'F' },
                      { label: 'G (< 70%)', value: 'G' },
                    ]}
                  />
                  <OptionGroup
                    name="boiler_age_band"
                    label="Boiler Age Band"
                    value={form.boiler_age_band}
                    onChange={v => setField('boiler_age_band', v)}
                    options={[
                      { label: 'Pre-1985', value: 'pre-1985' },
                      { label: '1985–1998', value: '1985-1998' },
                      { label: '1998–2005', value: '1998-2005' },
                      { label: '2005+', value: '2005+' },
                    ]}
                  />
                </>
              )}
              <OptionGroup
                name="secondary_heat_type"
                label="Secondary Heating (if any)"
                value={form.secondary_heat_type}
                onChange={v => setField('secondary_heat_type', v)}
                options={[
                  { label: 'None', value: 'none' },
                  { label: 'Room Heater', value: 'room-heater' },
                  { label: 'Electric Heater', value: 'electric-heater' },
                  { label: 'Solid Fuel Stove', value: 'solid-fuel-stove' },
                ]}
              />
            </div>
          )}

          {/* ── HOT WATER ────────────────────────────────────────────── */}
          {activeSection === 'hotwater' && (
            <div>
              <h3 className={styles.sectionTitle}>Hot Water</h3>
              <OptionGroup
                name="hot_water_source"
                label="Hot Water Source"
                value={form.hot_water_source}
                onChange={v => setField('hot_water_source', v)}
                options={[
                  { label: 'From Main Boiler', value: 'from-boiler' },
                  { label: 'Immersion Heater', value: 'immersion' },
                  { label: 'Combi Boiler', value: 'combi-boiler' },
                  { label: 'Heat Pump Cylinder', value: 'heat-pump' },
                  { label: 'Solar + Cylinder', value: 'solar-cylinder' },
                ]}
              />
              <div className={styles.checkRow}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={form.solar_hw_panel}
                    onChange={e => setField('solar_hw_panel', e.target.checked)}
                  />
                  <span>Solar Thermal Panels Installed</span>
                </label>
              </div>
              {form.solar_hw_panel && (
                <NumberInput
                  label="Solar Panel Area (m²)"
                  value={form.solar_hw_panel_area_sqm}
                  onChange={v => setField('solar_hw_panel_area_sqm', v)}
                  unit="m²" min={0} max={100}
                />
              )}
            </div>
          )}

          {/* ── RENEWABLES ───────────────────────────────────────────── */}
          {activeSection === 'renewables' && (
            <div>
              <h3 className={styles.sectionTitle}>Renewables & Low Carbon Technologies</h3>
              <div className={styles.checkRow}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={form.solar_pv}
                    onChange={e => setField('solar_pv', e.target.checked)}
                  />
                  <span>Solar Photovoltaic (PV) System Installed</span>
                </label>
              </div>
              {form.solar_pv && (
                <>
                  <NumberInput
                    label="PV System Peak Power (kWp)"
                    value={form.solar_pv_kwp}
                    onChange={v => setField('solar_pv_kwp', v)}
                    unit="kWp" min={0} max={50} step={0.5}
                  />
                  <OptionGroup
                    name="solar_pv_facing"
                    label="PV Panel Orientation"
                    value={form.solar_pv_facing}
                    onChange={v => setField('solar_pv_facing', v)}
                    options={[
                      { label: 'South', value: 'south' },
                      { label: 'South-East', value: 'south-east' },
                      { label: 'South-West', value: 'south-west' },
                      { label: 'East', value: 'east' },
                      { label: 'West', value: 'west' },
                      { label: 'North', value: 'north' },
                    ]}
                  />
                </>
              )}
              <div className={styles.checkRow} style={{ marginTop: '1.5rem' }}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={form.wind_turbine}
                    onChange={e => setField('wind_turbine', e.target.checked)}
                  />
                  <span>Wind Turbine Installed</span>
                </label>
              </div>
              {form.wind_turbine && (
                <NumberInput
                  label="Wind Turbine Rated Power (kW)"
                  value={form.wind_turbine_kw}
                  onChange={v => setField('wind_turbine_kw', v)}
                  unit="kW" min={0} max={50} step={0.5}
                />
              )}
              <OptionGroup
                name="ventilation_type"
                label="Ventilation System"
                value={form.ventilation_type}
                onChange={v => setField('ventilation_type', v)}
                options={[
                  { label: 'Natural (Draughty)', value: 'natural-draughty' },
                  { label: 'Natural (Intermittent Fans)', value: 'natural-fans' },
                  { label: 'Positive Input (PIV)', value: 'piv' },
                  { label: 'MVHR', value: 'mvhr' },
                  { label: 'MEV', value: 'mev' },
                ]}
              />
            </div>
          )}

          {/* ── NOTES & REVIEW ───────────────────────────────────────── */}
          {activeSection === 'notes' && (
            <div>
              <h3 className={styles.sectionTitle}>Assessor Notes & Review</h3>
              <NumberInput
                label="Low Energy Lighting (%)"
                value={form.low_energy_lighting_pct}
                onChange={v => setField('low_energy_lighting_pct', Math.round(v))}
                unit="%" min={0} max={100} step={10}
              />
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Assessor Notes</label>
                <textarea
                  className={styles.textarea}
                  rows={8}
                  placeholder="Record any site-specific observations, access issues, data anomalies, or items that may affect the rating calculation..."
                  value={form.assessor_notes}
                  onChange={e => setField('assessor_notes', e.target.value)}
                />
              </div>

              <div className={styles.reviewSummary}>
                <h4>Data Summary</h4>
                <div className={styles.summaryGrid}>
                  {[
                    { label: 'Property Type', val: form.property_type },
                    { label: 'Age Band', val: form.property_age_band },
                    { label: 'Total Floor Area', val: `${((form.floor_area_ground || 0) + (form.floor_area_first || 0) + (form.floor_area_second || 0)).toFixed(1)}m²` },
                    { label: 'Wall Type', val: form.wall_type },
                    { label: 'Wall Insulation', val: form.wall_insulation },
                    { label: 'Roof Insulation', val: `${form.roof_insulation_thickness_mm || 0}mm` },
                    { label: 'Glazing', val: form.window_type },
                    { label: 'Main Heating Fuel', val: form.main_heat_fuel },
                    { label: 'Solar PV', val: form.solar_pv ? `${form.solar_pv_kwp}kWp` : 'None' },
                    { label: 'Solar Hot Water', val: form.solar_hw_panel ? `${form.solar_hw_panel_area_sqm}m²` : 'None' },
                  ].map(item => (
                    <div key={item.label} className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>{item.label}</span>
                      <span className={styles.summaryVal}>{item.val || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCompleteAssessment}
                  className={styles.completeBtnLarge}
                  style={{ flex: 1, minWidth: '200px' }}
                >
                  Finalise Assessment & Mark Complete
                </button>
                
                <button
                  type="button"
                  onClick={handleExportData}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    backgroundColor: '#1E2D4A',
                    color: '#E8F4FF',
                    border: '1.5px solid #1E2D4A',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#9BFF59'
                    e.currentTarget.style.color = '#9BFF59'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1E2D4A'
                    e.currentTarget.style.color = '#E8F4FF'
                  }}
                >
                  📥 Export RdSAP 10 Data
                </button>
              </div>

              {/* Elmhurst lodgement info card */}
              <div style={{
                marginTop: '1.5rem',
                background: '#0F1628',
                border: '1px solid #1E2D4A',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
              }}>
                <div style={{ color: '#9BFF59', flexShrink: 0, marginTop: '2px' }}>
                  <Info size={20} />
                </div>
                <div>
                  <h5 style={{
                    fontFamily: 'var(--font-headings, Syne, sans-serif)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#E8F4FF',
                    margin: '0 0 0.25rem 0',
                    lineHeight: 1.2,
                  }}>
                    Elmhurst lodgement
                  </h5>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#8BA3BF',
                    margin: '0 0 0.75rem 0',
                    lineHeight: 1.4,
                    textAlign: 'left',
                  }}>
                    Lodge this assessment via your Elmhurst member portal at{' '}
                    <a href="https://www.elmhurstenergy.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: '#9BFF59', textDecoration: 'underline' }}>elmhurstenergy.co.uk</a>{' '}
                    or the RdSAP Go mobile app. Your Elmhurst accreditation number is auto-included in the export data.
                  </p>
                  <a
                    href="https://my.elmhurstenergy.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono, DM Mono, monospace)',
                      fontSize: '0.8rem',
                      color: '#9BFF59',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Open Elmhurst portal →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Section navigation buttons */}
          <div className={styles.sectionNav2}>
            {SECTIONS.findIndex(s => s.id === activeSection) > 0 && (
              <button
                className={styles.prevBtn}
                onClick={() => {
                  const idx = SECTIONS.findIndex(s => s.id === activeSection)
                  setActiveSection(SECTIONS[idx - 1].id)
                }}
              >
                ← {SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) - 1].label}
              </button>
            )}
            {SECTIONS.findIndex(s => s.id === activeSection) < SECTIONS.length - 1 && (
              <button
                className={styles.nextBtn}
                onClick={() => {
                  handleSave(false)
                  const idx = SECTIONS.findIndex(s => s.id === activeSection)
                  setActiveSection(SECTIONS[idx + 1].id)
                }}
              >
                {SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) + 1].label} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
