import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC City of London | Non-Domestic Energy Assessors | Avorria',
  description: 'Fast, accredited Commercial EPCs in the City of London (EC1-EC4). Financial offices, banking premises, retail units. Registered assessor visit from £185+VAT.',
}

export default function CityOfLondonCommercialEpc() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria City of London Commercial Energy Assessors',
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
    'url': 'https://avorria.co.uk/locations/london/city-of-london/commercial-epc',
    'priceRange': '£185-£595+',
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
          <span className={styles.eyebrow}>Financial District NDEA Specialist</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC City of London</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Professional non-domestic energy assessments across the Square Mile. Expert SBEM Level 3 &amp; 4 compliance reports for historical and modern commercial premises.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=EC2N2DB" className={styles.ctaPrimary}>
              Book City of London EPC →
            </Link>
            <Link href="/services/commercial-epc" className={styles.ctaSecondary}>
              Our Pricing Calculator
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Commercial Building Compliance (EC1, EC2, EC3, EC4)</h2>
            <p className={styles.paragraph}>
              Operating in the heart of London&apos;s financial sector, the City of London contains a complex mix of historic livery halls, heritage banking premises, and state-of-the-art office towers. Energy performance standards here demand non-domestic assessors who understand complex corporate configurations.
            </p>
            <p className={styles.paragraph}>
              Whether you are preparing a multi-floor lease near Liverpool Street, selling corporate premises in EC3, or managing a retail unit on Cheapside, a valid Commercial Energy Performance Certificate is a statutory legal requirement.
            </p>
            <div className={styles.featureBox}>
              <h3 style={{ color: '#fff' }}>City of London MEES Directives</h3>
              <ul className={styles.list}>
                <li><strong>Statutory Targets:</strong> Grade A to G buildings must meet C-rating guidelines by 2027.</li>
                <li><strong>Exemptions Support:</strong> We assist landlords in applying for the £3,500 spending cap and heritage exceptions.</li>
                <li><strong>Fast Delivery:</strong> Rapid 24-48 hour lodgement on the official national register.</li>
              </ul>
            </div>
          </div>

          <div className={styles.pricingCard}>
            <h3 style={{ color: '#fff' }}>City of London Rates</h3>
            <p className={styles.priceIntro}>Fixed commercial rates excluding VAT. Includes assessor visit &amp; lodgement.</p>
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
            <Link href="/book?service=commercial&postcode=EC2N2DB" className={styles.bookButton}>
              Book Assessment Now
            </Link>
            <span className={styles.pricingNotes}>* Floor areas over 1,000m² and Level 4 systems are priced on individual scope of work.</span>
          </div>
        </section>
      </div>
    </div>
  )
}
