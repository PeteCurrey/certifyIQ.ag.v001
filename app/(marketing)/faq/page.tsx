import type { Metadata } from 'next'
import FAQClient from './FAQClient'

export const metadata: Metadata = {
  title: 'Avorria — FAQ | EPC Assessments',
  description: 'Answers to every question about EPCs, landlord MEES compliance, new build SAP, air tightness testing, commercial EPCs and booking with Avorria.',
}

export default function FAQPage() {
  return <FAQClient />
}
