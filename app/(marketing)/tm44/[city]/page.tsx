import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tm44Cities } from '@/lib/tm44-cities'
import { ServiceSchema } from '@/components/seo/ServiceSchema'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import TM44CityForm from '@/components/marketing/TM44CityForm'
import styles from '@/app/(marketing)/services/services.module.css'
import { SITE_CONFIG } from '@/lib/site-config'

export async function generateMetadata(
  props: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const city = tm44Cities[params.city]
  if (!city) return {}

  const url = `https://avorria.co.uk/tm44/${city.slug}`

  return {
    title: `TM44 Air Conditioning Inspection ${city.name}`,
    description: `Accredited TM44 air conditioning inspections in ${city.name}. Fast turnaround, lodged on the Landmark Register. Fixed prices.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url: url,
    }
  }
}

export function generateStaticParams() {
  return Object.keys(tm44Cities).map((city) => ({
    city: city,
  }))
}

export default async function TM44CityPage(props: { params: Promise<{ city: string }> }) {
  const params = await props.params;
  const city = tm44Cities[params.city]
  if (!city) return notFound()

  const url = `/tm44/${city.slug}`

  return (
    <div className={styles.container} style={{ padding: 0, maxWidth: 'none' }}>
      <ServiceSchema 
        name={`TM44 Air Conditioning Inspection ${city.name}`}
        description={`Accredited TM44 air conditioning inspections in ${city.name}.`}
        url={url}
        areaServed={city.name}
      />
      
      {/* Hero Section */}
      <section 
        className={styles.heroFullScreen}
        style={{ backgroundImage: 'url(/hero_commercial.png)', backgroundColor: '#080D18' }}
      >
        <div className={styles.heroFullScreenInner}>
          <div style={{ marginBottom: '2rem' }}>
            <Breadcrumbs crumbs={[
              { name: 'Commercial', url: '/services/commercial-epc' },
              { name: 'TM44 Inspections', url: '/services/tm44' },
              { name: city.name, url: url }
            ]} />
          </div>
          
          <h1 className={styles.h1} style={{ color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.5)', maxWidth: '800px' }}>
            TM44 Air Conditioning Inspections {city.name}
          </h1>
          <p className={styles.sub} style={{ color: '#E8F4FF', fontSize: '1.25rem', textShadow: '0 2px 12px rgba(0,0,0,0.5)', maxWidth: '700px' }}>
            {city.heroSub}
          </p>
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#quote" className={styles.btnPrimary} style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
              Get a TM44 Quote
            </a>
            <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`} className={styles.btnGhost} style={{ fontSize: '1.1rem', padding: '16px 40px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              Call {SITE_CONFIG.phone}
            </a>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '40px', color: '#9BFF59', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>✓ CIBSE TM44 / ACEA accredited</span>
            <span>✓ Landmark Register lodgement</span>
            <span>✓ Local {city.name} assessors</span>
          </div>
        </div>
      </section>

      <div className={styles.inner}>
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '24px', margin: '40px 0' }}>
          <p style={{ color: '#FCD34D', margin: 0, fontSize: '1.05rem', lineHeight: 1.6 }}>
            <strong style={{ color: '#F59E0B' }}>Urgent Notice for {city.name} Businesses:</strong> Fines of up to £800 per system apply to non-compliant properties. If your building has been in use for over 5 years and has air conditioning {'>'}12kW, you are likely already overdue.
          </p>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '80px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Local Market Context</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px' }}>
              {city.marketContext}
            </p>
            <h3 style={{ fontSize: '1.25rem', marginTop: '32px', marginBottom: '16px' }}>Areas Covered</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              We cover all commercial properties across {city.name} including postcodes: {city.postcodes.join(', ')}.
            </p>
          </div>
          <div id="quote">
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Request a Fast Quote</h2>
            <TM44CityForm city={city.name} />
          </div>
        </section>

        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '32px', textAlign: 'center' }}>Frequently Asked Questions in {city.name}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
            {city.faqs.map((faq, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{faq.q}</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
