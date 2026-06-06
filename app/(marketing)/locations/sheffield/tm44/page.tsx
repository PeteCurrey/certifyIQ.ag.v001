import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london/london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection Sheffield | Avorria',
  description: 'Accredited TM44 air conditioning inspections in Sheffield and South Yorkshire. Avoid the £300 fine. We cover offices, retail, and industrial premises. Book online.',
  alternates: { canonical: 'https://avorria.co.uk/locations/sheffield/tm44' },
  openGraph: {
    title: 'TM44 Sheffield | Air Conditioning Inspections | Avorria',
    description: 'Accredited TM44 inspections for Sheffield commercial premises with AC systems over 12kW. Fixed pricing, 5-year compliance certificate.',
    url: 'https://avorria.co.uk/locations/sheffield/tm44',
  },
}

const REVIEWS = [
  {
    text: 'Our Sheffield office block had never had a TM44. Avorria made the process completely painless. They inspected all 8 split units, produced a clear report, and gave us practical energy-saving recommendations.',
    name: 'Amanda Clarke',
    role: 'Office Manager, Sheffield Business Park',
    stars: 5,
  },
  {
    text: 'We needed TM44 certificates for three retail units in the city centre urgently. Avorria handled all three in one visit and saved us significant money on mobilisation. Highly recommended.',
    name: 'Steve Barker',
    role: 'Retail Property Manager, South Yorkshire',
    stars: 5,
  },
  {
    text: 'Fast, professional, and thorough. The assessor clearly knew what he was doing and the report highlighted a poorly controlled zone that was costing us £800/year unnecessarily.',
    name: 'Jennifer Walsh',
    role: 'Facilities Coordinator, Meadowhall Area',
    stars: 5,
  },
]

const AC_SYSTEMS = [
  { type: 'Split Units', typical: 'Offices, retail', threshold: 'From 3.5kW each — combined total matters', notes: 'Most common in Sheffield offices' },
  { type: 'VRF / VRV Systems', typical: 'Multi-floor offices, hotels', threshold: 'Systems almost always exceed 12kW', notes: 'Level 4 TM44 required' },
  { type: 'Chiller Systems', typical: 'Large commercial, industrial', threshold: 'Always exceeds 12kW', notes: 'Complex system inspection' },
  { type: 'Cassette Units', typical: 'Open-plan offices, retail', threshold: 'Check combined kW rating', notes: 'Very common in South Yorkshire retail parks' },
]

