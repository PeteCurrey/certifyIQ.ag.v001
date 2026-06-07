'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './seo.module.css'

type Tab = 'dashboard' | 'inspector' | 'keywords' | 'calendar' | 'sitemap' | 'redirects'

export default function SeoToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Data state
  const [blogs, setBlogs] = useState<any[]>([])
  const [keywords, setKeywords] = useState<any[]>([])
  const [redirects, setRedirects] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const [blogRes, keywordRes, redirectRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('published_at', { ascending: false }),
        supabase.from('keyword_tracking').select('*').order('created_at', { ascending: false }),
        supabase.from('seo_redirects').select('*').order('created_at', { ascending: false })
      ])
      
      setBlogs(blogRes.data || [])
      setKeywords(keywordRes.data || [])
      setRedirects(redirectRes.data || [])
      setLoading(false)
    }
    loadData()
  }, [])

  const renderDashboard = () => (
    <div className={styles.grid}>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Published Pages & Posts</span>
        <span className={styles.statValue}>{blogs.filter(b => b.published).length + 30}</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Tracked Keywords</span>
        <span className={styles.statValue}>{keywords.length}</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Active Redirects</span>
        <span className={styles.statValue}>{redirects.filter(r => r.is_active).length}</span>
      </div>
      <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
        <h3>Recent Content</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {blogs.slice(0, 5).map(b => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>/blog/{b.slug}</td>
                <td><span className={`${styles.badge} ${b.published ? styles.badgePublished : styles.badgeDraft}`}>{b.published ? 'Published' : 'Draft'}</span></td>
                <td>{b.published_at ? new Date(b.published_at).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderInspector = () => (
    <div className={styles.card}>
      <h3>Page Inspector</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Enter a URL slug to inspect its metadata, schema, and headings.</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input type="text" className={styles.input} placeholder="/services/tm44" />
        <button className={`${styles.btn} ${styles.btnPrimary}`}>Inspect URL</button>
      </div>
      <div style={{ border: '1px dashed var(--border-subtle)', padding: '2rem', textAlign: 'center', borderRadius: '8px', color: 'var(--text-muted)' }}>
        Inspector results will appear here.
      </div>
    </div>
  )

  const renderKeywords = () => (
    <div className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Keyword Tracker</h3>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>+ Add Keyword</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Target URL</th>
            <th>Volume</th>
            <th>Difficulty</th>
            <th>Latest Position</th>
          </tr>
        </thead>
        <tbody>
          {keywords.length > 0 ? keywords.map(k => (
            <tr key={k.id}>
              <td><strong>{k.keyword}</strong></td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{k.target_url}</td>
              <td>{k.search_volume}</td>
              <td>{k.difficulty}/100</td>
              <td>--</td>
            </tr>
          )) : (
            <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No keywords tracked yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )

  const renderCalendar = () => (
    <div className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Content Calendar</h3>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>+ Plan Content</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Target Keyword</th>
            <th>Status</th>
            <th>Publish Date</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No planned content.</td></tr>
        </tbody>
      </table>
    </div>
  )

  const renderSitemap = () => (
    <div className={styles.card}>
      <h3>Sitemap Manager</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Manage sitemap generation and ping search engines.</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={styles.btn}>Generate sitemap.xml</button>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>Ping Google</button>
      </div>
      <div style={{ backgroundColor: 'var(--bg-obsidian)', padding: '1.5rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#9BFF59' }}>
        {`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ...\n</urlset>`}
      </div>
    </div>
  )

  const renderRedirects = () => (
    <div className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Redirects Manager</h3>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>+ Add Redirect</button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Source Path</th>
            <th>Destination Path</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {redirects.length > 0 ? redirects.map(r => (
            <tr key={r.id}>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{r.source_path}</td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{r.destination_path}</td>
              <td>{r.type}</td>
              <td><span className={`${styles.badge} ${r.is_active ? styles.badgePublished : styles.badgeDraft}`}>{r.is_active ? 'Active' : 'Inactive'}</span></td>
            </tr>
          )) : (
            <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No redirects configured.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )

  if (loading) return <div className={styles.container}>Loading SEO tools...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>SEO Tools Suite</h1>
        <p className={styles.subtitle}>Manage keywords, content, redirects, and technical SEO.</p>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'dashboard' ? styles.tabActive : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`${styles.tab} ${activeTab === 'inspector' ? styles.tabActive : ''}`} onClick={() => setActiveTab('inspector')}>Page Inspector</button>
        <button className={`${styles.tab} ${activeTab === 'keywords' ? styles.tabActive : ''}`} onClick={() => setActiveTab('keywords')}>Keyword Tracker</button>
        <button className={`${styles.tab} ${activeTab === 'calendar' ? styles.tabActive : ''}`} onClick={() => setActiveTab('calendar')}>Content Calendar</button>
        <button className={`${styles.tab} ${activeTab === 'sitemap' ? styles.tabActive : ''}`} onClick={() => setActiveTab('sitemap')}>Sitemap</button>
        <button className={`${styles.tab} ${activeTab === 'redirects' ? styles.tabActive : ''}`} onClick={() => setActiveTab('redirects')}>Redirects</button>
      </div>

      <div>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'inspector' && renderInspector()}
        {activeTab === 'keywords' && renderKeywords()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'sitemap' && renderSitemap()}
        {activeTab === 'redirects' && renderRedirects()}
      </div>
    </div>
  )
}
