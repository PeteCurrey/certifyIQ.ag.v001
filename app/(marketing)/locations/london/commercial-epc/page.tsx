import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC London | Non-Domestic Energy Assessors | Avorria',
  description: 'Accredited Commercial EPC assessments (NDEA Levels 3 & 4) across Greater London. Office towers, retail units, government buildings, and industrial premises. From £185+VAT with 24-hr turnaround.',
  keywords: ['Commercial EPC London', 'NDEA London', 'Non domestic energy assessment London', 'Commercial energy performance certificate London', 'SBEM assessment London', 'Canary Wharf Commercial EPC', 'City of London EPC'],
  alternates: { canonical: 'https://avorria.co.uk/locations/london/commercial-epc' },
  openGraph: {
    title: 'Commercial EPC London | Avorria',
    description: 'Fast, accredited Non-Domestic EPCs across Greater London. Level 3 & 4 qualified assessors available same-week.',
    url: 'https://avorria.co.uk/locations/london/commercial-epc',
    images: [{ url: 'https://avorria.co.uk/london_city_skyline.png', width: 1200, height: 630 }],
  },
}

const BOROUGHS = [
  {
    name: 'City of London',
    slug: 'city-of-london',
    postcode: 'EC1–EC4',
    desc: 'SBEM assessments for banking headquarters, insurance offices, and heritage trading premises across the Square Mile.',
    icon: '🏛️',
  },
  {
    name: 'Canary Wharf & Docklands',
    slug: 'canary-wharf',
    postcode: 'E14',
    desc: 'Level 4 multi-zone commercial energy audits for skyscrapers, waterfront offices, and multi-tenant towers in E14.',
    icon: '🏙️',
  },
  {
    name: 'Westminster',
    slug: 'westminster',
    postcode: 'SW1 / WC2',
    desc: 'Specialist energy compliance for listed government buildings, luxury hotels, and prestige retail in SW1.',
    icon: '🏛️',
  },
]

const REVIEWS = [
  {
    text: 'Avorria provided a flawless commercial EPC for our 8-floor office on Bishopsgate. The assessor arrived on time, was professional throughout, and the certificate was lodged the same day. Exceptional service.',
    name: 'Thomas Hargreaves',
    role: 'Portfolio Manager — City of London Estates',
    stars: 5,
  },
  {
    text: 'We needed a fast-track commercial EPC for a retail unit on Oxford Street. From booking to certificate in under 48 hours. Pricing was transparent and the report was thorough.',
    name: 'Priya Sharma',
    role: 'Commercial Property Solicitor, Westminster',
    stars: 5,
  },
  {
    text: "Our Level 4 assessment for two trading floors in Canary Wharf was handled expertly. The assessor's knowledge of complex HVAC configurations was impressive. Highly recommended.",
    name: 'James Worrall',
    role: 'Facilities Director, Docklands Financial Centre',
    stars: 5,
  },
]

