import React from 'react'

export interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  providerName?: string
  areaServed?: string
  serviceType?: string
}

export function ServiceSchema({ 
  name, 
  description, 
  url, 
  providerName = 'Avorria',
  areaServed = 'UK',
  serviceType = 'Energy Performance Certificate'
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": `https://avorria.co.uk${url}`,
    "provider": {
      "@type": "LocalBusiness",
      "name": providerName
    },
    "areaServed": {
      "@type": "Country",
      "name": areaServed
    },
    "serviceType": serviceType
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
