import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import styles from '../../london-location.module.css'

export const metadata: Metadata = {
  title: 'Commercial EPC City of London | Square Mile Energy Assessors',
  description: 'Accredited Commercial EPCs in the City of London (EC1, EC2, EC3, EC4). Banking premises, corporate offices, heritage livery halls, and retail units. Specialist SBEM assessors from £185+VAT.',
  alternates: { canonical: 'https://avorria.co.uk/locations/london/city-of-london/commercial-epc' },
  openGraph: {
    title: 'Commercial EPC City of London',
    description: 'Fast, accredited Commercial EPCs across EC1-EC4. Banking headquarters, offices, heritage livery halls. Level 3 & 4 NDEA assessors. From £185+VAT.',
    url: 'https://avorria.co.uk/locations/london/city-of-london/commercial-epc',
    images: [{ url: 'https://avorria.co.uk/london_city_skyline.png', width: 1200, height: 630 }],
  },
}

const REVIEWS = [
  {
    text: 'We needed a Commercial EPC for our seven-floor office on Cannon Street before sale. The assessor navigated the building expertly, understood the listed nature of the exterior, and the report was clear and legally sound.',
    name: 'Richard Pemberton',
    role: 'Commercial Partner, EC4 Property Practice',
    stars: 5,
  },
  {
    text: 'Our insurance company required an updated EPC for our Lloyd\'s adjacent premises in EC3. Avorria understood the historical construction challenges and delivered a certificate that reflected an accurate and fair energy rating.',
    name: 'Fiona Sutherland',
    role: 'Head of Operations, Lloyd\'s Underwriting Firm',
    stars: 5,
  },
  {
    text: 'Fast, professional, and knowledgeable. Our Cheapside retail unit received its EPC within 24 hours and the report included practical recommendations for our LED upgrade project.',
    name: 'Tom Reeves',
    role: 'Retail Property Manager, EC2',
    stars: 5,
  },
]

