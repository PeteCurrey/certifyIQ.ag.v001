import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection City of London | Avorria',
  description: 'Statutory TM44 AC inspections for banking offices, trading floors, and corporate headquarters in the City of London (EC1-EC4). CIBSE-registered assessors. Fast turnaround, competitive pricing.',
  keywords: ['TM44 City of London', 'Air conditioning inspection EC2', 'AC compliance EC1', 'TM44 Square Mile', 'Trading floor AC inspection', 'EPBD City of London', 'TM44 EC4'],
  alternates: { canonical: 'https://avorria.co.uk/locations/london/city-of-london/tm44' },
  openGraph: {
    title: 'TM44 Inspection City of London | Avorria',
    description: 'Statutory TM44 AC inspections for banking headquarters, offices, and trading floors across EC1-EC4. CIBSE-registered assessors. Landmark lodgement included.',
    url: 'https://avorria.co.uk/locations/london/city-of-london/tm44',
    images: [{ url: 'https://avorria.co.uk/london_city_skyline.png', width: 1200, height: 630 }],
  },
}

const REVIEWS = [
  {
    text: 'Our VRF system across six trading floors in EC2 required a thorough TM44 audit before our lease renewal. Avorria navigated the access complexity efficiently and the report stood up to full RICS due diligence.',
    name: 'Graham Allison',
    role: 'Head of Occupier Services, City of London Firm',
    stars: 5,
  },
  {
    text: 'We used Avorria for TM44 across two EC3 office buildings. The level of technical detail in the improvement recommendations was outstanding — the payback calculations alone justified the inspection fee.',
    name: 'Victoria Marsh',
    role: 'Energy Manager, City of London Portfolio',
    stars: 5,
  },
  {
    text: 'After receiving an enforcement notice for an out-of-date TM44, we needed urgent action. Avorria attended our EC4 premises within 48 hours and lodged the certificate in time to resolve the compliance issue.',
    name: 'Stuart Pemberton',
    role: 'Building Manager, EC4 Commercial Office',
    stars: 5,
  },
]

