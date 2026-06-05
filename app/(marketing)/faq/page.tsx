import React from 'react'
import type { Metadata } from 'next'
import styles from './faq.module.css'

export const metadata: Metadata = {
  title: 'FAQ | CertifyIQ EPC Assessments',
  description: 'Answers to common questions about Energy Performance Certificates, the booking process, how long EPCs last, and what to expect during an assessment.',
}

const FAQS = [
  { category: 'About EPCs', q: 'What is an Energy Performance Certificate?', a: 'An EPC is a document that rates the energy efficiency of a property on a scale from A (most efficient) to G (least efficient). It is a legal requirement to have one when selling or renting out a property.' },
  { category: 'About EPCs', q: 'How long does an EPC last?', a: 'An EPC is valid for 10 years from the date of issue. After 10 years, a new assessment is required.' },
  { category: 'About EPCs', q: 'When do I need an EPC?', a: 'You need a valid EPC when: (1) selling your home, (2) renting a property to new tenants, (3) constructing a new property, or (4) applying for certain government grants and incentives.' },
  { category: 'Landlord Rules', q: 'What is the minimum EPC rating for rental properties?', a: 'Currently, the minimum energy efficiency standard (MEES) for rental properties in England and Wales is Band E. From 2028, the government is proposing to raise this to Band C for new tenancies.' },
  { category: 'Landlord Rules', q: 'What happens if my rental property is below Band E?', a: 'It is currently unlawful to let a property in England and Wales with an EPC below E without a valid exemption. Penalties can reach £30,000.' },
  { category: 'Booking', q: 'How long does the assessment take?', a: 'A domestic assessment typically takes 30–60 minutes depending on the size and complexity of the property. Larger detached homes may take slightly longer.' },
  { category: 'Booking', q: 'What do I need to do to prepare for the assessment?', a: 'Ensure access to all rooms, the loft (if accessible), the boiler/heating system, and any outbuildings that form part of the habitable area. All windows should be accessible for inspection.' },
  { category: 'Booking', q: 'Can I book same-day?', a: 'We offer same-day assessments subject to assessor availability. Book early in the morning for the best chance of a same-day appointment. You can request this in the booking form.' },
  { category: 'Results', q: 'How quickly will I receive my certificate?', a: 'We aim to lodge your certificate with the national register and deliver it to your email address within 24 hours of the assessment visit. Same-day lodgement is often possible.' },
  { category: 'Results', q: 'Can I dispute or retake my EPC?', a: 'If you believe an error was made during the assessment, you can request a review or commission a fresh assessment. Keep in mind that improvements must be physically installed before they can be reflected in a new rating.' },
]

const categories = [...new Set(FAQS.map(f => f.category))]

export default function FAQPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Help Centre</span>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        <p className={styles.subtitle}>Everything you need to know about EPCs, the booking process, landlord compliance, and more.</p>
      </div>
      {categories.map(cat => (
        <div key={cat} className={styles.section}>
          <h2 className={styles.catTitle}>{cat}</h2>
          <div className={styles.faqList}>
            {FAQS.filter(f => f.category === cat).map(faq => (
              <details key={faq.q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{faq.q}</summary>
                <p className={styles.faqA}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
