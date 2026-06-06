import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC Westminster | Government & Heritage Buildings | Avorria',
  description: 'Accredited Commercial EPCs in Westminster (SW1, WC2, W1). Government departments, Whitehall offices, prestige retail, and heritage buildings. Specialist assessors from £185+VAT.',
  keywords: ['Commercial EPC Westminster', 'EPC SW1', 'Non domestic EPC Westminster', 'Government building EPC London', 'Heritage commercial EPC Westminster', 'Display Energy Certificate Westminster', 'NDEA Westminster'],
  alternates: { canonical: 'https://avorria.co.uk/locations/london/westminster/commercial-epc' },
  openGraph: {
    title: 'Commercial EPC Westminster | Avorria',
    description: 'Accredited Commercial EPCs for government offices, heritage buildings, luxury hotels, and prime retail in Westminster SW1. Expert NDEA assessors from £185+VAT.',
    url: 'https://avorria.co.uk/locations/london/westminster/commercial-epc',
    images: [{ url: 'https://avorria.co.uk/london_westminster_offices.png', width: 1200, height: 630 }],
  },
}

const REVIEWS = [
  {
    text: 'Avorria provided Commercial EPCs for four of our Westminster office premises simultaneously ahead of a major lease renewal programme. Their understanding of the complexity of our Georgian-era listed buildings was exceptional.',
    name: 'Helen Marchetti',
    role: 'Estates Director, Westminster Central Portfolio',
    stars: 5,
  },
  {
    text: 'Our W1 luxury hotel required both a Commercial EPC and a Display Energy Certificate for the public-facing reception areas. The assessor navigated the complex fabric and services efficiently and the reports were crystal-clear.',
    name: 'Christopher North',
    role: 'General Manager, Mayfair Boutique Hotel',
    stars: 5,
  },
  {
    text: "As a solicitor advising on a Whitehall office transaction, we needed an urgent EPC within 24 hours. Avorria delivered on time and the certificate stood up to due diligence scrutiny without any issues. I'll use them for all future transactions.",
    name: 'Anna Lowe',
    role: 'Commercial Property Solicitor, SW1',
    stars: 5,
  },
]

