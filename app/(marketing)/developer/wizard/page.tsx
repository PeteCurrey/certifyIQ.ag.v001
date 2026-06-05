import type { Metadata } from 'next'
import WizardClient from './WizardClient'

export const metadata: Metadata = {
  title: 'Compliance Wizard | Avorria',
  description: 'Plan your development project compliance.',
}

export default function WizardPage() {
  return <WizardClient />
}
