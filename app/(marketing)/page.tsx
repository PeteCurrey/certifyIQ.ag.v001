import HeroSection from '@/components/marketing/HeroSection'
import HowItWorks from '@/components/marketing/HowItWorks'
import WhoNeedsEPC from '@/components/marketing/WhoNeedsEPC'
import AIToolsShowcase from '@/components/marketing/AIToolsShowcase'
import SocialProof from '@/components/marketing/SocialProof'
import PricingOverview from '@/components/marketing/PricingOverview'
import TrustSection from '@/components/marketing/TrustSection'
import LandlordBand from '@/components/marketing/LandlordBand'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avorria — UK EPC Assessments | Chesterfield & Derbyshire',
  description: 'Fast, transparent, fully accredited Energy Performance Certificates. Book online from £65. Certificate issued within 24 hours.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <WhoNeedsEPC />
      <AIToolsShowcase />
      <SocialProof />
      <PricingOverview />
      <TrustSection />
      <LandlordBand />
    </>
  )
}
