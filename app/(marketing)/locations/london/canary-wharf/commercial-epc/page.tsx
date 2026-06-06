import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC Canary Wharf | Non-Domestic Energy Assessors | Avorria',
  description: 'Accredited NDEA Level 4 Commercial EPCs in Canary Wharf & Docklands (E14). Office towers, corporate buildings. Fast turnaround from £185+VAT.',
}

export default function CanaryWharfCommercialEpc() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Canary Wharf Commercial Energy Assessors',
    'image': 'https://avorria.co.uk/canary_wharf_towers.png',
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
    'url': 'https://avorria.co.uk/locations/london/canary-wharf/commercial-epc',
    'priceRange': '£185-£595+',
    'areaServed': [
      {
        '@type': 'AdministrativeArea',
        'name': 'Canary Wharf',
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
        style={{ backgroundImage: 'url(/canary_wharf_towers.png)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Docklands Premier Energy Assessors</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC Canary Wharf</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Accredited NDEA Level 4 energy audits for skyscrapers, financial headquarters, and multi-tenant assets in Docklands E14. Based at 1 Canada Square.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.ctaPrimary}>
              Book E14 Assessment →
            </Link>
            <Link href="/services/commercial-epc" className={styles.ctaSecondary}>
              Pricing &amp; Levels
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Premium Office &amp; Retail Energy Compliance (E14)</h2>
            <p className={styles.paragraph}>
              With our London operations based in the iconic 37th Floor of 1 Canada Square, Canary Wharf Estate, Avorria is exceptionally integrated into the Docklands commercial property ecosystem. Modern offices in E14 utilize centralized HVAC, complex chillers, and district heating systems that require Level 4 NDEA capabilities.
            </p>
            <p className={styles.paragraph}>
              Our assessors coordinate with facilities management, building services, and operations teams to model complex thermal envelopes without interrupting everyday business operations.
            </p>
          </div>

          <div className={styles.pricingCard}>
            <h3 style={{ color: '#fff' }}>Docklands Standard Rates</h3>
            <p className={styles.priceIntro}>Fixed commercial rates excluding VAT. Standard Level 3 layouts.</p>
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
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.bookButton}>
              Book Assessment Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
