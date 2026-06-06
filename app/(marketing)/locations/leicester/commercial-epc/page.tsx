import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london/london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC Leicester | Accredited NDEA Assessors | Avorria',
  description: 'Fast, accredited Commercial EPC assessments in Leicester for offices, retail, and industrial premises. Level 3 & 4 NDEA qualified. From £150+VAT with 24-hr turnaround.',
  alternates: { canonical: 'https://avorria.co.uk/locations/leicester/commercial-epc' },
  openGraph: {
    title: 'Commercial EPC Leicester | Avorria',
    description: 'Accredited Non-Domestic EPCs in Leicester. Level 3 & 4 qualified assessors covering LE1–LE19 and Leicestershire.',
    url: 'https://avorria.co.uk/locations/leicester/commercial-epc',
  },
}

const REVIEWS = [
  {
    text: 'We urgently needed a commercial EPC for a lease renewal on our city centre office. Avorria had an assessor on site within 48 hours and lodged the certificate the same day as the visit. Excellent service.',
    name: 'Priya Chandrasekaran',
    role: 'Commercial Property Manager, Leicester City Centre',
    stars: 5,
  },
  {
    text: 'Our Narborough Road retail unit needed a commercial EPC as part of a sale. Avorria were professional, accurate, and provided a report that was exactly what our solicitors needed. Will use again.',
    name: 'Daniel Whitfield',
    role: 'Commercial Property Owner, LE3',
    stars: 5,
  },
  {
    text: 'Assessed our industrial unit in Thurmaston. The report clearly outlined what we\'d need to do to reach Band C before 2027 and ranked the improvements by cost — very helpful for budget planning.',
    name: 'Sarah Bradshaw',
    role: 'Facilities Director, Thurmaston Industrial Estate',
    stars: 5,
  },
]

export default function LeicesterCommercialEpcPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Leicester Commercial Energy Assessors',
    'telephone': '01246 000000',
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
    'url': 'https://avorria.co.uk/locations/leicester/commercial-epc',
    'priceRange': '£150–£545+',
    'areaServed': [
      { '@type': 'City', 'name': 'Leicester' },
      { '@type': 'AdministrativeArea', 'name': 'Leicestershire' },
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '44',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How much does a Commercial EPC cost in Leicester?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Commercial EPC pricing in Leicester starts at £150 + VAT for buildings up to 100m², scaling by floor area. Level 4 complex buildings are scoped individually. Get an instant fixed quote using our online calculator.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How quickly can I get a Commercial EPC in Leicester?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We offer same-week and next-day appointments across Leicester and Leicestershire. Certificates are typically lodged within 24 hours of the site visit.',
        },
      },
      {
        '@type': 'Question',
        'name': 'What MEES rating do Leicester commercial properties need by 2027?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'All non-domestic rented properties must achieve EPC Band C by April 2027 and Band B by 2030. With around 80% of Leicester\'s commercial buildings currently below Band B, most landlords need to act now.',
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
          <span className={styles.eyebrow}>Leicester &amp; Leicestershire NDEA Specialists</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC Leicester</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Fully accredited Non-Domestic Energy Assessors (NDEA Levels 3 &amp; 4) delivering fast SBEM certificates
            for commercial premises across Leicester and Leicestershire. Certificates lodged on the official
            national register within 24 hours.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&city=leicester" className={styles.ctaPrimary}>
              Book Leicester Assessment →
            </Link>
            <Link href="/prices" className={styles.ctaSecondary}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⚡</span><span><strong>24hr</strong> certificate turnaround</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>🏆</span><span><strong>NDEA Levels 3 &amp; 4</strong> qualified</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>📍</span><span>Covering <strong>LE1–LE19</strong> &amp; Leicestershire</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⭐</span><span><strong>4.9/5</strong> from 44+ reviews</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>🏢</span><span><strong>Offices, retail &amp; industrial</strong></span></div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Leicester's Trusted Commercial Energy Assessors</h2>
            <p className={styles.paragraph}>
              Leicester is one of the UK's most commercially diverse cities — from the Golden Mile retail corridor on Belgrave Road and the Highcross shopping centre to the National Space Centre's innovation campus, Thurmaston and Meridian Business Parks, and the growing LE1 office district around Granby Street. Avorria's accredited NDEAs are experienced across the full spectrum of Leicester's commercial building stock.
            </p>
            <p className={styles.paragraph}>
              With approximately 80% of Leicester's commercial buildings currently rated below EPC Band B, and the MEES Band C deadline arriving in April 2027, the window for landlords to commission assessments and plan retrofit programmes is closing fast. Most commercial upgrade programmes take 12–18 months from assessment to completion.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>80%</span>
                <span className={styles.statLabel}>Leicester commercial buildings below EPC Band B</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>24hr</span>
                <span className={styles.statLabel}>Average certificate turnaround time</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>£150</span>
                <span className={styles.statLabel}>Starting price + VAT</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>Which Leicester buildings require a Commercial EPC?</h3>
            <p className={styles.paragraph}>
              Any commercial property in Leicester must have a valid EPC when built, sold, or rented. This includes:
            </p>
            <div className={styles.featureBox}>
              <h3>Leicester Building Types We Assess</h3>
              <ul className={styles.list}>
                <li><strong>City Centre Offices:</strong> Suites and multi-floor offices across LE1 — Granby Street, Rutland Street, and the expanding Cultural Quarter — plus out-of-town business parks at Meridian and Grove Park.</li>
                <li><strong>Retail Units:</strong> Highcross shopping centre, Haymarket, Fosse Park, and high-street retail across Granby Street, Gallowtree Gate, and the Golden Mile.</li>
                <li><strong>Industrial &amp; Warehouse:</strong> Logistics and manufacturing premises across Thurmaston, Braunstone Frith, Wigston, and the M1/M69 motorway corridor.</li>
                <li><strong>Hospitality &amp; Leisure:</strong> Hotels, restaurants, sports venues, and event spaces across Leicester and the county.</li>
                <li><strong>Healthcare &amp; Education:</strong> University of Leicester and De Montfort University commercial premises, private clinics, and independent schools requiring Commercial EPCs or DECs.</li>
                <li><strong>Mixed-Use Developments:</strong> City centre regeneration schemes with commercial ground floors and upper residential floors — increasingly common in LE1 and LE2.</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>Level 3 vs Level 4 — Which Does Your Leicester Building Need?</h3>
            <div className={styles.featureBox}>
              <h3>Assessment Level Guide for Leicester</h3>
              <ul className={styles.list}>
                <li><strong>Level 3 — Standard Buildings:</strong> Covers the majority of Leicester's commercial stock — standard offices, retail units, warehouses, and simple industrial premises. Assessed using iSBEM software.</li>
                <li><strong>Level 4 — Complex Buildings:</strong> Multi-zone HVAC, mechanical ventilation with heat recovery (MVHR), or advanced mechanical and electrical services. Typically applies to larger hotels, university buildings, and modern office developments in LE1.</li>
                <li><strong>Display Energy Certificates (DECs):</strong> Required for Leicester City Council buildings, University Hospitals of Leicester NHS Trust premises, leisure centres, and schools over 250m² visited by the public. Avorria provides both DECs and Advisory Reports.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Leicester Commercial EPC Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes assessor visit, SBEM calculation &amp; national register lodgement.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 100m²</span><strong>£150</strong></div>
              <div className={styles.priceRow}><span>101 – 250m²</span><strong>£225</strong></div>
              <div className={styles.priceRow}><span>251 – 500m²</span><strong>£325</strong></div>
              <div className={styles.priceRow}><span>501 – 750m²</span><strong>£425</strong></div>
              <div className={styles.priceRow}><span>751 – 1,000m²</span><strong>£545</strong></div>
              <div className={styles.priceRow}><span>1,001m²+</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=commercial&city=leicester" className={styles.bookButton}>
              Book Leicester EPC Now
            </Link>
            <Link href="/services/commercial-epc" className={styles.bookButtonSecondary}>
              Learn About Commercial EPCs
            </Link>
            <span className={styles.pricingNotes}>
              * Level 4 complex assessments scoped individually. TM44 air conditioning inspections quoted separately.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How Leicester Commercial EPCs Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}><div className={styles.stepNumber}>1</div><h4>Book Online</h4><p>Select your building type and floor area. Instant fixed pricing shown. Confirm in minutes — no account needed.</p></div>
            <div className={styles.processStep}><div className={styles.stepNumber}>2</div><h4>Site Assessment</h4><p>Our Leicester NDEA assessor visits capturing construction data, HVAC, lighting, and fabric — typically 2–4 hours on site.</p></div>
            <div className={styles.processStep}><div className={styles.stepNumber}>3</div><h4>SBEM Calculation</h4><p>Building data processed through approved SBEM software with improvement recommendations ranked by cost-benefit ratio.</p></div>
            <div className={styles.processStep}><div className={styles.stepNumber}>4</div><h4>Certificate Lodged</h4><p>EPC lodged on the official national register within 24 hours. PDF copies emailed immediately upon lodgement.</p></div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Leicester Client Testimonials</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 44+ verified Leicester commercial assessments</p>
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
          <h2 className={styles.faqTitle}>Commercial EPC Leicester — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>How much does a Commercial EPC cost in Leicester?</p><p className={styles.faqAnswer}>Pricing starts at £150 + VAT for buildings up to 100m², scaling by floor area. Use our <Link href="/prices" style={{ color: 'var(--accent-lime)' }}>pricing calculator</Link> for an instant estimate.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>How quickly can I get a Commercial EPC in Leicester?</p><p className={styles.faqAnswer}>Same-week appointments across all LE postcodes. Certificates are typically lodged within 24 hours of the site visit — often the same day.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>Does my Leicester commercial property meet MEES 2027?</p><p className={styles.faqAnswer}>All commercial rental premises must reach Band C by April 2027 and Band B by 2030. Try our free <Link href="/estimate" style={{ color: 'var(--accent-lime)' }}>EPC Estimator</Link> for an early rating indication.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>Do I need a Commercial EPC or DEC for my Leicester building?</p><p className={styles.faqAnswer}>Commercial EPCs are required for sale/rental. DECs are required for public buildings over 250m² visited by the public — including council offices, NHS premises, and schools. Avorria provides both.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>Can I bundle Commercial EPC and TM44 in Leicester?</p><p className={styles.faqAnswer}>Yes — combining both in a single visit saves on assessor mobilisation costs. Ask about Leicester bundle pricing when booking.</p></div>
            <div className={styles.faqItem}><p className={styles.faqQuestion}>What improvements raise a Leicester commercial EPC rating?</p><p className={styles.faqAnswer}>Highest-ROI commercial improvements include LED lighting, HVAC controls, roof insulation, and heating upgrades. Our <Link href="/improve" style={{ color: 'var(--accent-lime)' }}>Improvement Advisor</Link> models cost and impact for your specific building.</p></div>
          </div>
        </section>

        {/* CTA */}
        <div className={styles.ctaBanner}>
          <h2>Ready to Book Your Leicester Commercial EPC?</h2>
          <p>Covering all LE postcodes and Leicestershire. Fixed pricing, accredited NDEA assessors, 24-hour certificate turnaround.</p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&city=leicester" className={styles.ctaPrimary}>Book Assessment Now →</Link>
            <Link href="/services/commercial-epc" className={styles.ctaSecondary}>Learn About Commercial EPCs</Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Leicester Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/leicester/tm44" className={styles.relatedLink}>TM44 Leicester</Link>
            <Link href="/locations/nottingham/commercial-epc" className={styles.relatedLink}>Commercial EPC Nottingham</Link>
            <Link href="/locations/derby/commercial-epc" className={styles.relatedLink}>Commercial EPC Derby</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
            <Link href="/services/display-energy-certificate" className={styles.relatedLink}>Display Energy Certificates</Link>
            <Link href="/improve" className={styles.relatedLink}>Improvement Advisor</Link>
            <Link href="/prices" className={styles.relatedLink}>Pricing Calculator</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
