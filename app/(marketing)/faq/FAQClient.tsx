'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './faq.module.css'

const FAQS = [
  // About EPCs
  { cat: 'About EPCs', q: 'What is an Energy Performance Certificate (EPC)?', a: 'An EPC is a legally required document rating a property\'s energy efficiency from A (most efficient) to G (least efficient) on a scale of 1–100. It shows current and potential ratings, estimated energy costs, and recommended improvements. Valid for 10 years.', cta: null },
  { cat: 'About EPCs', q: 'What does my EPC rating mean?', a: 'Ratings run A–G: A (92–100, excellent) to G (1–20, very poor). The rating reflects how energy-efficient your property is based on its fabric, heating, and lighting — not your actual energy use. A higher rating means lower energy bills and less CO₂ output.', cta: { text: 'Book your EPC from £65', href: '/book' } },
  { cat: 'About EPCs', q: 'How long is an EPC valid for?', a: 'An EPC is valid for 10 years from the date of issue. You don\'t need a new one if a valid certificate exists — even when selling or renting — provided it\'s less than 10 years old and a more recent one hasn\'t been issued. A new EPC supersedes any previous certificate.', cta: null },
  { cat: 'About EPCs', q: 'What\'s the difference between current rating and potential rating?', a: 'The current rating reflects how energy-efficient the property is now. The potential rating is what it could achieve if all cost-effective improvements recommended on the certificate were carried out. The gap between the two shows the improvement headroom.', cta: null },
  { cat: 'About EPCs', q: 'Does an EPC affect my property value?', a: 'Higher-rated properties typically command a premium. Research consistently shows Band C or above adds measurable value, particularly for rental properties facing MEES compliance requirements. A low rating can also affect mortgage availability on rental properties.', cta: null },
  { cat: 'About EPCs', q: 'Can I see anyone else\'s EPC?', a: 'Yes — all lodged EPCs in England and Wales are on the public register. You can search by postcode. Our free EPC Lookup tool makes this even easier.', cta: { text: 'Search the EPC Register', href: '/lookup' } },
  { cat: 'About EPCs', q: 'What is RdSAP 10 and how is it different to the previous standard?', a: 'RdSAP 10 is the current methodology for assessing existing homes, introduced in 2025. It collects more detailed data than its predecessor (RdSAP 9.94), particularly around heating systems, heat pumps, solar technology, and fabric performance. This makes ratings more accurate and fair — especially for properties with modern improvements.', cta: null },
  { cat: 'About EPCs', q: 'Does a new EPC replace an old one?', a: 'Yes. When a new EPC is lodged, it supersedes the previous one. The latest lodged certificate is the valid one. If your previous certificate showed a lower rating that you\'ve since improved, commissioning a fresh assessment will update the public record.', cta: null },

  // When Do I Need One?
  { cat: 'When Do I Need One?', q: 'Do I need an EPC to sell my home?', a: 'Yes. You must have a valid EPC before marketing the property. Estate agents are required to include the EPC rating in listings. Penalties for non-compliance can reach £5,000.', cta: null },
  { cat: 'When Do I Need One?', q: 'Do I need an EPC to rent out a property?', a: 'Yes. A valid EPC must be provided to prospective tenants before a tenancy begins. Under MEES regulations, the property must also meet minimum energy efficiency standards (currently Band E or above for England and Wales).', cta: null },
  { cat: 'When Do I Need One?', q: 'Are there any exemptions from needing an EPC?', a: 'Some properties are exempt: listed buildings (where improvements would unacceptably alter character), temporary buildings intended for use for less than 2 years, and some holiday lets. Exemptions must be registered on the PRS exemptions register.', cta: null },
  { cat: 'When Do I Need One?', q: 'Do new builds need an EPC?', a: 'Yes. All new dwellings must have an On-Construction EPC (OC-EPC) before they can be occupied. This is based on the as-built SAP calculation and the air tightness test result.', cta: { text: 'Get a new build EPC & SAP quote', href: '/book?service=sap' } },
  { cat: 'When Do I Need One?', q: 'Does a commercial property need an EPC?', a: 'Yes. Non-domestic properties require a commercial EPC when built, sold, or rented. The assessment uses SBEM methodology rather than RdSAP. Level 3, 4, or 5 assessment is needed depending on building complexity.', cta: null },
  { cat: 'When Do I Need One?', q: 'What happens if I don\'t have an EPC when required?', a: 'Failing to have a valid EPC when required can result in fines up to £5,000 for domestic properties and up to £150,000 for larger commercial properties. Estate agents can also be fined for marketing without one.', cta: null },

  // Landlord Compliance
  { cat: 'Landlord Compliance', q: 'What is the Minimum Energy Efficiency Standard (MEES)?', a: 'MEES are regulations requiring rental properties in England and Wales to meet minimum EPC standards. Since April 2018, properties must be Band E or above for new tenancies. From 2028, the government is proposing to raise this to Band C.', cta: null },
  { cat: 'Landlord Compliance', q: 'What is the current minimum EPC rating for rental properties?', a: 'Band E. Properties rated F or G cannot legally be rented out without a registered exemption. This applies to all domestic tenancies in England and Wales.', cta: null },
  { cat: 'Landlord Compliance', q: 'What is changing in 2028 for landlords?', a: 'The government proposes that from 2028, all rental properties must achieve a minimum of Band C for new tenancies. This is a significant jump for many landlords — particularly those with Victorian terraces, older solid-wall properties, or properties without cavity insulation.', cta: { text: 'Check your EPC status now', href: '/lookup' } },
  { cat: 'Landlord Compliance', q: 'What happens if my rental property is below Band E?', a: 'Without a valid exemption, it is unlawful to let the property. You must either carry out improvement works to raise the rating or register a valid exemption on the PRS Exemptions Register.', cta: null },
  { cat: 'Landlord Compliance', q: 'What are the fines for non-compliance with MEES?', a: 'Fines can reach £30,000 per property for domestic breaches. Local authorities can also publish details of non-compliant landlords. For commercial properties, penalties can reach £150,000.', cta: null },
  { cat: 'Landlord Compliance', q: 'Can I get an exemption from MEES?', a: 'Yes, in specific circumstances: if the cost of improvements exceeds £3,500 (the cost cap), if improvements would damage the property or aren\'t permitted under planning or listed building consent, or if a tenant refuses access for works. Exemptions last 5 years and must be registered.', cta: null },
  { cat: 'Landlord Compliance', q: 'What improvements are most effective for raising my EPC rating?', a: 'The most cost-effective measures in rough order are: loft insulation, LED lighting, cavity wall insulation, smart thermostatic controls, hot water cylinder insulation, double glazing, and boiler upgrade. More significant improvements include solid wall insulation, solar PV, and heat pumps.', cta: { text: 'Try the free Improvement Advisor', href: '/improve' } },
  { cat: 'Landlord Compliance', q: 'I have a portfolio of properties — can you manage multiple EPCs?', a: 'Yes. We offer portfolio pricing and can manage multiple assessments across your portfolio. Contact us to discuss a programme approach with bulk pricing.', cta: { text: 'Enquire about portfolio EPCs', href: '/for/landlords' } },

  // The Assessment
  { cat: 'The Assessment', q: 'How long does a domestic EPC assessment take?', a: 'Typically 30–45 minutes for a standard 3-bedroom semi-detached home. Larger detached properties or those with complex layouts may take up to 90 minutes. The assessor needs access to all rooms, the loft, and the heating system.', cta: null },
  { cat: 'The Assessment', q: 'What will the assessor look at during the visit?', a: 'The assessor inspects: wall construction and insulation, loft insulation, floor insulation, window type and glazing, main and secondary heating systems, hot water system, lighting, solar panels or other renewables, and ventilation. All inspection is visual and non-invasive — nothing is moved or dismantled.', cta: null },
  { cat: 'The Assessment', q: 'How do I prepare for the assessment?', a: 'Ensure access to all rooms (including the loft if applicable), the boiler or heating system controls, the fuse box, and the hot water cylinder if present. Have any documentation for recent improvements to hand (e.g. boiler installation certificate, insulation guarantee). No special preparation is needed.', cta: null },
  { cat: 'The Assessment', q: 'Do I need to be present during the assessment?', a: 'Someone must be present to grant access, but it does not need to be the owner — a tenant or property manager can let the assessor in. The assessor does not need any decisions made on the day; the visit is observation only.', cta: null },
  { cat: 'The Assessment', q: 'How quickly will I get my certificate?', a: 'We aim to lodge your certificate with the national register and send it to you within 24 hours of the assessment. In many cases, same-day lodgement is possible.', cta: null },
  { cat: 'The Assessment', q: 'What accreditation should my assessor have?', a: 'Domestic EPC assessors must be accredited DEAs (Domestic Energy Assessors), registered with a government-approved accreditation scheme such as Elmhurst Energy. All Avorria assessors are Elmhurst-accredited.', cta: { text: 'Book with an Elmhurst-accredited assessor', href: '/book' } },

  // New Build & SAP
  { cat: 'New Build & SAP', q: 'What is a SAP calculation?', a: 'SAP (Standard Assessment Procedure) is the UK government\'s method for calculating the energy performance of new and converted homes. It\'s used to demonstrate compliance with Part L of the Building Regulations. SAP can only be carried out by accredited OCDEAs.', cta: null },
  { cat: 'New Build & SAP', q: 'What is a Predicted Energy Assessment (PEA)?', a: 'A PEA is a document produced from the design stage SAP calculation, showing the predicted energy rating of a new home before it\'s built. It\'s required by Building Control before construction work begins.', cta: { text: 'Get a design stage SAP quote', href: '/book?service=sap' } },
  { cat: 'New Build & SAP', q: 'What is an On-Construction EPC (OC-EPC)?', a: 'The OC-EPC is the final Energy Performance Certificate issued when a new build is complete. It\'s based on the as-built SAP calculation, incorporating the actual air tightness test result. Required for handover and Building Control sign-off.', cta: null },
  { cat: 'New Build & SAP', q: 'What is air tightness testing and why is it mandatory?', a: 'Air tightness testing measures how much air leaks through the building envelope. All new dwellings must be tested under Part L1A of the Building Regulations. The result feeds into the final SAP calculation and determines the OC-EPC rating.', cta: { text: 'Book an air tightness test', href: '/book?service=air_tightness' } },
  { cat: 'New Build & SAP', q: 'What is the pass standard for an air tightness test?', a: 'The default design target is 8.0 m³/h/m² at 50 Pascals. Better-performing homes aim for 5.0 or below. The test result must be equal to or better than the design target used in the SAP calculation — if it\'s worse, a revised SAP is required.', cta: null },
  { cat: 'New Build & SAP', q: 'What happens if my new build fails the air tightness test?', a: 'The building fabric needs remedial work (typically finding and sealing leakage points), followed by a retest. We can carry out same-day retests in many cases. Common causes of failure are unsealed service penetrations, window reveals, and loft hatches.', cta: null },

  // Commercial EPCs
  { cat: 'Commercial EPCs', q: 'What is a Non-Domestic Energy Performance Certificate?', a: 'A commercial EPC (also called an NDEC) rates the energy efficiency of non-domestic buildings on the same A–G scale. Required when a commercial property is built, sold, or rented. Assessed using SBEM or DSM methodology by a qualified NDEA.', cta: null },
  { cat: 'Commercial EPCs', q: 'What are EPC levels 3, 4, and 5?', a: 'Level 3: Small straightforward buildings (offices, shops under 500m²). Level 4: Larger or more complex buildings with sophisticated HVAC. Level 5: Very large or complex buildings requiring dynamic simulation modelling (DSM). Most commercial properties need Level 3 or 4.', cta: null },
  { cat: 'Commercial EPCs', q: 'What are the commercial MEES deadlines?', a: 'EPC E minimum is already required (since 2018). EPC C is required from April 2027 for all non-domestic rented properties. EPC B is required from April 2030. Fines for non-compliance can reach £50,000.', cta: { text: 'Get a commercial EPC quote', href: '/book?service=commercial' } },

  // Booking & Payment
  { cat: 'Booking & Payment', q: 'How do I book an EPC with Avorria?', a: 'Use our online booking wizard — select your service, enter your property details, choose a date, and confirm. For commercial, new build, or large projects, we\'ll contact you within 2 hours with a fixed price.', cta: { text: 'Book now', href: '/book' } },
  { cat: 'Booking & Payment', q: 'How much does an EPC cost?', a: 'Domestic EPCs start from £65. Commercial EPCs from £150. New build SAP from £195. Air tightness testing from £120+VAT. All prices include lodgement on the national register.', cta: { text: 'View full pricing', href: '/prices' } },
  { cat: 'Booking & Payment', q: 'Can I cancel or reschedule?', a: 'Yes — please contact us at least 24 hours before your appointment. We\'ll reschedule at no charge. Cancellations with less than 24 hours notice may incur a call-out fee.', cta: null },
  { cat: 'Booking & Payment', q: 'Do you cover my area?', a: 'We currently cover Chesterfield, Sheffield, Matlock, Mansfield, and the wider Derbyshire and South Yorkshire areas. Enter your postcode in the booking form to check availability.', cta: null },
  { cat: 'Booking & Payment', q: 'What is included in the price?', a: 'All Avorria assessment fees include: the site visit, the full RdSAP 10 assessment, lodgement on the national EPC register, and the digital certificate emailed to you. No hidden extras.', cta: null },
]

