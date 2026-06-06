import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../london-location.module.css'

export const metadata: Metadata = {
  title: 'TM44 Air Conditioning Inspection London | Avorria',
  description: 'Legally mandated TM44 air conditioning inspections for commercial and public buildings across Greater London. Accredited AC energy assessors covering all boroughs. Fast turnaround & competitive pricing.',
  alternates: { canonical: 'https://avorria.co.uk/locations/london/tm44' },
  openGraph: {
    title: 'TM44 AC Inspection London | Avorria',
    description: 'Statutory TM44 inspections for all cooling systems over 12kW across Greater London. CIBSE-registered assessors. Certificate lodged to Landmark database.',
    url: 'https://avorria.co.uk/locations/london/tm44',
    images: [{ url: 'https://avorria.co.uk/canary_wharf_towers.png', width: 1200, height: 630 }],
  },
}

const BOROUGHS = [
  {
    name: 'City of London',
    slug: 'city-of-london',
    postcode: 'EC1–EC4',
    desc: 'TM44 assessments for banks, trading floors, server rooms, and corporate headquarters across the Square Mile.',
    icon: '🏛️',
  },
  {
    name: 'Canary Wharf & Docklands',
    slug: 'canary-wharf',
    postcode: 'E14',
    desc: 'Complex chiller plant, VRF, and BMS-integrated AC inspections for the Docklands skyline.',
    icon: '🏙️',
  },
  {
    name: 'Westminster',
    slug: 'westminster',
    postcode: 'SW1 / WC2',
    desc: 'Government offices, heritage buildings, and hospitality venues with retrofitted cooling systems in Westminster.',
    icon: '🏛️',
  },
]

const REVIEWS = [
  {
    text: 'Quick, thorough TM44 inspection for our 4-floor office in the City. The assessor understood our Daikin VRF system fully and provided a clear improvement report. Certificate on Landmark the same day.',
    name: 'Caroline Hughes',
    role: 'Head of Facilities, EC2 Corporate Office',
    stars: 5,
  },
  {
    text: 'Avorria handled TM44 for three of our Canary Wharf properties simultaneously. Their logistical efficiency is excellent — minimal disruption to tenants, all certificates delivered in one batch.',
    name: 'Alex Drummond',
    role: 'Asset Manager, E14 Portfolio',
    stars: 5,
  },
  {
    text: 'We had a complex split-system and central chiller installation at our Westminster venue. The assessor was knowledgeable, patient, and the report exceeded what we expected.',
    name: 'Sarah Finch',
    role: 'Operations Director, SW1 Events Venue',
    stars: 5,
  },
]

