'use client'
import React, { useState } from 'react'
import styles from '../commercial-city.module.css'

interface CityFaqAccordionProps {
  city: string
}

export default function CityFaqAccordion({ city }: CityFaqAccordionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const getFaqs = () => {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1)
    if (city === 'london') {
      return [
        {
          q: "Do you cover all London boroughs?",
          a: "Yes — we cover all 32 London boroughs plus the City of London."
        },
        {
          q: "How long does a commercial EPC take in London?",
          a: "Level 3 (up to 500m²): typically a 2-hour site visit. Certificates issued within 5 working days."
        },
        {
          q: "Do you account for congestion charges and ULEZ in your pricing?",
          a: "Yes — London assessments include a travel supplement to cover central London access costs. This is confirmed in your quote."
        }
      ]
    } else if (city === 'manchester') {
      return [
        {
          q: `Do you cover Salford and MediaCity as well as ${cityName} city centre?`,
          a: `Yes, we provide full coverage across Salford, MediaCity, Trafford Park, and all surrounding areas of Greater ${cityName}.`
        },
        {
          q: `How quickly can you turn around a commercial EPC in ${cityName}?`,
          a: "Standard turnaround is 5 working days from the site visit, but we can offer expedited 48-hour service on request."
        },
        {
          q: `We manage a portfolio of offices in Greater ${cityName} — do you offer volume pricing?`,
          a: "Yes, we offer discounted rates for landlords and managing agents who book multiple commercial assessments or register their portfolios."
        }
      ]
    } else {
      return [
        {
          q: `How long does a commercial EPC take in ${cityName}?`,
          a: `A typical on-site assessment for a Level 3 property (up to 500m²) in ${cityName} takes around 1.5 to 3 hours depending on complexity. Final lodge to the register is completed within 5 working days.`
        },
        {
          q: `Do you cover all commercial districts in and around ${cityName}?`,
          a: `Yes. We provide complete coverage for ${cityName} city centre as well as all business parks, commercial estates, and surrounding industrial hubs in the region.`
        },
        {
          q: `What is the difference between NDEA Level 3 and Level 4 in ${cityName}?`,
          a: "Level 3 covers simple buildings with common heating systems. Level 4 is for complex buildings with central cooling/air conditioning, dynamic ventilation, or complex solar control. We have assessors qualified up to Level 4 NDEA to handle all asset profiles."
        }
      ]
    }
  }

  const faqs = getFaqs()

  return (
    <div className={styles.faqAccordion}>
      {faqs.map((faq, index) => (
        <div key={index} className={styles.faqItem}>
          <button
            className={styles.faqQuestion}
            onClick={() => toggleFaq(index)}
            aria-expanded={activeFaq === index}
          >
            <span>{faq.q}</span>
            <span>{activeFaq === index ? '−' : '+'}</span>
          </button>
          {activeFaq === index && (
            <div className={styles.faqAnswer}>
              <p>{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
