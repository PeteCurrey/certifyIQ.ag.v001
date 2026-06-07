import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection Westminster | Government & Heritage',
  description: 'Statutory TM44 air conditioning inspections for government departments, heritage offices, luxury hotels, and commercial premises in Westminster (SW1, WC2, W1). Accredited CIBSE assessors.',
  alternates: { canonical: 'https://avorria.co.uk/locations/london/westminster/tm44' },
  openGraph: {
    title: 'TM44 Inspection Westminster',
    description: 'Statutory TM44 AC inspections for government offices, heritage buildings, and luxury hotels in Westminster SW1. Accredited assessors, Landmark lodgement included.',
    url: 'https://avorria.co.uk/locations/london/westminster/tm44',
    images: [{ url: 'https://avorria.co.uk/london_westminster_offices.png', width: 1200, height: 630 }],
  },
}

const REVIEWS = [
  {
    text: 'We engaged Avorria for TM44 inspections across three government-adjacent office buildings in Victoria. Their understanding of the complex access requirements and multi-system configurations was excellent.',
    name: 'Jonathan Hayward',
    role: 'Estates Manager, Westminster Public Sector Building',
    stars: 5,
  },
  {
    text: 'Our Mayfair hotel had a mixture of split systems, FCUs, and a centralised chiller. Avorria managed the inspection across four nights to avoid disrupting guests. Professional, discreet, and thorough.',
    name: 'Isabella Grey',
    role: 'Chief Engineer, Mayfair Five-Star Hotel',
    stars: 5,
  },
  {
    text: 'As commercial property solicitors advising on a Bond Street retail unit transaction, we needed a TM44 certificate urgently. Avorria delivered within 48 hours. Impeccable service.',
    name: 'Marcus Thornton',
    role: 'Commercial Property Partner, Westminster Law Firm',
    stars: 5,
  },
]

