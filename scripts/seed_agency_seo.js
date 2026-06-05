const fs = require('fs')
const path = require('path')

const LOCATIONS = [
  'London', 'Birmingham', 'Manchester', 'Leeds', 'Sheffield', 'Liverpool',
  'Newcastle', 'Nottingham', 'Bristol', 'Leicester', 'Brighton', 'Bournemouth',
  'Cardiff', 'Edinburgh', 'Glasgow', 'Belfast', 'Derby', 'Chesterfield',
  'Matlock', 'Bakewell', 'Buxton', 'Belper', 'Alfreton', 'Ripley', 'Heanor'
]

async function generateAgencySeoPages() {
  const dir = path.join(__dirname, '../app/(marketing)/for/agents')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  // Write base page
  fs.writeFileSync(path.join(dir, 'page.tsx'), `
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EPC Services for Estate & Letting Agents | CertifyIQ',
  description: 'Bulk EPC ordering, portfolio compliance tracking, and branded certificates for UK estate agents. Special rates available.',
}

export default function AgencyLandingPage() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto', padding: '100px 2rem 4rem' }}>
      <h1 style={{ fontSize: '3rem', fontFamily: 'Syne, sans-serif', color: '#E8F4FF', marginBottom: '1rem' }}>Smarter compliance for agencies</h1>
      <p style={{ fontSize: '1.2rem', color: '#8BA3BF', maxWidth: '600px', marginBottom: '2rem' }}>
        Manage your entire portfolio's EPCs from one dashboard. Bulk order, track expiry dates, and get white-labeled reports.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
        <Link href="/register?type=agency" style={{ background: '#9BFF59', color: '#080D18', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>Create Agency Account</Link>
        <Link href="/book" style={{ border: '1px solid #9BFF59', color: '#9BFF59', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>Order Single EPC</Link>
      </div>

      <h2 style={{ fontSize: '1.5rem', color: '#E8F4FF', marginBottom: '1.5rem' }}>Local Agency Services</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {${JSON.stringify(LOCATIONS)}.map(loc => (
          <Link key={loc} href={\`/for/agents/\${loc.toLowerCase()}\`} style={{ color: '#8BA3BF', textDecoration: 'none', padding: '1rem', background: '#0F1628', borderRadius: '8px', border: '1px solid #1E2D4A' }}>
            EPCs for Agents in {loc} →
          </Link>
        ))}
      </div>
    </div>
  )
}
  `.trim())

  // Create dynamic route
  const slugDir = path.join(dir, '[location]')
  if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true })

  fs.writeFileSync(path.join(slugDir, 'page.tsx'), `
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { location: string } }): Promise<Metadata> {
  const { location } = await params
  const locName = location.charAt(0).toUpperCase() + location.slice(1)
  return {
    title: \`EPC Services for Estate Agents in \${locName} | CertifyIQ\`,
    description: \`Fast, reliable EPCs and compliance services for estate and letting agents in \${locName}. Bulk discounts and dedicated portal.\`,
  }
}

export async function generateStaticParams() {
  const locations = ${JSON.stringify(LOCATIONS.map(l => l.toLowerCase()))}
  return locations.map(location => ({ location }))
}

export default async function AgencyLocationPage({ params }: { params: { location: string } }) {
  const { location } = await params
  const locName = location.charAt(0).toUpperCase() + location.slice(1)

  return (
    <div style={{ paddingTop: '100px', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto', padding: '100px 2rem 4rem' }}>
      <p style={{ color: '#9BFF59', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Local Partner Program</p>
      <h1 style={{ fontSize: '3rem', fontFamily: 'Syne, sans-serif', color: '#E8F4FF', marginBottom: '1rem' }}>Preferred EPC Partner for {locName} Agencies</h1>
      <p style={{ fontSize: '1.2rem', color: '#8BA3BF', maxWidth: '600px', marginBottom: '2rem' }}>
        We provide dedicated support, bulk discounts, and rapid turnaround times for estate agents and property managers operating in {locName}.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <Link href="/register?type=agency" style={{ background: '#9BFF59', color: '#080D18', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>Partner with us in {locName}</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '4rem' }}>
        <div style={{ background: '#0F1628', padding: '2rem', borderRadius: '12px', border: '1px solid #1E2D4A' }}>
          <h3 style={{ color: '#E8F4FF', marginBottom: '1rem' }}>Why {locName} agents choose us</h3>
          <ul style={{ color: '#8BA3BF', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
            <li>Local assessors covering all of {locName}</li>
            <li>24-hour SLA on standard EPCs</li>
            <li>Free portfolio compliance dashboard</li>
            <li>White-labeled reports with your agency logo</li>
            <li>MEES compliance guidance for landlords</li>
          </ul>
        </div>
        <div style={{ background: '#0F1628', padding: '2rem', borderRadius: '12px', border: '1px solid #1E2D4A' }}>
          <h3 style={{ color: '#E8F4FF', marginBottom: '1rem' }}>Ready to streamline your workflow?</h3>
          <p style={{ color: '#8BA3BF', marginBottom: '1.5rem' }}>Our agency portal lets you order, track, and download certificates without ever picking up the phone.</p>
          <Link href="/register?type=agency" style={{ color: '#9BFF59', textDecoration: 'none', fontWeight: 'bold' }}>Create your free portal account →</Link>
        </div>
      </div>
    </div>
  )
}
  `.trim())

  console.log('Agency SEO pages generated successfully.')
}

generateAgencySeoPages()
