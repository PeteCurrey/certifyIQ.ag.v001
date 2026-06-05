import type { Metadata } from 'next'
import LookupClient from './LookupClient'

export const metadata: Metadata = {
  title: 'Avorria — EPC Lookup | EPC Assessments',
  description: 'Search the official UK Government EPC Register by postcode. Find current energy ratings, expiry dates, and improvement potential for any property in England and Wales.',
  openGraph: {
    title: 'EPC Lookup — Avorria',
    description: 'Free EPC register search for England & Wales.',
  },
}

export default function EPCLookupPage() {
  return <LookupClient />
}
