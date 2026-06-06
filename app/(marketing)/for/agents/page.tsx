import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EPC Services & CRM Integration for Estate Agents | Avorria',
  description: 'Automate your EPC pipeline. Connect Alto, Street or Reapit and let Avorria automatically arrange EPCs for your new instructions.',
}

export default function AgencyLandingPage() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto', padding: '100px 2rem 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ background: 'rgba(155,255,89,0.1)', color: '#9BFF59', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>New Agent Portal Live</span>
      </div>
      <h1 style={{ fontSize: '3.5rem', fontFamily: 'Syne, sans-serif', color: '#E8F4FF', marginBottom: '1rem', lineHeight: 1.1 }}>
        Zero-touch EPCs for<br />modern estate agents
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#8BA3BF', maxWidth: '650px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        Connect your CRM. When a new property is instructed, we automatically check the EPC register, contact the vendor to arrange access, and manage the assessment. You don't lift a finger.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
        <Link href="/agent/login" style={{ background: '#9BFF59', color: '#080D18', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' }}>
          Go to Agent Portal →
        </Link>
        <Link href="/contact" style={{ border: '1px solid #1E2D4A', color: '#E8F4FF', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' }}>
          Talk to Sales
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#E8F4FF', fontSize: '1.25rem', marginBottom: '1rem' }}>Seamless CRM Sync</h3>
          <p style={{ color: '#8BA3BF', lineHeight: 1.6 }}>Integrates directly with Alto, Street.co.uk, and Reapit. We sync your new instructions every 15 minutes.</p>
        </div>
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#E8F4FF', fontSize: '1.25rem', marginBottom: '1rem' }}>Automated Vendor Outreach</h3>
          <p style={{ color: '#8BA3BF', lineHeight: 1.6 }}>We automatically email vendors to schedule the assessment or collect payment on your behalf.</p>
        </div>
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '2rem', borderRadius: '12px' }}>
          <h3 style={{ color: '#E8F4FF', fontSize: '1.25rem', marginBottom: '1rem' }}>Flexible Billing</h3>
          <p style={{ color: '#8BA3BF', lineHeight: 1.6 }}>Choose to pay on a single monthly invoice, or have the vendor pay directly via Stripe before the booking.</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', color: '#E8F4FF', marginBottom: '1.5rem' }}>Coverage Areas</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {["London","Birmingham","Manchester","Leeds","Sheffield","Liverpool","Newcastle","Nottingham","Bristol","Leicester","Brighton","Bournemouth","Cardiff","Edinburgh","Glasgow","Belfast","Derby","Chesterfield","Matlock","Bakewell","Buxton","Belper","Alfreton","Ripley","Heanor"].map(loc => (
          <Link key={loc} href={`/for/agents/${loc.toLowerCase()}`} style={{ color: '#8BA3BF', textDecoration: 'none', padding: '1rem', background: '#0F1628', borderRadius: '8px', border: '1px solid #1E2D4A', fontSize: '0.9rem' }}>
            EPCs for Agents in {loc} →
          </Link>
        ))}
      </div>
    </div>
  )
}