export default function WestminsterTm44() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Westminster TM44 Assessors',
    'image': 'https://avorria.co.uk/london_westminster_offices.png',
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
      'latitude': '51.4975',
      'longitude': '-0.1357',
    },
    'url': 'https://avorria.co.uk/locations/london/westminster/tm44',
    'priceRange': 'From £350 + VAT',
    'areaServed': [{ '@type': 'AdministrativeArea', 'name': 'City of Westminster' }],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '19',
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
          <span className={styles.eyebrow}>Westminster Government & Heritage AC Compliance</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspections Westminster</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Statutory air conditioning inspections for government departments, heritage office buildings, luxury hotels, and commercial premises across Westminster SW1, WC2, and W1. Certified installations, Landmark lodgement, and full compliance documentation.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request Westminster TM44 Quote →
            </Link>
            <Link href="/locations/london/westminster/commercial-epc" className={styles.ctaSecondary}>
              Also Need a Commercial EPC?
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏛️</span>
          <span><strong>Government & heritage</strong> specialists</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏨</span>
          <span><strong>Luxury hotel</strong> AC assessors</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📋</span>
          <span><strong>Landmark</strong> database lodgement</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span><strong>4.9/5</strong> from 19 Westminster reviews</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🔒</span>
          <span><strong>DBS-checked</strong> assessors</span>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Westminster Heritage & Modern AC Compliance</h2>
            <p className={styles.paragraph}>
              The City of Westminster presents one of London's most varied TM44 assessment landscapes. The area encompasses everything from state-of-the-art government departmental buildings with modern centralised cooling and BMS infrastructure, to Victorian and Georgian-era heritage offices where AC has been retrofitted through ceiling voids and listed interiors — requiring assessors with experience in both modern mechanical systems and the particular challenges of historic building fabric.
            </p>
            <p className={styles.paragraph}>
              Westminster's significant hospitality sector — including the concentration of five-star hotels in Mayfair, Belgravia, and St James's — also generates frequent TM44 requirements for complex hotel cooling systems serving guest rooms, restaurants, conference suites, and kitchen ventilation. These often combine multiple cooling technologies and require careful out-of-hours scheduling to avoid disruption to hotel operations and guests.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>19+</span>
                <span className={styles.statLabel}>Westminster TM44s completed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>SW1/W1</span>
                <span className={styles.statLabel}>Core coverage areas</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>5yr</span>
                <span className={styles.statLabel}>Certificate validity period</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>AC Systems We Inspect in Westminster</h3>
            <table className={styles.acTable}>
              <thead>
                <tr>
                  <th>System Type</th>
                  <th>Typical Westminster Locations</th>
                  <th>Complexity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Fan Coil Units (FCU) with Chilled Water</td>
                  <td>Government office blocks, embassy buildings, corporate HQs</td>
                  <td>High — plant room access, BMS, chiller logs</td>
                </tr>
                <tr>
                  <td>VRF / VRV Multi-Zone</td>
                  <td>Hotel bedroom floors, converted office buildings, boutiques</td>
                  <td>High — full unit mapping and zone controls analysis</td>
                </tr>
                <tr>
                  <td>Ducted AC with AHU</td>
                  <td>Conference centres, large hotel ballrooms, government briefing rooms</td>
                  <td>High — AHU inspection, duct routing, zone controls</td>
                </tr>
                <tr>
                  <td>Retrofit Split / Cassette Units</td>
                  <td>Listed office buildings, Georgian townhouse offices, legal chambers</td>
                  <td>Medium — heritage access complications, ceiling voids</td>
                </tr>
                <tr>
                  <td>Packaged Rooftop</td>
                  <td>Retail units on Oxford Street, leisure venues, restaurants</td>
                  <td>Medium — roof access coordination</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.featureBox}>
              <h3>Government Buildings & Public Sector TM44 — Westminster</h3>
              <ul className={styles.list}>
                <li><strong>Mandatory Obligation:</strong> Government departments and public bodies must comply with the same TM44 obligations as private commercial landlords under the EPBD Regulations. There are no public sector exemptions.</li>
                <li><strong>Procurement Requirements:</strong> Crown Estate and government property management contracts increasingly mandate current TM44 certificates as part of occupier due diligence and net-zero estate strategy reporting.</li>
                <li><strong>DBS-Checked Assessors:</strong> For sensitive government premises in Whitehall and the Westminster security zone, our assessors undergo standard DBS clearance and can work within established security access protocols.</li>
                <li><strong>Net-Zero Estate Planning:</strong> TM44 improvement recommendations feed directly into BEIS and Cabinet Office net-zero government estate programmes. Our reports include carbon reduction metrics aligned to the Government Estate Decarbonisation Roadmap.</li>
                <li><strong>Grouped Procurement:</strong> For public sector clients managing multiple Westminster buildings, we offer a managed procurement service with grouped scheduling, consolidated reporting, and framework pricing.</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>Out-of-Hours Assessments for Hotels & Hospitality</h3>
            <p className={styles.paragraph}>
              Westminster's luxury hotel sector has specific operational requirements that standard commercial AC inspection providers often cannot accommodate. Avorria offers out-of-hours and night-time TM44 assessment scheduling for hotel and hospitality clients where daytime access to plant rooms, bedroom floors, or conference suites would disrupt operations or guest experience.
            </p>
            <p className={styles.paragraph}>
              We coordinate directly with your chief engineer and operations director to plan a phased assessment schedule that completes all required inspections without impacting occupancy, events calendars, or kitchen service periods.
            </p>
          </div>

          {/* QUOTE CARD */}
          <div className={styles.pricingCard}>
            <h3>Westminster TM44 Pricing</h3>
            <p className={styles.priceIntro}>Pricing based on system type, output, and access requirements. Custom proposals within 2 hours of enquiry.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Retrofit split / cassette</span><strong>From £350</strong></div>
              <div className={styles.priceRow}><span>VRF / VRV multi-zone</span><strong>From £550</strong></div>
              <div className={styles.priceRow}><span>FCU with chilled water</span><strong>POA</strong></div>
              <div className={styles.priceRow}><span>Hotel / hospitality</span><strong>POA</strong></div>
              <div className={styles.priceRow}><span>Out-of-hours bookings</span><strong>Supplement applies</strong></div>
            </div>
            <Link href="/services/tm44" className={styles.bookButton}>
              Request Westminster TM44 Quote
            </Link>
            <Link href="/locations/london/westminster/commercial-epc" className={styles.bookButtonSecondary}>
              Bundle with Commercial EPC →
            </Link>
            <span className={styles.pricingNotes}>
              * Out-of-hours and weekend assessment slots available for hotels and hospitality venues. Government framework pricing available for public sector clients with 3+ buildings.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How We Work in Westminster</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Operations-Sensitive Planning</h4>
              <p>For hotels, government buildings, and heritage premises, we plan the inspection schedule around your operational requirements. Advance access coordination with estates or engineering teams.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>On-Site Inspection</h4>
              <p>Systematic assessment of all qualifying AC plant across SW1, WC2, and W1. Heritage access challenges (ceiling voids, listed fabric, restricted plant room access) handled by our specialist senior assessors.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>Westminster TM44 Report</h4>
              <p>Comprehensive report covering system inventory, efficiency benchmarking, maintenance analysis, and improvement recommendations — including heritage-appropriate upgrade pathways for listed buildings.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Landmark Lodgement</h4>
              <p>TM44 lodged to the Landmark Non-Domestic Register. Certificate reference issued. Complete compliance pack emailed within 48 hours of assessment completion.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Westminster TM44 Client Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 19 verified Westminster TM44 inspections</p>
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
          <h2 className={styles.faqTitle}>Westminster TM44 — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do government departments in Westminster need TM44?</p>
              <p className={styles.faqAnswer}>Yes — public sector buildings including government departments, civil service offices, and NHS facilities are subject to the same TM44 obligations as private commercial premises. There are no government exemptions. Crown and Government Estates increasingly audit TM44 compliance as part of the Government Estate Decarbonisation Strategy.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can TM44 inspections be conducted out of hours at our Westminster hotel?</p>
              <p className={styles.faqAnswer}>Yes — we offer evening and weekend assessment appointments specifically for hotel and hospitality clients where daytime inspections would disrupt operations. A supplemental out-of-hours rate applies. We coordinate fully with your chief engineer and duty manager to plan a phased schedule that works around your occupancy calendar.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Our Westminster office is in a listed building — does TM44 still apply?</p>
              <p className={styles.faqAnswer}>Yes. Listed building status does not exempt a commercial premises from TM44 obligations. Where AC systems have been retrofitted into historic fabric (e.g., cassette units in listed ceiling plasterwork, or split systems through listed windows), we adapt our inspection methodology to access all plant without causing damage to protected fabric.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How does TM44 relate to the Net Zero Government Estate commitment?</p>
              <p className={styles.faqAnswer}>The Government Estate Decarbonisation Roadmap requires all central government buildings to reach net zero by 2040. TM44 inspections and their improvement recommendations form a key input to estate carbon assessments. Avorria can provide TM44 reports formatted to support BEIS and Cabinet Office estate reporting requirements, including carbon intensity metrics and upgrade cost-benefit analysis.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Book Your Westminster TM44 Inspection</h2>
          <p>
            Trusted by government estate teams, luxury hotel operators, heritage property managers, and commercial landlords across SW1, WC2, and W1. Out-of-hours slots available. Full Landmark lodgement included.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request Westminster TM44 →
            </Link>
            <Link href="/locations/london/westminster/commercial-epc" className={styles.ctaSecondary}>
              Also Book Commercial EPC
            </Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Pages</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/london/tm44" className={styles.relatedLink}>London TM44 Hub</Link>
            <Link href="/locations/london/westminster/commercial-epc" className={styles.relatedLink}>Commercial EPC Westminster</Link>
            <Link href="/locations/london/canary-wharf/tm44" className={styles.relatedLink}>TM44 Canary Wharf</Link>
            <Link href="/locations/london/city-of-london/tm44" className={styles.relatedLink}>TM44 City of London</Link>
            <Link href="/services/tm44" className={styles.relatedLink}>TM44 Service Overview</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
            <Link href="/services/display-energy-certificate" className={styles.relatedLink}>Display Energy Certificates</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
