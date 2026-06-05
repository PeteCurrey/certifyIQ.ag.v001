import React from 'react'
import Link from 'next/link'
import styles from './services.module.css'

const SERVICES = [
  {
    title: 'Domestic EPC',
    icon: '🏠',
    desc: 'Energy Performance Certificates for existing homes, legally required before selling or letting a residential property.',
    facts: [
      'From £65 (no hidden fees)',
      'Certificate issued within 24 hours',
      'Valid for 10 years'
    ],
    learnMore: '/estimate',
    bookUrl: '/book?service=domestic'
  },
  {
    title: 'Commercial EPC',
    icon: '🏢',
    desc: 'Simplified Building Energy Model (SBEM) assessments and certification for commercial premises, offices, and retail units.',
    facts: [
      'Level 3 & 4 assessments available',
      'Approved SBEM calculations',
      'Fully accredited NDEA assessors'
    ],
    learnMore: '/services/commercial-epc',
    bookUrl: '/book?service=commercial'
  },
  {
    title: 'On-Construction EPC & SAP',
    icon: '👷',
    desc: 'Comprehensive energy modeling for new builds, conversions, and large extensions to secure Building Control approval.',
    facts: [
      'Design stage calculations + PEA',
      'As-built SAP calculations + OC-EPC',
      'Part L1A building regulations support'
    ],
    learnMore: '/services/new-build-epc',
    bookUrl: '/services/new-build-epc#book-sap'
  },
  {
    title: 'Air Tightness Testing',
    icon: '💨',
    desc: 'Blower door tests to measure envelope leakage on new build residential plots, ensuring compliance with Part L.',
    facts: [
      'ATTMA accredited testing engineers',
      'Results on site (m³/h/m² @ 50Pa)',
      'Same-day re-test at no extra charge'
    ],
    learnMore: '/services/air-tightness',
    bookUrl: '/book?service=air_tightness_domestic'
  },
  {
    title: 'Commercial Air Tightness',
    icon: '🏭',
    desc: 'Large-scale air permeability testing for non-domestic developments and commercial properties to satisfy Part L2A.',
    facts: [
      'ATTMA TS2 standards compliance',
      'Calibrated multi-fan equipment',
      'Covers all non-domestic structures'
    ],
    learnMore: '/services/air-tightness',
    bookUrl: '/book?service=air_tightness_commercial'
  }
]

const COMPARISONS = [
  { situation: 'Selling or renting an existing home', service: 'Domestic EPC' },
  { situation: 'Selling or renting a shop / office / warehouse', service: 'Commercial EPC' },
  { situation: 'Building a new home or conversion', service: 'On-Construction EPC + SAP' },
  { situation: 'Building work nearly complete', service: 'Air Tightness Test + As-Built SAP' },
  { situation: 'Selling a new home off-plan', service: 'Predicted Energy Assessment (PEA)' },
  { situation: 'Extending or converting a property', service: 'SAP Calculation (Part L1B)' }
]

export default function ServicesHubPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Accredited Energy Compliance</span>
          <h1 className={styles.h1}>Every energy compliance service. One accredited team.</h1>
          <p className={styles.sub}>
            Domestic EPCs, commercial assessments, on-construction SAP calculations and Part L air tightness testing across Chesterfield and Derbyshire.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.gridSection}>
        <div className={styles.inner}>
          <div className={styles.grid}>
            {SERVICES.map((srv, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.icon}>{srv.icon}</span>
                  <h3 className={styles.cardTitle}>{srv.title}</h3>
                </div>
                <p className={styles.cardDesc}>{srv.desc}</p>
                <ul className={styles.facts}>
                  {srv.facts.map((fact, fidx) => (
                    <li key={fidx} className={styles.fact}>
                      <span className={styles.bullet}>✓</span> {fact}
                    </li>
                  ))}
                </ul>
                <div className={styles.ctas}>
                  <Link href={srv.learnMore} className={styles.btnGhost}>
                    Learn More
                  </Link>
                  <Link href={srv.bookUrl} className={styles.btnPrimary}>
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Band */}
      <section className={styles.urgency}>
        <div className={styles.urgencyInner}>
          <div className={styles.urgencyIcon}>⚠️</div>
          <div className={styles.urgencyContent}>
            <p className={styles.urgencyText}>
              <strong>Commercial landlords:</strong> new MEES standards require EPC C by April 2027 and EPC B by April 2030. Fines up to £50,000 for non-compliance.
            </p>
            <Link href="/services/commercial-epc" className={styles.urgencyCta}>
              Check your commercial property →
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className={styles.comparison}>
        <div className={styles.inner}>
          <h2 className={styles.sectionTitle}>Which service do you need?</h2>
          <p className={styles.sectionSub}>Find the right compliance path for your specific project type</p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Your situation</th>
                  <th>Service needed</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISONS.map((comp, idx) => (
                  <tr key={idx}>
                    <td>{comp.situation}</td>
                    <td className={styles.highlightCol}>{comp.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
