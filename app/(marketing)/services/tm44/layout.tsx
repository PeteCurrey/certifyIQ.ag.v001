import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avorria — TM44 Air Conditioning Inspections',
  description: 'Fast, accredited TM44 inspections to ensure compliance for AC systems over 12kW. Avoid the £800 fine. Book your assessment online.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://avorria.co.uk/services/tm44',
    siteName: 'Avorria',
  },
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "TM44 Air Conditioning Inspection",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Avorria"
  },
  "areaServed": {
    "@type": "Country",
    "name": "UK"
  },
  "description": "Accredited TM44 inspections for air conditioning systems with an effective combined output over 12kW.",
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "priceCurrency": "GBP",
      "price": "295.00",
      "priceType": "StartingPrice"
    }
  }
}

export default function TM44Layout({
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
