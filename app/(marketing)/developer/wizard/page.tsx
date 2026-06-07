import type { Metadata } from 'next'
import WizardClient from './WizardClient'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://avorria.co.uk/developer/wizard',
  },
  openGraph: {
    url: 'https://avorria.co.uk/developer/wizard',
  },
  title: 'Compliance Wizard',
  description: 'Plan your development project compliance.',
}

export default function WizardPage() {
  return <WizardClient />
}
