'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Info, Shield, Check, AlertTriangle, CloudRain, Save } from 'lucide-react'
import styles from './airtest.module.css'

export default function AirTightnessTestPage() {
  const params = useParams()
  const bookingId = params.bookingId as string
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [booking, setBooking] = useState<any>(null)
  const [test, setTest] = useState<any>(null)

  // Form State
  const [form, setForm] = useState({
    building_type: 'new_build_dwelling',
    construction_type: 'timber_frame',
    floor_area_sqm: 85,
    ceiling_height: 2.4,
    building_envelope_area_sqm: 210,
    internal_volume_m3: 204,
    design_target_m3_h_m2: 5.0,
    regulatory_limit_m3_h_m2: 8.0,

    // Environmental
    test_date: new Date().toISOString().split('T')[0],
    test_time: '12:00',
    temperature_internal: 20,
    temperature_external: 15,
    wind_speed_description: 'light',
    barometric_pressure_pa: 101325,
    baseline_pressure_pa: 50,

    // Test Results
    test_method: 'average', // pressurisation | depressurisation | average
    pressurisation_result_m3_h: 0,
    depressurisation_result_m3_h: 0,
    air_permeability_m3_h_m2: 0,
    pass_fail: 'fail',

    // Failure / Remedial
    failure_areas: [] as string[],
    other_failure_area: '',
    remedial_works_completed: false,
    retest_pressurisation_result_m3_h: 0,
    retest_depressurisation_result_m3_h: 0,
    retest_result_m3_h_m2: null as number | null,
    retest_pass_fail: '',
    retest_required: false,

    // Equipment & Cert
    fan_type: 'Minneapolis BlowerDoor',
    equipment_calibration_ref: 'UKAS-C-7728A',
    ukas_calibration_date: new Date().toISOString().split('T')[0],
    attma_certificate_ref: '',
    assessor_notes: ''
  })

  // File mocks
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [certFileUrl, setCertFileUrl] = useState<string | null>(null)

  const setField = useCallback((key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  // Auto calculate Volume & Envelope area
  useEffect(() => {
    const vol = Number((form.floor_area_sqm * form.ceiling_height).toFixed(1))
    // Approximate envelope: 2.5 * floor_area + walls. Allow override, but auto-set defaults
    const envelope = Number((form.floor_area_sqm * 2 + Math.sqrt(form.floor_area_sqm) * 4 * form.ceiling_height).toFixed(1))
    
    setForm(prev => ({
      ...prev,
      internal_volume_m3: vol,
      building_envelope_area_sqm: prev.building_envelope_area_sqm === 210 ? envelope : prev.building_envelope_area_sqm
    }))
  }, [form.floor_area_sqm, form.ceiling_height])

  // Live calculation of Air Permeability
  const calcFlow = (press: number, depr: number, method: string) => {
    if (method === 'pressurisation') return press
    if (method === 'depressurisation') return depr
    return (press + depr) / 2
  }

  const avgFlow = calcFlow(form.pressurisation_result_m3_h, form.depressurisation_result_m3_h, form.test_method)
  const calculatedPermeability = form.building_envelope_area_sqm > 0 ? Number((avgFlow / form.building_envelope_area_sqm).toFixed(2)) : 0
  const isPass = calculatedPermeability <= form.design_target_m3_h_m2

  // Retest live calculation
  const retestAvgFlow = calcFlow(form.retest_pressurisation_result_m3_h, form.retest_depressurisation_result_m3_h, form.test_method)
  const retestCalculatedPermeability = form.building_envelope_area_sqm > 0 ? Number((retestAvgFlow / form.building_envelope_area_sqm).toFixed(2)) : 0
  const isRetestPass = retestCalculatedPermeability <= form.design_target_m3_h_m2

  // Sync calculated results back to form
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      air_permeability_m3_h_m2: calculatedPermeability,
      pass_fail: isPass ? 'pass' : 'fail',
      retest_result_m3_h_m2: form.retest_required ? retestCalculatedPermeability : null,
      retest_pass_fail: form.retest_required ? (isRetestPass ? 'pass' : 'fail') : ''
    }))
  }, [calculatedPermeability, isPass, retestCalculatedPermeability, isRetestPass, form.retest_required])

  // Load Data
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

        // Prepopulate building detail fields
        if (bookingData.floor_area_sqm) {
          setField('floor_area_sqm', Number(bookingData.floor_area_sqm))
        }

        const { data: testData, error: tErr } = await supabase
          .from('air_tightness_tests')
          .select('*')
          .eq('booking_id', bookingId)
          .maybeSingle()

        if (testData) {
          setTest(testData)
          setForm(prev => ({
            ...prev,
            building_type: testData.building_type || 'new_build_dwelling',
            construction_type: testData.construction_type || 'timber_frame',
            floor_area_sqm: Number(testData.floor_area_sqm) || 85,
            building_envelope_area_sqm: Number(testData.building_envelope_area_sqm) || 210,
            internal_volume_m3: Number(testData.internal_volume_m3) || 204,
            design_target_m3_h_m2: Number(testData.design_target_m3_h_m2) || 5.0,
            test_date: testData.test_date || new Date().toISOString().split('T')[0],
            test_time: testData.test_time || '12:00',
            temperature_internal: Number(testData.temperature_internal) || 20,
            temperature_external: Number(testData.temperature_external) || 15,
            wind_speed_description: testData.wind_speed_description || 'light',
            barometric_pressure_pa: Number(testData.barometric_pressure_pa) || 101325,
            test_method: testData.test_method || 'average',
            pressurisation_result_m3_h: Number(testData.pressurisation_result_m3_h) || 0,
            depressurisation_result_m3_h: Number(testData.depressurisation_result_m3_h) || 0,
            air_permeability_m3_h_m2: Number(testData.air_permeability_m3_h_m2) || 0,
            pass_fail: testData.pass_fail || 'fail',
            failure_areas: testData.failure_areas || [],
            remedial_notes: testData.remedial_notes || '',
            retest_required: testData.retest_required || false,
            retest_result_m3_h_m2: testData.retest_result_m3_h_m2 ? Number(testData.retest_result_m3_h_m2) : null,
            retest_pass_fail: testData.retest_pass_fail || '',
            fan_type: testData.fan_type || 'Minneapolis BlowerDoor',
            equipment_calibration_ref: testData.equipment_calibration_ref || 'UKAS-C-7728A',
            ukas_calibration_date: testData.ukas_calibration_date || '',
            attma_certificate_ref: testData.attma_certificate_ref || '',
            assessor_notes: testData.assessor_notes || ''
          }))
          if (testData.photos_url) setPhotoUrls(testData.photos_url)
          if (testData.certificate_url) setCertFileUrl(testData.certificate_url)
        } else {
          // Create test row
          const { data: newTest, error: cErr } = await supabase
            .from('air_tightness_tests')
            .insert({
              booking_id: bookingId,
              property_address: `${bookingData.properties?.address_line_1}, ${bookingData.properties?.town}`,
              postcode: bookingData.properties?.postcode,
              status: 'scheduled'
            })
            .select()
            .single()

          if (cErr) throw cErr
          setTest(newTest)
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load test page')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [bookingId])

  // Save draft function
  const handleSave = async (silent = false) => {
    setSaving(true)
    try {
      const updateData = {
        building_type: form.building_type,
        construction_type: form.construction_type,
        floor_area_sqm: form.floor_area_sqm,
        building_envelope_area_sqm: form.building_envelope_area_sqm,
        internal_volume_m3: form.internal_volume_m3,
        design_target_m3_h_m2: form.design_target_m3_h_m2,
        test_date: form.test_date,
        test_time: form.test_time,
        temperature_internal: form.temperature_internal,
        temperature_external: form.temperature_external,
        wind_speed_description: form.wind_speed_description,
        barometric_pressure_pa: form.barometric_pressure_pa,
        test_method: form.test_method,
        pressurisation_result_m3_h: form.pressurisation_result_m3_h,
        depressurisation_result_m3_h: form.depressurisation_result_m3_h,
        air_permeability_m3_h_m2: form.air_permeability_m3_h_m2,
        pass_fail: form.pass_fail,
        failure_areas: form.failure_areas,
        remedial_notes: form.other_failure_area,
        retest_required: form.retest_required,
        retest_result_m3_h_m2: form.retest_result_m3_h_m2,
        retest_pass_fail: form.retest_pass_fail,
        fan_type: form.fan_type,
        equipment_calibration_ref: form.equipment_calibration_ref,
        ukas_calibration_date: form.ukas_calibration_date || null,
        attma_certificate_ref: form.attma_certificate_ref,
        assessor_notes: form.assessor_notes,
        photos_url: photoUrls,
        certificate_url: certFileUrl,
        updated_at: new Date().toISOString()
      }

      await supabase
        .from('air_tightness_tests')
        .update(updateData)
        .eq('booking_id', bookingId)

      setSaved(true)
    } catch (err: any) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Auto save hook
  useEffect(() => {
    const timer = setInterval(() => {
      if (!saved && !saving && test) {
        handleSave(true)
      }
    }, 30000)
    return () => clearInterval(timer)
  }, [form, saved, saving, test])

  // Final complete test
  const handleCompleteTest = async () => {
    await handleSave(true)
    setSaving(true)
    try {
      const finalPerm = form.retest_required ? (form.retest_result_m3_h_m2 ?? form.air_permeability_m3_h_m2) : form.air_permeability_m3_h_m2
      const finalPassFail = form.retest_required ? form.retest_pass_fail : form.pass_fail

      // Update tests table
      await supabase
        .from('air_tightness_tests')
        .update({
          status: finalPassFail === 'pass' ? 'passed' : 'failed'
        })
        .eq('booking_id', bookingId)

      // Update bookings table status
      await supabase
        .from('bookings')
        .update({
          status: 'assessment_complete'
        })
        .eq('id', bookingId)

      // If linked to SAP calculations:
      const { data: linkedSap } = await supabase
        .from('sap_assessments')
        .select('booking_id')
        .eq('booking_id', bookingId)
        .maybeSingle()

      if (linkedSap) {
        await supabase
          .from('sap_assessments')
          .update({
            air_permeability_tested: finalPerm,
            air_test_certificate_ref: form.attma_certificate_ref || `ATTMA-${bookingId.slice(0,6)}`,
            air_test_date: form.test_date
          })
          .eq('booking_id', bookingId)
      }

      // Simulate sending email to customer
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
        <p>Loading Air Tightness Test Form...</p>
      </div>
    )
  }

  const prop = booking?.properties

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div>
          <span className={styles.bookingRef}>{booking?.booking_ref}</span>
          <h2 className={styles.propertyAddress}>
            {prop?.address_line_1 || 'Site Plot'}, {prop?.town}
          </h2>
          <p className={styles.clientName}>Client: {booking?.customers?.full_name || 'N/A'} · Air Test Report</p>
        </div>
        <div className={styles.topBarActions}>
          <span className={styles.autoSaveIndicator}>
            <Save size={14} /> {saved ? 'Saved' : 'Auto-saving...'}
          </span>
          <button onClick={() => handleSave()} className={styles.saveButton} disabled={saving}>
            Save Draft
          </button>
        </div>
      </div>

      {/* SECTION 1: Pre-test Details */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Section 1: Pre-Test Details</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Property Confirmed Address</label>
          <div className={styles.readOnlyText}>
            {prop?.address_line_1}, {prop?.address_line_2 ? `${prop.address_line_2}, ` : ''}{prop?.town}, {prop?.postcode}
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Building Type</label>
            <select
              className={styles.select}
              value={form.building_type}
              onChange={e => setField('building_type', e.target.value)}
            >
              <option value="new_build_dwelling">New Build Dwelling</option>
              <option value="new_build_commercial">New Build Commercial</option>
              <option value="retrofit">Retrofit / Existing</option>
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Construction Type</label>
            <select
              className={styles.select}
              value={form.construction_type}
              onChange={e => setField('construction_type', e.target.value)}
            >
              <option value="timber_frame">Timber Frame</option>
              <option value="masonry">Masonry</option>
              <option value="steel_frame">Steel Frame</option>
              <option value="modular">Modular</option>
              <option value="other">Other / Mixed</option>
            </select>
          </div>
        </div>

        <div className={styles.grid3}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Floor Area (sqm)</label>
            <input
              type="number"
              className={styles.numInput}
              value={form.floor_area_sqm}
              onChange={e => setField('floor_area_sqm', parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Avg Ceiling Height (m)</label>
            <input
              type="number"
              step="0.1"
              className={styles.numInput}
              value={form.ceiling_height}
              onChange={e => setField('ceiling_height', parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Internal Volume (m³)</label>
            <div className={styles.readOnlyText}>{form.internal_volume_m3} m³</div>
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Building Envelope Area (sqm)</label>
            <input
              type="number"
              className={styles.numInput}
              value={form.building_envelope_area_sqm}
              onChange={e => setField('building_envelope_area_sqm', parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Design Air Permeability Target</label>
            <input
              type="number"
              step="0.1"
              className={styles.numInput}
              value={form.design_target_m3_h_m2}
              onChange={e => setField('design_target_m3_h_m2', parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Environmental Conditions */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Section 2: Environmental Conditions</h3>
        <div className={styles.grid3}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Test Date</label>
            <input
              type="date"
              className={styles.textInput}
              value={form.test_date}
              onChange={e => setField('test_date', e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Time of Test</label>
            <input
              type="time"
              className={styles.textInput}
              value={form.test_time}
              onChange={e => setField('test_time', e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Wind Description</label>
            <select
              className={styles.select}
              value={form.wind_speed_description}
              onChange={e => setField('wind_speed_description', e.target.value)}
            >
              <option value="calm">Calm (0-2 mph)</option>
              <option value="light">Light Breeze (3-10 mph)</option>
              <option value="moderate">Moderate Wind (11-18 mph - warning)</option>
            </select>
          </div>
        </div>

        <div className={styles.grid3}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Internal Temperature (°C)</label>
            <input
              type="number"
              className={styles.numInput}
              value={form.temperature_internal}
              onChange={e => setField('temperature_internal', parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>External Temperature (°C)</label>
            <input
              type="number"
              className={styles.numInput}
              value={form.temperature_external}
              onChange={e => setField('temperature_external', parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Barometric Pressure (Pa)</label>
            <input
              type="number"
              className={styles.numInput}
              value={form.barometric_pressure_pa}
              onChange={e => setField('barometric_pressure_pa', parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Test Results */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Section 3: Test Results</h3>
        
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Test Method</label>
          <div className={styles.optionRow}>
            {['pressurisation', 'depressurisation', 'average'].map(m => (
              <button
                key={m}
                type="button"
                className={`${styles.optBtn} ${form.test_method === m ? styles.optBtnActive : ''}`}
                onClick={() => setField('test_method', m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Pressurisation Flow (m³/h @ 50Pa)</label>
            <input
              type="number"
              className={styles.numInput}
              value={form.pressurisation_result_m3_h}
              onChange={e => setField('pressurisation_result_m3_h', parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Depressurisation Flow (m³/h @ 50Pa)</label>
            <input
              type="number"
              className={styles.numInput}
              value={form.depressurisation_result_m3_h}
              onChange={e => setField('depressurisation_result_m3_h', parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.calcCard}>
          <div className={styles.calcResultHeader}>
            <h4>Calculated Summary</h4>
            <span className={`${styles.badge} ${form.pass_fail === 'pass' ? styles.badgePass : styles.badgeFail}`}>
              {form.pass_fail}
            </span>
          </div>
          <div className={styles.calcMetrics}>
            <div>
              <div className={styles.fieldLabel}>Average Flow</div>
              <div className={styles.metricVal}>{avgFlow.toFixed(1)} m³/h</div>
            </div>
            <div>
              <div className={styles.fieldLabel}>Envelope Area</div>
              <div className={styles.metricVal}>{form.building_envelope_area_sqm} m²</div>
            </div>
            <div>
              <div className={styles.fieldLabel}>Air Permeability</div>
              <div className={styles.metricVal} style={{ color: form.pass_fail === 'pass' ? 'var(--accent-lime)' : 'var(--accent-red)' }}>
                {calculatedPermeability.toFixed(2)} m³/h/m²
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Failure & Remedial */}
      {form.pass_fail === 'fail' && (
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle} style={{ color: 'var(--accent-red)' }}>
            <AlertTriangle size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Section 4: Leakage Areas & Remedial Works
          </h3>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Leakage Areas Detected</label>
            <div className={styles.checkGrid}>
              {[
                'Service penetrations (pipes/cables)',
                'Window reveals',
                'Loft hatch',
                'Floor/wall junctions',
                'Ceiling/wall junctions',
                'Letterbox/cat flap',
                'Downlighters',
                'External door frame'
              ].map(area => (
                <label key={area} className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={form.failure_areas.includes(area)}
                    onChange={e => {
                      const cur = [...form.failure_areas]
                      if (e.target.checked) cur.push(area)
                      else cur.splice(cur.indexOf(area), 1)
                      setField('failure_areas', cur)
                    }}
                  />
                  {area}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Other Areas / Remedial Notes</label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={form.other_failure_area}
              onChange={e => setField('other_failure_area', e.target.value)}
              placeholder="Describe any other problem areas or remedial sealing performed on site..."
            />
          </div>

          <div className={styles.checkRow}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={form.retest_required}
                onChange={e => setField('retest_required', e.target.checked)}
              />
              Perform on-site re-test now?
            </label>
          </div>

          {form.retest_required && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h4 style={{ color: 'var(--accent-lime)', marginBottom: '1rem' }}>On-Site Retest Results</h4>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Retest Pressurisation Flow (m³/h @ 50Pa)</label>
                  <input
                    type="number"
                    className={styles.numInput}
                    value={form.retest_pressurisation_result_m3_h}
                    onChange={e => setField('retest_pressurisation_result_m3_h', parseFloat(e.target.value))}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Retest Depressurisation Flow (m³/h @ 50Pa)</label>
                  <input
                    type="number"
                    className={styles.numInput}
                    value={form.retest_depressurisation_result_m3_h}
                    onChange={e => setField('retest_depressurisation_result_m3_h', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.calcCard} style={{ backgroundColor: 'rgba(155,255,89,0.05)', borderColor: 'rgba(155,255,89,0.2)' }}>
                <div className={styles.calcResultHeader}>
                  <h5 style={{ color: 'var(--text-primary)', margin: 0 }}>Retest Outcome</h5>
                  <span className={`${styles.badge} ${form.retest_pass_fail === 'pass' ? styles.badgePass : styles.badgeFail}`}>
                    {form.retest_pass_fail}
                  </span>
                </div>
                <div className={styles.calcMetrics}>
                  <div>
                    <div className={styles.fieldLabel}>Retest Air Permeability</div>
                    <div className={styles.metricVal} style={{ color: form.retest_pass_fail === 'pass' ? 'var(--accent-lime)' : 'var(--accent-red)' }}>
                      {retestCalculatedPermeability.toFixed(2)} m³/h/m²
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: Equipment & Certification */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Section 5: Equipment & Certification</h3>
        <div className={styles.grid3}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Blower Door Fan Type</label>
            <input
              type="text"
              className={styles.textInput}
              value={form.fan_type}
              onChange={e => setField('fan_type', e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Equipment Calibration Ref</label>
            <input
              type="text"
              className={styles.textInput}
              value={form.equipment_calibration_ref}
              onChange={e => setField('equipment_calibration_ref', e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>UKAS Calibration Date</label>
            <input
              type="date"
              className={styles.textInput}
              value={form.ukas_calibration_date}
              onChange={e => setField('ukas_calibration_date', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>ATTMA Certificate Ref (Once Issued)</label>
          <input
            type="text"
            className={styles.textInput}
            value={form.attma_certificate_ref}
            onChange={e => setField('attma_certificate_ref', e.target.value)}
            placeholder="e.g. ATTMA-12345"
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Photos Upload</label>
          <div className={styles.fileInput} onClick={() => setPhotoUrls(['/files/test_setup.jpg', '/files/leak_smoke.jpg'])}>
            <p>Click to attach site photos (calibration tag, fan installed, smoke tests)</p>
            {photoUrls.length > 0 && <p className={styles.uploadedFile}>✓ {photoUrls.length} Photos uploaded</p>}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Assessor Notes</label>
          <textarea
            className={styles.textarea}
            rows={3}
            value={form.assessor_notes}
            onChange={e => setField('assessor_notes', e.target.value)}
            placeholder="Add any extra comments about site conditions, building control attendance etc..."
          />
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <button onClick={handleCompleteTest} className={styles.completeBtnLarge} disabled={saving}>
          {saving ? <LoadingSpinner size={18} /> : 'Complete Test & Submit Results'}
        </button>
      </div>
    </div>
  )
}
