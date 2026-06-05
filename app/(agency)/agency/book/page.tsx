'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './book.module.css'

const SERVICES = [
  { id: 'domestic_epc', label: 'Domestic EPC', icon: '🏠', price: 95, desc: 'Standard residential energy assessment' },
  { id: 'landlord_epc', label: 'Landlord EPC', icon: '🔑', price: 85, desc: 'Fast-tracked for lettings compliance' },
  { id: 'commercial_epc', label: 'Commercial EPC', icon: '🏢', price: 295, desc: 'Level 3, 4 & 5 non-domestic assessments' },
  { id: 'new_build_epc', label: 'New Build EPC', icon: '🏗️', price: 175, desc: 'On construction SAP-based certificate' },
  { id: 'sap', label: 'SAP Calculations', icon: '📐', price: 395, desc: 'Design stage & as-built SAP calculations' },
  { id: 'air_tightness', label: 'Air Tightness Test', icon: '💨', price: 295, desc: 'ATTMA accredited blower door testing' },
  { id: 'floor_plan', label: 'Floor Plans', icon: '📏', price: 65, desc: '2D & 3D architectural floor plans' },
  { id: 'photography', label: 'Property Photography', icon: '📷', price: 125, desc: 'Professional property photography' },
  { id: 'drone', label: 'Drone Photography', icon: '🚁', price: 195, desc: 'Aerial imagery and video' },
  { id: 'virtual_tour', label: 'Virtual Tour', icon: '🥽', price: 225, desc: '360° immersive property walkthrough' },
  { id: 'inventory', label: 'Inventory Service', icon: '📋', price: 85, desc: 'Check-in / check-out inventory reports' },
  { id: 'consultancy', label: 'Compliance Consultancy', icon: '⚖️', price: 150, desc: 'Expert UK Building Regulations advice' },
]

const TIME_SLOTS = ['Morning (8am–12pm)', 'Afternoon (12pm–4pm)', 'Late Afternoon (4pm–6pm)', 'Any time']

