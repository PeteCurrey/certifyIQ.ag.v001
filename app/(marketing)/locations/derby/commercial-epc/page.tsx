import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london/london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC Derby | Accredited NDEA Assessors',
  description: 'Fast, accredited Commercial EPC assessments in Derby for offices, retail, and industrial premises. Level 3 & 4 NDEA qualified. From £150+VAT with 24-hr turnaround.',
  alternates: { canonical: 'https://avorria.co.uk/locations/derby/commercial-epc' },
  openGraph: {
    title: 'Commercial EPC Derby',
    description: 'Accredited Non-Domestic EPCs in Derby. Level 3 & 4 qualified assessors covering DE1–DE24 and Derbyshire.',
    url: 'https://avorria.co.uk/locations/derby/commercial-epc',
  },
}

const REVIEWS = [
  {
    text: 'Avorria assessed our city centre office on Iron Gate ahead of a lease renewal. Rapid appointment, professional assessor, and the certificate was on the national register the same day. Highly recommended.',
    name: 'Tom Ashworth',
    role: 'Commercial Property Manager, Derby City Centre',
    stars: 5,
  },
  {
    text: 'We needed commercial EPCs for two industrial units on Raynesway. Avorria handled both in a single visit, saving us time and money. Clear report with practical upgrade recommendations.',
    name: 'Nicola Bostock',
    role: 'Facilities Director, Derby Industrial Portfolio',
    stars: 5,
  },
  {
    text: 'Great service for our retail unit near Derbion. Quick turnaround and the assessor was very knowledgeable about MEES compliance and what we\'d need to do to hit Band C before 2027.',
    name: 'Ravi Patel',
    role: 'Retail Property Owner, Derby',
    stars: 5,
  },
]

