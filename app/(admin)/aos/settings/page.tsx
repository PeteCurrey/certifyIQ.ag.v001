'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './settings.module.css'

export default function AdminSettingsPage() {
  const [assessor, setAssessor] = useState<any>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [accreditationNumber, setAccreditationNumber] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('assessors').select('*').eq('auth_user_id', user.id).single()
      if (data) {
        setAssessor(data)
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
        setAccreditationNumber(data.accreditation_number || '')
        setIsSuperAdmin(!!data.is_super_admin)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await supabase.from('assessors').update({ full_name: fullName, phone, accreditation_number: accreditationNumber }).eq('id', assessor.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><LoadingSpinner size={40} /></div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Assessor Settings</h2>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Account Details</h3>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="fullName">Full Name</label>
              <input id="fullName" type="text" className={styles.input} value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Accreditation Body</label>
              <div style={{
                padding: '0.65rem 0.85rem',
                background: 'rgba(155, 255, 89, 0.05)',
                border: '1px solid rgba(155, 255, 89, 0.2)',
                borderRadius: '8px',
                color: '#E8F4FF',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{ color: '#9BFF59', fontSize: '1rem' }}>✓</span>
                Elmhurst Energy
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="accNum">Accreditation Number</label>
              <input id="accNum" type="text" className={styles.input} value={accreditationNumber} onChange={e => setAccreditationNumber(e.target.value)} />
              <a
                href="https://www.elmhurstenergy.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '0.4rem',
                  fontFamily: 'var(--font-mono, DM Mono, monospace)',
                  fontSize: '0.75rem',
                  color: '#8BA3BF',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#9BFF59'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8BA3BF'}
              >
                Verify your membership → elmhurstenergy.co.uk
              </a>
            </div>
          </div>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Super Admin Only — Invoice Settings */}
      {isSuperAdmin && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Super Admin</h3>
            <span style={{
              background: 'rgba(155,255,89,0.1)',
              color: 'var(--accent-lime)',
              border: '1px solid rgba(155,255,89,0.3)',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Restricted
            </span>
          </div>

          <Link
            href="/aos/settings/invoice"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(155,255,89,0.4)'
                ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(155,255,89,0.04)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)'
                ;(e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: 'rgba(155,255,89,0.1)', border: '1px solid rgba(155,255,89,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  flexShrink: 0,
                }}>
                  🧾
                </div>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '3px' }}>
                    Invoice Design & Settings
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Edit company name, registered address, bank details, and VAT number for all BACS invoices. Includes a live invoice preview.
                  </div>
                </div>
              </div>
              <span style={{ color: 'var(--accent-lime)', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
