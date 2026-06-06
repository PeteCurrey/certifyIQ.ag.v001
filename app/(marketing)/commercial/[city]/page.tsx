import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from '../commercial-city.module.css'
import CityQuoteForm from './CityQuoteForm'
import CityFaqAccordion from './CityFaqAccordion'

interface CityPageProps {
  params: Promise<{ city: string }>
}

const CITIES = ['london', 'manchester', 'birmingham', 'sheffield', 'leeds', 'nottingham', 'derby']

export async function generateStaticParams() {
  return CITIES.map(city => ({ city }))
}

// Data generator for city pages
function getCityData(city: string) {
  const c = city.toLowerCase()
  const cityName = city.charAt(0).toUpperCase() + city.slice(1)

  const contentMap: Record<string, { heroSub: string; p1: string; p2: string; p3: string; phone: string; address: string; schemaLat: number; schemaLng: number }> = {
    london: {
      heroSub: "Commercial EPC assessments across Greater London — from the City and Canary Wharf to the West End, Southbank and outer boroughs. Level 3 and Level 4 SBEM assessments, TM44 air conditioning inspections and DECs for public buildings.",
      p1: "London holds the UK's largest concentration of commercial property — over 260 million square feet of office space alone. With MEES Band C required from April 2027, the capital's landlords face one of the most significant compliance programmes in the sector's history. The majority of London's commercial stock dates from before 2000 and will require assessment and likely upgrade planning to meet the new standards.",
      p2: "Our NDEA-accredited assessors cover all London postcodes, from EC1 and WC2 to E14, SE1, W1 and beyond. We use iSBEM for Level 3 assessments and can refer complex Level 4 and Level 5 buildings to DSM-qualified partners within our accredited network.",
      p3: "TM44 compliance is particularly relevant in London, where older office buildings commonly have legacy AC systems that have never been formally assessed. The fine of up to £800 per system makes early inspection cost-effective compared to enforcement action.",
      phone: "020 7123 4567",
      address: "37th Floor, 1 Canada Square, Canary Wharf Estate, London E14 5AA",
      schemaLat: 51.5048,
      schemaLng: -0.0194
    },
    manchester: {
      heroSub: "Commercial EPCs, TM44 and DECs for Manchester city centre and Greater Manchester — from Spinningfields and Piccadilly to Trafford, Salford and MediaCity.",
      p1: "Manchester's commercial property market is one of the fastest-growing outside London. Major office developments at Spinningfields, St Peter's Square and the NOMA district have created a significant stock of modern commercial space — but older mill conversions, Victorian warehouses and 1980s office buildings still dominate large parts of the portfolio. Many of these older buildings will need EPC assessment and improvement planning ahead of the 2027 MEES deadline.",
      p2: "We serve clients across M1-M90 postcodes, including Manchester city centre, Salford Quays, MediaCity, Trafford Park, Stockport and the wider Greater Manchester area.",
      p3: "TM44 compliance is frequently overlooked by Manchester landlords and facilities managers. With a significant proportion of Greater Manchester's commercial building stock using air conditioning systems installed before 2010, many are already overdue for their mandatory 5-year inspection.",
      phone: "0161 823 4567",
      address: "Spinningfields, Manchester M3 3HF",
      schemaLat: 53.4794,
      schemaLng: -2.2511
    },
    birmingham: {
      heroSub: "Commercial EPC assessments in Birmingham and the West Midlands — Colmore Row, Brindleyplace, Digbeth, Jewellery Quarter and beyond.",
      p1: "Birmingham is undergoing substantial commercial regeneration, with major office, retail and mixed-use developments reshaping the city centre. The relocation of HSBC UK's headquarters and the post-Games investment in infrastructure have accelerated demand for high-quality commercial space — and with it, increasing regulatory scrutiny on energy compliance.",
      p2: "Our assessors cover B1-B99 postcodes across Birmingham, Solihull, Wolverhampton, Coventry and the wider West Midlands.",
      p3: "Birmingham's extensive stock of light industrial units in areas such as Tyseley and Aston represents a significant TM44 compliance gap — many small warehouses and light industrial units have added office AC systems over the years without formal inspection.",
      phone: "0121 643 4567",
      address: "Colmore Row, Birmingham B3 2BJ",
      schemaLat: 52.4816,
      schemaLng: -1.9001
    },
    sheffield: {
      heroSub: "Commercial EPCs, TM44 and compliance assessments for Sheffield and South Yorkshire — from the city centre to Meadowhall, the Advanced Manufacturing Park and Barnsley.",
      p1: "Sheffield's commercial property market reflects its dual identity as a post-industrial city and a growing knowledge economy hub. The city centre features a mix of modern office developments alongside converted industrial buildings, many of which have complex energy profiles that benefit from thorough SBEM assessment.",
      p2: "We cover all Sheffield postcodes (S1-S99) as well as Rotherham, Barnsley, Doncaster and the wider South Yorkshire area. Sheffield is also within our primary East Midlands assessment zone, meaning same-day availability is frequently possible.",
      p3: "The Advanced Manufacturing Park (AMP) at Waverley and similar technology-focused developments have created a new generation of light industrial and research facilities in South Yorkshire — many requiring Level 4 SBEM assessment due to complex ventilation and process cooling systems.",
      phone: "0114 272 4567",
      address: "Wellington Street, Sheffield S1 4HD",
      schemaLat: 53.3797,
      schemaLng: -1.4781
    },
    leeds: {
      heroSub: "Commercial EPCs and TM44 inspections for Leeds and West Yorkshire — from Wellington Place and the financial district to out-of-town business parks.",
      p1: "Leeds is the UK's second-largest financial centre outside London, with a growing concentration of professional services, legal and financial firms. The city's commercial office market — centred on Wellington Place, Whitehall Road and the South Bank development — contains a substantial volume of older stock that is approaching or has passed MEES Band C requirements.",
      p2: "We serve LS1-LS99 postcodes including Leeds city centre, Harrogate, Bradford, Wakefield and the surrounding West Yorkshire commercial market.",
      p3: "Leeds has one of the highest concentrations of legal and financial services firms outside London — many of which occupy leased office space and need their landlords to demonstrate EPC compliance as a condition of lease renewal.",
      phone: "0113 244 4567",
      address: "Wellington Place, Leeds LS1 4AP",
      schemaLat: 53.7972,
      schemaLng: -1.5541
    },
    nottingham: {
      heroSub: "Commercial EPC assessments for Nottingham and the East Midlands — the Lace Market, Castle Rock, Eastside and the wider NG postcode area.",
      p1: "Nottingham is one of the East Midlands' most dynamic commercial property markets, with strong retail, office and industrial sectors. The city's proximity to Chesterfield means we can offer some of the fastest commercial EPC turnarounds in the region.",
      p2: "We cover NG1-NG99 postcodes across Nottingham, Mansfield, Newark, Grantham and the wider East Midlands area.",
      p3: "Nottingham's large student population and purpose-built student accommodation sector creates an ongoing need for EPC compliance management for housing associations and private PBSA operators.",
      phone: "0115 941 4567",
      address: "Lace Market, Nottingham NG1 1PB",
      schemaLat: 52.9524,
      schemaLng: -1.1434
    },
    derby: {
      heroSub: "Commercial EPC assessments for Derby and Derbyshire — the city centre, Pride Park, Rolls-Royce precinct and surrounding industrial areas.",
      p1: "Derby's commercial property market is closely linked to its industrial heritage — Rolls-Royce, Toyota and a network of advanced manufacturing suppliers give the city a distinctively engineering-focused commercial economy. Light industrial units, research facilities and manufacturing premises form a significant proportion of the commercial stock requiring EPC assessment.",
      p2: "Derby is within our primary assessment zone — DE1-DE99 postcodes are covered with same-day availability in many cases. Our local knowledge of Derby's commercial stock — including the specific characteristics of Rolls-Royce adjacent industrial premises and Pride Park office developments — means we can complete assessments efficiently.",
      p3: "Derby's position at the centre of the East Midlands transport network makes it an ideal base for coordinating regional portfolio assessments for clients managing commercial property across the M1 corridor.",
      phone: "01332 291 567",
      address: "Pride Park, Derby DE24 8WY",
      schemaLat: 52.9125,
      schemaLng: -1.4556
    }
  }

  const data = contentMap[c]
  if (!data) return null
  return {
    ...data,
    cityName,
    cityKey: c
  }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params
  const data = getCityData(city)
  if (!data) return {}
  return {
    title: `Commercial EPC ${data.cityName} | NDEA Accredited | Avorria`,
    description: `Commercial EPC assessments in ${data.cityName}. Level 3 & 4, TM44 air conditioning inspections, and DEC assessments. Accredited NDEA assessors. Fixed prices, fast turnaround. Quote in 2 hours.`,
  }
}