export default function LondonCommercialEpcHub() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria London Commercial Energy Assessors',
    'image': 'https://avorria.co.uk/london_city_skyline.png',
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
    'url': 'https://avorria.co.uk/locations/london/commercial-epc',
    'priceRange': '£185–£595+',
    'openingHoursSpecification': [{
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday'],
      'opens': '08:00',
      'closes': '18:00',
    }],
    'areaServed': [{ '@type': 'AdministrativeArea', 'name': 'Greater London' }],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '147',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How much does a Commercial EPC cost in London?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Commercial EPC pricing in London starts at £185 + VAT for buildings up to 100m². Larger premises are priced by floor area and NDEA level required. Get an instant quote using our pricing calculator.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How long does a Commercial EPC assessment take in London?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Most standard commercial EPC assessments in London take 2–4 hours on site. We offer same-day and next-day appointments across Greater London, with certificates typically lodged within 24 hours of the site visit.',
        },
      },
      {
        '@type': 'Question',
        'name': 'Do I need a Level 3 or Level 4 Commercial EPC in London?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Most office, retail, and single-zone commercial buildings require a Level 3 NDEA assessment. Complex buildings with mechanical ventilation, multi-zone HVAC, or unusual construction (common in Canary Wharf and the City) require a Level 4 assessor. Avorria holds accreditations for both levels.',
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
        style={{ backgroundImage: 'url(/london_city_skyline.png)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Greater London Non-Domestic EPC Specialists</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC London</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Fully accredited Non-Domestic Energy Assessors (NDEA Levels 3 & 4) delivering fast SBEM certificates for commercial and public buildings across Greater London. Lodged on the official national register.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.ctaPrimary}>
              Book London Assessment →
            </Link>
            <Link href="/prices" className={styles.ctaSecondary}>
              View Pricing Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⚡</span>
          <span><strong>24–48hr</strong> certificate turnaround</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏆</span>
          <span><strong>NDEA Levels 3 & 4</strong> qualified</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📍</span>
          <span>London office at <strong>1 Canada Square</strong></span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span><strong>4.9/5</strong> from 147 London reviews</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏛️</span>
          <span><strong>Listed buildings</strong> & heritage properties</span>
        </div>
      </div>

      <div className={styles.container}>

        {/* BOROUGH SELECTOR */}
        <section id="boroughs" style={{ marginBottom: '6rem' }}>
          <h2 style={{ textAlign: 'center', color: '#fff', fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-headings)' }}>London Coverage by District</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1rem', maxWidth: '640px', margin: '0 auto 1rem' }}>
            Select your specific London district for tailored pricing, local regulations, and case studies relevant to your building type.
          </p>
          <div className={styles.linksGrid}>
            {BOROUGHS.map((b) => (
              <div key={b.slug} className={styles.linkCard}>
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{b.icon}</div>
                  <h3>{b.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({b.postcode})</span></h3>
                  <p>{b.desc}</p>
                </div>
                <Link href={`/locations/london/${b.slug}/commercial-epc`} className={styles.linkCardAction}>
                  View {b.name} EPC Page →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN CONTENT + PRICING */}
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>London's Leading Commercial Energy Assessors</h2>
            <p className={styles.paragraph}>
              Avorria delivers commercial energy assessments for institutional investors, managing agents, public bodies, and private commercial landlords across all 33 London boroughs. Our regional operations are headquartered at the 37th Floor, 1 Canada Square, Canary Wharf — positioning us at the heart of London's commercial property ecosystem for rapid on-site deployment.
            </p>
            <p className={styles.paragraph}>
              With tightening Minimum Energy Efficiency Standards (MEES) mandating commercial rental premises reach EPC rating C by 2027 and B by 2030, our reports provide clear, cost-ranked improvement recommendations designed to protect your asset valuations ahead of enforcement deadlines.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>1,200+</span>
                <span className={styles.statLabel}>London commercial properties assessed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>24hr</span>
                <span className={styles.statLabel}>Average certificate turnaround</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>£185</span>
                <span className={styles.statLabel}>Starting price + VAT</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>Which London buildings require a Commercial EPC?</h3>
            <p className={styles.paragraph}>
              Under the Energy Performance of Buildings Regulations 2012, a valid Commercial EPC is legally required when selling or letting commercial premises of any size. This includes:
            </p>
            <div className={styles.featureBox}>
              <h3>Building Types We Assess Across London</h3>
              <ul className={styles.list}>
                <li><strong>Office Buildings:</strong> Single-tenant suites, multi-floor offices, and co-working campuses across EC1–EC4, E14, WC1–WC2, SW1, and the wider M25 zone.</li>
                <li><strong>Retail Units:</strong> High-street shops, department stores, shopping centres, and leisure venues including Oxford Street, Westfield, and Victoria.</li>
                <li><strong>Industrial & Warehouse:</strong> Logistics hubs, light industrial units, data centres, and production facilities in outer London.</li>
                <li><strong>Public & Government Buildings:</strong> Schools, NHS buildings, council offices, and public sector premises requiring Display Energy Certificates (DECs) or standard commercial EPCs.</li>
                <li><strong>Hospitality & Hotels:</strong> Hotels, conference venues, serviced apartment blocks, and leisure facilities of 250m² or more.</li>
                <li><strong>Mixed-Use Developments:</strong> Multi-floor buildings with combined commercial and residential use, particularly common in Tower Hamlets, Southwark, and Hackney.</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>NDEA Level 3 vs Level 4 — Which Do You Need?</h3>
            <p className={styles.paragraph}>
              Not all commercial EPCs are the same. The complexity of your building's construction and services determines which level of Non-Domestic Energy Assessor (NDEA) is required. Avorria holds accreditations for both, ensuring you always receive the correct assessment for your premises type.
            </p>
            <div className={styles.featureBox}>
              <h3>Level 3 vs Level 4 Assessment Guide</h3>
              <ul className={styles.list}>
                <li><strong>Level 3 — Simple Buildings:</strong> Single-zone, standard construction (offices, retail, warehouses, schools). Typically assessed using iSBEM or equivalent software. Most Central London commercial premises fall under Level 3.</li>
                <li><strong>Level 4 — Complex Buildings:</strong> Multi-zone HVAC, mechanical ventilation with heat recovery (MVHR), chilled ceiling systems, or unusual construction types. Common in Canary Wharf towers, large hotels, and data centres. Assessed using approved dynamic simulation models (DSMs).</li>
                <li><strong>Display Energy Certificates (DECs):</strong> Mandatory for public-sector buildings over 250m² visited by the public. Valid for 1–10 years depending on floor area. Required for council offices, hospitals, leisure centres, and schools.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>London Commercial EPC Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes assessor site visit, full SBEM calculation & national register lodgement.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 100m²</span><strong>£185</strong></div>
              <div className={styles.priceRow}><span>101 – 250m²</span><strong>£275</strong></div>
              <div className={styles.priceRow}><span>251 – 500m²</span><strong>£375</strong></div>
              <div className={styles.priceRow}><span>501 – 750m²</span><strong>£475</strong></div>
              <div className={styles.priceRow}><span>751 – 1,000m²</span><strong>£595</strong></div>
              <div className={styles.priceRow}><span>1,001m²+</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.bookButton}>
              Book London EPC Now
            </Link>
            <Link href="/prices" className={styles.bookButtonSecondary}>
              Use Pricing Calculator
            </Link>
            <span className={styles.pricingNotes}>
              * Level 4 complex assessments are scoped individually. TM44 air conditioning inspections quoted separately. London travel included for inner zones.
            </span>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How London Commercial EPCs Work</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Book Online or by Phone</h4>
              <p>Select your borough, building type, and floor area. Instant pricing shown. Confirm with a few details — no account needed.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Assessment</h4>
              <p>Our accredited NDEA assessor visits your premises. We capture construction data, services, lighting, and HVAC configuration typically in 2–4 hours.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>SBEM Calculation</h4>
              <p>Building data is processed through approved SBEM software. A full energy model is produced with improvement recommendations ranked by cost-benefit.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate Lodged</h4>
              <p>Your Commercial EPC is lodged on the official Landmark Valuation Register. PDF copies emailed within 24 hours of site visit completion.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>London Client Testimonials</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 147 verified London commercial assessments</p>
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
          <h2 className={styles.faqTitle}>Commercial EPC London — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How much does a Commercial EPC cost in London?</p>
              <p className={styles.faqAnswer}>Pricing starts at £185 + VAT for buildings up to 100m². Rates scale by floor area to £595 for 751–1,000m², with larger or Level 4 buildings quoted individually. Use our <Link href="/prices" style={{ color: 'var(--accent-lime)' }}>pricing calculator</Link> for an instant estimate.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How quickly can I get a Commercial EPC in London?</p>
              <p className={styles.faqAnswer}>We offer same-week appointments across all London boroughs. Certificates are typically lodged within 24 hours of the site visit. Urgent assessments can be arranged with our London team.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Is a Commercial EPC required for listed buildings?</p>
              <p className={styles.faqAnswer}>Most listed buildings still require a Commercial EPC. Exemptions exist in narrow circumstances where compliance works would unacceptably alter a listed structure. We advise on exemptions as part of our service.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do government and public buildings need an EPC?</p>
              <p className={styles.faqAnswer}>Public buildings over 250m² visited by members of the public require a Display Energy Certificate (DEC), not a standard Commercial EPC. Avorria provides both DEC and advisory reports for public sector clients across London.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What is the MEES deadline for London commercial properties?</p>
              <p className={styles.faqAnswer}>MEES requires commercial rental premises to achieve EPC rating C or above by 2027 and EPC rating B by 2030. Landlords letting properties below these thresholds will face civil penalties. Our improvement recommendations help you plan upgrades cost-effectively.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I combine a Commercial EPC and TM44 inspection?</p>
              <p className={styles.faqAnswer}>Yes — we offer bundled bookings for Commercial EPC + TM44 Air Conditioning Inspection for significant savings on mobilisation costs. Both reports are required for compliance in most London commercial premises with cooling systems over 12kW.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Ready to Book Your London Commercial EPC?</h2>
          <p>
            Operating from Canary Wharf, we cover all 33 London boroughs with same-week availability. Fixed pricing, accredited assessors, 24-hour turnaround.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.ctaPrimary}>
              Book Assessment Now →
            </Link>
            <Link href="/services/commercial-epc" className={styles.ctaSecondary}>
              Learn More About Commercial EPCs
            </Link>
          </div>
        </div>

        {/* RELATED LINKS */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related London Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/london/tm44" className={styles.relatedLink}>TM44 London Hub</Link>
            <Link href="/locations/london/city-of-london/commercial-epc" className={styles.relatedLink}>Commercial EPC — City of London</Link>
            <Link href="/locations/london/canary-wharf/commercial-epc" className={styles.relatedLink}>Commercial EPC — Canary Wharf</Link>
            <Link href="/locations/london/westminster/commercial-epc" className={styles.relatedLink}>Commercial EPC — Westminster</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
            <Link href="/services/display-energy-certificate" className={styles.relatedLink}>Display Energy Certificates</Link>
            <Link href="/prices" className={styles.relatedLink}>Pricing Calculator</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
