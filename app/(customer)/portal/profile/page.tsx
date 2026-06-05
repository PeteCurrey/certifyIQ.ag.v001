'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import styles from './profile.module.css'

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('customers').select('*').eq('auth_user_id', user.id).single()
      if (data) {
        setCustomer(data)
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
        setCompanyName(data.company_name || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await supabase.from('customers').update({ full_name: fullName, phone, company_name: companyName }).eq('id', customer.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><LoadingSpinner size={40} /></div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Profile</h2>
      <div className={styles.card}>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <div className={styles.staticField}>{customer?.email}</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" className={styles.input} value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">Phone Number</label>
            <input id="phone" type="tel" className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          {customer?.customer_type === 'agent' && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="company">Company Name</label>
              <input id="company" type="text" className={styles.input} value={companyName} onChange={e => setCompanyName(e.target.value)} />
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Account Type</label>
            <div className={styles.staticField} style={{ textTransform: 'capitalize' }}>{customer?.customer_type}</div>
          </div>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
