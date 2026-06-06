import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection Canary Wharf | Avorria',
  description: 'Statutory TM44 air conditioning inspections for commercial tower buildings in Canary Wharf & Docklands (E14). Chiller plant, VRF & BMS systems. CIBSE-registered assessors based at 1 Canada Square.',
  keywords: ['TM44 Canary Wharf', 'Air conditioning inspection E14', 'AC inspection Docklands', 'TM44 assessment E14', 'Chiller plant TM44 London', 'VRF inspection Canary Wharf'],
  alternates: { canonical: 'https://avorria.co.uk/locations/london/canary-wharf/tm44' },
  openGraph: {
    title: 'TM44 Inspection Canary Wharf | Avorria — Based at 1 Canada Square',
    description: 'Statutory TM44 AC inspections for Canary Wharf office towers. VRF, chiller, and BMS systems. Fast turnaround, competitive pricing.',
    url: 'https://avorria.co.uk/locations/london/canary-wharf/tm44',
    images: [{ url: 'https://avorria.co.uk/canary_wharf_towers.png', width: 1200, height: 630 }],
  },
}

const REVIEWS = [
  {
    text: "Avorria conducted TM44 for our entire Canary Wharf tower — 23 floors, a central chiller, and 6 separate VRF networks. The assessor was meticulous, the report was thorough, and we had zero compliance issues on our portfolio audit.",
    name: 'Nathan Cross',
    role: 'Head of Engineering, Docklands Commercial Tower',
    stars: 5,
  },
  {
    text: 'Our E14 data centre required precision cooling assessment for our CRAC units. The team understood the critical infrastructure constraints and conducted the inspection with zero disruption to our operations.',
    name: 'Rachel Keaton',
    role: 'Data Centre Operations Manager, Crossharbour',
    stars: 5,
  },
  {
    text: 'Fast, professional, and technically excellent. Three separate TM44 reports across our E14 portfolio delivered simultaneously. Pricing was competitive and the process was painless.',
    name: 'Oliver Stevens',
    role: 'Asset Manager, Canary Wharf Portfolio',
    stars: 5,
  },
]

