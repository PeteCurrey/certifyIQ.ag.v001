import type { Metadata } from 'next'
import ComplianceClient from './ComplianceClient'

export const metadata: Metadata = {
  title: 'Landlord Compliance Checker | MEES & EPC Band C | Avorria',
  description: 'Free AI-powered landlord compliance checker. Check if you can legally rent your property, assess MEES compliance, and prepare for future EPC Band C regulations.',
  openGraph: {
    title: 'Landlord Compliance Checker — Avorria',
    description: 'Assess MEES compliance and EPC Band C readiness instantly.',
  },
}

export default function LandlordCompliancePage() {
  return <ComplianceClient />
}
