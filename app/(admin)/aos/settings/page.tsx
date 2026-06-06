'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { UserRole } from '@/lib/aos/permissions'
import styles from './settings.module.css'

export default function AdminSettingsPage() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [aosUserId, setAosUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Profile settings state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Password change state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: aosUser } = await supabase
        .from('aos_users')
        .select('*')
        .eq('email', user.email)
        .maybeSingle()

      if (aosUser) {
        setAosUserId(aosUser.id)
        setRole(aosUser.role as UserRole)
        setFullName(aosUser.name || '')
      }

      // Fetch assessor info if exists for phone number
      const { data: assessor } = await supabase
        .from('assessors')
        .select('phone')
        .eq('email', user?.email)
        .maybeSingle()
      if (assessor) {
        setPhone(assessor.phone || '')
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Update aos_users name
    await supabase.from('aos_users').update({ name: fullName }).eq('id', aosUserId)
    
    // Update assessor phone if assessor profile exists
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: assessor } = await supabase
        .from('assessors')
        .select('id')
        .eq('email', user.email)
        .maybeSingle()

      if (assessor) {
        await supabase.from('assessors').update({ full_name: fullName, phone }).eq('id', assessor.id)
      }
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSaved(false)

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSaved(true)
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 3000)
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><LoadingSpinner size={40} /></div>

  const isSuperAdmin = role === 'super_admin'

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>System Settings</h2>

      {/* Account Profile Form */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Account Profile</h3>
        <form onSubmit={handleSaveProfile} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="fullName">Full Name</label>
              <input id="fullName" type="text" className={styles.input} value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 07700900000" />
            </div>
          </div>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved Profile' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Change Password Security Form */}
      <div className={styles.card} style={{ marginTop: '24px' }}>
        <h3 className={styles.sectionTitle}>Account Security</h3>
        <form onSubmit={handleChangePassword} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="newPass">New Password</label>
              <input id="newPass" type="password" className={styles.input} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="confPass">Confirm New Password</label>
              <input id="confPass" type="password" className={styles.input} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
            </div>
          </div>
          {passwordError && (
            <div style={{ color: '#ff5c5c', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {passwordError}
            </div>
          )}
          <button type="submit" className={styles.saveBtn} style={{ background: 'var(--accent-amber, #F5A623)', color: '#000' }} disabled={passwordSaving}>
            {passwordSaving ? 'Updating...' : passwordSaved ? '✓ Password Updated' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Super Admin Restricted Section */}
      {isSuperAdmin && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Super Admin Restricted Panels</h3>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Invoice Settings */}
            <Link href="/aos/settings/invoice" style={{ textDecoration: 'none' }}>
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

            {/* Audit Trail Settings */}
            <Link href="/aos/settings/audit" style={{ textDecoration: 'none' }}>
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
                    🛡️
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '3px' }}>
                      System Audit Trail Logs
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      Track sensitive console action histories, administrative user creation/deletions, status logs, and value modifications.
                    </div>
                  </div>
                </div>
                <span style={{ color: 'var(--accent-lime)', fontSize: '1.2rem', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