export default function CanaryWharfTm44() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Canary Wharf TM44 Assessors',
    'image': 'https://avorria.co.uk/canary_wharf_towers.png',
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
    'url': 'https://avorria.co.uk/locations/london/canary-wharf/tm44',
    'priceRange': 'From £350 + VAT',
    'areaServed': [{ '@type': 'AdministrativeArea', 'name': 'Canary Wharf and Docklands' }],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '5.0',
      'reviewCount': '27',
      'bestRating': '5',
    },
  }

  return (
    <div style={{ background: '#080D18', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section
        className={styles.heroFullScreen}
        style={{ backgroundImage: 'url(/canary_wharf_towers.png)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Skyscraper AC Systems Compliance — E14 Docklands</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspections Canary Wharf</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Accredited air conditioning efficiency assessments for Docklands commercial towers. Our team is based at 37th Floor, 1 Canada Square — uniquely placed for rapid, minimally disruptive inspections of E14's most complex HVAC systems.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request E14 TM44 Quote →
            </Link>
            <Link href="/locations/london/canary-wharf/commercial-epc" className={styles.ctaSecondary}>
              Also Need a Commercial EPC?
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📍</span>
          <span>Based at <strong>1 Canada Square</strong></span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🔧</span>
          <span><strong>Chiller, VRF & BMS</strong> specialists</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📋</span>
          <span><strong>Landmark</strong> register lodgement</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span><strong>5.0/5</strong> from 27 E14 TM44 reviews</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏙️</span>
          <span><strong>Data centre</strong> cooling assessed</span>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Chiller Plant & VRF Inspections in Canary Wharf (E14)</h2>
            <p className={styles.paragraph}>
              Canary Wharf contains some of London's most technically demanding commercial air conditioning environments. The Docklands financial district is characterised by large-floorplate office towers with centralised chiller plant, complex multi-zone variable refrigerant flow (VRF) networks, building management systems (BMS), and specialist precision cooling for trading floor infrastructure — all requiring experienced, technically proficient TM44 assessors who can accurately evaluate system efficiency without disrupting critical operations.
            </p>
            <p className={styles.paragraph}>
              With our London team operating directly from the 37th Floor of 1 Canada Square, we are closer to Canary Wharf's commercial real estate community than any other accredited TM44 provider. This proximity allows us to respond rapidly to assessment requests, coordinate with facilities management teams in neighbouring towers, and build long-term compliance relationships with portfolio landlords and building managers across E14.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>27+</span>
                <span className={styles.statLabel}>E14 TM44 inspections completed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>12kW+</span>
                <span className={styles.statLabel}>Threshold requiring inspection</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>5yr</span>
                <span className={styles.statLabel}>Certificate validity period</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>AC System Types We Inspect in Canary Wharf</h3>
            <table className={styles.acTable}>
              <thead>
                <tr>
                  <th>System Type</th>
                  <th>Typical E14 Locations</th>
                  <th>Complexity Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Central Chiller Plant</td>
                  <td>Major office towers (One Canada Square, HSBC Tower, Citigroup Centre)</td>
                  <td>Very High — requires plant room access, BMS download, refrigerant logs</td>
                </tr>
                <tr>
                  <td>Multi-Zone VRF / VRV</td>
                  <td>Mid-size offices, boutique hotels, serviced office campuses</td>
                  <td>High — requires full unit inventory and controls mapping</td>
                </tr>
                <tr>
                  <td>CRAC / Precision Cooling</td>
                  <td>Data centres, server rooms, trading floor infrastructure</td>
                  <td>High — specialist critical infrastructure assessment</td>
                </tr>
                <tr>
                  <td>Fan Coil Units (FCU)</td>
                  <td>Standard office fit-outs with centralised chilled water distribution</td>
                  <td>Medium — zone-by-zone controls and maintenance analysis</td>
                </tr>
                <tr>
                  <td>Split / Multi-Split</td>
                  <td>Ground-floor retail, restaurant units, smaller offices</td>
                  <td>Low to Medium — straightforward unit inventory and maintenance check</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.featureBox}>
              <h3>What Our Canary Wharf TM44 Inspections Cover</h3>
              <ul className={styles.list}>
                <li><strong>Full System Inventory:</strong> Comprehensive documentation of all cooling plant — outdoor condensers, indoor units, chiller vessels, cooling towers, and associated pipework. Refrigerant type, circuit configuration, and unit rated outputs recorded for all plant.</li>
                <li><strong>BMS & Controls Audit:</strong> Review of building management system programming, zone control logic, setpoint schedules, and occupancy-based demand controls. Inefficient BMS scheduling is a major source of wasted energy in E14 towers.</li>
                <li><strong>Maintenance Records & F-Gas Logs:</strong> Analysis of maintenance history, refrigerant top-up frequency, and F-Gas logbooks to identify chronic leakage, deferred maintenance, or system degradation issues.</li>
                <li><strong>Efficiency Calculations:</strong> System seasonal performance factor (SPF) and cooling-specific energy consumption calculated against design intent and current operational profiles.</li>
                <li><strong>Improvement Recommendations:</strong> Ranked recommendations including: BMS optimisation, refrigerant retrofit (e.g., R-22 to R-454B), controls upgrades, planned replacement scheduling, and free-cooling opportunities using London's ambient temperatures.</li>
                <li><strong>Landmark Register Lodgement:</strong> Completed TM44 inspection report submitted to the official Landmark Non-Domestic Database. Certificate reference number provided for lease compliance and EPBD due diligence.</li>
              </ul>
            </div>
          </div>

          {/* QUOTE CARD */}
          <div className={styles.pricingCard}>
            <h3>Canary Wharf TM44 Pricing</h3>
            <p className={styles.priceIntro}>TM44 costs depend on system complexity and number of AC units. Request a bespoke proposal — typically provided within 2 hours.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Split / multi-split systems</span><strong>From £350</strong></div>
              <div className={styles.priceRow}><span>VRF / VRV systems</span><strong>From £550</strong></div>
              <div className={styles.priceRow}><span>Central chiller plant</span><strong>POA</strong></div>
              <div className={styles.priceRow}><span>CRAC / data centre</span><strong>POA</strong></div>
              <div className={styles.priceRow}><span>Portfolio (3+ buildings)</span><strong>Discount applied</strong></div>
            </div>
            <Link href="/services/tm44" className={styles.bookButton}>
              Request E14 TM44 Quote
            </Link>
            <Link href="/locations/london/canary-wharf/commercial-epc" className={styles.bookButtonSecondary}>
              Bundle with Commercial EPC →
            </Link>
            <span className={styles.pricingNotes}>
              * TM44 + Commercial EPC bundle available for E14 properties — one assessor visit, two certificates, single mobilisation charge.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>Our Canary Wharf TM44 Process</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Pre-Visit System Scoping</h4>
              <p>We gather system schematic drawings, BMS architecture diagrams, and F-Gas logbooks in advance to scope assessment complexity and confirm access requirements with facilities teams.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>On-Site Inspection</h4>
              <p>Our assessor attends E14. Plant rooms, roof plant, server room cooling, and zone controls are systematically inspected. BMS data downloaded where accessible. Coordinated with building management to minimise tenant disruption.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>Report Compilation</h4>
              <p>Full TM44 assessment report compiled including system inventory, efficiency analysis, maintenance review, and ranked improvement recommendations with indicative ROI calculations.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Landmark Lodgement</h4>
              <p>TM44 report submitted to the Landmark Non-Domestic Register. Certificate reference number issued. PDF pack emailed to client and building management contact within 48 hours.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Canary Wharf TM44 Client Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 5.0/5 from 27 verified Canary Wharf TM44 inspections</p>
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
          <h2 className={styles.faqTitle}>Canary Wharf TM44 — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>My E14 tower has a centralised chiller plant — how does TM44 work?</p>
              <p className={styles.faqAnswer}>Central chiller plant TM44 inspections are our most complex assessments. We require plant room access, chiller maintenance logs, BMS data export, and cooling tower documentation. These are typically half-day to full-day inspections. We work closely with your facilities management team to coordinate access without disrupting building operations.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does TM44 apply to our trading floor air conditioning systems?</p>
              <p className={styles.faqAnswer}>Yes — trading floor CRAC (Computer Room Air Conditioning) and precision cooling systems are subject to TM44 if their combined effective rated output exceeds 12kW, which is virtually always the case in active trading environments. We have specific experience in assessing trading infrastructure cooling with minimal disruption to live operations.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can we do TM44 and Commercial EPC on the same visit?</p>
              <p className={styles.faqAnswer}>Yes — and we actively recommend it for E14 properties. A combined assessment visit covers both the building fabric data for the Commercial EPC and the AC system audit for the TM44 in a single mobilisation, reducing cost and minimising disruption to tenants. Contact us to arrange a combined booking.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How long is the TM44 certificate valid in Canary Wharf?</p>
              <p className={styles.faqAnswer}>TM44 certificates are valid for 5 years from the date of inspection. We offer a reminder service to notify you 3 months before your renewal date. For portfolio clients, we manage renewal scheduling across multiple E14 buildings simultaneously to prevent gaps in compliance.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Book Your Canary Wharf TM44 Inspection</h2>
          <p>
            Based at 1 Canada Square — the most conveniently located TM44 assessors in Canary Wharf. Same-week availability, competitive portfolio pricing, and full Landmark register lodgement.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request TM44 Quote →
            </Link>
            <Link href="/locations/london/canary-wharf/commercial-epc" className={styles.ctaSecondary}>
              Also Book Commercial EPC
            </Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Pages</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/london/tm44" className={styles.relatedLink}>London TM44 Hub</Link>
            <Link href="/locations/london/canary-wharf/commercial-epc" className={styles.relatedLink}>Commercial EPC Canary Wharf</Link>
            <Link href="/locations/london/city-of-london/tm44" className={styles.relatedLink}>TM44 City of London</Link>
            <Link href="/locations/london/westminster/tm44" className={styles.relatedLink}>TM44 Westminster</Link>
            <Link href="/services/tm44" className={styles.relatedLink}>TM44 Service Overview</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
