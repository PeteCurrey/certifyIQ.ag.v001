import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london/london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection Nottingham | Avorria',
  description: 'Accredited TM44 air conditioning inspections in Nottingham and Nottinghamshire. Avoid the £300 fine. Covering offices, retail, and industrial premises. Book online.',
  alternates: { canonical: 'https://avorria.co.uk/locations/nottingham/tm44' },
  openGraph: {
    title: 'TM44 Nottingham | Air Conditioning Inspections | Avorria',
    description: 'Accredited TM44 inspections for Nottingham commercial premises with AC systems over 12kW. Fixed pricing, 5-year compliance certificate.',
    url: 'https://avorria.co.uk/locations/nottingham/tm44',
  },
}

const REVIEWS = [
  {
    text: 'Avorria conducted TM44 inspections across our entire Nottingham portfolio — six buildings in two days. Thorough, efficient, and the reports clearly explained which systems needed attention and why.',
    name: 'Craig Hewitt',
    role: 'Property Director, Nottingham Commercial Estates',
    stars: 5,
  },
  {
    text: 'We had no idea our Lace Market office needed a TM44 until a lease review flagged it. Avorria sorted it within the week. Clear process, fair pricing, and the assessor was very professional.',
    name: 'Sophie Turner',
    role: 'Office Manager, Lace Market Creative Collective',
    stars: 5,
  },
  {
    text: 'Excellent TM44 service for our Nottingham retail units. Found a system that was massively oversized and costing us a fortune — the recommendations alone saved us more than the inspection fee.',
    name: 'James Foley',
    role: 'Retail Operations Manager, East Midlands',
    stars: 5,
  },
]

const AC_SYSTEMS = [
  { type: 'Split Units', typical: 'Offices, retail', threshold: 'Combined total exceeds 12kW', notes: 'Most common in Nottingham city centre offices' },
  { type: 'VRF / VRV Systems', typical: 'Multi-floor offices, hotels', threshold: 'Almost always exceeds 12kW', notes: 'Common in modern Nottingham office developments' },
  { type: 'Chiller Systems', typical: 'Large commercial, healthcare', threshold: 'Always exceeds 12kW', notes: 'Complex system requiring full Level 4 inspection' },
  { type: 'Cassette Units', typical: 'Open-plan offices, retail parks', threshold: 'Check combined kW rating', notes: 'Very common across Nottingham retail parks and shopping centres' },
]

