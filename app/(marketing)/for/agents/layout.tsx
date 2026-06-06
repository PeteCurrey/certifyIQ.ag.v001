import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Avorria For Agents | Automated EPC Management',
  description: 'Zero-touch EPC management for modern estate agents. Connect your CRM and automate the entire EPC lifecycle from instruction to lodgement.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://avorria.co.uk/for/agents',
    siteName: 'Avorria',
  },
}

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
