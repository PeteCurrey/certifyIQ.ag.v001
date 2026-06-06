import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avorria — Display Energy Certificates (DEC)',
  description: 'Fast, accredited Display Energy Certificates for public buildings. Avoid fines and comply with the latest regulations. Request a fixed quote online.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://avorria.co.uk/services/display-energy-certificate',
    siteName: 'Avorria',
  },
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Display Energy Certificate",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Avorria"
  },
  "areaServed": {
    "@type": "Country",
    "name": "UK"
  },
  "description": "Accredited Display Energy Certificates (DEC) and Advisory Reports for public buildings over 250m².",
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "priceCurrency": "GBP",
      "price": "195.00",
      "priceType": "StartingPrice"
    }
  }
}

export default function DecLayout({
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
