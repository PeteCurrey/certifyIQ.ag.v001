import React from 'react'
import Link from 'next/link'
import { Sparkles, FileText, Upload, ChevronRight, Shield, Zap, TrendingUp } from 'lucide-react'
import styles from '../../ai-analyser/analyser.module.css'

export async function generateStaticParams() {
  const locations = [
    'london', 'birmingham', 'manchester', 'leeds', 'sheffield', 
    'liverpool', 'bristol', 'nottingham', 'leicester', 'derby', 
    'chesterfield', 'matlock', 'belper', 'bakewell', 'buxton'
  ]
  return locations.map(l => ({ location: l }))
}

export async function generateMetadata({ params }: { params: { location: string } }) {
  const { location } = await params
  const locTitle = location.charAt(0).toUpperCase() + location.slice(1)
  return {
    title: `Free EPC Analysis in ${locTitle} | Avorria AI`,
    description: `Upload your EPC in ${locTitle} and get an instant, plain-English explanation of your property's energy rating and improvement costs using AI.`,
  }
}

export default async function LocationEpcAnalysisPage({ params }: { params: { location: string } }) {
  const { location } = await params
  const locTitle = location.charAt(0).toUpperCase() + location.slice(1)

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot}></span>
            Property Compliance AI — {locTitle}
          </div>
          <h1 className={styles.heroTitle}>
            Free AI EPC Analysis for properties in <span className={styles.heroGradient}>{locTitle}</span>
          </h1>
          <p className={styles.heroSub}>
            Stop guessing what your Energy Performance Certificate means. Upload any EPC for a property in {locTitle} and let our AI translate it into a clear improvement roadmap with local cost estimates.
          </p>
          
          <Link href="/tools/ai-analyser" style={{ textDecoration: 'none' }}>
            <button className={styles.analyseBtn} style={{ width: 'auto', padding: '1.25rem 2.5rem', margin: '0 auto 2rem' }}>
              <Upload size={20} />
              Upload your EPC for Free Analysis
            </button>
          </Link>
          
          <div className={styles.uploadFooter}>
            <Shield size={14} /> Secure · Powered by Claude 3.5 Sonnet · Takes 60 seconds
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustGrid}>
          <div className={styles.trustCard}>
            <span className={styles.trustIcon}>🏘️</span>
            <h4 className={styles.trustTitle}>Local to {locTitle}</h4>
            <p className={styles.trustDesc}>Understanding the specific housing stock and compliance needs for landlords and owners in {locTitle}.</p>
          </div>
          <div className={styles.trustCard}>
            <span className={styles.trustIcon}>📖</span>
            <h4 className={styles.trustTitle}>Plain English</h4>
            <p className={styles.trustDesc}>Technical jargon translated into clear, simple advice you can actually understand.</p>
          </div>
          <div className={styles.trustCard}>
            <span className={styles.trustIcon}>💰</span>
            <h4 className={styles.trustTitle}>Cost Estimates</h4>
            <p className={styles.trustDesc}>Realistic pricing for every recommended improvement based on current market rates.</p>
          </div>
          <div className={styles.trustCard}>
            <span className={styles.trustIcon}>🤖</span>
            <h4 className={styles.trustTitle}>Ask Questions</h4>
            <p className={styles.trustDesc}>Chat directly with the AI about your specific property and get instant answers.</p>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', lineHeight: 1.6, color: '#8BA3BF' }}>
        <h2 style={{ color: '#E8F4FF', fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Syne, sans-serif' }}>
          Why {locTitle} landlords need to check their EPCs
        </h2>
        <p style={{ marginBottom: '2rem' }}>
          With MEES regulations tightening, property owners in {locTitle} need to ensure their portfolios meet the minimum 'E' rating. If your property is rated F or G, you cannot legally let it out to new or existing tenants. Our AI tool analyses your certificate and gives you a step-by-step roadmap to compliance.
        </p>

        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '2rem', borderRadius: '12px', marginTop: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: '#E8F4FF', fontSize: '1.5rem', marginBottom: '1rem' }}>Get your free analysis</h3>
          <p style={{ marginBottom: '1.5rem' }}>Upload your certificate PDF or a photo of it now.</p>
          <Link href="/tools/ai-analyser" style={{ color: '#9BFF59', fontWeight: 'bold', textDecoration: 'none' }}>
            Go to AI Analyser →
          </Link>
        </div>
      </section>
    </div>
  )
}
