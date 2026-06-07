import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london/london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection Leicester',
  description: 'Accredited TM44 air conditioning inspections in Leicester and Leicestershire. Avoid the £300 fine. Covering LE1–LE19. Book online for same-week availability.',
  alternates: { canonical: 'https://avorria.co.uk/locations/leicester/tm44' },
  openGraph: {
    title: 'TM44 Leicester | Air Conditioning Inspections',
    description: 'Accredited TM44 inspections for Leicester commercial premises with AC systems over 12kW. Fixed pricing, 5-year compliance certificate.',
    url: 'https://avorria.co.uk/locations/leicester/tm44',
  },
}

const REVIEWS = [
  {
    text: 'Our Granby Street offices had never had a TM44. Avorria made the whole process straightforward — inspected all our cassette units, provided a comprehensive report, and issued our compliance certificate the same week.',
    name: 'Meera Subramaniam',
    role: 'Office Manager, Leicester City Centre',
    stars: 5,
  },
  {
    text: 'We manage a small commercial portfolio in Leicestershire and needed TM44s for three properties. Avorria scheduled all three efficiently, offered a good multi-site rate, and the reports were thorough and well presented.',
    name: 'Colin Westwood',
    role: 'Portfolio Manager, Leicestershire Commercial',
    stars: 5,
  },
  {
    text: 'Fast, professional, and genuinely useful. Our Leicester retail unit\'s AC system was significantly oversized — we\'d never have known without the TM44. The recommendations are already saving us money.',
    name: 'Fatima Hassan',
    role: 'Retail Operations Director, East Midlands',
    stars: 5,
  },
]

const AC_SYSTEMS = [
  { type: 'Split Units', typical: 'Offices, retail', threshold: 'Combined total exceeds 12kW', notes: 'Most common in Leicester city centre offices and Highcross units' },
  { type: 'VRF / VRV Systems', typical: 'Multi-floor offices, hotels', threshold: 'Almost always exceeds 12kW', notes: 'Common in newer LE1 office developments' },
  { type: 'Chiller Systems', typical: 'Large commercial, university', threshold: 'Always exceeds 12kW', notes: 'UoL and DMU campuses, larger hotels' },
  { type: 'Cassette Units', typical: 'Open-plan offices, retail', threshold: 'Check combined kW rating', notes: 'Very common across Fosse Park and Meridian Business Park' },
]