const CATEGORIES = [...new Set(FAQS.map(f => f.cat))]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function FAQClient() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  const filtered = useMemo(() => {
    if (!search.trim()) return FAQS
    const q = search.toLowerCase()
    return FAQS.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }, [search])

  const displayCategories = search.trim()
    ? [...new Set(filtered.map(f => f.cat))]
    : CATEGORIES

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <div className={styles.container}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>Help Centre</span>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Everything you need to know about EPCs, landlord compliance, new builds, air testing, and booking.
          </p>
          <div className={styles.searchWrap}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search questions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.layout}>
          {/* Sidebar */}
          {!search.trim() && (
            <aside className={styles.sidebar}>
              {CATEGORIES.map(cat => (
                <a
                  key={cat}
                  href={`#${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`${styles.sidebarLink} ${activeCategory === cat ? styles.sidebarLinkActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </a>
              ))}
              <div className={styles.sidebarCta}>
                <p>Still have questions?</p>
                <Link href="/book" className={styles.sidebarCtaBtn}>Book now →</Link>
              </div>
            </aside>
          )}

          {/* FAQ content */}
          <div className={styles.content}>
            {search.trim() && filtered.length === 0 && (
              <div className={styles.noResults}>
                <p>No questions matching "{search}". <button className={styles.clearSearch} onClick={() => setSearch('')}>Clear search</button></p>
              </div>
            )}

            {displayCategories.map(cat => {
              const items = filtered.filter(f => f.cat === cat)
              if (items.length === 0) return null
              return (
                <section
                  key={cat}
                  id={cat.replace(/\s+/g, '-').toLowerCase()}
                  className={styles.section}
                >
                  <h2 className={styles.catTitle}>{cat}</h2>
                  <div className={styles.faqList}>
                    {items.map(faq => (
                      <details key={faq.q} className={styles.faqItem}>
                        <summary className={styles.faqQ}>{faq.q}</summary>
                        <div className={styles.faqBody}>
                          <p className={styles.faqA}>{faq.a}</p>
                          {faq.cta && (
                            <Link href={faq.cta.href} className={styles.faqCta}>
                              {faq.cta.text} →
                            </Link>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