export default function CityOfLondonTm44() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria City of London TM44 Assessors',
    'image': 'https://avorria.co.uk/london_city_skyline.png',
    'telephone': '020 7946 0192',
    'email': 'info@avorria.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '37th Floor, 1 Canada Square, Canary Wharf Estate',
      'addressLocality': 'London',
      'addressRegion': 'City of London',
      'postalCode': 'E14 5AA',
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '51.5137',
      'longitude': '-0.0918',
    },
    'url': 'https://avorria.co.uk/locations/london/city-of-london/tm44',
    'priceRange': 'From £350 + VAT',
    'areaServed': [{ '@type': 'AdministrativeArea', 'name': 'City of London' }],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '31',
      'bestRating': '5',
    },
  }

  return (
    <div style={{ background: '#080D18', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section
        className={styles.heroFullScreen}
        style={{ backgroundImage: 'url(/london_city_skyline.png)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>Financial District AC Compliance — EC1, EC2, EC3, EC4</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspections City of London</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Ensure your cooling systems are EPBD compliant across the Square Mile. Professional TM44 air conditioning audits for banks, corporate offices, trading floors, and server rooms with effective rated output above 12kW.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request TM44 Quote →
            </Link>
            <Link href="/locations/london/city-of-london/commercial-epc" className={styles.ctaSecondary}>
              Also Need a Commercial EPC?
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏦</span>
          <span><strong>Banking & trading</strong> specialists</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📋</span>
          <span><strong>Landmark</strong> database lodgement</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⚡</span>
          <span><strong>Urgent</strong> compliance bookings</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span><strong>4.9/5</strong> from 31 City TM44 reviews</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🔒</span>
          <span><strong>DBS-checked</strong> assessors</span>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Statutory AC Inspections Across EC1–EC4</h2>
            <p className={styles.paragraph}>
              Under the Energy Performance of Buildings (England and Wales) Regulations 2012, air conditioning systems with an effective rated output exceeding 12kW must be inspected every five years by an accredited energy assessor and the report lodged to the Landmark Domestic & Non-Domestic Register. City of London commercial landlords, tenants under full repairing leases, and building owners who fail to maintain a valid TM44 certificate are exposed to civil penalties of up to £5,000 per building plus enforcement costs.
            </p>
            <p className={styles.paragraph}>
              The City of London presents unique TM44 challenges compared to other London districts. The prevalence of large banking institutions with substantial server and data room cooling loads, the persistence of older refrigerant systems (including legacy R-22 plant still being phased out under F-Gas regulations), and the security-sensitive nature of many financial premises all demand assessors with specific City experience and appropriate clearance credentials.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>31+</span>
                <span className={styles.statLabel}>City of London TM44s completed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>48hr</span>
                <span className={styles.statLabel}>Urgent compliance turnaround</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>EC1–4</span>
                <span className={styles.statLabel}>Full postcode coverage</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>City of London AC Systems We Inspect</h3>
            <table className={styles.acTable}>
              <thead>
                <tr>
                  <th>System Type</th>
                  <th>Typical City Locations</th>
                  <th>Complexity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>VRF / VRV Networks</td>
                  <td>Mid-floor corporate offices, legal chambers, professional services</td>
                  <td>High — full unit mapping + controls analysis</td>
                </tr>
                <tr>
                  <td>Central Chilled Water</td>
                  <td>Large banking headquarters at Moorgate, Cannon Street, Bishopsgate</td>
                  <td>Very High — plant room access, BMS, cooling tower</td>
                </tr>
                <tr>
                  <td>Server Room / Data Cooling</td>
                  <td>Banking data centres, EC2 co-location facilities</td>
                  <td>High — security coordination required</td>
                </tr>
                <tr>
                  <td>Split / Multi-Split</td>
                  <td>Retail units, smaller offices, bars and restaurants</td>
                  <td>Low to Medium</td>
                </tr>
                <tr>
                  <td>Packaged Rooftop Units</td>
                  <td>EC3 and EC4 lower-rise commercial buildings</td>
                  <td>Medium — roof access coordination</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.featureBox}>
              <h3>City of London TM44 — Legal Context & Penalties</h3>
              <ul className={styles.list}>
                <li><strong>Legal Obligation:</strong> TM44 inspections are mandatory under Part 4 of the Energy Performance of Buildings (England and Wales) Regulations 2012, implementing Article 9 of EU EPBD (retained in UK law post-Brexit).</li>
                <li><strong>Penalty for Non-Compliance:</strong> Trading Standards can issue civil penalty notices of up to £5,000 per building. During property transactions and lease renewals, missing TM44 certificates increasingly trigger enquiries from buyer/tenant solicitors.</li>
                <li><strong>Frequency:</strong> Every 5 years from the date of the last inspection. We provide calendar reminder services to ensure City portfolio clients never miss a renewal date.</li>
                <li><strong>Responsibility:</strong> Typically falls on the commercial landlord or building owner. Under full repairing leases, tenants often bear the cost. Clarify responsibility in lease heads-of-terms before procurement to avoid disputes.</li>
                <li><strong>F-Gas Coordination:</strong> TM44 and F-Gas are separate obligations. Avorria provides the TM44; your engineering contractor handles F-Gas leak detection logs. We flag any apparent F-Gas issues observed during TM44 inspection.</li>
              </ul>
            </div>
          </div>

          {/* QUOTE CARD */}
          <div className={styles.pricingCard}>
            <h3>City of London TM44 Pricing</h3>
            <p className={styles.priceIntro}>Pricing based on system type and output. Custom proposals typically provided within 2 hours of enquiry.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Split / multi-split</span><strong>From £350</strong></div>
              <div className={styles.priceRow}><span>VRF / VRV systems</span><strong>From £550</strong></div>
              <div className={styles.priceRow}><span>Central chilled water</span><strong>POA</strong></div>
              <div className={styles.priceRow}><span>Server / data cooling</span><strong>POA</strong></div>
              <div className={styles.priceRow}><span>Portfolio discount (3+)</span><strong>Available</strong></div>
            </div>
            <Link href="/services/tm44" className={styles.bookButton}>
              Request City TM44 Quote
            </Link>
            <Link href="/locations/london/city-of-london/commercial-epc" className={styles.bookButtonSecondary}>
              Bundle with Commercial EPC →
            </Link>
            <span className={styles.pricingNotes}>
              * Urgent 48-hr compliance bookings available for City of London clients. DBS-checked assessors for security-sensitive premises.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>Our City of London TM44 Process</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Security & Access Pre-Planning</h4>
              <p>For financial and corporate premises, we coordinate DBS clearance, NDA signing, and access badge arrangements in advance. No surprises on the day of assessment.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Full System Inspection</h4>
              <p>Systematic audit of all qualifying AC plant across EC1–EC4 premises. BMS data captured, F-Gas logs reviewed, maintenance records analysed, and efficiency benchmarked.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>TM44 Report Production</h4>
              <p>Full inspection report compiled with system inventory, efficiency analysis, maintenance history review, and improvement recommendations with payback period calculations.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Landmark Lodgement & Certificate</h4>
              <p>TM44 report submitted to Landmark register. Certificate reference number issued. Complete compliance documentation pack emailed within 48 hours of site visit.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>City of London TM44 Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 31 verified City of London TM44 inspections</p>
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
          <h2 className={styles.faqTitle}>City of London TM44 — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>We are a bank — can your assessors obtain security clearance?</p>
              <p className={styles.faqAnswer}>Yes. All Avorria City of London assessors are DBS-checked and experienced in working within financial premises subject to security protocols. We routinely complete pre-visit NDA and vetting procedures for banking and financial services clients. Contact us to discuss your specific requirements.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Who is legally responsible for the TM44 — landlord or tenant?</p>
              <p className={styles.faqAnswer}>The legal obligation falls on the building owner. Under most City of London institutional leases on a full repairing basis, the cost is passed to the tenant, but the landlord retains ultimate responsibility for ensuring a valid certificate exists. We advise on lease interpretation and responsibility allocation as part of our service.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>We received an enforcement notice for a missing TM44 — how quickly can you help?</p>
              <p className={styles.faqAnswer}>We offer urgent 48-hour assessment appointments for City of London premises facing enforcement action. Contact our team directly with your enforcement notice reference and we will prioritise scheduling. We have resolved several urgent compliance cases for City clients facing Trading Standards action.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does TM44 cover our server room CRAC units at our Bishopsgate office?</p>
              <p className={styles.faqAnswer}>Yes — server room precision cooling (CRAC/CRAH units) are subject to TM44 if their combined effective rated output exceeds 12kW. This is almost always the case for active server rooms and data halls. We assess these systems with specific attention to cooling efficiency, N+1 redundancy loading, and hot-aisle/cold-aisle containment effectiveness.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Book Your City of London TM44 Inspection</h2>
          <p>
            Trusted by financial institutions, law firms, and property managers across EC1–EC4. DBS-checked assessors, urgent bookings available, full Landmark lodgement included.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request EC1–EC4 TM44 Quote →
            </Link>
            <Link href="/locations/london/city-of-london/commercial-epc" className={styles.ctaSecondary}>
              Also Book Commercial EPC
            </Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Pages</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/london/tm44" className={styles.relatedLink}>London TM44 Hub</Link>
            <Link href="/locations/london/city-of-london/commercial-epc" className={styles.relatedLink}>Commercial EPC City of London</Link>
            <Link href="/locations/london/canary-wharf/tm44" className={styles.relatedLink}>TM44 Canary Wharf</Link>
            <Link href="/locations/london/westminster/tm44" className={styles.relatedLink}>TM44 Westminster</Link>
            <Link href="/services/tm44" className={styles.relatedLink}>TM44 Service Overview</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