export default function BookServicePage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    service: '',
    address: '',
    town: '',
    postcode: '',
    date: '',
    timeSlot: '',
    branchId: '',
    accessNotes: '',
    specialInstructions: '',
  })
  const [branches, setBranches] = useState<any[]>([])
  const [agencyId, setAgencyId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [jobRef, setJobRef] = useState('')

  React.useEffect(() => {
    async function loadBranches() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: agUser } = await supabase
        .from('agency_users')
        .select('agency_id, branch_id')
        .eq('auth_user_id', user.id)
        .single()
      if (!agUser) return
      setAgencyId(agUser.agency_id)
      if (agUser.branch_id) setForm(f => ({ ...f, branchId: agUser.branch_id }))
      const { data: branchData } = await supabase
        .from('agency_branches')
        .select('id, branch_name, town')
        .eq('agency_id', agUser.agency_id)
        .eq('is_active', true)
      setBranches(branchData || [])
    }
    loadBranches()
  }, [])

  const selectedService = SERVICES.find(s => s.id === form.service)

  async function handleSubmit() {
    setSubmitting(true)
    // Create or find property
    const { data: prop } = await supabase
      .from('agency_properties')
      .upsert({
        agency_id: agencyId,
        branch_id: form.branchId || null,
        address_line_1: form.address,
        town: form.town,
        postcode: form.postcode.toUpperCase(),
      }, { onConflict: 'agency_id,postcode,address_line_1' })
      .select('id')
      .single()

    const { data: job, error } = await supabase
      .from('agency_jobs')
      .insert({
        agency_id: agencyId,
        branch_id: form.branchId || null,
        property_id: prop?.id || null,
        service_type: form.service,
        status: 'booked',
        booked_date: form.date,
        booked_time_slot: form.timeSlot,
        access_notes: form.accessNotes,
        special_instructions: form.specialInstructions,
        price_gbp: selectedService?.price || 0,
      })
      .select('job_ref')
      .single()

    setSubmitting(false)
    if (!error) {
      setJobRef(job?.job_ref || '')
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1>Order Confirmed!</h1>
          <p>Your booking has been received and our team will be in touch to confirm your appointment.</p>
          <div className={styles.refBox}>
            <span>Reference:</span>
            <strong>{jobRef}</strong>
          </div>
          <div className={styles.successActions}>
            <Link href="/agency/jobs" className={styles.primaryBtn}>View Jobs</Link>
            <Link href="/agency/book" className={styles.secondaryBtn} onClick={() => { setStep(1); setSubmitted(false); setForm({ service: '', address: '', town: '', postcode: '', date: '', timeSlot: '', branchId: '', accessNotes: '', specialInstructions: '' }) }}>Order Another</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Order a Service</h1>
        <p className={styles.subtitle}>Complete the form below to book an assessment or service</p>
      </div>

      {/* Progress Bar */}
      <div className={styles.progress}>
        {[1,2,3,4,5,6].map(n => (
          <div key={n} className={`${styles.progressStep} ${step >= n ? styles.progressActive : ''}`}>
            <div className={styles.progressNum}>{step > n ? '✓' : n}</div>
            <span className={styles.progressLabel}>{['Service', 'Address', 'Date', 'Branch', 'Notes', 'Confirm'][n-1]}</span>
          </div>
        ))}
      </div>

      <div className={styles.formCard}>
        {/* STEP 1: Service */}
        {step === 1 && (
          <div>
            <h2 className={styles.stepTitle}>Select a Service</h2>
            <div className={styles.serviceGrid}>
              {SERVICES.map(svc => (
                <button
                  key={svc.id}
                  className={`${styles.serviceCard} ${form.service === svc.id ? styles.serviceSelected : ''}`}
                  onClick={() => setForm(f => ({ ...f, service: svc.id }))}
                >
                  <span className={styles.serviceIcon}>{svc.icon}</span>
                  <span className={styles.serviceName}>{svc.label}</span>
                  <span className={styles.serviceDesc}>{svc.desc}</span>
                  <span className={styles.servicePrice}>from £{svc.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Address */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Property Address</h2>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Address Line 1</label>
              <input className={styles.input} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="e.g. 12 High Street" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Town / City</label>
              <input className={styles.input} value={form.town} onChange={e => setForm(f => ({ ...f, town: e.target.value }))} placeholder="e.g. Chesterfield" />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Postcode</label>
              <input className={styles.input} value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} placeholder="e.g. S40 1AB" style={{ textTransform: 'uppercase' }} />
            </div>
          </div>
        )}

        {/* STEP 3: Date */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Choose a Date</h2>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Preferred Date</label>
              <input className={styles.input} type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Preferred Time Slot</label>
              <div className={styles.slotGrid}>
                {TIME_SLOTS.map(slot => (
                  <button key={slot} className={`${styles.slotBtn} ${form.timeSlot === slot ? styles.slotSelected : ''}`} onClick={() => setForm(f => ({ ...f, timeSlot: slot }))}>{slot}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Branch */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Assign to Branch</h2>
            <div className={styles.branchGrid}>
              {branches.map(b => (
                <button key={b.id} className={`${styles.branchCard} ${form.branchId === b.id ? styles.branchSelected : ''}`} onClick={() => setForm(f => ({ ...f, branchId: b.id }))}>
                  <span className={styles.branchName}>{b.branch_name}</span>
                  <span className={styles.branchTown}>{b.town}</span>
                </button>
              ))}
              {branches.length === 0 && <p style={{ color: '#94A3B8' }}>No branches configured. <Link href="/agency/branches">Add one.</Link></p>}
            </div>
          </div>
        )}

        {/* STEP 5: Notes */}
        {step === 5 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Access & Notes</h2>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Access Instructions</label>
              <textarea className={styles.textarea} value={form.accessNotes} onChange={e => setForm(f => ({ ...f, accessNotes: e.target.value }))} placeholder="e.g. Key held at branch, ring doorbell twice, tenant available from 10am…" rows={4} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Special Instructions</label>
              <textarea className={styles.textarea} value={form.specialInstructions} onChange={e => setForm(f => ({ ...f, specialInstructions: e.target.value }))} placeholder="e.g. Commercial property, bring extension ladder…" rows={3} />
            </div>
          </div>
        )}

        {/* STEP 6: Confirm */}
        {step === 6 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Confirm Your Order</h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}><span>Service</span><strong>{selectedService?.label}</strong></div>
              <div className={styles.summaryRow}><span>Property</span><strong>{form.address}, {form.postcode.toUpperCase()}</strong></div>
              <div className={styles.summaryRow}><span>Date</span><strong>{form.date} — {form.timeSlot}</strong></div>
              <div className={styles.summaryRow}><span>Branch</span><strong>{branches.find(b => b.id === form.branchId)?.branch_name || 'Not assigned'}</strong></div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRow}><span>Estimated Price</span><strong className={styles.price}>from £{selectedService?.price}</strong></div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.navRow}>
          {step > 1 && (
            <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          {step < 6 ? (
            <button
              className={styles.nextBtn}
              disabled={step === 1 && !form.service}
              onClick={() => setStep(s => s + 1)}
            >
              Continue →
            </button>
          ) : (
            <button className={styles.confirmBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Placing Order…' : 'Confirm Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