export default function LondonTm44Hub() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria London TM44 Air Conditioning Assessors',
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
    'url': 'https://avorria.co.uk/locations/london/tm44',
    'priceRange': 'Bespoke — from £350',
    'areaServed': [{ '@type': 'AdministrativeArea', 'name': 'Greater London' }],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '89',
      'bestRating': '5',
    },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is a TM44 inspection and who needs one in London?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'A TM44 is a statutory air conditioning inspection required under the Energy Performance of Buildings Regulations for any commercial AC system with an effective rated output over 12kW. All London commercial property owners and landlords with qualifying systems must have a valid TM44 report lodged every 5 years.',
        },
      },
      {
        '@type': 'Question',
        'name': 'How much does a TM44 inspection cost in London?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'TM44 inspection costs in London vary depending on system complexity, number of AC units, and building access requirements. Pricing typically starts from £350 + VAT for simpler installations. Request a bespoke quote via our services page for an accurate price.',
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
        style={{ backgroundImage: 'url(/canary_wharf_towers.png)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroFullScreenInner}>
          <span className={styles.eyebrow}>London AC Energy Compliance — EPBD Registered</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>TM44 Inspections London</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Statutory air conditioning inspection reports for commercial and public buildings across Greater London. Ensure full EPBD compliance before enforcement deadlines for systems above 12kW.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Get a TM44 Quote →
            </Link>
            <Link href="#boroughs" className={styles.ctaSecondary}>
              Select Your Borough
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🔧</span>
          <span><strong>VRF, Chiller & Split</strong> systems covered</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📋</span>
          <span><strong>Landmark</strong> database lodgement</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📍</span>
          <span>London HQ at <strong>1 Canada Square</strong></span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span><strong>4.9/5</strong> from 89 London TM44 reviews</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⚡</span>
          <span><strong>Same-week</strong> availability</span>
        </div>
      </div>

      <div className={styles.container}>

        {/* BOROUGH SELECTOR */}
        <section id="boroughs" style={{ marginBottom: '6rem' }}>
          <h2 style={{ textAlign: 'center', color: '#fff', fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-headings)' }}>TM44 Coverage by London District</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 0' }}>
            Choose a London location for tailored TM44 inspection criteria, building guidelines, and expected system complexity.
          </p>
          <div className={styles.linksGrid}>
            {BOROUGHS.map((b) => (
              <div key={b.slug} className={styles.linkCard}>
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{b.icon}</div>
                  <h3>{b.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>({b.postcode})</span></h3>
                  <p>{b.desc}</p>
                </div>
                <Link href={`/locations/london/${b.slug}/tm44`} className={styles.linkCardAction}>
                  View {b.name} TM44 Page →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN CONTENT + QUOTE CARD */}
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>TM44 Inspections Across Greater London</h2>
            <p className={styles.paragraph}>
              Under the Energy Performance of Buildings (England and Wales) Regulations 2012, all air conditioning systems with an effective rated output exceeding 12kW must be regularly inspected by an accredited energy assessor and the report lodged to the Landmark Domestic & Non-Domestic Register. London commercial landlords, tenants, and public bodies who fail to comply face civil fines of up to £5,000 per premises.
            </p>
            <p className={styles.paragraph}>
              Avorria's London-based TM44 assessors hold accreditations under the CIBSE Low Carbon Consultant programme and the wider Non-Domestic Energy Assessor (NDEA) framework. Operating from our Canary Wharf office (37th Floor, 1 Canada Square), we efficiently mobilise across all London zones to inspect systems from simple split-type units to complex multi-zone variable refrigerant flow (VRF) networks and district chiller plant.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>89+</span>
                <span className={styles.statLabel}>London TM44 reports completed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>5yr</span>
                <span className={styles.statLabel}>Inspection frequency required</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>12kW</span>
                <span className={styles.statLabel}>Threshold requiring TM44</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>AC System Types We Inspect in London</h3>
            <table className={styles.acTable}>
              <thead>
                <tr>
                  <th>System Type</th>
                  <th>Typical London Locations</th>
                  <th>Assessment Complexity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Split & Multi-Split Units</td>
                  <td>SME offices, retail units, restaurants</td>
                  <td>Low — 1–2 hrs on site</td>
                </tr>
                <tr>
                  <td>VRF / VRV Systems</td>
                  <td>Mid-size corporate offices, serviced apartments</td>
                  <td>Medium — 2–4 hrs on site</td>
                </tr>
                <tr>
                  <td>Central Chiller Plant</td>
                  <td>Canary Wharf towers, hospitals, large hotels</td>
                  <td>High — requires plant room access + BMS data</td>
                </tr>
                <tr>
                  <td>CRAC / Precision Cooling</td>
                  <td>Data centres, trading floors, server rooms</td>
                  <td>High — specialist data centre assessment required</td>
                </tr>
                <tr>
                  <td>Packaged Rooftop Units</td>
                  <td>Retail warehouses, leisure centres</td>
                  <td>Medium — roof access required</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.featureBox}>
              <h3>What Does a TM44 Report Cover?</h3>
              <ul className={styles.list}>
                <li><strong>System Inventory:</strong> Full documentation of all AC plant, outdoor condensers, indoor units, and auxiliary equipment including refrigerant type and circuit configuration.</li>
                <li><strong>Controls Assessment:</strong> Evaluation of BMS, thermostatic controls, scheduling, and zoning to identify oversizing or inefficient operation patterns.</li>
                <li><strong>Maintenance Record Review:</strong> Analysis of F-Gas log books, service history, and refrigerant top-up frequency to flag ongoing inefficiency or leakage.</li>
                <li><strong>Energy Reduction Recommendations:</strong> Ranked recommendations for controls upgrades, refrigerant retrofits, or partial/full system replacement with indicative payback periods.</li>
                <li><strong>Formal Lodgement:</strong> Inspection report submitted to the Landmark database. Certificate reference number provided for lease compliance and due diligence purposes.</li>
              </ul>
            </div>
          </div>

          {/* QUOTE CARD */}
          <div className={styles.pricingCard}>
            <h3>Get a London TM44 Quote</h3>
            <p className={styles.priceIntro}>TM44 pricing depends on system type, output, and number of indoor/outdoor units. Request a bespoke proposal — usually within 2 hours.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Simple split systems</span><strong>From £350</strong></div>
              <div className={styles.priceRow}><span>VRF/VRV systems</span><strong>From £550</strong></div>
              <div className={styles.priceRow}><span>Central chiller plant</span><strong>POA</strong></div>
              <div className={styles.priceRow}><span>Portfolio discount</span><strong>Yes — 3+ sites</strong></div>
            </div>
            <Link href="/services/tm44" className={styles.bookButton}>
              Request London TM44 Quote
            </Link>
            <Link href="/locations/london/commercial-epc" className={styles.bookButtonSecondary}>
              Also Need a Commercial EPC?
            </Link>
            <span className={styles.pricingNotes}>
              * Bundle TM44 + Commercial EPC for saving on mobilisation. All London zones covered.
            </span>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>London TM44 Client Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 89 verified London TM44 inspections</p>
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
          <h2 className={styles.faqTitle}>London TM44 — Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Who is responsible for arranging the TM44 inspection?</p>
              <p className={styles.faqAnswer}>Responsibility typically falls on the commercial landlord or building owner. In multi-tenant buildings, the building manager or facilities team usually coordinates. For tenanted properties, lease terms should specify who bears TM44 costs — often the tenant under a full repairing lease.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What happens if my TM44 has expired?</p>
              <p className={styles.faqAnswer}>Expired or missing TM44 certificates leave landlords and building owners exposed to enforcement action by Trading Standards. Civil penalties of up to £5,000 per building apply. We can arrange urgent inspections to restore compliance quickly.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How long is a TM44 certificate valid?</p>
              <p className={styles.faqAnswer}>TM44 inspection reports are valid for 5 years from the date of inspection. Avorria offers calendar reminder services to notify you 3 months before renewal is due, helping avoid missed compliance dates.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does TM44 apply to server rooms and data centres?</p>
              <p className={styles.faqAnswer}>Yes — precision cooling systems (CRAC units) and close-control air conditioning in data centres and server rooms are subject to TM44 if the effective rated output exceeds 12kW. These require specialised assessors with knowledge of data centre thermal management.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I book TM44 + Commercial EPC together?</p>
              <p className={styles.faqAnswer}>Absolutely. We offer combined booking for Commercial EPC + TM44 inspections, often on the same site visit, saving on assessor mobilisation costs. This is the most efficient approach for London properties requiring both.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What is the difference between TM44 and F-Gas?</p>
              <p className={styles.faqAnswer}>TM44 is an energy efficiency inspection required by the EPBD. F-Gas regulations separately require that refrigerant-containing systems are regularly checked for leaks by an F-Gas certified engineer. Both are legal obligations — Avorria provides TM44 while your engineering contractor handles F-Gas logs.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Book Your London TM44 Inspection Today</h2>
          <p>
            Operating across all Greater London boroughs from our Canary Wharf base. Competitive pricing, fast turnaround, and full Landmark register lodgement included.
          </p>
          <div className={styles.ctas}>
            <Link href="/services/tm44" className={styles.ctaPrimary}>
              Request TM44 Quote →
            </Link>
            <Link href="/locations/london/commercial-epc" className={styles.ctaSecondary}>
              Also Need a Commercial EPC?
            </Link>
          </div>
        </div>

        {/* RELATED LINKS */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related London Services</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/london/commercial-epc" className={styles.relatedLink}>Commercial EPC London Hub</Link>
            <Link href="/locations/london/city-of-london/tm44" className={styles.relatedLink}>TM44 — City of London</Link>
            <Link href="/locations/london/canary-wharf/tm44" className={styles.relatedLink}>TM44 — Canary Wharf</Link>
            <Link href="/locations/london/westminster/tm44" className={styles.relatedLink}>TM44 — Westminster</Link>
            <Link href="/services/tm44" className={styles.relatedLink}>TM44 Service Overview</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
