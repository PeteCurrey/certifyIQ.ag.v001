import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './developer.module.css'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://avorria.co.uk/developer',
  },
  openGraph: {
    url: 'https://avorria.co.uk/developer',
  },
  title: 'Property Developer Compliance Wizard',
  description: 'The UK\'s most useful new build compliance planning tool. Instantly identify required reports, testing, and compliance services for your development project.',
}

export default function DeveloperLandingPage() {
  const services = [
    { title: 'SAP Calculations', icon: '📐' },
    { title: 'Part L Compliance', icon: '✅' },
    { title: 'Air Tightness Testing', icon: '🌬️' },
    { title: 'Water Calculations', icon: '💧' },
    { title: 'Overheating Assessments', icon: '🌡️' },
    { title: 'BRUKL Reports', icon: '🏢' },
    { title: 'On Construction EPCs', icon: '📄' },
    { title: 'Energy Consultancy', icon: '💡' },
  ]

  const users = [
    'Architects', 'Property Developers', 'House Builders', 'Self Builders', 
    'Planning Consultants', 'Project Managers', 'Commercial Developers'
  ]

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>New Tool</span>
            <span className={styles.badge}>Elmhurst Accredited</span>
          </div>
          <h1 className={styles.title}>
            The Intelligent Compliance Planner<br />
            <span className={styles.titleHighlight}>For UK Property Developers.</span>
          </h1>
          <p className={styles.subtitle}>
            Instantly determine which reports, tests, and EPCs your project needs to meet Building Regulations. Get a custom roadmap, risk analysis, and estimated costs in 60 seconds.
          </p>
          
          <div className={styles.heroActions}>
            <Link href="/developer/wizard" className={styles.primaryCta}>
              Launch Compliance Wizard →
            </Link>
            <p className={styles.heroNote}>Free to use. No account required.</p>
          </div>
        </div>
      </section>

      {/* Target Users Strip */}
      <section className={styles.usersStrip}>
        <p className={styles.usersLabel}>Trusted by professionals across the UK:</p>
        <div className={styles.usersList}>
          {users.map((u, i) => (
            <span key={i} className={styles.userItem}>{u}</span>
          ))}
        </div>
      </section>

      {/* Value Prop Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresInner}>
          <h2 className={styles.sectionTitle}>Stop guessing at Building Regulations.</h2>
          <p className={styles.sectionDesc}>
            Navigating Part L, Part O, and Part G can be complex. Our AI-driven wizard acts as your digital compliance consultant.
          </p>

          <div className={styles.featureGrid}>
             <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🗺️</div>
                <h3>Instant Roadmap</h3>
                <p>Answer 6 simple questions about your project and we'll generate a timeline of exactly what you need and when you need it.</p>
             </div>
             <div className={styles.featureCard}>
                <div className={styles.featureIcon}>⚠️</div>
                <h3>Risk Identification</h3>
                <p>We flag potential delays, missing reports, and regulatory risks before they impact your construction schedule.</p>
             </div>
             <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💷</div>
                <h3>Cost Forecasting</h3>
                <p>Get immediate, transparent estimated pricing ranges for all required compliance services.</p>
             </div>
             <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📑</div>
                <h3>Downloadable Plan</h3>
                <p>Generate a professional, print-ready compliance action plan to share with your client or project team.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesInner}>
          <h2 className={styles.sectionTitle}>Everything under one roof.</h2>
          <p className={styles.sectionDesc}>Avorria provides end-to-end compliance services for residential and commercial developments.</p>
          
          <div className={styles.servicesGrid}>
            {services.map((s, i) => (
              <div key={i} className={styles.serviceItem}>
                <span className={styles.serviceIcon}>{s.icon}</span>
                <span className={styles.serviceTitle}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <h2 className={styles.ctaTitle}>Ready to plan your project?</h2>
        <Link href="/developer/wizard" className={styles.primaryCta}>
          Start the Wizard
        </Link>
      </section>
    </div>
  )
}
