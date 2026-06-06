import HeroSection from '@/components/marketing/HeroSection'
import HowItWorks from '@/components/marketing/HowItWorks'
import WhoNeedsEPC from '@/components/marketing/WhoNeedsEPC'
import CorporateSections from '@/components/marketing/CorporateSections'
import AIToolsShowcase from '@/components/marketing/AIToolsShowcase'
import SocialProof from '@/components/marketing/SocialProof'
import PricingOverview from '@/components/marketing/PricingOverview'
import TrustSection from '@/components/marketing/TrustSection'
import AgentBand from '@/components/marketing/AgentBand'
import LandlordBand from '@/components/marketing/LandlordBand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avorria — EPC Assessments | Chesterfield & Derbyshire',
  description: 'Fast, transparent, fully accredited Energy Performance Certificates. Book online from £65. Certificate issued within 24 hours.',
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://avorria.co.uk/#website",
        "url": "https://avorria.co.uk",
        "name": "Avorria",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://avorria.co.uk/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://avorria.co.uk/#localbusiness",
        "name": "Avorria",
        "url": "https://avorria.co.uk",
        "logo": "https://avorria.co.uk/logo.png",
        "image": "https://avorria.co.uk/hero_commercial.png",
        "description": "Fast, transparent, fully accredited Energy Performance Certificates for commercial and domestic properties.",
        "telephone": "01246 000000",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Chesterfield",
          "addressRegion": "Derbyshire",
          "addressCountry": "UK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 53.2350,
          "longitude": -1.4215
        },
        "priceRange": "££",
        "sameAs": [
          "https://www.elmhurstenergy.co.uk"
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <HowItWorks />
      <WhoNeedsEPC />
      <CorporateSections />
      <AIToolsShowcase />
      <SocialProof />
      <PricingOverview />
      <TrustSection />
      <AgentBand />
      <LandlordBand />
    </>
  )
}

