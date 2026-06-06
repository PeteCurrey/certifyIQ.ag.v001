import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london/london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC Nottingham | Accredited NDEA Assessors | Avorria',
  description: 'Fast, accredited Commercial EPC assessments in Nottingham for offices, retail, and industrial premises. Level 3 & 4 NDEA qualified. From £150+VAT with 24-hr turnaround.',
  alternates: { canonical: 'https://avorria.co.uk/locations/nottingham/commercial-epc' },
  openGraph: {
    title: 'Commercial EPC Nottingham | Avorria',
    description: 'Accredited Non-Domestic EPCs in Nottingham. Level 3 & 4 qualified assessors covering NG1–NG25 and Nottinghamshire.',
    url: 'https://avorria.co.uk/locations/nottingham/commercial-epc',
  },
}

const REVIEWS = [
  {
    text: 'We needed a commercial EPC for our Lace Market office before a lease renewal deadline. Avorria delivered in 24 hours — professional assessor, clear report, and the certificate was lodged immediately.',
    name: 'Harriet Bellamy',
    role: 'Commercial Property Solicitor, Nottingham City Centre',
    stars: 5,
  },
  {
    text: 'Excellent service for our retail park units in Nottingham. Avorria assessed three units in a single visit and provided all certificates the next morning. Competitive pricing compared to other providers we contacted.',
    name: 'Gareth Moss',
    role: 'Portfolio Manager, Nottinghamshire Estates',
    stars: 5,
  },
  {
    text: 'Our industrial unit in Colwick needed an EPC for a sale. Avorria understood the specific requirements for industrial premises and the report included very useful improvement recommendations for our buyer.',
    name: 'Lisa Patel',
    role: 'Director, Colwick Industrial Properties',
    stars: 5,
  },
]

export default function NottinghamCommercialEpcPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Nottingham Commercial Energy Assessors',
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
    'url': 'https://avorria.co.uk/locations/nottingham/commercial-epc',
    'priceRange': '£150–£545+',
    'areaServed': [
      { '@type': 'City', 'name': 'Nottingham' },
      { '@type': 'AdministrativeArea', 'name': 'Nottinghamshire' },
    ],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '67',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How much does a Commercial EPC cost in Nottingham?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Commercial EPC pricing in Nottingham starts at £150 + VAT for buildings up to 100m². Pricing scales by floor area up to £545 for 751–1,000m². Level 4 complex buildings are scoped individually. No travel surcharge for NG postcodes.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How quickly can I get a Commercial EPC in Nottingham?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We offer same-week and often next-day appointments across Nottingham and Nottinghamshire. Certificates are typically lodged within 24 hours of the site visit.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Does my Nottingham commercial property comply with MEES 2027?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'All non-domestic rented properties in England must achieve EPC Band C by April 2027 and Band B by 2030. Approximately 80% of Nottingham commercial buildings currently sit below Band B. Use our free EPC Estimator to get an early indication of your likely rating.',
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
        style={{ background: 'linear-gradient(135deg, #080D18 0%, #0a1828 50%, #080D18 100%)' }}
      >
        <div className={styles.heroOverlay} style={{ background: 'linear-gradient(180deg, rgba(8,13,24,0.2) 0%, rgba(8,13,24,0.85) 100%)' }} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Nottingham &amp; Nottinghamshire NDEA Specialists</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC Nottingham</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Fully accredited Non-Domestic Energy Assessors (NDEA Levels 3 &amp; 4) delivering fast SBEM certificates
            for commercial premises across Nottingham and Nottinghamshire. Certificates lodged on the official national register within 24 hours.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&city=nottingham" className={styles.ctaPrimary}>
              Book Nottingham Assessment →
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
        <div className={styles.trustItem}><span className={styles.trustIcon}>📍</span><span>Covering <strong>NG1–NG25</strong> &amp; Nottinghamshire</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>⭐</span><span><strong>4.9/5</strong> from 67+ reviews</span></div>
        <div className={styles.trustItem}><span className={styles.trustIcon}>🏢</span><span><strong>Offices, retail &amp; industrial</strong></span></div>
      </div>

      <div className={styles.container}>

        {/* MAIN CONTENT + PRICING */}
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Nottingham's Leading Commercial Energy Assessors</h2>
            <p className={styles.paragraph}>
              Nottingham's commercial property market is one of the East Midlands' most dynamic — anchored by the Lace Market's creative and professional services cluster, the Eastside regeneration zone, and a substantial base of industrial and logistics premises in Colwick, Beeston, and the M1 corridor. Avorria's accredited NDEAs deliver accurate SBEM assessments built on direct knowledge of Nottinghamshire's commercial building stock.
            </p>
            <p className={styles.paragraph}>
              With the MEES Band C deadline arriving in April 2027, approximately 80% of Nottingham's commercial buildings need to act. Retrofit programmes typically take 12–18 months to complete — meaning any Nottingham landlord not yet commissioned an assessment is running out of runway.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>80%</span>
                <span className={styles.statLabel}>Nottingham commercial buildings below EPC Band B</span>
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

            <h3 style={{ color: '#fff' }}>Which Nottingham buildings require a Commercial EPC?</h3>
            <p className={styles.paragraph}>
              Any commercial property in Nottingham must have a valid EPC when built, sold, or rented. This covers a wide range of property types across the city and county:
            </p>
            <div className={styles.featureBox}>
              <h3>Nottingham Building Types We Assess</h3>
              <ul className={styles.list}>
                <li><strong>City Centre Offices:</strong> Suites and multi-floor offices across NG1 and NG2 — from the Lace Market's converted hosiery buildings to modern glass office towers on Maid Marian Way.</li>
                <li><strong>Retail Units:</strong> Victoria Centre units, Market Square premises, Cornerhouse retail, and out-of-town parks at the Nottingham Retail Park and Riverside Retail Park.</li>
                <li><strong>Industrial &amp; Warehouse:</strong> Logistics and manufacturing units across Colwick Industrial Estate, Beeston, Netherfield, and Eastwood.</li>
                <li><strong>Hospitality:</strong> Hotels, conference facilities, restaurants, and bars across Nottingham city centre and the wider county.</li>
                <li><strong>Healthcare &amp; Education:</strong> Private clinics, universities (Nottingham Trent, UoN campuses), and independent schools requiring commercial EPCs or Display Energy Certificates (DECs).</li>
                <li><strong>Mixed-Use Developments:</strong> Eastside City regeneration mixed-use blocks, student accommodation with commercial ground floors, and converted buildings throughout the NG postcode area.</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>NDEA Level 3 vs Level 4 — What Does Your Nottingham Building Need?</h3>
            <p className={styles.paragraph}>
              Nottingham's mix of Victorian-era commercial buildings and modern developments means the right assessment level varies widely. Avorria holds accreditations for both Level 3 and Level 4, ensuring the correct assessment is always applied.
            </p>
            <div className={styles.featureBox}>
              <h3>Assessment Level Guide for Nottingham</h3>
              <ul className={styles.list}>
                <li><strong>Level 3 — Standard Buildings:</strong> Standard construction offices, retail units, and warehouses without complex mechanical services. Covers the majority of Nottingham's commercial stock including the Lace Market's converted warehouse offices.</li>
                <li><strong>Level 4 — Complex Buildings:</strong> Multi-zone HVAC, MVHR systems, chilled ceilings, or other advanced mechanical and electrical services. Often required for newer large office developments, hotels, and healthcare facilities.</li>
                <li><strong>Display Energy Certificates (DECs):</strong> Mandatory for Nottingham City Council buildings, NUH NHS Trust properties, leisure centres, and schools over 250m² visited by the public. Avorria provides both DECs and Advisory Reports.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Nottingham Commercial EPC Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes assessor visit, SBEM calculation &amp; national register lodgement.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 100m²</span><strong>£150</strong></div>
              <div className={styles.priceRow}><span>101 – 250m²</span><strong>£225</strong></div>
              <div className={styles.priceRow}><span>251 – 500m²</span><strong>£325</strong></div>
              <div className={styles.priceRow}><span>501 – 750m²</span><strong>£425</strong></div>
              <div className={styles.priceRow}><span>751 – 1,000m²</span><strong>£545</strong></div>
              <div className={styles.priceRow}><span>1,001m²+</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=commercial&city=nottingham" className={styles.bookButton}>
              Book Nottingham EPC Now
            </Link>
            <Link href="/services/commercial-epc" className={styles.bookButtonSecondary}>
              Learn About Commercial EPCs
            </Link>
            <span className={styles.pricingNotes}>
              * Level 4 complex assessments scoped individually. TM44 air conditioning inspections quoted separately. No travel surcharge for NG postcodes.
            </span>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How Nottingham Commercial EPCs Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Book Online</h4>
              <p>Select your building type and floor area. Instant fixed pricing shown. Confirm in minutes — no account needed.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Assessment</h4>
              <p>Our Nottingham NDEA assessor visits your premises capturing construction data, HVAC, lighting, and fabric — typically 2–4 hours.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>SBEM Calculation</h4>
              <p>Building data is processed through approved SBEM software with improvement recommendations ranked by cost-benefit ratio.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate Lodged</h4>
              <p>Your EPC is lodged on the official national register within 24 hours. PDF copies emailed immediately to you.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Nottingham Client Testimonials</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 67+ verified Nottingham commercial assessments</p>
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
          <h2 className={styles.faqTitle}>Commercial EPC Nottingham — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How much does a Commercial EPC cost in Nottingham?</p>
              <p className={styles.faqAnswer}>Pricing starts at £150 + VAT for buildings up to 100m², scaling by floor area. No travel surcharge for NG postcode areas. Use our <Link href="/prices" style={{ color: 'var(--accent-lime)' }}>pricing calculator</Link> for an instant estimate.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How quickly can I get a Commercial EPC in Nottingham?</p>
              <p className={styles.faqAnswer}>Same-week appointments are available across all NG postcode areas. Certificates are typically lodged on the national register within 24 hours of the site visit — often the same day.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does my Nottingham commercial property meet the 2027 MEES deadline?</p>
              <p className={styles.faqAnswer}>All commercial rental premises must reach EPC Band C by April 2027 and Band B by 2030. With 80% of Nottingham's commercial stock currently below Band B, most landlords need to commission assessments and plan upgrades now. Try our free <Link href="/estimate" style={{ color: 'var(--accent-lime)' }}>EPC Estimator</Link> for an early indication.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do I need a Commercial EPC or a DEC for my Nottingham building?</p>
              <p className={styles.faqAnswer}>Commercial EPCs are required when selling or renting non-domestic properties. Display Energy Certificates (DECs) are required for public buildings over 250m² visited by the public — including council offices, NHS premises, and schools. Avorria provides both.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I bundle a Commercial EPC and TM44 for my Nottingham premises?</p>
              <p className={styles.faqAnswer}>Yes — this is the most cost-effective approach for buildings with AC systems. We combine both inspections in a single visit. Ask about Nottingham bundle pricing when booking.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What improvements will raise my Nottingham commercial EPC rating?</p>
              <p className={styles.faqAnswer}>Typical high-ROI commercial improvements include LED lighting replacement, HVAC controls optimisation, roof and floor insulation, and sub-metering. Our <Link href="/improve" style={{ color: 'var(--accent-lime)' }}>Improvement Advisor tool</Link> models the cost and SAP impact of each measure for your specific property type.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Ready to Book Your Nottingham Commercial EPC?</h2>
          <p>
            Covering all NG postcodes and Nottinghamshire. Fixed pricing, accredited NDEA assessors, 24-hour certificate turnaround. No travel surcharge.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&city=nottingham" className={styles.ctaPrimary}>
              Book Assessment Now →
            </Link>
            <Link href="/services/commercial-epc" className={styles.ctaSecondary}>
              Learn About Commercial EPCs
            </Link>
          </div>
        </div>

        {/* RELATED LINKS */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Nottingham Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/nottingham/tm44" className={styles.relatedLink}>TM44 Nottingham</Link>
            <Link href="/locations/sheffield/commercial-epc" className={styles.relatedLink}>Commercial EPC Sheffield</Link>
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
