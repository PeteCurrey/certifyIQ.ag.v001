import type { Metadata } from 'next'
import GlossaryClient from './GlossaryClient'

export const metadata: Metadata = {
  title: 'Avorria — EPC Glossary | EPC Assessments',
  description: 'A complete glossary of EPC, SAP, SBEM, RdSAP, MEES and energy assessment terminology. Plain English definitions for property owners, landlords and developers.',
}

export default function GlossaryPage() {
  return <GlossaryClient />
}
