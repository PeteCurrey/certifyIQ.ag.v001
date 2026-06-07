import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london/london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection Derby',
  description: 'Accredited TM44 air conditioning inspections in Derby and Derbyshire. Local assessors — no travel surcharge. Avoid the £300 fine. Book online.',
  alternates: { canonical: 'https://avorria.co.uk/locations/derby/tm44' },
  openGraph: {
    title: 'TM44 Derby | Air Conditioning Inspections',
    description: 'Accredited TM44 inspections for Derby commercial premises with AC systems over 12kW. Fixed pricing, 5-year compliance certificate. Local assessors.',
    url: 'https://avorria.co.uk/locations/derby/tm44',
  },
}

const REVIEWS = [
  {
    text: 'Avorria carried out TM44 inspections for our Pride Park office complex. Two buildings done in a single day, professional report produced within 24 hours, and real energy-saving recommendations we\'re now implementing.',
    name: 'Andrew Marsh',
    role: 'Facilities Manager, Pride Park Office Complex',
    stars: 5,
  },
  {
    text: 'We took over a Derby retail unit with no TM44 history. Avorria sorted the inspection within a week of us calling. Great local knowledge and a very thorough report.',
    name: 'Claire Nuttall',
    role: 'Retail Property Manager, Derbyshire',
    stars: 5,
  },
  {
    text: 'Quick, efficient, and genuinely helpful. The assessor spotted an oversized system that was draining £1,200/year in unnecessary energy costs. The TM44 paid for itself immediately.',
    name: 'Paul Greaves',
    role: 'Commercial Landlord, Derby City Centre',
    stars: 5,
  },
]

const AC_SYSTEMS = [
  { type: 'Split Units', typical: 'Offices, retail', threshold: 'Combined total exceeds 12kW', notes: 'Most common in Derby city centre offices' },
  { type: 'VRF / VRV Systems', typical: 'Multi-floor offices, hotels', threshold: 'Almost always exceeds 12kW', notes: 'Common in Pride Park and newer developments' },
  { type: 'Chiller Systems', typical: 'Large commercial, manufacturing', threshold: 'Always exceeds 12kW', notes: 'Requires full system inspection' },
  { type: 'Cassette Units', typical: 'Open-plan offices, retail', threshold: 'Check combined kW rating', notes: 'Common in Derbion and out-of-town retail parks' },
]

