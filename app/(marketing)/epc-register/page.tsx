import type { Metadata } from 'next'
import LookupClient from './LookupClient'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://avorria.co.uk/epc-register',
  },
  title: 'EPC Register Search',
  description: 'Search the official UK Government EPC Register by postcode. Find current energy ratings, expiry dates, and improvement recommendations for any property in England & Wales.',
  openGraph: {
    url: 'https://avorria.co.uk/epc-register',
    title: 'EPC Register Search | Avorria',
    description: 'Free EPC register search with actionable insights for England & Wales.',
  },
}

export default function EPCLookupPage({
  searchParams,
}: {
  searchParams: { postcode?: string }
}) {
  return <LookupClient defaultPostcode={searchParams.postcode || ''} />
}