export default async function CommercialCityPage({ params }: CityPageProps) {
  const { city } = await params
  const data = getCityData(city)
  if (!data) notFound()

  // Dynamic MEES countdown
  const targetDate = new Date('2027-04-01')
  const now = new Date()
  const monthsRemaining = Math.max(0, (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth()))

  // Build JSON-LD structured data schema
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Avorria Commercial EPC ${data.cityName}`,
    "image": "https://avorria.co.uk/logo.png",
    "telephone": data.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.address,
      "addressLocality": data.cityName,
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.schemaLat,
      "longitude": data.schemaLng
    },
    "url": `https://avorria.co.uk/commercial/${data.cityKey}`
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Commercial Energy Performance Certificate",
    "provider": {
      "@type": "LocalBusiness",
      "name": `Avorria Commercial EPC ${data.cityName}`
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": data.cityName
    }
  }

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Commercial EPC Assessments · {data.cityName}</span>
          <h1 className={styles.title}>Commercial EPC Assessments in {data.cityName}</h1>
          <p className={styles.subtitle}>{data.heroSub}</p>
          <div className={styles.heroCtas}>
            <a href="#quote-form" className={styles.btnPrimary}>Get a quote — response within 2 hours</a>
            <a href={`tel:${data.phone.replace(/\s+/g, '')}`} className={styles.btnSecondary}>Call us now — {data.phone}</a>
          </div>
        </div>
      </div>

      {/* Services offered */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Commercial services offered in {data.cityName}</h2>
          <p className={styles.sectionSub}>Comprehensive commercial energy compliance solutions for landlords, agents, and public sector bodies.</p>
          
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>Commercial EPC (Level 3 & 4)</h3>
              <span className={styles.servicePrice}>From £185+VAT</span>
              <p className={styles.serviceDesc}>Energy performance certificates calculated via SBEM methodology for sales, lettings, and renewals. Level 3 (simple heating) and Level 4 (complex HVAC) covered.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>TM44 Air Conditioning</h3>
              <span className={styles.servicePrice}>From £275+VAT</span>
              <p className={styles.serviceDesc}>Statutory 5-yearly inspections of all air conditioning systems with an effective output exceeding 12kW. Lodged to the Landmark Register.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>Display Energy Certificate</h3>
              <span className={styles.servicePrice}>From £245+VAT</span>
              <p className={styles.serviceDesc}>Annual operational ratings showing actual energy usage for public sector or frequently visited public buildings over 250m².</p>
            </div>
          </div>
        </div>
      </section>

      {/* Local Market Context */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Commercial property compliance in {data.cityName}</h2>
          
          <div className={styles.contextGrid}>
            <div className={styles.contextText}>
              <p>{data.p1}</p>
              <p>{data.p2}</p>
              <p>{data.p3}</p>
            </div>
            <div className={styles.contextStats}>
              <div className={styles.contextStat}>
                <span className={styles.statVal}>Band C</span>
                <span className={styles.statLabel}>Proposed MEES standard for rented assets by 2027</span>
              </div>
              <div className={styles.contextStat}>
                <span className={styles.statVal}>5 Days</span>
                <span className={styles.statLabel}>Standard certificate issuance turnaround time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEES Urgency Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner} style={{ textAlign: 'center' }}>
          <h2 className={styles.sectionTitle}>The commercial MEES roadmap</h2>
          <p className={styles.sectionSub}>
            {data.cityName} commercial landlords face <strong>{monthsRemaining} months</strong> until the EPC C requirement. Early assessment gives you time to plan cost-effective improvements.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
            <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: '8px', flex: '1 1 250px' }}>
              <strong style={{ color: '#06B6D4', fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>April 2025</strong>
              <span style={{ color: '#8BA3BF', fontSize: '0.9rem' }}>All active leases must have a valid EPC of any rating</span>
            </div>
            <div style={{ background: '#0F1628', border: '1px solid rgba(239,68,68,0.3)', padding: '1.5rem', borderRadius: '8px', flex: '1 1 250px' }}>
              <strong style={{ color: '#EF4444', fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>April 2027</strong>
              <span style={{ color: '#E8F4FF', fontSize: '0.9rem' }}>Minimum rating rises to Band C for all active commercial tenancies</span>
            </div>
            <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: '8px', flex: '1 1 250px' }}>
              <strong style={{ color: '#06B6D4', fontSize: '1.2rem', display: 'block', marginBottom: '0.5rem' }}>April 2030</strong>
              <span style={{ color: '#8BA3BF', fontSize: '0.9rem' }}>Minimum rating rises to Band B for all active commercial tenancies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Transparent commercial EPC pricing</h2>
          <p className={styles.sectionSub}>Fixed prices based on building floor area. No hidden fees. Prices exclude VAT.</p>
          
          <div className={styles.tableContainer}>
            <table className={styles.pricingTable}>
              <thead>
                <tr>
                  <th>Floor Area</th>
                  <th>Standard Price (exc. VAT)</th>
                  <th>Assessor Type</th>
                  <th>Turnaround</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.pricingRow}>
                  <td>Up to 100 m²</td>
                  <td style={{ color: '#9BFF59', fontWeight: 600 }}>£185</td>
                  <td>Level 3 NDEA</td>
                  <td>3-5 Working Days</td>
                </tr>
                <tr className={styles.pricingRow}>
                  <td>101 – 250 m²</td>
                  <td style={{ color: '#9BFF59', fontWeight: 600 }}>£275</td>
                  <td>Level 3 NDEA</td>
                  <td>3-5 Working Days</td>
                </tr>
                <tr className={styles.pricingRow}>
                  <td>251 – 500 m²</td>
                  <td style={{ color: '#9BFF59', fontWeight: 600 }}>£375</td>
                  <td>Level 3 NDEA</td>
                  <td>3-5 Working Days</td>
                </tr>
                <tr className={styles.pricingRow}>
                  <td>501 – 750 m²</td>
                  <td style={{ color: '#9BFF59', fontWeight: 600 }}>£475</td>
                  <td>Level 4 NDEA</td>
                  <td>3-5 Working Days</td>
                </tr>
                <tr className={styles.pricingRow}>
                  <td>751 – 1,000 m²</td>
                  <td style={{ color: '#9BFF59', fontWeight: 600 }}>£595</td>
                  <td>Level 4 NDEA</td>
                  <td>3-5 Working Days</td>
                </tr>
                <tr className={styles.pricingRow}>
                  <td>1,000 m²+</td>
                  <td style={{ color: '#06B6D4', fontWeight: 600 }}>Bespoke Quote</td>
                  <td>Level 4 / DSM Assessor</td>
                  <td>Bespoke</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <CityQuoteForm city={city} />
        </div>
      </section>

      {/* FAQs */}
      <section className={styles.section} style={{ borderBottom: 'none' }}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Local Commercial FAQs</h2>
          <p className={styles.sectionSub} style={{ textAlign: 'center' }}>Common questions from commercial property landlords in {data.cityName}.</p>
          <CityFaqAccordion city={city} />
        </div>
      </section>
    </div>
  )
}
