import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection London | Avorria',
  description: 'Legally mandated TM44 air conditioning inspections for commercial and public buildings across Greater London. Accredited AC energy assessors.',
  keywords: ['TM44 London', 'Air conditioning inspection London', 'EPBD compliance London', 'Canary Wharf TM44'],
}

const BOROUGHS = [
  {
    name: 'City of London',
    slug: 'city-of-london',
    postcode: 'EC1A',
    desc: 'Bespoke TM44 assessments for air conditioning systems in corporate and banking headquarters.',
  },
  {
    name: 'Canary Wharf & Docklands',
    slug: 'canary-wharf',
    postcode: 'E14',
    desc: 'Multi-zone VRF and central chiller system TM44 inspections for Canary Wharf skyscrapers.',
  },
  {
    name: 'Westminster',
    slug: 'westminster',
    postcode: 'SW1A',
    desc: 'Government buildings and luxury hospitality AC cooling efficiency audits in Westminster.',
  }
]

export default function LondonTm44Hub() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria London TM44 Assessors',
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
    'url': 'https://avorria.co.uk/locations/london/tm44',
    'priceRange': 'Bespoke Quote',
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
          <span className={styles.eyebrow}>London AC Energy Compliance</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspections London</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Ensure legal compliance under EPBD. Professional TM44 air conditioning inspections for systems over 12kW throughout London.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Get a TM44 Quote →
            </Link>
            <Link href="#boroughs" className={styles.ctaSecondary}>
              Select Your Borough
            </Link>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section id="boroughs" style={{ marginBottom: '5rem' }}>
          <h2 style={{ textAlign: 'center', color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>London TM44 Inspection Coverage</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            Choose a location for tailored AC inspection criteria, building guidelines, and local contacts.
          </p>
          
          <div className={styles.linksGrid}>
            {BOROUGHS.map((b) => (
              <div key={b.slug} className={styles.linkCard}>
                <div>
                  <h3>{b.name} ({b.postcode})</h3>
                  <p>{b.desc}</p>
                </div>
                <Link href={`/locations/london/${b.slug}/tm44`} className={styles.linkCardAction}>
                  View {b.name} TM44 Page →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
