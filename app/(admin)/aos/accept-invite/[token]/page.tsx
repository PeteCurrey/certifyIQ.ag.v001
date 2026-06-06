'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AcceptInvitePage() {
  const { token } = useParams()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      const response = await fetch('/api/aos/accept-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })
      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/aos/login')
        }, 3000)
      } else {
        setErrorMsg(data.error || 'Failed to accept invitation.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('A network error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-obsidian, #030712)',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'linear-gradient(145deg, #0d1527 0%, #030712 100%)',
        border: '1px solid var(--border-color, #1e293b)',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.75rem',
            color: 'var(--accent-lime, #9BFF59)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}>Avorria Operations</span>
          <h2 style={{
            fontFamily: 'var(--font-headings, sans-serif)',
            fontSize: '1.8rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: '0.5rem',
          }}>Set Account Password</h2>
        </div>

        {success ? (
          <div style={{
            color: 'var(--accent-lime, #9BFF59)',
            background: 'rgba(155, 255, 89, 0.1)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid rgba(155, 255, 89, 0.2)',
            textAlign: 'center',
          }}>
            <p style={{ fontWeight: 600, margin: '0 0 0.5rem 0' }}>✓ Invite Accepted Successfully</p>
            <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.8 }}>Redirecting you to login portal...</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color, #1e293b)',
                  color: 'var(--text-primary)',
                  padding: '0.8rem 1rem',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color, #1e293b)',
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
                color: '#ff5c5c',
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
                background: 'var(--accent-lime, #9BFF59)',
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
              {loading ? 'Processing...' : 'Activate Account'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/aos/login" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
