import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC Westminster | Non-Domestic Energy Assessors | Avorria',
  description: 'Accredited Commercial EPCs in Westminster (SW1, WC2). Government facilities, historical buildings, prestige retail. Turnaround from £185+VAT.',
}

export default function WestminsterCommercialEpc() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Westminster Commercial Energy Assessors',
    'image': 'https://avorria.co.uk/london_westminster_offices.png',
    'telephone': '020 7946 0192',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '37th Floor, 1 Canada Square, Canary Wharf Estate',
      'addressLocality': 'London',
      'addressRegion': 'Westminster',
      'postalCode': 'SW1A 1AA',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '51.4975',
      'longitude': '-0.1357',
    },
    'url': 'https://avorria.co.uk/locations/london/westminster/commercial-epc',
    'priceRange': '£185-£595+',
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
          <span className={styles.eyebrow}>Heritage &amp; Corporate Specialist NDEA</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC Westminster</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Tailored SBEM energy modeling for listed buildings, government headquarters, and premium commercial retail portfolios in SW1 &amp; surrounding areas.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=SW1A1AA" className={styles.ctaPrimary}>
              Book Westminster EPC →
            </Link>
            <Link href="/services/display-energy-certificate" className={styles.ctaSecondary}>
              DEC Certifications
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Prestige Commercial Property Compliance in Westminster</h2>
            <p className={styles.paragraph}>
              Westminster encompasses some of the country&apos;s most high-profile properties, including the government facilities of Whitehall, high-end offices in Mayfair and Victoria, and the flagship retail zones of Oxford Street. Balancing energy efficiency improvements with conservation and heritage requirements demands qualified energy assessors.
            </p>
            <p className={styles.paragraph}>
              At Avorria, we provide detailed building models that isolate thermal performance, helping landlords make intelligent insulation, HVAC, and lighting upgrades that align with conservation regulations.
            </p>
          </div>

          <div className={styles.pricingCard}>
            <h3 style={{ color: '#fff' }}>Westminster Rates</h3>
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
            <Link href="/book?service=commercial&postcode=SW1A1AA" className={styles.bookButton}>
              Book Assessment Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