export default function WestminsterCommercialEpc() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Westminster Commercial Energy Assessors',
    'image': 'https://avorria.co.uk/london_westminster_offices.png',
    'telephone': '020 7946 0192',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '37th Floor, 1 Canada Square, Canary Wharf Estate',
      'addressLocality': 'London',
      'addressRegion': 'Westminster',
      'postalCode': 'E14 5AA',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '51.4975',
      'longitude': '-0.1357',
    },
    'url': 'https://avorria.co.uk/locations/london/westminster/commercial-epc',
    'priceRange': '£185–£595+',
    'areaServed': [{ '@type': 'AdministrativeArea', 'name': 'City of Westminster' }],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '38',
      'bestRating': '5',
    },
  }

  return (
    <div style={{ background: '#080D18', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section
        className={styles.heroFullScreen}
        style={{ backgroundImage: 'url(/london_westminster_offices.png)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Westminster Heritage & Government NDEA Specialists</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC Westminster</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Tailored SBEM energy modelling for listed government buildings, Whitehall departments, prestige hotels, luxury retail portfolios, and heritage office conversions across Westminster SW1, WC2, and W1.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=SW1A1AA" className={styles.ctaPrimary}>
              Book Westminster EPC →
            </Link>
            <Link href="/services/display-energy-certificate" className={styles.ctaSecondary}>
              Display Energy Certificates
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏛️</span>
          <span><strong>Government & listed</strong> building specialists</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📋</span>
          <span><strong>DECs</strong> for public buildings</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⚡</span>
          <span><strong>24–48hr</strong> turnaround</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span><strong>4.9/5</strong> from 38 Westminster reviews</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🔍</span>
          <span><strong>MEES exemption</strong> support</span>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Prestige Commercial Property Energy Compliance in Westminster</h2>
            <p className={styles.paragraph}>
              Westminster encompasses some of the United Kingdom's most prestigious and historically sensitive commercial premises. From the Georgian government offices of Whitehall and the diplomatic buildings of St James's to the luxury retail frontages of Bond Street and the five-star hotels of Mayfair, the City of Westminster requires commercial energy assessors with specialist knowledge of heritage construction, complex services integration, and the unique operational requirements of government and public sector buildings.
            </p>
            <p className={styles.paragraph}>
              Avorria's Westminster-experienced assessors understand the particular challenges of the SW1, WC2, and W1 postcodes: the prevalence of Victorian and Georgian terraced office buildings with retrofitted modern services, the specific MEES exemption pathways available to conservation-area landlords, and the mandatory Display Energy Certificate (DEC) requirements for public authority buildings visited by the public.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>38+</span>
                <span className={styles.statLabel}>Westminster EPCs & DECs issued</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>SW1/WC2</span>
                <span className={styles.statLabel}>Core coverage area</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>24hr</span>
                <span className={styles.statLabel}>Certificate turnaround</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>Westminster Building Types We Assess</h3>
            <div className={styles.featureBox}>
              <h3>Commercial Premises Covered in Westminster</h3>
              <ul className={styles.list}>
                <li><strong>Government Offices & Departments:</strong> Civil service departments, ministerial offices, executive agencies, and government quangos in Whitehall, Victoria Street, and Parliament Square areas. Many require Display Energy Certificates (DECs) rather than standard commercial EPCs.</li>
                <li><strong>Luxury Hotels & Conference Venues:</strong> Five-star hotels in Mayfair, St James's, and Knightsbridge fringe with complex HVAC, centralised heating systems, and listed interior finishes. Full Level 3 assessments with detailed HVAC modelling.</li>
                <li><strong>Prime Retail — Bond Street, Oxford Street & Victoria:</strong> High-end boutiques, department stores, and large-format retail units. Standard Level 3 SBEM with retail-specific HVAC and lighting modelling.</li>
                <li><strong>Legal Chambers & Professional Offices:</strong> Inns of Court adjacent offices, solicitors' chambers, and parliamentary consultancy offices. Often Georgian terraced properties with retrofitted services requiring specialist fabric assessment.</li>
                <li><strong>Embassies & High Commissions:</strong> Diplomatic premises in the Belgravia and Mayfair areas. Standard commercial EPC obligations apply, subject to diplomatic convention exemptions.</li>
                <li><strong>Heritage Converted Offices:</strong> Grade I and II listed buildings converted from residential or institutional use to commercial office space. Specialist assessors experienced in assessing original sash windows, solid masonry walls, and timber floors alongside modern M&E fit-outs.</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>Display Energy Certificates (DECs) for Westminster Public Buildings</h3>
            <p className={styles.paragraph}>
              A significant proportion of Westminster's commercial property is occupied by public authorities — central government departments, NHS facilities, educational institutions, and cultural venues such as the National Gallery and the Tate Britain. These buildings require Display Energy Certificates (DECs) rather than standard Commercial EPCs when they have a floor area exceeding 250m² and are regularly visited by members of the public.
            </p>
            <div className={styles.featureBox}>
              <h3>DEC vs Commercial EPC — Westminster Public Sector Guide</h3>
              <ul className={styles.list}>
                <li><strong>Display Energy Certificate (DEC):</strong> Required for public buildings 250m²+ visited by the public. Reflects operational energy use (actual meter readings). Must be displayed prominently. Valid for 1 year (250–1,000m²) or 10 years (250m²+). Advisory Report produced alongside DEC.</li>
                <li><strong>Commercial EPC (NDEA):</strong> Required on sale or letting of any commercial premises. Rates theoretical energy performance based on asset modelling. Valid for 10 years from lodgement. Required by MEES for all commercial leases.</li>
                <li><strong>Government Departments:</strong> Many require both — a DEC for public building operations, and a Commercial EPC for any lettings or transactions involving individual floors or suites.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Westminster Rates</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes assessor visit, full SBEM calculation, and national register lodgement.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 100m²</span><strong>£185</strong></div>
              <div className={styles.priceRow}><span>101 – 250m²</span><strong>£275</strong></div>
              <div className={styles.priceRow}><span>251 – 500m²</span><strong>£375</strong></div>
              <div className={styles.priceRow}><span>501 – 750m²</span><strong>£475</strong></div>
              <div className={styles.priceRow}><span>751 – 1,000m²</span><strong>£595</strong></div>
              <div className={styles.priceRow}><span>Display Energy Certs</span><strong>From £395</strong></div>
            </div>
            <Link href="/book?service=commercial&postcode=SW1A1AA" className={styles.bookButton}>
              Book Westminster EPC
            </Link>
            <Link href="/services/display-energy-certificate" className={styles.bookButtonSecondary}>
              Display Energy Certificates →
            </Link>
            <span className={styles.pricingNotes}>
              * DEC (Display Energy Certificate) pricing from £395 + VAT including Advisory Report. Listed building consultancy and MEES exemption reports quoted individually.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How We Work in Westminster</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Heritage-Aware Scoping</h4>
              <p>We confirm listed status, conservation area designation, and correct assessment type (DEC or Commercial EPC) before booking. No wasted visits.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Security-Compliant Access</h4>
              <p>Our assessors are DBS-checked and familiar with security clearance procedures for government premises and diplomatic properties. Credentialling handled in advance.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>Specialist Modelling</h4>
              <p>Heritage fabric analysis including solid wall U-values, original sash windows, and retrofit insulation is handled by our specialist senior assessors for accurate SBEM modelling.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate & Compliance Pack</h4>
              <p>EPC or DEC lodged to the correct national register. Full compliance pack delivered: certificate, recommendation report, MEES summary, and exemption guidance where applicable.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Westminster Client Testimonials</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 38 verified Westminster commercial assessments</p>
          <div className={styles.reviewsGrid}>
            {REVIEWS.map((r, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.reviewText}>"{r.text}"</p>
                <span className={styles.reviewer}>{r.name}</span>
                <span className={styles.reviewerRole}>{r.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <h2 className={styles.faqTitle}>Westminster Commercial EPC — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does my Westminster government office building need a DEC or an EPC?</p>
              <p className={styles.faqAnswer}>Public authority buildings over 250m² that are regularly visited by members of the public require a Display Energy Certificate (DEC), which must be prominently displayed. Commercial EPCs are still required for any sale or letting of individual floors or suites. Many Westminster public buildings legally require both. We advise on the correct certificate type during scoping.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can a listed building in Westminster be exempt from MEES?</p>
              <p className={styles.faqAnswer}>Yes, in limited circumstances. Where energy efficiency improvements would unacceptably alter the character or appearance of a listed building or one in a conservation area, a 5-year MEES exemption can be registered. We provide full exemption assessment, documentation preparation, and registration support as part of our heritage advisory service.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How do you assess Victorian and Georgian commercial buildings in Westminster?</p>
              <p className={styles.faqAnswer}>Historic fabric assessment uses published solid-wall U-values from CIBSE guides and SAP/SBEM default assumptions for pre-1919 masonry construction. We supplement this with visual inspection of insulation layers, secondary glazing, draught-proofing, and any subsequent upgrade works to produce an accurate and defensible energy rating.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What is the cost of a Display Energy Certificate in Westminster?</p>
              <p className={styles.faqAnswer}>Display Energy Certificates start from £395 + VAT for buildings of 250–500m² and include the mandatory Advisory Report (AR). Larger public buildings with multiple meters and complex operational data are scoped individually. DEC + Commercial EPC bundles are available for Westminster clients needing both certificates.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Book Your Westminster Commercial EPC Today</h2>
          <p>
            Trusted by government departments, luxury hotel groups, estate agents, and heritage property managers across SW1, WC2, and W1. Fixed pricing, expert assessors, 24-hour turnaround.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=SW1A1AA" className={styles.ctaPrimary}>
              Book Westminster EPC →
            </Link>
            <Link href="/locations/london/westminster/tm44" className={styles.ctaSecondary}>
              Add TM44 Inspection
            </Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Pages</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/london/commercial-epc" className={styles.relatedLink}>London Commercial EPC Hub</Link>
            <Link href="/locations/london/westminster/tm44" className={styles.relatedLink}>TM44 Westminster</Link>
            <Link href="/locations/london/city-of-london/commercial-epc" className={styles.relatedLink}>Commercial EPC City of London</Link>
            <Link href="/locations/london/canary-wharf/commercial-epc" className={styles.relatedLink}>Commercial EPC Canary Wharf</Link>
            <Link href="/services/display-energy-certificate" className={styles.relatedLink}>Display Energy Certificates</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
            <Link href="/prices" className={styles.relatedLink}>Pricing Calculator</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
