import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC Canary Wharf & Docklands | NDEA Level 4 | Avorria',
  description: 'Accredited NDEA Level 3 & 4 Commercial EPCs for office towers, financial headquarters, and multi-tenant developments in Canary Wharf & Docklands (E14). From £185+VAT. Avorria is based at 1 Canada Square.',
  keywords: ['Commercial EPC Canary Wharf', 'NDEA Level 4 E14', 'Commercial energy certificate Docklands', 'EPC E14', 'Canary Wharf office EPC', 'Non-domestic energy assessor Canary Wharf'],
  alternates: { canonical: 'https://avorria.co.uk/locations/london/canary-wharf/commercial-epc' },
  openGraph: {
    title: 'Commercial EPC Canary Wharf | Avorria — Based at 1 Canada Square',
    description: 'Fast-track Commercial EPCs for E14 office towers and multi-tenant commercial properties. Level 4 NDEA accredited, from £185+VAT.',
    url: 'https://avorria.co.uk/locations/london/canary-wharf/commercial-epc',
    images: [{ url: 'https://avorria.co.uk/canary_wharf_towers.png', width: 1200, height: 630 }],
  },
}

const REVIEWS = [
  {
    text: "Our 12-floor office in One Canada Square required a Level 4 NDEA assessment due to our complex mechanical ventilation. Avorria's assessor understood every aspect of our BMS and HVAC configuration without disrupting our trading operations.",
    name: 'Daniel Forsythe',
    role: 'Head of Facilities, Financial Services — E14',
    stars: 5,
  },
  {
    text: 'We needed EPC certificates across four E14 units before a portfolio disposal. Avorria turned around all four within 48 hours of site visits. Exceptional logistics and professionalism.',
    name: 'Jessica Blount',
    role: 'Commercial Portfolio Manager, Docklands',
    stars: 5,
  },
  {
    text: 'As property managers for a large mixed-use development at Crossharbour, getting accurate EPCs was essential for our lease compliance. The assessment was thorough and the report detailed.',
    name: 'Marcus Chen',
    role: 'Property Manager, Crossharbour Development',
    stars: 5,
  },
]

