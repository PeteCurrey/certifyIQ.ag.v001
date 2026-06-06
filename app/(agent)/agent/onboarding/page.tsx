'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './onboarding.module.css'

type Step = 'welcome' | 'profile' | 'crm' | 'billing' | 'done'
const STEPS: Step[] = ['welcome', 'profile', 'crm', 'billing', 'done']

export default function AgentOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('welcome')
  const [loading, setLoading] = useState(false)

  // Form state
  const [agencyName, setAgencyName] = useState('')
  const [phone, setPhone] = useState('')
  const [crmType, setCrmType] = useState<string | null>(null)
  const [billingPref, setBillingPref] = useState<'agency' | 'vendor'>('agency')

  const nextStep = () => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  const prevStep = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      await supabase.from('agent_accounts').update({
        agency_name: agencyName,
        phone,
        crm_type: crmType,
        billing_preference: billingPref,
        onboarding_complete: true,
        status: 'active',
        updated_at: new Date().toISOString()
      }).eq('auth_user_id', user.id)

      // Insert CRM integration if selected (will be set to inactive until authenticated later via settings)
      if (crmType) {
        const { data: account } = await supabase.from('agent_accounts').select('id').eq('auth_user_id', user.id).single()
        if (account) {
          await supabase.from('crm_integrations').insert({
            agent_account_id: account.id,
            crm_type: crmType,
            is_active: false
          })
        }
      }

      router.push('/agent/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <h1>Avorria<span className={styles.dot}>.</span></h1>
        </div>

        {step !== 'done' && (
          <div className={styles.progressBar}>
            {STEPS.slice(0, 4).map((s, i) => (
              <div key={s} className={`${styles.progressStep} ${i <= STEPS.indexOf(step) ? styles.done : ''}`} />
            ))}
          </div>
        )}

        {step === 'welcome' && (
          <>
            <h2 className={styles.title}>Welcome to Avorria</h2>
            <p className={styles.subtitle}>
              Let's get your agency set up. This will only take a minute. We'll configure your agency profile, connect your CRM, and set your billing preferences.
            </p>
            <button className={styles.btnPrimary} style={{ width: '100%' }} onClick={nextStep}>
              Get Started →
            </button>
          </>
        )}

        {step === 'profile' && (
          <>
            <h2 className={styles.title}>Agency Profile</h2>
            <p className={styles.subtitle}>Enter your agency details so we can brand communications to your vendors.</p>
            <div className={styles.field}>
              <label className={styles.label}>Agency / Company Name</label>
              <input className={styles.input} value={agencyName} onChange={e => setAgencyName(e.target.value)} placeholder="e.g. Chesterfield Estates" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="01246 123456" />
            </div>
            <div className={styles.actions}>
              <button className={styles.btnSecondary} onClick={prevStep}>← Back</button>
              <button className={styles.btnPrimary} onClick={nextStep} disabled={!agencyName}>Continue →</button>
            </div>
          </>
        )}

        {step === 'crm' && (
          <>
            <h2 className={styles.title}>Connect your CRM</h2>
            <p className={styles.subtitle}>Select the CRM you use. We'll automatically detect new instructions and check if they need an EPC.</p>
            <div className={styles.grid}>
              {[
                { id: 'alto', name: 'Alto (Vebra)', desc: 'Connect via API Key' },
                { id: 'street', name: 'Street.co.uk', desc: 'Connect via OAuth' },
                { id: 'reapit', name: 'Reapit', desc: 'Connect via AppMarket' },
                { id: 'none', name: 'Other / None', desc: 'I will manually add properties' }
              ].map(crm => (
                <div
                  key={crm.id}
                  className={`${styles.optionCard} ${crmType === crm.id || (crm.id === 'none' && crmType === null) ? styles.active : ''}`}
                  onClick={() => setCrmType(crm.id === 'none' ? null : crm.id)}
                >
                  <h3>{crm.name}</h3>
                  <p>{crm.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
              You can authenticate with your CRM later in Settings.
            </p>
            <div className={styles.actions}>
              <button className={styles.btnSecondary} onClick={prevStep}>← Back</button>
              <button className={styles.btnPrimary} onClick={nextStep}>Continue →</button>
            </div>
          </>
        )}

        {step === 'billing' && (
          <>
            <h2 className={styles.title}>Billing Preferences</h2>
            <p className={styles.subtitle}>How would you like to handle payment for EPC assessments by default?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                className={`${styles.optionCard} ${billingPref === 'agency' ? styles.active : ''}`}
                onClick={() => setBillingPref('agency')}
              >
                <h3>Add to monthly invoice</h3>
                <p>We bill your agency once a month for all completed EPCs. You handle charging the vendor if needed.</p>
              </div>
              <div
                className={`${styles.optionCard} ${billingPref === 'vendor' ? styles.active : ''}`}
                onClick={() => setBillingPref('vendor')}
              >
                <h3>Vendor pays directly</h3>
                <p>We send the vendor a Stripe payment link. The assessment is only arranged once they pay.</p>
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.btnSecondary} onClick={prevStep}>← Back</button>
              <button className={styles.btnPrimary} onClick={handleFinish} disabled={loading}>
                {loading ? 'Completing setup...' : 'Finish Setup ✓'}
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(155, 255, 89, 0.1)', border: '2px solid var(--accent-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', color: 'var(--accent-lime)' }}>✓</div>
            <h2 className={styles.title}>You're all set!</h2>
            <p className={styles.subtitle}>Your account is ready. Taking you to the dashboard...</p>
          </div>
        )}
      </div>
    </div>
  )
}