export default function DerbyTM44Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria TM44 Inspections Derby',
    'telephone': '{SITE_CONFIG.phone}',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Derby',
      'addressRegion': 'Derbyshire',
      'postalCode': 'DE1 2PJ',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '52.9225',
      'longitude': '-1.4746',
    },
    'url': 'https://avorria.co.uk/locations/derby/tm44',
    'priceRange': '£295–£795+',
    'areaServed': [
      { '@type': 'City', 'name': 'Derby' },
      { '@type': 'AdministrativeArea', 'name': 'Derbyshire' },
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '29',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Do I need a TM44 inspection in Derby?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, if the combined cooling output of your Derby building\'s air conditioning systems exceeds 12kW. This includes split units, VRF systems, cassette units, and chillers — their total combined output is what determines whether TM44 applies.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How much does a TM44 inspection cost in Derby?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'TM44 inspections in Derby start from £295 + VAT. As a Chesterfield-based assessor, Derby is our home territory — no travel surcharge applies to any DE postcode.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How often do I need a TM44 in Derby?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Every 5 years. If you have recently taken over a Derby property with no TM44 history, you must arrange an inspection within 3 months of taking control of the building.',
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
        style={{ background: 'linear-gradient(135deg, #080D18 0%, #0c1a2a 50%, #080D18 100%)' }}
      >
        <div className={styles.heroOverlay} style={{ background: 'linear-gradient(180deg, rgba(8,13,24,0.2) 0%, rgba(8,13,24,0.85) 100%)' }} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Derby &amp; Derbyshire TM44 Air Conditioning Compliance</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspection Derby</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Accredited TM44 air conditioning inspections for Derby commercial premises.
            Local assessors based in Chesterfield — no travel surcharge for any DE postcode.
            Avoid the £300 Trading Standards fine. Same-week availability.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=tm44&city=derby" className={styles.ctaPrimary}>
              Book TM44 Derby →
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
        <div className={styles.trustItem}><span className={styles.trustIcon}>📍</span><span><strong>Local assessors</strong> — zero travel fee</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⭐</span><span><strong>4.9/5</strong> from 29+ TM44 reviews</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>💷</span><span>Avoid the <strong>£300 fine</strong></span></div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>TM44 Compliance for Derby Businesses</h2>
            <p className={styles.paragraph}>
              Avorria is a Chesterfield-headquartered business — Derby is home territory. Our TM44 assessors cover all DE postcodes with no travel surcharge and same-week availability as standard. We inspect everything from split systems in Iron Gate offices to the larger VRF installations found in Pride Park's modern commercial buildings and the Rolls-Royce supply chain premises across the city.
            </p>
            <p className={styles.paragraph}>
              Despite TM44 being a legal requirement for over a decade, compliance rates across Derby's commercial sector remain low — making Trading Standards enforcement increasingly common. The fine is £300 per building, re-issuable every inspection cycle, making non-compliance far more expensive than the inspection itself.
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
                <span className={styles.statNumber}>£0</span>
                <span className={styles.statLabel}>Travel surcharge for DE postcodes</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>Derby AC System Types &amp; TM44 Requirements</h3>
            <p className={styles.paragraph}>
              The 12kW threshold applies to the <strong>combined effective rated output</strong> of all AC systems in a building. Two 7kW split units (14kW combined) in a Derby office require a TM44 — even though each unit individually is below the threshold.
            </p>
            <table className={styles.acTable}>
              <thead>
                <tr>
                  <th>System Type</th>
                  <th>Typical Derby Usage</th>
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
              <h3>What Our Derby TM44 Inspection Covers</h3>
              <ul className={styles.list}>
                <li><strong>Full equipment inspection:</strong> All indoor and outdoor units across your Derby premises — splits, cassettes, AHUs, condensers, and VRF/VRV multi-splits.</li>
                <li><strong>Maintenance records review:</strong> F-Gas logs, service records, and refrigerant leak documentation reviewed against regulatory requirements.</li>
                <li><strong>Controls assessment:</strong> Temperature setpoints, scheduling, and zone controls assessed to identify energy waste and poor control strategies.</li>
                <li><strong>Efficiency rating:</strong> Overall system efficiency scored against modern equivalents — building the ROI case for system replacement if applicable.</li>
                <li><strong>Improvement recommendations:</strong> Practical, costed suggestions. Implementing TM44 recommendations typically yields 15–30% energy savings.</li>
                <li><strong>5-year compliance certificate:</strong> Formally issued TM44 Air Conditioning Inspection Report valid for 5 years from inspection date.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Derby TM44 Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. No travel surcharge for DE postcodes. Includes site visit, full inspection report &amp; compliance certificate.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 5 units</span><strong>£295</strong></div>
              <div className={styles.priceRow}><span>6–10 units</span><strong>£395</strong></div>
              <div className={styles.priceRow}><span>11–20 units</span><strong>£525</strong></div>
              <div className={styles.priceRow}><span>21–35 units</span><strong>£665</strong></div>
              <div className={styles.priceRow}><span>36+ units</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=tm44&city=derby" className={styles.bookButton}>
              Book TM44 Derby Now
            </Link>
            <Link href="/services/tm44" className={styles.bookButtonSecondary}>
              Learn More About TM44
            </Link>
            <span className={styles.pricingNotes}>
              * No travel surcharge for any DE postcode. Commercial EPC + TM44 bundles available for further savings.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How Derby TM44 Inspections Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Book Online</h4>
              <p>Tell us your system count and postcode. We'll confirm your Derby appointment within 2 hours.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Inspection</h4>
              <p>Our local Derby TM44 assessor inspects all AC units, reviews maintenance records, and assesses your controls strategy.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>Report Production</h4>
              <p>Full TM44 Air Conditioning Inspection Report compiled with system efficiency ratings and ranked improvement recommendations.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate Issued</h4>
              <p>Your 5-year TM44 compliance certificate is issued and emailed. Free renewal reminder set for your next cycle.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Derby TM44 Client Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 29+ Derby TM44 inspections</p>
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
          <h2 className={styles.faqTitle}>TM44 Derby — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do I need a TM44 for my Derby office?</p>
              <p className={styles.faqAnswer}>Yes, if your combined AC output exceeds 12kW. Most Derby city centre offices and larger retail units with more than 3–4 split units will exceed this threshold. Call us for a free pre-booking confirmation.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Is there a travel charge for Derby?</p>
              <p className={styles.faqAnswer}>No. Avorria is based in Chesterfield — Derby is home territory. Zero travel surcharge applies to all DE postcodes. Our pricing for Derby is identical to our standard rate card.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How long is a Derby TM44 valid?</p>
              <p className={styles.faqAnswer}>5 years from the date of inspection. We include a free renewal reminder so you never miss your next compliance date.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I combine TM44 and Commercial EPC in Derby?</p>
              <p className={styles.faqAnswer}>Yes — we combine both in a single assessor visit for maximum cost efficiency. This is the recommended approach for Derby premises that need both. Ask about our bundle pricing when booking.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>We have just taken over a Derby property with no TM44 history.</p>
              <p className={styles.faqAnswer}>You must arrange an inspection within 3 months of taking control of the building. We offer priority scheduling for property handover situations across Derby and Derbyshire.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do you cover the wider Derbyshire area?</p>
              <p className={styles.faqAnswer}>Yes — we cover all DE postcodes including Chesterfield, Matlock, Belper, Ilkeston, Long Eaton, Swadlincote, and Ashbourne. All at the same fixed pricing with no travel surcharge.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Need a TM44 Inspection in Derby?</h2>
          <p>Local Chesterfield-based assessors. No travel surcharge for any DE postcode. Fixed pricing, same-week availability. Don't risk the fine — book today.</p>
          <div className={styles.ctas}>
            <Link href="/book?service=tm44&city=derby" className={styles.ctaPrimary}>Book TM44 Now →</Link>
            <Link href="/services/tm44" className={styles.ctaSecondary}>Learn About TM44</Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Derby Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/derby/commercial-epc" className={styles.relatedLink}>Commercial EPC Derby</Link>
            <Link href="/locations/nottingham/tm44" className={styles.relatedLink}>TM44 Nottingham</Link>
            <Link href="/locations/sheffield/tm44" className={styles.relatedLink}>TM44 Sheffield</Link>
            <Link href="/locations/leicester/tm44" className={styles.relatedLink}>TM44 Leicester</Link>
            <Link href="/services/tm44" className={styles.relatedLink}>TM44 Service Page</Link>
            <Link href="/prices" className={styles.relatedLink}>Pricing Calculator</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
