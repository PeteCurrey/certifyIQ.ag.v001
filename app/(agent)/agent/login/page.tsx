'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import styles from './login.module.css'

export default function AgentLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        // Check profile role
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('auth_user_id', data.user.id)
            .single()
            
          if (profile?.role !== 'agent') {
            await supabase.auth.signOut()
            throw new Error('This account does not have agent access.')
          }
          
          // Check onboarding status
          const { data: agentAccount } = await supabase
            .from('agent_accounts')
            .select('onboarding_complete')
            .eq('auth_user_id', data.user.id)
            .single()
            
          if (agentAccount?.onboarding_complete) {
            router.push('/agent/dashboard')
          } else {
            router.push('/agent/onboarding')
          }
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: 'agent' }
          }
        })
        if (error) throw error
        
        // The profiles table trigger will create the profile with 'agent' role
        // Now redirect to onboarding
        router.push('/agent/onboarding')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <div className={styles.loginCard}>
          <div className={styles.brand}>
            <h1>Avorria<span className={styles.dot}>.</span></h1>
            <span className={styles.subtitle}>Agent Portal</span>
          </div>

          <div className={styles.tabs}>
            <div 
              className={`${styles.tab} ${isLogin ? styles.active : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </div>
            <div 
              className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </div>
          </div>

          <form onSubmit={handleAuth} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.co.uk"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                required
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {errorMsg && <div className={styles.error}>{errorMsg}</div>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Please wait...' : (isLogin ? 'Sign In to Portal' : 'Create Agent Account')}
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Back to Avorria website
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.rightPane}>
        <div className={styles.rightContent}>
          <h2>Zero-touch EPC management for forward-thinking agencies.</h2>
          <p>
            Connect your property CRM to Avorria and we'll automatically detect when an EPC is needed, contact the vendor, and arrange the assessment.
          </p>
        </div>
      </div>
    </div>
  )
}