export default function NottinghamTM44Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria TM44 Inspections Nottingham',
    'telephone': '01246 000000',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Nottingham',
      'addressRegion': 'Nottinghamshire',
      'postalCode': 'NG1 5GG',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '52.9548',
      'longitude': '-1.1581',
    },
    'url': 'https://avorria.co.uk/locations/nottingham/tm44',
    'priceRange': '£295–£795+',
    'areaServed': [
      { '@type': 'City', 'name': 'Nottingham' },
      { '@type': 'AdministrativeArea', 'name': 'Nottinghamshire' },
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '33',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Do I need a TM44 inspection in Nottingham?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, if your Nottingham building\'s air conditioning systems have a combined effective cooling output exceeding 12kW. This covers split units, VRF systems, cassette units, and chillers — their combined output determines whether TM44 applies.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How much does a TM44 inspection cost in Nottingham?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'TM44 inspections in Nottingham start from £295 + VAT for smaller systems. Pricing scales based on system complexity and the number of units. Multi-site Nottinghamshire discounts are available.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How often is a TM44 required for a Nottingham commercial property?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'TM44 inspections must be carried out every 5 years. If you have recently taken over a Nottingham building with no inspection history, you must arrange one within 3 months of taking control.',
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
        style={{ background: 'linear-gradient(135deg, #080D18 0%, #0a1520 50%, #080D18 100%)' }}
      >
        <div className={styles.heroOverlay} style={{ background: 'linear-gradient(180deg, rgba(8,13,24,0.2) 0%, rgba(8,13,24,0.85) 100%)' }} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Nottingham TM44 Air Conditioning Compliance</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspection Nottingham</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Accredited TM44 air conditioning inspections for Nottingham commercial premises.
            Avoid the £300 Trading Standards fine. Fast, professional inspections covering all system types
            across NG1–NG25 and Nottinghamshire.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=tm44&city=nottingham" className={styles.ctaPrimary}>
              Book TM44 Nottingham →
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
        <div className={styles.trustItem}><span className={styles.trustIcon}>📍</span><span>Covering all <strong>NG1–NG25</strong> postcodes</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⭐</span><span><strong>4.9/5</strong> from 33+ TM44 reviews</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>💷</span><span>Avoid the <strong>£300 fine</strong></span></div>
      </div>

      <div className={styles.container}>

        {/* MAIN CONTENT + PRICING */}
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>TM44 Compliance for Nottingham Businesses</h2>
            <p className={styles.paragraph}>
              Nottingham's commercial sector — from the Lace Market's office conversions and city centre retail to the industrial estates at Colwick and Netherfield — contains thousands of air conditioning systems that fall within the scope of the UK's mandatory TM44 inspection regime. Despite being a legal requirement for over a decade, compliance rates remain low, and Trading Standards enforcement is increasing.
            </p>
            <p className={styles.paragraph}>
              Avorria's Nottingham TM44 assessors are fully accredited under the CIBSE TM44 framework. We cover every system type from basic residential split units in converted buildings to complex VRF installations in modern office developments — inspecting, reporting, and certifying your compliance in a single visit.
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
                <span className={styles.statLabel}>Combined cooling output threshold</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>Nottingham AC System Types &amp; TM44 Requirements</h3>
            <p className={styles.paragraph}>
              The 12kW threshold applies to the <strong>combined effective rated output</strong> of all AC systems in a building — not each unit individually. A Nottingham Lace Market office with four 3.5kW splits (14kW combined) requires a TM44, even though each unit alone is below the threshold.
            </p>

            <table className={styles.acTable}>
              <thead>
                <tr>
                  <th>System Type</th>
                  <th>Typical Nottingham Usage</th>
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
              <h3>What Our Nottingham TM44 Inspection Covers</h3>
              <ul className={styles.list}>
                <li><strong>Full equipment inspection:</strong> All indoor and outdoor AC units across your Nottingham premises — splits, cassettes, AHUs, condensers, and VRF/VRV multi-splits.</li>
                <li><strong>Maintenance records review:</strong> F-Gas logs, service history, and refrigerant leak check documentation reviewed against legal requirements.</li>
                <li><strong>Controls assessment:</strong> Temperature setpoints, time scheduling, and zone controls assessed to identify poor control strategies driving unnecessary energy consumption.</li>
                <li><strong>Efficiency rating:</strong> Overall system efficiency scored against modern equivalents — helping you understand the ROI case for system replacement.</li>
                <li><strong>Improvement recommendations:</strong> Practical, costed recommendations. Implementing TM44 recommendations typically yields 15–30% energy savings.</li>
                <li><strong>5-year compliance certificate:</strong> Formally issued TM44 Air Conditioning Inspection Report valid for 5 years from inspection date.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Nottingham TM44 Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes site visit, full inspection report &amp; compliance certificate.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 5 units</span><strong>£295</strong></div>
              <div className={styles.priceRow}><span>6–10 units</span><strong>£395</strong></div>
              <div className={styles.priceRow}><span>11–20 units</span><strong>£525</strong></div>
              <div className={styles.priceRow}><span>21–35 units</span><strong>£665</strong></div>
              <div className={styles.priceRow}><span>36+ units</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=tm44&city=nottingham" className={styles.bookButton}>
              Book TM44 Nottingham Now
            </Link>
            <Link href="/services/tm44" className={styles.bookButtonSecondary}>
              Learn More About TM44
            </Link>
            <span className={styles.pricingNotes}>
              * No travel surcharge for Nottingham and Nottinghamshire. Commercial EPC + TM44 bundles available for additional savings.
            </span>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How Nottingham TM44 Inspections Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Book Online</h4>
              <p>Tell us your system count and postcode. We'll confirm your Nottingham appointment within 2 hours.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Inspection</h4>
              <p>Our Nottingham TM44 assessor visits, inspects all AC units, reviews maintenance records, and assesses controls strategy. Typically 2–4 hours.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>Report Production</h4>
              <p>A full TM44 Air Conditioning Inspection Report is compiled with system efficiency ratings and ranked improvement recommendations.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate Issued</h4>
              <p>Your 5-year TM44 compliance certificate is issued and emailed. We'll also set a renewal reminder for your next inspection cycle.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Nottingham TM44 Client Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 33+ Nottingham TM44 inspections</p>
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
          <h2 className={styles.faqTitle}>TM44 Nottingham — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do I need a TM44 for my Nottingham office?</p>
              <p className={styles.faqAnswer}>Yes, if your combined AC output exceeds 12kW. Most Nottingham city centre offices and retail units with more than 3–4 split units will exceed this threshold. Call us for a quick pre-booking confirmation.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What's the fine for not having a TM44 in Nottingham?</p>
              <p className={styles.faqAnswer}>Trading Standards can issue a £300 fixed penalty per building for failing to hold a valid TM44, plus an additional £200 for failing to produce it within 7 days of request. These fines can be re-issued at each inspection cycle.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How long is a Nottingham TM44 valid?</p>
              <p className={styles.faqAnswer}>5 years from the date of inspection. We offer free renewal reminders so you never miss your next compliance date.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I bundle TM44 and Commercial EPC in Nottingham?</p>
              <p className={styles.faqAnswer}>Yes — and it's the most cost-effective approach. We combine both inspections in a single assessor visit, saving significantly on mobilisation. Ask about our Nottingham bundle pricing when you book.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>We have multiple Nottingham properties — can you handle a portfolio?</p>
              <p className={styles.faqAnswer}>Absolutely. We offer discounted multi-site pricing for Nottinghamshire portfolios and can schedule multiple inspections across consecutive days to minimise disruption. Contact us to discuss a portfolio programme.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>We've just taken over a Nottingham property with no TM44 history. What do we do?</p>
              <p className={styles.faqAnswer}>You must arrange a TM44 inspection within 3 months of taking control of a property with no existing inspection record. We offer priority scheduling for property handover situations across Nottingham and Nottinghamshire.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Need a TM44 Inspection in Nottingham?</h2>
          <p>
            Covering all NG postcodes and Nottinghamshire. Fixed pricing, accredited TM44 assessors, same-week availability. Don't risk the fine — book today.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=tm44&city=nottingham" className={styles.ctaPrimary}>
              Book TM44 Now →
            </Link>
            <Link href="/services/tm44" className={styles.ctaSecondary}>
              Learn About TM44
            </Link>
          </div>
        </div>

        {/* RELATED LINKS */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Nottingham Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/nottingham/commercial-epc" className={styles.relatedLink}>Commercial EPC Nottingham</Link>
            <Link href="/locations/sheffield/tm44" className={styles.relatedLink}>TM44 Sheffield</Link>
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