export default function SheffieldTM44Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria TM44 Inspections Sheffield',
    'telephone': '01246 000000',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Sheffield',
      'addressRegion': 'South Yorkshire',
      'postalCode': 'S1 2HH',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '53.3811',
      'longitude': '-1.4701',
    },
    'url': 'https://avorria.co.uk/locations/sheffield/tm44',
    'priceRange': '£295–£795+',
    'areaServed': [
      { '@type': 'City', 'name': 'Sheffield' },
      { '@type': 'AdministrativeArea', 'name': 'South Yorkshire' },
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '41',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Do I need a TM44 inspection in Sheffield?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes, if the combined cooling output of your Sheffield premises\'s air conditioning systems exceeds 12kW. This includes split units, VRF systems, cassette units, and chillers — their combined output is what counts.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How much does a TM44 inspection cost in Sheffield?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'TM44 inspections in Sheffield start from £295 + VAT for smaller systems, with pricing scaling based on system complexity and number of units. Multi-site Sheffield discounts are available.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How often do I need a TM44 in Sheffield?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'TM44 inspections are required every 5 years. If you have taken over a building with an AC system that has no inspection history, you must arrange an inspection within 3 months.',
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
        style={{ background: 'linear-gradient(135deg, #080D18 0%, #0d1520 50%, #080D18 100%)' }}
      >
        <div className={styles.heroOverlay} style={{ background: 'linear-gradient(180deg, rgba(8,13,24,0.2) 0%, rgba(8,13,24,0.85) 100%)' }} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Sheffield TM44 Air Conditioning Compliance</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspection Sheffield</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Accredited TM44 air conditioning inspections for Sheffield commercial premises. Avoid the £300 Trading Standards fine.
            Fast, professional inspections covering all system types across S1–S35 and South Yorkshire.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=tm44&city=sheffield" className={styles.ctaPrimary}>
              Book TM44 Sheffield →
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
        <div className={styles.trustItem}><span className={styles.trustIcon}>📍</span><span>Covering all <strong>S1–S35</strong> postcodes</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⭐</span><span><strong>4.9/5</strong> from 41 TM44 reviews</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>💷</span><span>Avoid the <strong>£300 fine</strong></span></div>
      </div>

      <div className={styles.container}>

        {/* MAIN CONTENT + PRICING */}
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>TM44 Compliance for Sheffield Businesses</h2>
            <p className={styles.paragraph}>
              Sheffield's commercial property sector — from office parks in the city centre to distribution hubs in the Lower Don Valley — contains tens of thousands of square metres of air-conditioned space. Under the Energy Performance of Buildings Regulations, any building with air conditioning systems with a combined cooling output exceeding 12kW must be inspected by an accredited TM44 assessor every five years.
            </p>
            <p className={styles.paragraph}>
              Despite the long-running regulatory requirement, TM44 compliance rates in Sheffield remain low — meaning Trading Standards inspections are increasingly common and fines are rising. Avorria's Sheffield-based assessors are accredited under the CIBSE TM44 framework and can inspect any system type from basic split units to complex VRF installations.
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

            <h3 style={{ color: '#fff' }}>Sheffield AC System Types &amp; TM44 Requirements</h3>
            <p className={styles.paragraph}>
              The 12kW threshold applies to the <strong>combined effective rated output</strong> of all AC systems in a building. Four separate 3.5kW split units (14kW combined) require a TM44 — even though each individual unit is below the threshold.
            </p>

            <table className={styles.acTable}>
              <thead>
                <tr>
                  <th>System Type</th>
                  <th>Typical Sheffield Usage</th>
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
              <h3>What Our Sheffield TM44 Inspection Covers</h3>
              <ul className={styles.list}>
                <li><strong>Visual equipment inspection:</strong> All indoor and outdoor AC units, including AHUs, condensers, FCUs, and VRF/VRV multi-splits.</li>
                <li><strong>Maintenance records review:</strong> F-Gas logs, service records, and refrigerant leak check documentation.</li>
                <li><strong>Controls assessment:</strong> Temperature setpoints, time schedules, and zone controls to identify oversizing and inefficiency.</li>
                <li><strong>Energy efficiency rating:</strong> Overall system efficiency scored and compared to modern equivalents.</li>
                <li><strong>Improvement recommendations:</strong> Practical, cost-ranked suggestions — implementing which can yield 15–30% energy savings.</li>
                <li><strong>5-year compliance certificate:</strong> Formally lodged TM44 inspection report valid until your next mandatory inspection.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Sheffield TM44 Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes site visit, full inspection report &amp; compliance certificate.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 5 units</span><strong>£295</strong></div>
              <div className={styles.priceRow}><span>6–10 units</span><strong>£395</strong></div>
              <div className={styles.priceRow}><span>11–20 units</span><strong>£525</strong></div>
              <div className={styles.priceRow}><span>21–35 units</span><strong>£665</strong></div>
              <div className={styles.priceRow}><span>36+ units</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=tm44&city=sheffield" className={styles.bookButton}>
              Book TM44 Sheffield Now
            </Link>
            <Link href="/services/tm44" className={styles.bookButtonSecondary}>
              Learn More About TM44
            </Link>
            <span className={styles.pricingNotes}>
              * No travel surcharge for Sheffield and South Yorkshire. Commercial EPC + TM44 bundles available for additional savings.
            </span>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How Sheffield TM44 Inspections Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Book Online</h4>
              <p>Confirm your system count and building postcode. We'll confirm an appointment within 2 hours.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Inspection</h4>
              <p>Our Sheffield TM44 assessor visits and inspects all AC units, controls, and maintenance records. Typically 2–3 hours for standard systems.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>Report Production</h4>
              <p>A full TM44 Air Conditioning Inspection Report is compiled with efficiency ratings and improvement recommendations.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate Issued</h4>
              <p>Your 5-year TM44 compliance certificate is issued and emailed to you. Valid for 5 years from the inspection date.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Sheffield TM44 Client Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 41+ Sheffield TM44 inspections</p>
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
          <h2 className={styles.faqTitle}>TM44 Sheffield — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do I need a TM44 for my Sheffield office?</p>
              <p className={styles.faqAnswer}>Yes, if the combined output of your AC systems exceeds 12kW. Most Sheffield office buildings with more than 3–4 split units will exceed this threshold. We can confirm over the phone before you book.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What happens if I don't have a TM44 in Sheffield?</p>
              <p className={styles.faqAnswer}>Trading Standards can issue a fixed penalty of £300 per building for failing to hold a valid TM44. An additional £200 can be charged for failing to produce it within 7 days. Fines can be re-issued every inspection cycle.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How long is a TM44 valid for in Sheffield?</p>
              <p className={styles.faqAnswer}>5 years from the date of inspection. We can set up renewal reminders so you never miss your next compliance date.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I combine a TM44 and Commercial EPC in Sheffield?</p>
              <p className={styles.faqAnswer}>Yes — this is the most cost-effective approach. We can combine both inspections in a single visit, saving on assessor travel and mobilisation costs. Ask about our Sheffield bundle pricing.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does a TM44 cover heat pumps?</p>
              <p className={styles.faqAnswer}>TM44 applies specifically to air conditioning systems in cooling mode. Air source heat pumps used primarily for heating are generally not included, but reversible heat pumps with cooling capability may be in scope. We'll advise during your pre-booking consultation.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>We've just taken over a Sheffield property — do we need a TM44 immediately?</p>
              <p className={styles.faqAnswer}>If there is no existing TM44 report for the property, you must arrange an inspection within 3 months of taking control of the building. We offer priority scheduling for handover situations.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Need a TM44 Inspection in Sheffield?</h2>
          <p>
            Covering all S1–S35 postcodes and South Yorkshire. Fixed pricing, accredited TM44 assessors, same-week availability. Avoid the fine — book today.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=tm44&city=sheffield" className={styles.ctaPrimary}>
              Book TM44 Now →
            </Link>
            <Link href="/services/tm44" className={styles.ctaSecondary}>
              Learn About TM44
            </Link>
          </div>
        </div>

        {/* RELATED LINKS */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Sheffield Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/sheffield/commercial-epc" className={styles.relatedLink}>Commercial EPC Sheffield</Link>
            <Link href="/locations/nottingham/tm44" className={styles.relatedLink}>TM44 Nottingham</Link>
            <Link href="/services/tm44" className={styles.relatedLink}>TM44 Service Page</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
            <Link href="/prices" className={styles.relatedLink}>Pricing Calculator</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