export default function LeicesterTM44Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria TM44 Inspections Leicester',
    'telephone': '{SITE_CONFIG.phone}',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Leicester',
      'addressRegion': 'Leicestershire',
      'postalCode': 'LE1 5YB',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '52.6369',
      'longitude': '-1.1398',
    },
    'url': 'https://avorria.co.uk/locations/leicester/tm44',
    'priceRange': '£295–£795+',
    'areaServed': [
      { '@type': 'City', 'name': 'Leicester' },
      { '@type': 'AdministrativeArea', 'name': 'Leicestershire' },
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '22',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Do I need a TM44 inspection in Leicester?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, if the combined cooling output of your Leicester building\'s air conditioning systems exceeds 12kW. This covers split units, VRF systems, cassette units, and chillers — their total combined output determines whether TM44 applies.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How much does a TM44 inspection cost in Leicester?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'TM44 inspections in Leicester start from £295 + VAT for smaller systems, scaling by system complexity and number of units. Multi-site Leicestershire discounts are available.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How often is a TM44 required for a Leicester commercial property?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Every 5 years. If you have recently taken over a Leicester building with no inspection history, you must arrange a TM44 inspection within 3 months of taking control.',
        },
      },
    ],
  }

  return (
    <div style={{ background: '#080D18', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* HERO */}
      <section
        className={styles.heroFullScreen}
        style={{ background: 'linear-gradient(135deg, #080D18 0%, #0b1926 50%, #080D18 100%)' }}
      >
        <div className={styles.heroOverlay} style={{ background: 'linear-gradient(180deg, rgba(8,13,24,0.2) 0%, rgba(8,13,24,0.85) 100%)' }} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Leicester TM44 Air Conditioning Compliance</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspection Leicester</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Accredited TM44 air conditioning inspections for Leicester commercial premises.
            Avoid the £300 Trading Standards fine. Fast, professional inspections covering all system types
            across LE1–LE19 and Leicestershire. Same-week availability.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=tm44&city=leicester" className={styles.ctaPrimary}>
              Book TM44 Leicester →
            </Link>
            <Link href="/services/tm44" className={styles.ctaSecondary}>
              About TM44 Inspections
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⚡</span><span><strong>Same-week</strong> availability</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>🛡️</span><span><strong>5-year</strong> compliance certificate</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>📍</span><span>Covering all <strong>LE1–LE19</strong> postcodes</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⭐</span><span><strong>4.9/5</strong> from 22+ TM44 reviews</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>💷</span><span>Avoid the <strong>£300 fine</strong></span></div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>TM44 Compliance for Leicester Businesses</h2>
            <p className={styles.paragraph}>
              Leicester's commercial sector — from LE1 city centre offices and Highcross retail to the Meridian Business Park, Fosse Park retail complex, and industrial estates at Thurmaston and Wigston — contains a large volume of air-conditioned space falling within the mandatory TM44 inspection regime.
            </p>
            <p className={styles.paragraph}>
              Avorria's Leicester TM44 assessors are fully accredited under the CIBSE TM44 framework and cover all system types — from basic split-unit installations in converted Victorian offices to complex VRF systems in modern office towers and university buildings. We complete inspections, produce reports, and issue 5-year compliance certificates in a single mobilisation.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>£300</span>
                <span className={styles.statLabel}>Fine per building for non-compliance</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>5yr</span>
                <span className={styles.statLabel}>Mandatory inspection cycle</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>12kW</span>
                <span className={styles.statLabel}>Combined cooling threshold for TM44</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>Leicester AC System Types &amp; TM44 Requirements</h3>
            <p className={styles.paragraph}>
              The 12kW threshold applies to the <strong>combined effective rated output</strong> of all AC systems in a building — not each unit individually. A Leicester office with three 5kW cassette units (15kW combined) requires a TM44 inspection, even though each unit is below the threshold on its own.
            </p>
            <table className={styles.acTable}>
              <thead>
                <tr>
                  <th>System Type</th>
                  <th>Typical Leicester Usage</th>
                  <th>TM44 Threshold</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {AC_SYSTEMS.map((s, i) => (
                  <tr key={i}>
                    <td>{s.type}</td>
                    <td>{s.typical}</td>
                    <td>{s.threshold}</td>
                    <td>{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.featureBox}>
              <h3>What Our Leicester TM44 Inspection Covers</h3>
              <ul className={styles.list}>
                <li><strong>Full equipment inspection:</strong> All indoor and outdoor AC units across your Leicester premises — splits, cassettes, AHUs, condensers, and VRF/VRV multi-splits.</li>
                <li><strong>Maintenance records review:</strong> F-Gas logs, service records, and refrigerant leak check documentation reviewed against regulatory requirements.</li>
                <li><strong>Controls assessment:</strong> Temperature setpoints, scheduling, and zone controls assessed to identify poor strategies driving unnecessary energy consumption.</li>
                <li><strong>Efficiency rating:</strong> Overall system efficiency scored against modern benchmarks — building the ROI case for system replacement where applicable.</li>
                <li><strong>Improvement recommendations:</strong> Practical, costed suggestions delivering typical 15–30% energy savings.</li>
                <li><strong>5-year compliance certificate:</strong> Formally issued TM44 Air Conditioning Inspection Report, valid for 5 years from inspection date.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Leicester TM44 Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes site visit, full inspection report &amp; compliance certificate.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 5 units</span><strong>£295</strong></div>
              <div className={styles.priceRow}><span>6–10 units</span><strong>£395</strong></div>
              <div className={styles.priceRow}><span>11–20 units</span><strong>£525</strong></div>
              <div className={styles.priceRow}><span>21–35 units</span><strong>£665</strong></div>
              <div className={styles.priceRow}><span>36+ units</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=tm44&city=leicester" className={styles.bookButton}>
              Book TM44 Leicester Now
            </Link>
            <Link href="/services/tm44" className={styles.bookButtonSecondary}>
              Learn More About TM44
            </Link>
            <span className={styles.pricingNotes}>
              * Commercial EPC + TM44 bundles available for additional savings. Multi-site Leicestershire discounts available.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How Leicester TM44 Inspections Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}><div className={styles.stepNumber}>1</div><h4>Book Online</h4><p>Tell us your system count and postcode. We'll confirm your Leicester appointment within 2 hours.</p></div>
            <div className={styles.processStep}><div className={styles.stepNumber}>2</div><h4>Site Inspection</h4><p>Our Leicester TM44 assessor inspects all AC units, reviews maintenance records, and assesses your controls strategy. Typically 2–4 hours.</p></div>
            <div className={styles.processStep}><div className={styles.stepNumber}>3</div><h4>Report Production</h4><p>Full TM44 Air Conditioning Inspection Report compiled with system efficiency ratings and ranked improvement recommendations.</p></div>
            <div className={styles.processStep}><div className={styles.stepNumber}>4</div><h4>Certificate Issued</h4><p>Your 5-year TM44 compliance certificate is issued and emailed. Free renewal reminder set for your next inspection cycle.</p></div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Leicester TM44 Client Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 22+ Leicester TM44 inspections</p>
          <div className={styles.reviewsGrid}>
            {REVIEWS.map((r, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.stars}>{'★★★★★'.slice(0, r.stars)}</div>
                <p className={styles.reviewText}>"{r.text}"</p>
                <span className={styles.reviewer}>{r.name}</span>
                <span className={styles.reviewerRole}>{r.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <h2 className={styles.faqTitle}>TM44 Leicester — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>Do I need a TM44 for my Leicester office?</p><p className={styles.faqAnswer}>Yes, if your combined AC output exceeds 12kW. Most Leicester city centre offices with more than 3–4 split units will exceed this threshold. Call us for a free pre-booking confirmation.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>What's the fine for not having a TM44 in Leicester?</p><p className={styles.faqAnswer}>Trading Standards can issue a £300 fixed penalty per building, plus £200 for failing to produce it within 7 days. These fines can be re-issued at each inspection cycle — making non-compliance far more expensive than booking an inspection.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>How long is a Leicester TM44 valid?</p><p className={styles.faqAnswer}>5 years from the date of inspection. We include a free renewal reminder so you never miss your next compliance date.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>Can I combine TM44 and Commercial EPC in Leicester?</p><p className={styles.faqAnswer}>Yes — combining both inspections in a single assessor visit is the most cost-effective approach. Ask about Leicester bundle pricing when booking.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>We manage a portfolio of Leicester properties — can you handle all of them?</p><p className={styles.faqAnswer}>Absolutely. We offer discounted multi-site pricing for Leicestershire portfolios and can schedule inspections across consecutive days to minimise disruption. Contact us to discuss a portfolio programme.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>We've just taken over a Leicester property with no TM44 history.</p><p className={styles.faqAnswer}>You must arrange an inspection within 3 months of taking control of the building. We offer priority scheduling for property handover situations across Leicester and Leicestershire.</p></div>
          </div>
        </section>

        {/* CTA */}
        <div className={styles.ctaBanner}>
          <h2>Need a TM44 Inspection in Leicester?</h2>
          <p>Covering all LE postcodes and Leicestershire. Fixed pricing, accredited TM44 assessors, same-week availability. Don't risk the fine — book today.</p>
          <div className={styles.ctas}>
            <Link href="/book?service=tm44&city=leicester" className={styles.ctaPrimary}>Book TM44 Now →</Link>
            <Link href="/services/tm44" className={styles.ctaSecondary}>Learn About TM44</Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Leicester Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/leicester/commercial-epc" className={styles.relatedLink}>Commercial EPC Leicester</Link>
            <Link href="/locations/nottingham/tm44" className={styles.relatedLink}>TM44 Nottingham</Link>
            <Link href="/locations/derby/tm44" className={styles.relatedLink}>TM44 Derby</Link>
            <Link href="/services/tm44" className={styles.relatedLink}>TM44 Service Page</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
            <Link href="/prices" className={styles.relatedLink}>Pricing Calculator</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