export default function CanaryWharfCommercialEpc() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria Canary Wharf Commercial Energy Assessors',
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
    'url': 'https://avorria.co.uk/locations/london/canary-wharf/commercial-epc',
    'priceRange': '£185–£595+',
    'areaServed': [{ '@type': 'AdministrativeArea', 'name': 'Canary Wharf and Docklands' }],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '5.0',
      'reviewCount': '43',
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
          <span className={styles.eyebrow}>Docklands Premier Non-Domestic Energy Assessors — E14</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC Canary Wharf</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Accredited NDEA Level 3 & 4 energy audits for skyscrapers, financial headquarters, waterfront offices, and multi-tenant commercial assets in Canary Wharf and the wider Docklands. Our London team is based at 37th Floor, 1 Canada Square.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.ctaPrimary}>
              Book E14 EPC Assessment →
            </Link>
            <Link href="/prices" className={styles.ctaSecondary}>
              Calculate Your Price
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📍</span>
          <span>Office at <strong>1 Canada Square</strong></span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏆</span>
          <span><strong>Level 3 & 4</strong> NDEA accredited</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⚡</span>
          <span><strong>24-hr</strong> lodgement turnaround</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span><strong>5.0/5</strong> from 43 E14 reviews</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏙️</span>
          <span><strong>HVAC & BMS</strong> specialists</span>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Premium Commercial Energy Compliance — Canary Wharf (E14)</h2>
            <p className={styles.paragraph}>
              With our London operations headquartered at the iconic 37th Floor, 1 Canada Square, Avorria is uniquely positioned within the heart of Canary Wharf's commercial property ecosystem. We work directly with building managers, portfolio landlords, facilities directors, and letting agents across E14 and the wider Isle of Dogs to deliver fast, accredited Commercial Energy Performance Certificates that meet all statutory obligations under the Energy Act 2011 and the Minimum Energy Efficiency Standards.
            </p>
            <p className={styles.paragraph}>
              Canary Wharf presents some of London's most technically demanding commercial energy assessment scenarios. Modern offices here typically feature centralised chiller plant, mechanical ventilation with heat recovery (MVHR), intelligent building management systems (BMS), high-performance double-skin facades, and floor-to-ceiling glazing — all of which require Level 4 NDEA expertise and dynamic simulation modelling (DSM) rather than standard iSBEM software.
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>43+</span>
                <span className={styles.statLabel}>E14 commercial properties assessed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>Level 4</span>
                <span className={styles.statLabel}>NDEA accreditation held</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>24hr</span>
                <span className={styles.statLabel}>Certificate turnaround</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>Canary Wharf Building Types We Assess</h3>
            <div className={styles.featureBox}>
              <h3>Commercial Premises We Cover in E14</h3>
              <ul className={styles.list}>
                <li><strong>Grade A Office Towers:</strong> Multi-floor occupancy in modern post-2000 glass towers with centralised HVAC, raised access floors, and intelligent BMS. Level 4 assessment required for buildings with complex mechanical services.</li>
                <li><strong>Waterfront Offices & Retail Pavilions:</strong> Single-storey and lower-rise commercial units surrounding the dock basin, including ground-floor restaurants, financial services branches, and showrooms.</li>
                <li><strong>Mixed-Use Developments:</strong> Buildings combining ground-floor commercial use with residential above — particularly common at Crossharbour, Westferry, and Poplar. Separate EPCs required for commercial portions.</li>
                <li><strong>Co-Working & Flexible Offices:</strong> Serviced office campuses, flex-space operators, and managed workspaces with shared services requiring careful zone modelling for accurate energy benchmarking.</li>
                <li><strong>Data Centre Facilities:</strong> Server rooms and colocation facilities within E14 commercial towers requiring precision assessment of cooling load and server room thermal management systems.</li>
                <li><strong>Retail & Leisure:</strong> Westfield-adjacent units, gym facilities, hotels, and restaurant chains within the Canary Wharf Estate requiring standard Level 3 SBEM assessments with HVAC components.</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>Why Level 4 NDEA Matters in Canary Wharf</h3>
            <p className={styles.paragraph}>
              The distinction between Level 3 and Level 4 Non-Domestic Energy Assessments is critical for Canary Wharf's commercial stock. Standard iSBEM software used in Level 3 assessments cannot accurately model complex HVAC configurations — a Level 4 Dynamic Simulation Model (DSM) using software such as TAS, IES VE, or EnergyPlus is required.
            </p>
            <p className={styles.paragraph}>
              Choosing the wrong assessor level for a complex building risks generating an inaccurate EPC rating that may significantly overestimate or underestimate your building's energy performance — creating regulatory risk and potentially inflating improvement costs unnecessarily. Avorria's Level 4 assessors are qualified to assess and accurately model the most complex commercial environments in London.
            </p>

            <div className={styles.featureBox}>
              <h3>MEES Compliance Roadmap — Canary Wharf Landlords</h3>
              <ul className={styles.list}>
                <li><strong>April 2023:</strong> MEES enforcement extended to ALL existing commercial tenancies (not just new lettings). All commercial leases must now show minimum EPC E.</li>
                <li><strong>April 2027 (Proposed):</strong> Minimum EPC C required for all commercial rental property. Landlords must upgrade or apply for valid exemptions before this date.</li>
                <li><strong>April 2030 (Proposed):</strong> Minimum EPC B required. This is a significant step for existing older commercial stock in Docklands fringe areas.</li>
                <li><strong>Avorria Improvement Reports:</strong> Every Commercial EPC we issue includes a detailed cost-benefit ranked improvement schedule aligned to MEES deadlines, helping you plan capital expenditure efficiently.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>Canary Wharf EPC Pricing</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes assessor site visit, full SBEM/DSM calculation & national register lodgement.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 100m²</span><strong>£185</strong></div>
              <div className={styles.priceRow}><span>101 – 250m²</span><strong>£275</strong></div>
              <div className={styles.priceRow}><span>251 – 500m²</span><strong>£375</strong></div>
              <div className={styles.priceRow}><span>501 – 750m²</span><strong>£475</strong></div>
              <div className={styles.priceRow}><span>751 – 1,000m²</span><strong>£595</strong></div>
              <div className={styles.priceRow}><span>1,001m²+ (Level 4)</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.bookButton}>
              Book Canary Wharf EPC
            </Link>
            <Link href="/prices" className={styles.bookButtonSecondary}>
              Pricing Calculator
            </Link>
            <span className={styles.pricingNotes}>
              * Level 4 DSM assessments for complex HVAC buildings quoted individually. TM44 bundling available. Travel included within E14 postcode area.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>How We Assess Canary Wharf Properties</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Pre-Visit Scoping</h4>
              <p>We review existing building drawings, M&E specifications, and BMS documentation to determine NDEA level required before booking your assessor.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Assessment</h4>
              <p>Our assessor visits E14. Access to plant rooms, riser shafts, and roof equipment is coordinated with facilities management to minimise disruption to tenants.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>Energy Modelling</h4>
              <p>Complex buildings are modelled using dynamic simulation software (DSM). Standard buildings use iSBEM. Full thermal zone mapping and fabric U-value analysis included.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate & Report</h4>
              <p>EPC lodged to national register. You receive the PDF certificate, full recommendation report, and improvement cost analysis within 24 hours.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Canary Wharf Client Testimonials</h2>
          <p className={styles.reviewsSubtitle}>Rated 5.0/5 from 43 verified Canary Wharf commercial assessments</p>
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
          <h2 className={styles.faqTitle}>Canary Wharf Commercial EPC — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do I need a Level 3 or Level 4 EPC for my E14 office tower?</p>
              <p className={styles.faqAnswer}>Most Canary Wharf office towers with centralised HVAC, chiller plant, or mechanical ventilation require a Level 4 NDEA assessment. Simpler single-zone offices or ground-floor retail can use Level 3. We confirm which is required during our pre-visit scoping call at no charge.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can Avorria assess buildings under management by Canary Wharf Group?</p>
              <p className={styles.faqAnswer}>Yes — we regularly coordinate with Canary Wharf Group's facilities management teams for tenant-specific EPC requirements. We provide tenant-side assessments for sub-let floors and whole-building EPC updates for landlord clients.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How long does a Level 4 Commercial EPC assessment take in E14?</p>
              <p className={styles.faqAnswer}>Level 4 assessments for a full office floor (approx. 1,500–2,500m²) typically require 4–6 hours on site and 2–3 days for DSM modelling and certificate production. We work to agreed deadlines for time-sensitive transactions.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Does my Canary Wharf office need a TM44 inspection too?</p>
              <p className={styles.faqAnswer}>If your premises have AC systems with effective rated output exceeding 12kW — which is virtually every E14 commercial office — a TM44 is legally required every 5 years. We offer combined Commercial EPC + TM44 inspections in a single visit to minimise operational disruption.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Book Your Canary Wharf Commercial EPC Today</h2>
          <p>
            Local to E14. Based at 1 Canada Square. We're the most conveniently located accredited commercial energy assessors in Canary Wharf — available same-week with 24-hour certificate turnaround.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.ctaPrimary}>
              Book Now →
            </Link>
            <Link href="/locations/london/canary-wharf/tm44" className={styles.ctaSecondary}>
              Book TM44 Inspection Too
            </Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Pages</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/london/commercial-epc" className={styles.relatedLink}>London Commercial EPC Hub</Link>
            <Link href="/locations/london/canary-wharf/tm44" className={styles.relatedLink}>TM44 Canary Wharf</Link>
            <Link href="/locations/london/city-of-london/commercial-epc" className={styles.relatedLink}>Commercial EPC — City of London</Link>
            <Link href="/locations/london/westminster/commercial-epc" className={styles.relatedLink}>Commercial EPC — Westminster</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
            <Link href="/prices" className={styles.relatedLink}>Pricing Calculator</Link>
            <Link href="/book?service=commercial&postcode=E145AA" className={styles.relatedLink}>Book Assessment</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
