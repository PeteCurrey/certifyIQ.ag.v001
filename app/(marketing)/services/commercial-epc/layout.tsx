import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avorria — Commercial EPC Assessment | Level 3 & 4',
  description: 'Fast, accredited commercial EPC assessments to ensure your property meets the 2027 MEES deadline. Book online or request a fixed quote.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://avorria.co.uk/services/commercial-epc',
    siteName: 'Avorria',
  },
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Commercial Energy Performance Certificate",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Avorria"
  },
  "areaServed": {
    "@type": "Country",
    "name": "UK"
  },
  "description": "Accredited Level 3 and Level 4 Commercial EPC assessments (NDEA) for offices, retail, and industrial units.",
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "priceCurrency": "GBP",
      "price": "150.00",
      "priceType": "StartingPrice"
    }
  }
}

export default function CommercialEpcLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {children}
    </>
  )
}
