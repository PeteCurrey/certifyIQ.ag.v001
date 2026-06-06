import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection Canary Wharf | Avorria',
  description: 'Statutory TM44 air conditioning inspections for commercial tower buildings in Canary Wharf & Docklands (E14). CIBSE registered assessors.',
}

export default function CanaryWharfTm44() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Canary Wharf TM44 Assessors',
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
    'url': 'https://avorria.co.uk/locations/london/canary-wharf/tm44',
    'priceRange': 'Bespoke Quote',
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
          <span className={styles.eyebrow}>Skyscraper AC Systems Compliance</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspections Canary Wharf</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Accredited air conditioning efficiency assessments for Docklands commercial property portfolios. Located at 1 Canada Square.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request E14 TM44 Quote →
            </Link>
            <Link href="/locations/london/canary-wharf/commercial-epc" className={styles.ctaSecondary}>
              Canary Wharf EPCs
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Chiller &amp; VRF Inspections in Canary Wharf</h2>
            <p className={styles.paragraph}>
              Avorria conducts TM44 inspections for many of the largest central air conditioning setups in Canary Wharf and the wider Docklands region. Our assessors have extensive experience dealing with massive building management systems (BMS), high-volume refrigerant structures, and modern variable flow networks.
            </p>
            <p className={styles.paragraph}>
              With our London team operating out of 1 Canada Square, we can swiftly schedule onsite visits, conduct visual audits, and provide detailed reporting on system design, maintenance parameters, controls, and carbon emissions.
            </p>
          </div>

          <div className={styles.pricingCard}>
            <h3 style={{ color: '#fff' }}>Request a Quote</h3>
            <p className={styles.priceIntro}>Fast, professional TM44 proposals for Docklands buildings. Get in touch with our commercial leads.</p>
            <Link href="/services/tm44" className={styles.bookButton}>
              Get Custom Quote
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
