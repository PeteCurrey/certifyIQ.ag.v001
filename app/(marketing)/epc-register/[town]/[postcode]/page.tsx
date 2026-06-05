import type { Metadata } from 'next'
import LookupClient from '../../LookupClient'

export async function generateMetadata({ params }: { params: Promise<{ town: string, postcode: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const town = resolvedParams.town.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const rawPostcode = resolvedParams.postcode.replace(/-/g, ' ').toUpperCase()
  
  return {
    title: `EPC Register ${town} (${rawPostcode}) | Avorria`,
    description: `Check the EPC Register for properties in ${rawPostcode}, ${town}. Find energy ratings, improvement recommendations, and compliance checks instantly.`,
    openGraph: {
      title: `EPC Register ${town} (${rawPostcode}) | Avorria`,
      description: `Free EPC register search with actionable insights for ${town}.`,
    },
  }
}

export default async function EPCLocationPage({ params }: { params: Promise<{ town: string, postcode: string }> }) {
  const resolvedParams = await params;
  const town = resolvedParams.town.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const rawPostcode = resolvedParams.postcode.replace(/-/g, ' ').toUpperCase()

  return (
    <>
      <div style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '1rem', background: '#080D18' }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>
          EPC Register Search: <span style={{ color: 'var(--accent-lime)' }}>{town}</span>
        </h1>
        <p style={{ color: '#8BA3BF' }}>
          Check energy performance certificates for properties in {rawPostcode} and surrounding areas in {town}.
        </p>
      </div>
      <LookupClient defaultPostcode={rawPostcode} />
    </>
  )
}