export default function DerbyCommercialEpcPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Derby Commercial Energy Assessors',
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
    'url': 'https://avorria.co.uk/locations/derby/commercial-epc',
    'priceRange': '£150–£545+',
    'areaServed': [
      { '@type': 'City', 'name': 'Derby' },
      { '@type': 'AdministrativeArea', 'name': 'Derbyshire' },
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '58',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How much does a Commercial EPC cost in Derby?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Commercial EPC pricing in Derby starts at £150 + VAT for buildings up to 100m². Pricing scales by floor area. No travel surcharge for DE postcodes. Get an instant fixed quote using our online calculator.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How quickly can I get a Commercial EPC in Derby?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We offer same-week and next-day appointments across Derby and Derbyshire. Certificates are typically lodged within 24 hours of the site visit.',
        },
      },
      {
        '@type': 'Question',
        'name': 'What MEES rating do Derby commercial properties need by 2027?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'All non-domestic rented properties must achieve EPC Band C by April 2027 and Band B by 2030. Non-compliance fines can reach £150,000. Derby landlords should commission assessments now as retrofit programmes take 12–18 months.',
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
          <span className={styles.eyebrow}>Derby &amp; Derbyshire NDEA Specialists</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC Derby</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Fully accredited Non-Domestic Energy Assessors (NDEA Levels 3 &amp; 4) delivering fast SBEM certificates
            for commercial premises across Derby and Derbyshire. Based locally — no travel surcharge.
            Certificates lodged on the official national register within 24 hours.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&city=derby" className={styles.ctaPrimary}>
              Book Derby Assessment →
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
        <div className={styles.trustItem}><span className={styles.trustIcon}>📍</span><span>Covering <strong>DE1–DE24</strong> &amp; Derbyshire</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⭐</span><span><strong>4.9/5</strong> from 58+ reviews</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>🏭</span><span><strong>Local assessors</strong> — no travel fee</span></div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Derby's Trusted Commercial Energy Assessors</h2>
            <p className={styles.paragraph}>
              Derby's commercial property market is anchored by Rolls-Royce's aerospace manufacturing campus, a growing city centre retail and leisure offer anchored by Derbion, and a substantial industrial base across Raynesway, Spondon, and the A38 corridor. Avorria's accredited NDEAs bring deep knowledge of Derbyshire's commercial building stock — from Georgian city centre premises on Iron Gate to modern logistics sheds on Pride Park.
            </p>
            <p className={styles.paragraph}>
              As a Chesterfield-headquartered business, Derby is part of our home territory. No travel surcharge applies to any DE postcode. Same-week availability is standard, and our local assessors understand Derby's planning context, building typologies, and the specific challenges of assessing older commercial stock.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>80%</span>
                <span className={styles.statLabel}>Derby commercial buildings below EPC Band B</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>24hr</span>
                <span className={styles.statLabel}>Average certificate turnaround time</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>£0</span>
                <span className={styles.statLabel}>Travel surcharge for all DE postcodes</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>Which Derby buildings require a Commercial EPC?</h3>
            <p className={styles.paragraph}>
              Any commercial property in Derby must have a valid EPC when built, sold, or rented. This covers the full breadth of Derby's commercial stock:
            </p>
            <div className={styles.featureBox}>
              <h3>Derby Building Types We Assess</h3>
              <ul className={styles.list}>
                <li><strong>City Centre Offices:</strong> Georgian and Victorian commercial premises along Iron Gate, Sadler Gate, and the Cathedral Quarter, as well as modern offices on Pride Park and Friar Gate Studios.</li>
                <li><strong>Retail Units:</strong> Derbion shopping centre units, Eagle Market, St Peter's Street high street retail, and out-of-town retail parks across the DE postcode area.</li>
                <li><strong>Industrial &amp; Warehouse:</strong> Manufacturing units across Raynesway Industrial Estate, Spondon, and Alfreton Road — plus logistics warehouses servicing the A38 and M1 corridor.</li>
                <li><strong>Aerospace &amp; Advanced Manufacturing:</strong> Commercial premises associated with Derby's aerospace and automotive supply chain, including test facilities and R&amp;D units requiring specialist assessment.</li>
                <li><strong>Hospitality &amp; Leisure:</strong> Hotels, bars, restaurants, and event venues across the city centre and Derby's expanding riverside leisure district.</li>
                <li><strong>Healthcare &amp; Education:</strong> Private healthcare premises, university buildings, and independent schools requiring commercial EPCs or Display Energy Certificates.</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>Level 3 vs Level 4 Assessment — Derby Guide</h3>
            <div className={styles.featureBox}>
              <h3>Which Assessment Level Does Your Derby Building Need?</h3>
              <ul className={styles.list}>
                <li><strong>Level 3 — Standard Buildings:</strong> Covers the vast majority of Derby's commercial stock — standard offices, retail units, warehouses, and simple industrial premises. Assessed using iSBEM software.</li>
                <li><strong>Level 4 — Complex Buildings:</strong> Multi-zone HVAC, mechanical ventilation with heat recovery (MVHR), or complex services configurations. Required for larger hotels, healthcare facilities, and some of Derby's advanced manufacturing premises.</li>
                <li><strong>Display Energy Certificates (DECs):</strong> Required for Derby City Council buildings, NHS Derby premises, leisure centres, and public schools over 250m² visited by the public. Avorria provides both DECs and Advisory Reports.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Derby Commercial EPC Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. No travel surcharge for DE postcodes. Includes assessor visit, SBEM calculation &amp; national register lodgement.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 100m²</span><strong>£150</strong></div>
              <div className={styles.priceRow}><span>101 – 250m²</span><strong>£225</strong></div>
              <div className={styles.priceRow}><span>251 – 500m²</span><strong>£325</strong></div>
              <div className={styles.priceRow}><span>501 – 750m²</span><strong>£425</strong></div>
              <div className={styles.priceRow}><span>751 – 1,000m²</span><strong>£545</strong></div>
              <div className={styles.priceRow}><span>1,001m²+</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=commercial&city=derby" className={styles.bookButton}>
              Book Derby EPC Now
            </Link>
            <Link href="/services/commercial-epc" className={styles.bookButtonSecondary}>
              Learn About Commercial EPCs
            </Link>
            <span className={styles.pricingNotes}>
              * Level 4 complex assessments scoped individually. TM44 air conditioning inspections quoted separately. Zero travel surcharge for all DE postcodes.
            </span>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How Derby Commercial EPCs Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Book Online</h4>
              <p>Select your building type and floor area. Instant fixed pricing shown. Confirm in minutes — no account needed.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Assessment</h4>
              <p>Our Derby-based NDEA assessor visits your premises capturing construction data, HVAC, lighting, and fabric — typically 2–4 hours on site.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>SBEM Calculation</h4>
              <p>Building data processed through approved SBEM software. Improvement recommendations ranked by cost-benefit ratio and SAP point gain.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate Lodged</h4>
              <p>Your EPC is lodged on the official national register within 24 hours. PDF copies emailed to you immediately upon lodgement.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Derby Client Testimonials</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 58+ verified Derby commercial assessments</p>
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
          <h2 className={styles.faqTitle}>Commercial EPC Derby — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How much does a Commercial EPC cost in Derby?</p>
              <p className={styles.faqAnswer}>Pricing starts at £150 + VAT for buildings up to 100m², scaling by floor area to £545 for 751–1,000m². No travel surcharge for any DE postcode. Use our <Link href="/prices" style={{ color: 'var(--accent-lime)' }}>pricing calculator</Link> for an instant estimate.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How quickly can I get a Commercial EPC in Derby?</p>
              <p className={styles.faqAnswer}>Same-week appointments are available across all DE postcodes. As a Chesterfield-based business, Derby is home territory — we can often arrange next-day visits. Certificates lodged within 24 hours of site visit.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does my Derby commercial property meet MEES 2027?</p>
              <p className={styles.faqAnswer}>All commercial rental premises must reach EPC Band C by April 2027 and Band B by 2030. Fines for non-compliance range up to £150,000. Use our free <Link href="/estimate" style={{ color: 'var(--accent-lime)' }}>EPC Estimator</Link> for an early rating indication before committing to a full assessment.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do I need a Commercial EPC or DEC for my Derby building?</p>
              <p className={styles.faqAnswer}>Commercial EPCs are required when selling or renting non-domestic properties. Display Energy Certificates (DECs) are required for public buildings over 250m² visited by the public — including Derby City Council offices, NHS buildings, leisure centres, and schools. Avorria provides both.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I combine a Commercial EPC and TM44 in Derby?</p>
              <p className={styles.faqAnswer}>Yes — bundling Commercial EPC and TM44 Air Conditioning Inspection in a single visit saves on assessor costs. This is the most cost-effective approach for Derby premises with AC systems over 12kW.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What improvements will raise my Derby commercial EPC rating?</p>
              <p className={styles.faqAnswer}>Highest-ROI improvements for Derby commercial properties typically include LED lighting, HVAC controls optimisation, roof insulation, and heating system upgrades. Our <Link href="/improve" style={{ color: 'var(--accent-lime)' }}>Improvement Advisor</Link> models the exact cost and impact for your property type.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Ready to Book Your Derby Commercial EPC?</h2>
          <p>
            Based in Chesterfield — Derby is home territory. Covering all DE postcodes with same-week availability, no travel surcharge, and 24-hour certificate turnaround.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&city=derby" className={styles.ctaPrimary}>
              Book Assessment Now →
            </Link>
            <Link href="/services/commercial-epc" className={styles.ctaSecondary}>
              Learn About Commercial EPCs
            </Link>
          </div>
        </div>

        {/* RELATED LINKS */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Derby Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/derby/tm44" className={styles.relatedLink}>TM44 Derby</Link>
            <Link href="/locations/nottingham/commercial-epc" className={styles.relatedLink}>Commercial EPC Nottingham</Link>
            <Link href="/locations/sheffield/commercial-epc" className={styles.relatedLink}>Commercial EPC Sheffield</Link>
            <Link href="/locations/leicester/commercial-epc" className={styles.relatedLink}>Commercial EPC Leicester</Link>
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
