'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from '../login/login.module.css' // We can reuse the login styling or add customized classes

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [customerType, setCustomerType] = useState<'homeowner' | 'landlord' | 'agent'>('homeowner')
  const [companyName, setCompanyName] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      // 1. Sign up user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        // 2. Create customer record
        const { error: customerError } = await supabase.from('customers').insert({
          auth_user_id: authData.user.id,
          full_name: fullName,
          email: email,
          phone: phone,
          customer_type: customerType,
          company_name: customerType === 'agent' ? companyName : null,
        })

        if (customerError) {
          throw customerError
        }

        setSuccessMsg('Registration successful! Please check your email to verify your account or sign in.')
        setLoading(false)
        
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>C</span>
            <span className={styles.logoText}>CertifyIQ</span>
          </Link>
        </div>

        <h2 className={styles.title}>Create your account</h2>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}
        {successMsg && (
          <div style={{
            backgroundColor: 'rgba(155, 255, 89, 0.1)',
            border: '1px solid rgba(155, 255, 89, 0.2)',
            color: 'var(--accent-lime)',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            lineHeight: '1.4'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className={styles.input}
              placeholder="John Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className={styles.input}
              placeholder="e.g. 07700 900000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="customerType">Account Type</label>
            <select
              id="customerType"
              className={styles.input}
              value={customerType}
              onChange={(e: any) => setCustomerType(e.target.value)}
              style={{ appearance: 'none', backgroundPosition: 'right 12px center' }}
            >
              <option value="homeowner">Homeowner</option>
              <option value="landlord">Landlord</option>
              <option value="agent">Estate Agent</option>
            </select>
          </div>

          {customerType === 'agent' && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                type="text"
                className={styles.input}
                placeholder="Agency Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required={customerType === 'agent'}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link href="/login" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
