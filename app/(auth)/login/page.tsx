'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './login.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'assessor'>('customer')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        if (role === 'assessor') {
          // Verify they are an assessor in the assessor table
          const { data: assessor, error: assessorErr } = await supabase
            .from('assessors')
            .select('id')
            .eq('auth_user_id', data.user.id)
            .single()

          if (assessorErr || !assessor) {
            // Log them out and show error if not an assessor
            await supabase.auth.signOut()
            setErrorMsg('Access denied: You are not registered as an assessor.')
            setLoading(false)
            return
          }
          router.push('/admin')
        } else {
          // Customer login
          router.push('/portal')
        }
        router.refresh()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during login.')
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

        <h2 className={styles.title}>Sign in to your account</h2>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${role === 'customer' ? styles.tabActive : ''}`}
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button
            type="button"
            className={`${styles.tab} ${role === 'assessor' ? styles.tabActive : ''}`}
            onClick={() => setRole('assessor')}
          >
            Assessor
          </button>
        </div>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          {role === 'customer' ? (
            <p>
              New customer?{' '}
              <Link href="/register" className={styles.link}>
                Create an account
              </Link>
            </p>
          ) : (
            <p className={styles.assessorNote}>
              Accredited assessors only. Contact admin for registrations.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
