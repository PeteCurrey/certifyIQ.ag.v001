import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { location: string } }): Promise<Metadata> {
  const { location } = await params
  const locName = location.charAt(0).toUpperCase() + location.slice(1)
  return {
    title: `EPC Services for Estate Agents in ${locName} | Avorria`,
    description: `Fast, reliable EPCs and compliance services for estate and letting agents in ${locName}. Bulk discounts and dedicated portal.`,
  }
}

export async function generateStaticParams() {
  const locations = ["london","birmingham","manchester","leeds","sheffield","liverpool","newcastle","nottingham","bristol","leicester","brighton","bournemouth","cardiff","edinburgh","glasgow","belfast","derby","chesterfield","matlock","bakewell","buxton","belper","alfreton","ripley","heanor"]
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