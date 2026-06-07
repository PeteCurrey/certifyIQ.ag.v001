export interface TM44City {
  slug: string
  name: string
  postcodes: string[]
  heroSub: string
  marketContext: string
  faqs: { q: string; a: string }[]
}

export const tm44Cities: Record<string, TM44City> = {
  london: {
    slug: 'london',
    name: 'London',
    postcodes: ['EC', 'WC', 'E', 'N', 'NW', 'SE', 'SW', 'W'],
    heroSub: 'From the City to the West End, our CIBSE-accredited assessors deliver fast, compliant TM44 inspections across Greater London.',
    marketContext: 'London has the highest concentration of air-conditioned buildings in the UK. With strict MEES regulations and active enforcement by local boroughs, ensuring your office, retail unit, or hotel has a valid TM44 certificate is critical for compliance and tenant satisfaction.',
    faqs: [
      { q: 'How long does a TM44 inspection in London take?', a: 'For a standard office space in Central London, the on-site inspection takes 1-3 hours. The final report is lodged on the Landmark Register and emailed within 5 working days.' },
      { q: 'Do you cover all London boroughs?', a: 'Yes, we cover all 32 London boroughs and the City of London, with no additional travel charges.' }
    ]
  },
  manchester: {
    slug: 'manchester',
    name: 'Manchester',
    postcodes: ['M', 'WA', 'WN', 'BL', 'SK'],
    heroSub: 'Serving Greater Manchester and Salford Quays with accredited, fast-turnaround TM44 air conditioning assessments.',
    marketContext: 'As Manchester\'s commercial sector continues to boom, particularly around Spinningfields and MediaCity, the demand for compliant AC systems has surged. We help property managers across the North West stay compliant and avoid fines.',
    faqs: [
      { q: 'Are there travel fees for Manchester inspections?', a: 'No, we have local assessors based in Greater Manchester, so quotes are fully inclusive.' },
      { q: 'Can you assess multiple properties across the North West?', a: 'Absolutely. We offer portfolio discounts for property managers managing multiple sites in Manchester, Liverpool, and Leeds.' }
    ]
  },
  birmingham: {
    slug: 'birmingham',
    name: 'Birmingham',
    postcodes: ['B', 'WS', 'WV', 'DY'],
    heroSub: 'Accredited TM44 inspections for offices, retail, and industrial properties across the West Midlands.',
    marketContext: 'Birmingham’s commercial property market is diverse, ranging from modern high-rises in Colmore Row to extensive industrial parks. A valid TM44 ensures your cooling systems run efficiently, saving on rising energy costs across the Midlands.',
    faqs: [
      { q: 'Do you inspect industrial properties in Birmingham?', a: 'Yes, we inspect all commercial properties including industrial units, warehouses, and logistics centres with AC systems over 12kW.' }
    ]
  },
  leeds: {
    slug: 'leeds',
    name: 'Leeds',
    postcodes: ['LS', 'WF', 'BD'],
    heroSub: 'Yorkshire’s trusted TM44 energy assessors. Fast, compliant reports for Leeds and the surrounding areas.',
    marketContext: 'With a strong financial and legal sector, Leeds has a high density of air-conditioned office spaces. We provide CIBSE-accredited TM44 reports that satisfy lease requirements and regulatory compliance.',
    faqs: [
      { q: 'How do I know if my Leeds office needs a TM44?', a: 'If your combined cooling output exceeds 12kW (typically 3 or more standard split units, or a centralised system), it is a legal requirement.' }
    ]
  },
  sheffield: {
    slug: 'sheffield',
    name: 'Sheffield',
    postcodes: ['S', 'DN', 'S70'],
    heroSub: 'Local, accredited TM44 inspections across Sheffield, Rotherham, and South Yorkshire.',
    marketContext: 'Based locally, we understand the South Yorkshire property market. Whether you manage a retail unit in Meadowhall or offices in the city centre, we provide cost-effective TM44 compliance.',
    faqs: [
      { q: 'Can you assess a property in Sheffield tomorrow?', a: 'We can often accommodate urgent requests in South Yorkshire. Contact us directly to check immediate availability.' }
    ]
  },
  nottingham: {
    slug: 'nottingham',
    name: 'Nottingham',
    postcodes: ['NG'],
    heroSub: 'CIBSE-accredited TM44 reports for businesses across Nottinghamshire.',
    marketContext: 'From the Lace Market to modern business parks, Nottingham properties require efficient cooling. Our TM44 inspections not only ensure compliance but also provide actionable advice to reduce energy bills.',
    faqs: [
      { q: 'Do you lodge the certificate on the national register?', a: 'Yes, all our TM44 reports are lodged directly onto the official Government Landmark Register.' }
    ]
  },
  bristol: {
    slug: 'bristol',
    name: 'Bristol',
    postcodes: ['BS', 'BA'],
    heroSub: 'South West’s leading TM44 air conditioning energy assessors. Serving Bristol and Bath.',
    marketContext: 'Bristol’s mix of historic buildings and modern developments presents unique HVAC challenges. Our assessors are experienced in evaluating complex systems to ensure compliance.',
    faqs: [
      { q: 'Are your assessors CIBSE accredited?', a: 'Yes, all our assessors operating in the South West hold full CIBSE TM44 accreditation.' }
    ]
  },
  liverpool: {
    slug: 'liverpool',
    name: 'Liverpool',
    postcodes: ['L', 'CH', 'WA'],
    heroSub: 'Accredited TM44 assessments for Merseyside’s commercial properties.',
    marketContext: 'With extensive redevelopment in the city centre and docklands, Liverpool’s commercial spaces rely heavily on modern AC. We help you stay compliant with EPBD regulations.',
    faqs: [
      { q: 'What is included in the TM44 report?', a: 'The report includes an assessment of system efficiency, sizing, maintenance checks, and recommendations for improvement.' }
    ]
  },
  newcastle: {
    slug: 'newcastle',
    name: 'Newcastle',
    postcodes: ['NE', 'SR', 'DH'],
    heroSub: 'Fast, compliant TM44 inspections across Newcastle upon Tyne and the North East.',
    marketContext: 'We provide comprehensive TM44 reports for offices, retail parks, and public buildings across the North East, ensuring you meet your legal obligations without disruption.',
    faqs: [
      { q: 'Do you cover Sunderland and Durham?', a: 'Yes, our North East assessors cover Newcastle, Sunderland, Durham, and the surrounding areas.' }
    ]
  },
  leicester: {
    slug: 'leicester',
    name: 'Leicester',
    postcodes: ['LE'],
    heroSub: 'Your local East Midlands TM44 energy assessors. Fixed prices, fast turnaround.',
    marketContext: 'Leicester’s commercial footprint is growing. Ensure your property meets current energy regulations with our hassle-free TM44 inspection service.',
    faqs: [
      { q: 'Will the inspection disrupt my business?', a: 'No, our assessors work quietly and efficiently, causing minimal disruption to your daily operations.' }
    ]
  },
  cardiff: {
    slug: 'cardiff',
    name: 'Cardiff',
    postcodes: ['CF', 'NP'],
    heroSub: 'Accredited TM44 inspections for Wales’ capital. Fully compliant with Welsh Government regulations.',
    marketContext: 'We serve commercial landlords and property managers across South Wales, delivering TM44 reports that comply with all local and national energy directives.',
    faqs: [
      { q: 'Is the TM44 requirement the same in Wales as in England?', a: 'Yes, the Energy Performance of Buildings Regulations apply equally across England and Wales.' }
    ]
  },
  glasgow: {
    slug: 'glasgow',
    name: 'Glasgow',
    postcodes: ['G', 'PA', 'ML'],
    heroSub: 'Scotland’s trusted TM44 air conditioning assessors. Serving Glasgow and the central belt.',
    marketContext: 'In Scotland, Section 63 regulations and general energy compliance require strict adherence. Our TM44 inspections ensure your Scottish properties meet all statutory requirements.',
    faqs: [
      { q: 'Do you lodge on the Scottish EPC Register?', a: 'Yes, for Scottish properties, reports are lodged on the appropriate Scottish register in compliance with local law.' }
    ]
  },
  edinburgh: {
    slug: 'edinburgh',
    name: 'Edinburgh',
    postcodes: ['EH', 'KY'],
    heroSub: 'Expert TM44 assessments for Edinburgh’s unique commercial properties.',
    marketContext: 'Edinburgh’s blend of heritage properties and new developments requires expert assessment. We provide detailed TM44 reports that respect your building’s unique characteristics while ensuring compliance.',
    faqs: [
      { q: 'Do you inspect heritage and listed buildings?', a: 'Absolutely. We have extensive experience assessing air conditioning systems within listed and heritage properties in Edinburgh.' }
    ]
  }
}
