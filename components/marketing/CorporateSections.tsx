import React from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function CorporateSections() {
  const cities = [
    { name: 'London', desc: 'City, Canary Wharf & all boroughs', href: '/commercial/london' },
    { name: 'Manchester', desc: 'City centre & Greater Manchester', href: '/commercial/manchester' },
    { name: 'Birmingham', desc: 'West Midlands & surrounding area', href: '/commercial/birmingham' },
    { name: 'Sheffield', desc: 'South Yorkshire & Barnsley', href: '/commercial/sheffield' },
    { name: 'Leeds', desc: 'West Yorkshire financial district', href: '/commercial/leeds' },
    { name: 'Nottingham', desc: 'East Midlands · Same-day available', href: '/commercial/nottingham' },
    { name: 'Derby', desc: 'In our primary zone · Fast turnaround', href: '/commercial/derby' }
  ]

  return (
    <>
      {/* SECTION A: Commercial city links */}
      <section style={{ background: '#f8f9fa', padding: '5rem 2rem', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ display: 'inline-block', color: '#0ea5e9', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Commercial coverage
            </span>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'Syne, sans-serif', color: '#0f172a', margin: '0 0 1rem', fontWeight: 700, lineHeight: 1.2 }}>
              Commercial EPC assessments across the UK
            </h2>
            <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
              National commercial coverage for offices, retail, industrial units and public buildings.
            </p>
          </div>

          {/* Grid Layout - Horizontal Scroll on Mobile, 7-col on Desktop */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.5rem',
            overflowX: 'auto'
          }}>
            {cities.map((city) => (
              <div key={city.name} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 0.5rem', fontWeight: 600 }}>{city.name}</h3>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.4, margin: '0 0 1.5rem' }}>{city.desc}</p>
                </div>
                <Link href={city.href} style={{ color: '#0ea5e9', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  View services →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION B: Enterprise / managing agents */}
      <section style={{ background: '#0A0E1A', padding: '6rem 2rem', borderTop: '1px solid #1E2D4A', borderBottom: '1px solid #1E2D4A', color: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Column (60%) */}
          <div style={{ flex: '1 1 600px' }}>
            <span style={{ display: 'inline-block', color: '#06B6D4', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Enterprise services
            </span>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'Syne, sans-serif', margin: '0 0 1.5rem', fontWeight: 700, lineHeight: 1.2, color: '#ffffff' }}>
              For property management firms and commercial landlords
            </h2>
            <p style={{ color: '#8BA3BF', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Managing a multi-city commercial portfolio? We provide dedicated compliance programmes for property management consultancies — including Commercial EPCs, TM44 air conditioning inspections, and DEC assessments across all UK locations.
            </p>

            {/* Feature List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
              {[
                'Dedicated account manager for portfolios of 20+ properties',
                'BACS, purchase order and credit account billing',
                'Portfolio-level compliance reporting and dashboards',
                'SLA-backed turnaround times',
                'National coverage via our accredited assessor network'
              ].map((feature) => (
                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4', width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0 }}>✓</span>
                  <span style={{ color: '#E8F4FF', fontSize: '1rem' }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <Link href="/for/enterprise" style={{ background: '#ffffff', color: '#080D18', padding: '0.875rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: 'background 0.2s' }}>
                Speak to our enterprise team
              </Link>
              <Link href="/for/enterprise#reporting" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', padding: '0.875rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: 'background 0.2s' }}>
                Request a portfolio audit
              </Link>
            </div>
          </div>

          {/* Right Column (40%) */}
          <div style={{ flex: '1 1 400px', background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: '16px', padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#E8F4FF', marginBottom: '1.5rem' }}>Trusted by property professionals</h3>
            
            {/* LOGO DISPLAY SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {/* TODO: Replace placeholder logo slots with actual client logos as enterprise relationships are confirmed. Do NOT add real firm logos without written permission. */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, background: '#131A2D', border: '1px solid #1E2D4A', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', color: '#8BA3BF', fontSize: '0.8rem', fontWeight: 500 }}>
                  [Property Management Firm]
                </div>
                <div style={{ flex: 1, background: '#131A2D', border: '1px solid #1E2D4A', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', color: '#8BA3BF', fontSize: '0.8rem', fontWeight: 500 }}>
                  [Property Management Firm]
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, background: '#131A2D', border: '1px solid #1E2D4A', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', color: '#8BA3BF', fontSize: '0.8rem', fontWeight: 500 }}>
                  [Commercial Surveyor]
                </div>
                <div style={{ flex: 1, background: '#131A2D', border: '1px solid #1E2D4A', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', color: '#8BA3BF', fontSize: '0.8rem', fontWeight: 500 }}>
                  [Commercial Surveyor]
                </div>
              </div>
              <div style={{ background: '#131A2D', border: '1px solid #1E2D4A', borderRadius: '8px', padding: '0.75rem', textAlign: 'center', color: '#8BA3BF', fontSize: '0.8rem', fontWeight: 500 }}>
                [Asset Management]
              </div>
            </div>

            <p style={{ color: '#8BA3BF', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
              Working with leading commercial property firms. Contact us to discuss your portfolio requirements.
            </p>
          </div>

        </div>
      </section>
    </>
  )
}
