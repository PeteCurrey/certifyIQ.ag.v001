'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Globe, FileText, Map, HelpCircle, Tag } from 'lucide-react'
import styles from './website.module.css'

export default function WebsiteContentPage() {
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr || !user) throw new Error('Not authenticated')

        const { data: curAssessor } = await supabase
          .from('assessors')
          .select('is_super_admin')
          .eq('auth_user_id', user.id)
          .single()

        if (!curAssessor?.is_super_admin) {
          throw new Error('Access denied: Super Admin only')
        }
      } catch (err: any) {
        setErrorMsg(err.message)
      } finally {
        setLoading(false)
      }
    }
    checkAccess()
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Loading Website Management...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className={styles.container}>
        <h2>Access Denied</h2>
        <p>{errorMsg}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>CMS</span>
          <h1 className={styles.title}>Website Content Management</h1>
        </div>
        <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <Globe size={24} color="var(--accent-lime)" />
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}><FileText size={20} /></div>
            <h3 className={styles.cardTitle}>Blog Posts</h3>
          </div>
          <p className={styles.cardDesc}>
            Manage energy efficiency articles, news, and guides published on the main Avorria blog.
          </p>
          <button className={styles.cardBtn} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Module Coming Soon</button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}><Map size={20} /></div>
            <h3 className={styles.cardTitle}>Location SEO Pages</h3>
          </div>
          <p className={styles.cardDesc}>
            Manage the dynamically generated landing pages for local areas (e.g. 'EPC Assessor in Manchester').
          </p>
          <button className={styles.cardBtn} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Module Coming Soon</button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}><Tag size={20} /></div>
            <h3 className={styles.cardTitle}>Pricing & Tiers</h3>
          </div>
          <p className={styles.cardDesc}>
            Update the base prices for Domestic, Commercial, and Air Tightness testing.
          </p>
          <button className={styles.cardBtn} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Module Coming Soon</button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}><HelpCircle size={20} /></div>
            <h3 className={styles.cardTitle}>FAQ Content</h3>
          </div>
          <p className={styles.cardDesc}>
            Edit frequently asked questions displayed across service pages and the main FAQ hub.
          </p>
          <button className={styles.cardBtn} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Module Coming Soon</button>
        </div>
      </div>
    </div>
  )
}
