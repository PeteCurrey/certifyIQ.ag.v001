import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london/london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC Sheffield | Accredited NDEA Assessors',
  description: 'Fast, accredited Commercial EPC assessments in Sheffield for offices, retail units, and industrial premises. Level 3 & 4 NDEA qualified. From £150+VAT with 24-hr turnaround.',
  alternates: { canonical: 'https://avorria.co.uk/locations/sheffield/commercial-epc' },
  openGraph: {
    title: 'Commercial EPC Sheffield',
    description: 'Accredited Non-Domestic EPCs in Sheffield. Level 3 & 4 qualified assessors covering S1–S35 and South Yorkshire.',
    url: 'https://avorria.co.uk/locations/sheffield/commercial-epc',
  },
}

const REVIEWS = [
  {
    text: 'Avorria assessed our 3-floor office on Division Street. Fast, thorough, and the report was ready the same day. Exactly what we needed ahead of the 2027 MEES deadline.',
    name: 'Rachel Thornton',
    role: 'Commercial Property Manager, Sheffield City Centre',
    stars: 5,
  },
  {
    text: 'We needed a commercial EPC urgently for a lease renewal on our Meadowhall retail unit. Avorria turned it around in 24 hours. Competitive pricing and excellent report quality.',
    name: 'David Okafor',
    role: 'Retail Operations Director, South Yorkshire',
    stars: 5,
  },
  {
    text: 'Brilliant service for our industrial unit in Tinsley. The assessor clearly understood warehouse buildings and the report included really useful cost-ranked recommendations.',
    name: 'Mark Sutton',
    role: 'Facilities Manager, Sheffield Industrial Estate',
    stars: 5,
  },
]

export default function SheffieldCommercialEpcPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Sheffield Commercial Energy Assessors',
    'telephone': '{SITE_CONFIG.phone}',
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
    'url': 'https://avorria.co.uk/locations/sheffield/commercial-epc',
    'priceRange': '£150–£545+',
    'areaServed': [
      { '@type': 'City', 'name': 'Sheffield' },
      { '@type': 'AdministrativeArea', 'name': 'South Yorkshire' },
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '84',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How much does a Commercial EPC cost in Sheffield?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Commercial EPC pricing in Sheffield starts at £150 + VAT for buildings up to 100m². Pricing scales by floor area. Get an instant fixed quote using our online calculator.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How quickly can I get a Commercial EPC in Sheffield?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We offer same-week and often next-day appointments across Sheffield and South Yorkshire. Certificates are typically lodged within 24 hours of the site visit.',
        },
      },
      {
        '@type': 'Question',
        'name': 'What MEES rating do Sheffield commercial properties need by 2027?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'All non-domestic rented properties in England must achieve EPC Band C by April 2027, and Band B by 2030. Non-compliance fines can reach £150,000 for larger properties.',
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
        style={{ background: 'linear-gradient(135deg, #080D18 0%, #0d1a2e 50%, #080D18 100%)' }}
      >
        <div className={styles.heroOverlay} style={{ background: 'linear-gradient(180deg, rgba(8,13,24,0.2) 0%, rgba(8,13,24,0.85) 100%)' }} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Sheffield & South Yorkshire NDEA Specialists</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC Sheffield</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Fully accredited Non-Domestic Energy Assessors (NDEA Levels 3 &amp; 4) delivering fast SBEM certificates
            for commercial premises across Sheffield and South Yorkshire. Certificates lodged on the official national register.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&city=sheffield" className={styles.ctaPrimary}>
              Book Sheffield Assessment →
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
        <div className={styles.trustItem}><span className={styles.trustIcon}>📍</span><span>Covering <strong>S1–S35</strong> &amp; South Yorkshire</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⭐</span><span><strong>4.9/5</strong> from 84+ reviews</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>🏭</span><span><strong>Offices, retail &amp; industrial</strong></span></div>
      </div>

      <div className={styles.container}>

        {/* MAIN CONTENT + PRICING */}
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Sheffield's Leading Commercial Energy Assessors</h2>
            <p className={styles.paragraph}>
              Sheffield's commercial property market is diverse — from Victorian red-brick warehouses and creative quarter offices to Meadowhall retail parks and advanced manufacturing facilities. Avorria's accredited Non-Domestic Energy Assessors (NDEAs) have extensive experience across all Sheffield building types, providing accurate SBEM assessments that meet the latest software standards.
            </p>
            <p className={styles.paragraph}>
              With the MEES Band C deadline approaching in April 2027, Sheffield commercial landlords need to act now. Retrofit projects typically take 12–18 months from assessment to completion — and with approximately 79% of Sheffield commercial buildings still below Band B, the window to act is closing fast.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>79%</span>
                <span className={styles.statLabel}>Sheffield commercial buildings below EPC Band B</span>
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

            <h3 style={{ color: '#fff' }}>Which Sheffield buildings require a Commercial EPC?</h3>
            <p className={styles.paragraph}>
              Any commercial property in Sheffield must have a valid EPC when built, sold, or rented. This includes:
            </p>
            <div className={styles.featureBox}>
              <h3>Sheffield Building Types We Assess</h3>
              <ul className={styles.list}>
                <li><strong>City Centre Offices:</strong> Suites and multi-floor offices across S1, S2, and S3 — from Digital Campus co-working spaces to traditional banking premises on Pinstone Street.</li>
                <li><strong>Retail Units:</strong> High-street shops, Meadowhall units, out-of-town retail parks, and food service premises across South Yorkshire.</li>
                <li><strong>Industrial &amp; Warehouse:</strong> Steel and advanced manufacturing units, logistics warehouses, and light industrial premises in Tinsley, Attercliffe, and the Lower Don Valley.</li>
                <li><strong>Hospitality:</strong> Hotels, event venues, pubs, and restaurants requiring Level 3 non-domestic assessments.</li>
                <li><strong>Mixed-Use Developments:</strong> Combined commercial and residential buildings increasingly common in Sheffield's growing residential quarter.</li>
                <li><strong>Healthcare &amp; Education:</strong> Private clinics, training centres, and independent schools requiring commercial EPCs or Display Energy Certificates (DECs).</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>NDEA Level 3 vs Level 4 — Which Do You Need?</h3>
            <p className={styles.paragraph}>
              Sheffield's varied building stock means assessors need to understand both simple and complex building types. Most commercial premises in Sheffield require a Level 3 assessment, but complex premises with multi-zone HVAC may require Level 4.
            </p>
            <div className={styles.featureBox}>
              <h3>Assessment Level Guide for Sheffield</h3>
              <ul className={styles.list}>
                <li><strong>Level 3 — Standard Buildings:</strong> Single-zone, standard construction offices, retail units, and warehouses. The vast majority of Sheffield's commercial portfolio falls here.</li>
                <li><strong>Level 4 — Complex Buildings:</strong> Multi-zone HVAC, mechanical ventilation with heat recovery (MVHR), or unusual construction types. Typically applies to larger hotels, healthcare facilities, and modern office developments with complex services.</li>
                <li><strong>Display Energy Certificates (DECs):</strong> Required for Sheffield City Council buildings, NHS properties, leisure centres, and schools over 250m² visited by the public.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Sheffield Commercial EPC Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes assessor visit, SBEM calculation &amp; national register lodgement.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 100m²</span><strong>£150</strong></div>
              <div className={styles.priceRow}><span>101 – 250m²</span><strong>£225</strong></div>
              <div className={styles.priceRow}><span>251 – 500m²</span><strong>£325</strong></div>
              <div className={styles.priceRow}><span>501 – 750m²</span><strong>£425</strong></div>
              <div className={styles.priceRow}><span>751 – 1,000m²</span><strong>£545</strong></div>
              <div className={styles.priceRow}><span>1,001m²+</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=commercial&city=sheffield" className={styles.bookButton}>
              Book Sheffield EPC Now
            </Link>
            <Link href="/services/commercial-epc" className={styles.bookButtonSecondary}>
              Learn About Commercial EPCs
            </Link>
            <span className={styles.pricingNotes}>
              * Level 4 complex assessments scoped individually. TM44 air conditioning inspections quoted separately. No travel surcharge for Sheffield &amp; South Yorkshire.
            </span>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How Sheffield Commercial EPCs Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Book Online</h4>
              <p>Select your building type and floor area. Instant fixed pricing shown. Confirm with your details — no account needed.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Assessment</h4>
              <p>Our Sheffield NDEA assessor visits your premises. We capture construction data, HVAC, lighting, and fabric performance — typically in 2–4 hours.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>SBEM Calculation</h4>
              <p>Building data is processed through approved SBEM software. A full energy model is produced with improvement recommendations ranked by ROI.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate Lodged</h4>
              <p>Your Commercial EPC is lodged on the official national register within 24 hours. PDF copies emailed immediately to you.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Sheffield Client Testimonials</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 84+ verified Sheffield commercial assessments</p>
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
          <h2 className={styles.faqTitle}>Commercial EPC Sheffield — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How much does a Commercial EPC cost in Sheffield?</p>
              <p className={styles.faqAnswer}>Pricing starts at £150 + VAT for buildings up to 100m², scaling by floor area to £545 for 751–1,000m². Larger or complex Level 4 buildings are quoted individually. No travel surcharge for Sheffield and South Yorkshire.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How quickly can I get a Commercial EPC in Sheffield?</p>
              <p className={styles.faqAnswer}>We offer same-week and often next-day appointments across S1–S35. Certificates are typically lodged on the national register within 24 hours of the site visit, with PDF copies emailed immediately.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does my Sheffield commercial property meet MEES 2027?</p>
              <p className={styles.faqAnswer}>All commercial rental properties must achieve EPC Band C by April 2027 and Band B by 2030. Fines for non-compliance range up to £150,000. Use our free <Link href="/estimate" style={{ color: 'var(--accent-lime)' }}>EPC Estimator</Link> to check your likely rating before committing to a full assessment.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do I need a Commercial EPC or a DEC for my Sheffield building?</p>
              <p className={styles.faqAnswer}>Commercial EPCs are required when selling or renting non-domestic properties. Display Energy Certificates (DECs) are required for public buildings over 250m² — including Sheffield City Council premises, NHS buildings, and schools visited by the public. Avorria provides both.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I bundle a Commercial EPC and TM44 inspection in Sheffield?</p>
              <p className={styles.faqAnswer}>Yes — we offer bundled bookings combining Commercial EPC and TM44 Air Conditioning Inspections for Sheffield premises with cooling systems over 12kW, saving on assessor mobilisation costs.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What improvements will raise my Sheffield commercial EPC rating?</p>
              <p className={styles.faqAnswer}>The most cost-effective commercial EPC improvements are typically LED lighting upgrades, HVAC controls optimisation, roof insulation, and sub-metering. Our Improvement Advisor tool can model the ROI on each measure. <Link href="/improve" style={{ color: 'var(--accent-lime)' }}>Try it free →</Link></p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Ready to Book Your Sheffield Commercial EPC?</h2>
          <p>
            Covering S1–S35 and all of South Yorkshire. Fixed pricing, accredited NDEA assessors, 24-hour certificate turnaround. No travel surcharge.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&city=sheffield" className={styles.ctaPrimary}>
              Book Assessment Now →
            </Link>
            <Link href="/services/commercial-epc" className={styles.ctaSecondary}>
              Learn About Commercial EPCs
            </Link>
          </div>
        </div>

        {/* RELATED LINKS */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Sheffield Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/sheffield/tm44" className={styles.relatedLink}>TM44 Sheffield</Link>
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
