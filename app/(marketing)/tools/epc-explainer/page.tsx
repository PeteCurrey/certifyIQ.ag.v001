import React from 'react'
import Link from 'next/link'
import { Sparkles, FileText, Upload, ChevronRight, Shield, Zap, TrendingUp } from 'lucide-react'
import styles from '../ai-analyser/analyser.module.css' // Reuse the same premium styles

export const metadata = {
  title: 'AI EPC Explainer & Certificate Analyser | Avorria',
  description: 'Upload your Energy Performance Certificate (EPC) and get an instant, plain-English explanation of your rating, risks, and improvement costs using AI.',
}

export default function EpcExplainerPage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot}></span>
            EPC AI Intelligence
          </div>
          <h1 className={styles.heroTitle}>
            What does your EPC <span className={styles.heroGradient}>actually mean?</span>
          </h1>
          <p className={styles.heroSub}>
            Stop guessing what "Cavity wall insulation (assumed)" means. Upload your Energy Performance Certificate and let our AI translate it into a clear, actionable improvement roadmap with estimated costs.
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

      {/* Trust Section (Reused) */}
      <section className={styles.trustSection}>
        <div className={styles.trustGrid}>
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
            <span className={styles.trustIcon}>⚖️</span>
            <h4 className={styles.trustTitle}>MEES Risks</h4>
            <p className={styles.trustDesc}>Instant analysis of your legal exposure if you're renting the property out.</p>
          </div>
          <div className={styles.trustCard}>
            <span className={styles.trustIcon}>🤖</span>
            <h4 className={styles.trustTitle}>Ask Questions</h4>
            <p className={styles.trustDesc}>Chat directly with the AI about your specific property and get instant answers.</p>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', lineHeight: 1.6, color: '#8BA3BF' }}>
        <h2 style={{ color: '#E8F4FF', fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Syne, sans-serif' }}>How to read an Energy Performance Certificate</h2>
        <p style={{ marginBottom: '2rem' }}>
          An Energy Performance Certificate (EPC) provides a rating for the energy efficiency of a property. It is legally required whenever a property is built, sold, or rented in the UK. The rating is from A (most efficient) to G (least efficient).
        </p>

        <h3 style={{ color: '#E8F4FF', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem' }}>The MEES Regulations (Landlords)</h3>
        <p style={{ marginBottom: '2rem' }}>
          If you are a landlord, the Minimum Energy Efficiency Standards (MEES) dictate that your property must hold a rating of E or higher to be legally let. If your EPC says F or G, you are breaking the law and face fines of up to £30,000. Our AI analyser instantly flags MEES exposure and tells you exactly what improvements are needed to reach an E rating.
        </p>

        <h3 style={{ color: '#E8F4FF', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem' }}>How much do EPC improvements cost?</h3>
        <p style={{ marginBottom: '2rem' }}>
          While standard EPCs provide rough cost brackets (e.g. £4,000 - £6,000 for solid wall insulation), these are often outdated. The Avorria AI Explainer looks at your specific property type, floor area, and the current market to provide a more realistic cost roadmap. 
        </p>

        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '2rem', borderRadius: '12px', marginTop: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: '#E8F4FF', fontSize: '1.5rem', marginBottom: '1rem' }}>Ready to understand your EPC?</h3>
          <p style={{ marginBottom: '1.5rem' }}>Upload your certificate PDF or a photo of it now.</p>
          <Link href="/tools/ai-analyser" style={{ color: '#9BFF59', fontWeight: 'bold', textDecoration: 'none' }}>
            Go to AI Analyser →
          </Link>
        </div>
      </section>
    </div>
  )
}
