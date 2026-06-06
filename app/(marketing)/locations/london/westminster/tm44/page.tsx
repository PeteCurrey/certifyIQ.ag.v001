import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection Westminster | Avorria',
  description: 'Statutory TM44 air conditioning inspections for commercial and government properties in Westminster. Accredited CIBSE energy assessors.',
}

export default function WestminsterTm44() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Westminster TM44 Assessors',
    'image': 'https://avorria.co.uk/london_westminster_offices.png',
    'telephone': '020 7946 0192',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '37th Floor, 1 Canada Square, Canary Wharf Estate',
      'addressLocality': 'London',
      'postalCode': 'SW1A 1AA',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '51.4975',
      'longitude': '-0.1357',
    },
    'url': 'https://avorria.co.uk/locations/london/westminster/tm44',
    'priceRange': 'Bespoke Quote',
    'areaServed': [
      {
        '@type': 'AdministrativeArea',
        'name': 'City of Westminster',
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
        style={{ backgroundImage: 'url(/london_westminster_offices.png)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Westminster AC Inspection Compliance</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspections Westminster</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Ensure legally certified operations for cooling plant installations over 12kW in public and private commercial properties.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request Westminster TM44 Quote →
            </Link>
            <Link href="/locations/london/westminster/commercial-epc" className={styles.ctaSecondary}>
              Westminster EPCs
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Westminster Heritage &amp; Modern AC Compliance</h2>
            <p className={styles.paragraph}>
              The City of Westminster contains both classic listed architectural properties (with retrofitted AC units) and modern glazed corporate buildings. Navigating TM44 compliance here requires detailed technical skill to locate all cooling elements and verify efficiency indicators against original building permits.
            </p>
            <p className={styles.paragraph}>
              Avorria helps commercial landlords, public authorities, and office occupiers satisfy regulatory requirements quickly. All inspections include a fully accredited certificate logged on the Landmark database.
            </p>
          </div>

          <div className={styles.pricingCard}>
            <h3 style={{ color: '#fff' }}>Request a Proposal</h3>
            <p className={styles.priceIntro}>Fast turnarounds on compliance proposals. Talk to our London team today.</p>
            <Link href="/services/tm44" className={styles.bookButton}>
              Request Quote
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
