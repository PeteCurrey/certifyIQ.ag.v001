'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      // Check if user is assessor
      // In this setup, we verify if they can access assessor tables
      const { data: assessor, error: assessorErr } = await supabase
        .from('assessors')
        .select('id, is_active')
        .eq('auth_user_id', data.user?.id)
        .maybeSingle()

      if (assessorErr || !assessor) {
        // If not found in assessors, sign out and show error
        await supabase.auth.signOut()
        throw new Error('Access Denied: You do not have an active assessor profile.')
      }

      if (!assessor.is_active) {
        await supabase.auth.signOut()
        throw new Error('Access Denied: Your assessor account is inactive.')
      }

      router.replace('/aos')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed')
      setLoading(false)
    }
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: '420px',
      background: 'linear-gradient(145deg, #0d1527 0%, #030712 100%)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '2.5rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--accent-lime)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}>Internal Operations</span>
        <h2 style={{
          fontFamily: 'var(--font-headings)',
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginTop: '0.5rem',
        }}>Assessor Sign In</h2>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            required
            placeholder="assessor@avorria.co.uk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              outline: 'none',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} htmlFor="password">Security Password</label>
          <input
            type="password"
            id="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              outline: 'none',
              fontSize: '0.95rem',
            }}
          />
        </div>

        {errorMsg && (
          <div style={{
            color: 'var(--accent-red)',
            fontSize: '0.85rem',
            background: 'rgba(255, 92, 92, 0.1)',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 92, 92, 0.2)',
          }}>
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--accent-lime)',
            color: '#000',
            fontWeight: 700,
            fontSize: '1rem',
            padding: '0.9rem',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '0.5rem',
          }}
        >
          {loading ? 'Authenticating...' : 'Access Console'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← Back to Public Website
        </Link>
      </div>
    </div>
  )
}
