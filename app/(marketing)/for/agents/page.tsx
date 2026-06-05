import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EPC Services for Estate & Letting Agents | Avorria',
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
        {["London","Birmingham","Manchester","Leeds","Sheffield","Liverpool","Newcastle","Nottingham","Bristol","Leicester","Brighton","Bournemouth","Cardiff","Edinburgh","Glasgow","Belfast","Derby","Chesterfield","Matlock","Bakewell","Buxton","Belper","Alfreton","Ripley","Heanor"].map(loc => (
          <Link key={loc} href={`/for/agents/${loc.toLowerCase()}`} style={{ color: '#8BA3BF', textDecoration: 'none', padding: '1rem', background: '#0F1628', borderRadius: '8px', border: '1px solid #1E2D4A' }}>
            EPCs for Agents in {loc} →
          </Link>
        ))}
      </div>
    </div>
  )
}