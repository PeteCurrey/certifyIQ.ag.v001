import type { Metadata } from 'next'
import ComplianceClient from './ComplianceClient'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://avorria.co.uk/landlord-compliance',
  },
  title: 'Landlord Compliance Checker | MEES & EPC Band C',
  description: 'Free AI-powered landlord compliance checker. Check if you can legally rent your property, assess MEES compliance, and prepare for future EPC Band C regulations.',
  openGraph: {
    url: 'https://avorria.co.uk/landlord-compliance',
    title: 'Landlord Compliance Checker',
    description: 'Assess MEES compliance and EPC Band C readiness instantly.',
  },
}

export default function LandlordCompliancePage() {
  return <ComplianceClient />
}