export default function CityOfLondonCommercialEpc() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Avorria City of London Commercial Energy Assessors',
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
    'url': 'https://avorria.co.uk/locations/london/city-of-london/commercial-epc',
    'priceRange': '£185–£595+',
    'areaServed': [{ '@type': 'AdministrativeArea', 'name': 'City of London' }],
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'reviewCount': '62',
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
          <span className={styles.eyebrow}>Square Mile Commercial NDEA — EC1, EC2, EC3, EC4</span>
          <h1 className={styles.title} style={{ color: '#fff' }}>Commercial EPC City of London</h1>
          <p className={styles.subtitle} style={{ color: '#E8F4FF' }}>
            Professional non-domestic energy assessments across the Square Mile. Expert SBEM Level 3 & 4 compliance reports for historic banking premises, modern corporate towers, heritage livery halls, and retail units throughout EC1–EC4.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=EC2N2DB" className={styles.ctaPrimary}>
              Book City of London EPC →
            </Link>
            <Link href="/prices" className={styles.ctaSecondary}>
              Pricing Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏛️</span>
          <span><strong>Listed buildings</strong> assessors</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🏆</span>
          <span><strong>NDEA Level 3 & 4</strong> qualified</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⚡</span>
          <span><strong>24–48hr</strong> certificate turnaround</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>⭐</span>
          <span><strong>4.9/5</strong> from 62 City reviews</span>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📜</span>
          <span><strong>MEES exemption</strong> guidance</span>
        </div>
      </div>

      <div className={styles.container}>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <h2 style={{ color: '#fff' }}>Commercial Energy Certificates Across the Square Mile</h2>
            <p className={styles.paragraph}>
              The City of London contains one of the most diverse and complex commercial property mixes in the world. From Victorian-era Italianate banking halls on Lombard Street to post-2000 glass-and-steel towers at Bishopsgate and Broadgate, each building presents unique assessment challenges requiring assessors with deep knowledge of both heritage construction methods and modern commercial building services.
            </p>
            <p className={styles.paragraph}>
              Avorria's City of London commercial EPC assessors are experienced in the specific requirements of the EC1–EC4 postcode area, including the Corporation of London's planning constraints on building alterations, the prevalence of basement data centres and trading floors with specialist cooling, and the common scenario of Grade II listed exterior shells with modern interior fit-out (known as "façadism").
            </p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>62+</span>
                <span className={styles.statLabel}>City of London EPCs issued</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>24hr</span>
                <span className={styles.statLabel}>Certificate turnaround</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>EC1–EC4</span>
                <span className={styles.statLabel}>Full postcode coverage</span>
              </div>
            </div>

            <h3 style={{ color: '#fff' }}>City of London Building Types We Assess</h3>
            <div className={styles.featureBox}>
              <h3>Commercial Premises Covered in EC1–EC4</h3>
              <ul className={styles.list}>
                <li><strong>Banking & Financial Services Buildings:</strong> Corporate banking headquarters, insurance underwriting floors, asset management offices, and compliance suites across Cannon Street, Threadneedle Street, Cheapside, and Moorgate.</li>
                <li><strong>Heritage Livery Halls:</strong> Grade I and II listed guild halls with mixed historic fabric and modern services. Heritage exemptions advise available. We work closely with the Corporation of London's conservation requirements.</li>
                <li><strong>Office-to-Retail Conversions:</strong> Ground-floor retail units beneath office towers along King William Street, Queen Victoria Street, and Fenchurch Street. Level 3 assessments with HVAC modelling.</li>
                <li><strong>Legal & Professional Services Premises:</strong> Law firm offices in the Temple and Holborn Viaduct areas, across both historic stone buildings and new-build office suites.</li>
                <li><strong>Trading Floors & Data Centres:</strong> Specialist high-density cooling environments requiring Level 4 NDEA assessment. Separate assessment sections for server/trading zones.</li>
                <li><strong>Restaurant, Bar & Hospitality Units:</strong> Commercial kitchens, bar areas, and hospitality venues at Leadenhall Market, The Gherkin, and along Fleet Street.</li>
              </ul>
            </div>

            <h3 style={{ color: '#fff' }}>MEES & City of London Commercial Landlords</h3>
            <p className={styles.paragraph}>
              The Minimum Energy Efficiency Standards (MEES) apply universally to the City's commercial property stock regardless of heritage status (in most cases). Landlords who let commercial premises below EPC band E face unlimited civil penalties for each day of non-compliance. With MEES minimum standards rising to C by 2027 and B by 2030, City landlords are increasingly using Commercial EPC assessments to plan capital improvement programmes.
            </p>
            <div className={styles.featureBox}>
              <h3>City of London MEES — Key Obligations & Exemptions</h3>
              <ul className={styles.list}>
                <li><strong>MEES Threshold — Current:</strong> Minimum EPC rating of E required for all commercial tenancies. Applies to new lettings and all existing leases since April 2023.</li>
                <li><strong>2027 Target (Proposed):</strong> EPC C required. Landlords must either upgrade or register a valid exemption (e.g., spending cap derogation of £3,500 per rating point).</li>
                <li><strong>Listed Building Exemptions:</strong> Where compliance works would unacceptably alter the character of a listed structure, a temporary 5-year exemption can be registered with the relevant Local Authority. We provide full exemption assessment and documentation support.</li>
                <li><strong>Tenant Consent Exemptions:</strong> Where a tenant withholds consent for energy improvement works, a 5-year exemption can be registered. Documentation must be specific and legally compliant.</li>
              </ul>
            </div>
          </div>

          {/* PRICING SIDEBAR */}
          <div className={styles.pricingCard}>
            <h3>City of London EPC Rates</h3>
            <p className={styles.priceIntro}>Fixed rates excluding VAT. Includes assessor site visit, SBEM calculation, all MEES guidance, and national register lodgement.</p>
            <div className={styles.pricingList}>
              <div className={styles.priceRow}><span>Up to 100m²</span><strong>£185</strong></div>
              <div className={styles.priceRow}><span>101 – 250m²</span><strong>£275</strong></div>
              <div className={styles.priceRow}><span>251 – 500m²</span><strong>£375</strong></div>
              <div className={styles.priceRow}><span>501 – 750m²</span><strong>£475</strong></div>
              <div className={styles.priceRow}><span>751 – 1,000m²</span><strong>£595</strong></div>
              <div className={styles.priceRow}><span>1,001m²+ / Level 4</span><strong>POA</strong></div>
            </div>
            <Link href="/book?service=commercial&postcode=EC2N2DB" className={styles.bookButton}>
              Book City of London EPC
            </Link>
            <Link href="/prices" className={styles.bookButtonSecondary}>
              Use Pricing Calculator
            </Link>
            <span className={styles.pricingNotes}>
              * Level 4 complex assessments, listed building consultancy, and MEES exemption reports are scoped individually. TM44 bundling available.
            </span>
          </div>
        </section>

        {/* PROCESS */}
        <section className={styles.processSection}>
          <h2 className={styles.processTitle}>Our City of London Assessment Process</h2>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h4>Pre-Assessment Review</h4>
              <p>We request existing architectural drawings, planning history, and listed building status. Complex or heritage buildings are assessed by our specialist senior assessors.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h4>Site Visit — EC1–EC4</h4>
              <p>Our assessor attends your premises. All fabric elements, services plant, glazing, and lighting are systematically documented. Typically 2–5 hours depending on size.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h4>Energy Calculation</h4>
              <p>Building data processed through approved SBEM or DSM software. Improvement recommendations generated and ranked by cost-per-rating-point for MEES planning.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h4>Certificate Delivered</h4>
              <p>EPC lodged to Landmark national register. Full PDF pack emailed within 24 hours: certificate, recommendation report, and MEES compliance summary.</p>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>City of London Client Reviews</h2>
          <p className={styles.reviewsSubtitle}>Rated 4.9/5 from 62 verified City of London commercial assessments</p>
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
          <h2 className={styles.faqTitle}>City of London Commercial EPC — FAQ</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do listed buildings in the City of London need a Commercial EPC?</p>
              <p className={styles.faqAnswer}>Most listed buildings still require a Commercial EPC. A specific exemption exists only where compliance works would unacceptably alter the character or appearance of a listed building. We assess exemption eligibility during our scoping process and provide full documentation support where applicable.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Which NDEA level is required for City of London office buildings?</p>
              <p className={styles.faqAnswer}>Most standard office, retail, and single-zone commercial premises in the City require Level 3 NDEA assessment using iSBEM. Buildings with centralised mechanical ventilation, chiller plant, or complex multi-zone HVAC (common in large Bishopsgate and Broadgate offices) require Level 4 DSM. We confirm which level is required during pre-booking scoping.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How quickly can I get a Commercial EPC for an EC2 property?</p>
              <p className={styles.faqAnswer}>We typically offer same-week and often next-day appointments for City of London properties. Standard certificates are lodged within 24 hours of the site visit. Urgent same-day bookings can be arranged for time-sensitive transactions — contact our team directly.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What postcodes do you cover in the City of London?</p>
              <p className={styles.faqAnswer}>We cover all City of London postcodes: EC1A, EC1M, EC1N, EC1R, EC1V, EC1Y, EC2A, EC2M, EC2N, EC2P, EC2R, EC2V, EC2Y, EC3A, EC3M, EC3N, EC3R, EC3V, EC4A, EC4M, EC4N, EC4R, EC4V, and EC4Y. Adjacent areas including WC2 and parts of E1 are also covered.</p>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className={styles.ctaBanner}>
          <h2>Book Your City of London Commercial EPC</h2>
          <p>
            Trusted by City firms, estate agents, property managers, and public authorities across EC1–EC4. Fixed pricing, 24-hour turnaround, MEES guidance included.
          </p>
          <div className={styles.ctas}>
            <Link href="/book?service=commercial&postcode=EC2N2DB" className={styles.ctaPrimary}>
              Book EC1–EC4 EPC →
            </Link>
            <Link href="/locations/london/city-of-london/tm44" className={styles.ctaSecondary}>
              TM44 Inspection Too?
            </Link>
          </div>
        </div>

        {/* RELATED */}
        <div className={styles.relatedSection}>
          <p className={styles.relatedTitle}>Related Pages</p>
          <div className={styles.relatedLinks}>
            <Link href="/locations/london/commercial-epc" className={styles.relatedLink}>London Commercial EPC Hub</Link>
            <Link href="/locations/london/city-of-london/tm44" className={styles.relatedLink}>TM44 City of London</Link>
            <Link href="/locations/london/canary-wharf/commercial-epc" className={styles.relatedLink}>Commercial EPC Canary Wharf</Link>
            <Link href="/locations/london/westminster/commercial-epc" className={styles.relatedLink}>Commercial EPC Westminster</Link>
            <Link href="/services/commercial-epc" className={styles.relatedLink}>Commercial EPC Service</Link>
            <Link href="/services/display-energy-certificate" className={styles.relatedLink}>Display Energy Certificates</Link>
            <Link href="/prices" className={styles.relatedLink}>Pricing Calculator</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
