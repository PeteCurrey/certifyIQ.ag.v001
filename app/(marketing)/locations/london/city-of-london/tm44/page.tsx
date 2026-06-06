import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection City of London | Avorria',
  description: 'Statutory TM44 air conditioning inspections for commercial office buildings in the City of London (EC1-EC4). Registered CIBSE assessors.',
}

export default function CityOfLondonTm44() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria City of London TM44 Assessors',
    'image': 'https://avorria.co.uk/london_city_skyline.png',
    'telephone': '020 7946 0192',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '37th Floor, 1 Canada Square, Canary Wharf Estate',
      'addressLocality': 'London',
      'addressRegion': 'City of London',
      'postalCode': 'EC2N 2DB',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '51.5137',
      'longitude': '-0.0918',
    },
    'url': 'https://avorria.co.uk/locations/london/city-of-london/tm44',
    'priceRange': 'Bespoke Quote',
    'areaServed': [
      {
        '@type': 'AdministrativeArea',
        'name': 'City of London',
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
          <span className={styles.eyebrow}>Financial District AC Inspection</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspections City of London</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Ensure your cooling systems are EPBD compliant. Professional TM44 audits for banks, offices, and trading floor systems over 12kW in the City.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request TM44 Quote →
            </Link>
            <Link href="/locations/london/city-of-london/commercial-epc" className={styles.ctaSecondary}>
              Commercial EPCs
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Statutory Air Conditioning Inspections (EC1-EC4)</h2>
            <p className={styles.paragraph}>
              Under the Energy Performance of Buildings Regulations, air conditioning systems with an effective rated output of more than 12kW must be inspected by an accredited assessor every five years. Fines apply for missing or out-of-date TM44 reports.
            </p>
            <p className={styles.paragraph}>
              In the City of London, where trading floors, server rooms, and high-density office zones rely heavily on constant climate control, ensuring your VRF or chiller plant operates at peak efficiency is critical not only for legal compliance, but for lowering carbon taxes and operating costs.
            </p>
          </div>

          <div className={styles.pricingCard}>
            <h3 style={{ color: '#fff' }}>Get a Quote</h3>
            <p className={styles.priceIntro}>TM44 pricing depends on system tonnage and unit counts. Request a custom quote in minutes.</p>
            <Link href="/services/tm44" className={styles.bookButton}>
              Request AC Quote
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
