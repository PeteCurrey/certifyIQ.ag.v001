import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC London | Non-Domestic Energy Assessors | Avorria',
  description: 'Accredited Commercial EPC (NDEA Level 3 & 4) assessments across Greater London. Office, retail, and industrial buildings. Fast 24-hr turnaround from £185+VAT.',
  keywords: ['Commercial EPC London', 'NDEA London', 'Non domestic energy assessment London', 'Canary Wharf Commercial EPC'],
}

const BOROUGHS = [
  {
    name: 'City of London',
    slug: 'city-of-london',
    postcode: 'EC1A',
    desc: 'Bespoke SBEM assessments for corporate offices and financial premises across EC1-EC4.',
  },
  {
    name: 'Canary Wharf & Docklands',
    slug: 'canary-wharf',
    postcode: 'E14',
    desc: 'Level 4 and complex multi-zone commercial energy performance assessments in Canary Wharf.',
  },
  {
    name: 'Westminster',
    slug: 'westminster',
    postcode: 'SW1A',
    desc: 'Energy compliance audits for government departments, premium retail, and offices in SW1.',
  }
]

export default function LondonCommercialEpcHub() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria London Commercial Energy Assessors',
    'image': 'https://avorria.co.uk/logo.png',
    'telephone': '020 7946 0192',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '37th Floor, 1 Canada Square, Canary Wharf Estate',
      'addressLocality': 'London',
      'postalCode': 'E14 5AA',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '51.5054',
      'longitude': '-0.0235',
    },
    'url': 'https://avorria.co.uk/locations/london/commercial-epc',
    'priceRange': '£185-£595+',
    'areaServed': [
      {
        '@type': 'AdministrativeArea',
        'name': 'Greater London',
      }
    ],
  }

  return (
    <div style={{ background: '#080D18', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section 
        className={styles.heroFullScreen}
        style={{ backgroundImage: 'url(/london_city_skyline.png)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Greater London Commercial NDEA</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC London</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Fully accredited Non-Domestic Energy Assessors (NDEA Levels 3 &amp; 4) providing fast SBEM certificates for commercial and public buildings across London.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.ctaPrimary}>
              Book Assessment in London →
            </Link>
            <Link href="#boroughs" className={styles.ctaSecondary}>
              Select Your Borough
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section id="boroughs" style={{ marginBottom: '5rem' }}>
          <h2 style={{ textAlign: 'center', color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>London Coverage Areas</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            Select your specific London district below to see local pricing structure, case studies, and compliance regulations.
          </p>
          
          <div className={styles.linksGrid}>
            {BOROUGHS.map((b) => (
              <div key={b.slug} className={styles.linkCard}>
                <div>
                  <h3>{b.name} ({b.postcode})</h3>
                  <p>{b.desc}</p>
                </div>
                <Link href={`/locations/london/${b.slug}/commercial-epc`} className={styles.linkCardAction}>
                  View {b.name} EPC Page →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>London Non-Domestic Energy Certificates</h2>
            <p className={styles.paragraph}>
              Avorria delivers commercial energy assessments for institutional investors, letting agents, public bodies, and private commercial landlords across Greater London. Our regional office in Canary Wharf (37th Floor, 1 Canada Square) positions us perfectly to coordinate rapid inspections.
            </p>
            <p className={styles.paragraph}>
              With tightening MEES (Minimum Energy Efficiency Standard) requirements mandating that all commercial rental spaces reach a minimum rating of C by 2027 and B by 2030, our reports provide clear, cost-benefit ranked improvement recommendations to protect your property asset valuations.
            </p>
          </div>

          <div className={styles.pricingCard}>
            <h3 style={{ color: '#fff' }}>London Pricing Tiers</h3>
            <p className={styles.priceIntro}>Fixed commercial rates excluding VAT. Validated for standard Level 3 layouts.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}>
                <span>Up to 100m²</span>
                <strong>£185</strong>
              </div>
              <div className={styles.priceRow}>
                <span>101 - 250m²</span>
                <strong>£275</strong>
              </div>
              <div className={styles.priceRow}>
                <span>251 - 500m²</span>
                <strong>£375</strong>
              </div>
              <div className={styles.priceRow}>
                <span>501 - 750m²</span>
                <strong>£475</strong>
              </div>
              <div className={styles.priceRow}>
                <span>751 - 1000m²</span>
                <strong>£595</strong>
              </div>
            </div>
            <Link href="/book?service=commercial" className={styles.bookButton}>
              Book London EPC
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
