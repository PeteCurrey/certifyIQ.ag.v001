import type { Metadata } from 'next'
import LookupClient from './LookupClient'

export const metadata: Metadata = {
  title: 'Avorria — EPC Register Search Platform',
  description: 'Search the official UK Government EPC Register by postcode. Find current energy ratings, expiry dates, AI-driven insights, and improvement potential for any property.',
  openGraph: {
    title: 'EPC Register Search Platform — Avorria',
    description: 'Free EPC register search with actionable insights for England & Wales.',
  },
}

export default function EPCLookupPage() {
  return <LookupClient />
}
