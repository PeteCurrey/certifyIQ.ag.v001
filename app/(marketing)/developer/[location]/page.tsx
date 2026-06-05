import React from 'react'
import { notFound } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import styles from './location.module.css'

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }) {
  const resolvedParams = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data } = await supabase
    .from('developer_seo_pages')
    .select('*')
    .eq('slug', resolvedParams.location)
    .eq('is_live', true)
    .single()

  if (!data) return {}

  return {
    title: data.page_title,
    description: data.meta_description,
    openGraph: {
      title: data.page_title,
      description: data.meta_description,
    }
  }
}

export default async function DeveloperLocationPage({ params }: { params: Promise<{ location: string }> }) {
  const resolvedParams = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: page, error } = await supabase
    .from('developer_seo_pages')
    .select('*')
    .eq('slug', resolvedParams.location)
    .eq('is_live', true)
    .single()

  if (error || !page) notFound()

  // Format service name for display
  const serviceNameMap: Record<string, string> = {
    'sap-calculations': 'SAP Calculations',
    'part-l-compliance': 'Part L Compliance',
    'air-tightness-testing': 'Air Tightness Testing',
    'water-calculations': 'Water Efficiency Calculations',
    'overheating-assessments': 'Overheating Assessments (Part O)',
    'bruk-reports': 'BRUKL Reports',
    'commercial-epc': 'Commercial EPCs',
    'new-build-epc': 'On Construction EPCs'
  }
  const displayService = serviceNameMap[page.service_type] || 'Compliance Services'

  // Structured Data (Schema.org) for Local Business / Service
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${displayService} in ${page.town}`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Avorria",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": page.town,
        "addressRegion": page.county,
        "addressCountry": "UK"
      }
    },
    "description": page.meta_description,
    "areaServed": {
      "@type": "City",
      "name": page.town
    }
  }

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Location Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Avorria Developer Services • {page.town}</span>
          <h1 className={styles.title}>{page.page_title}</h1>
          <p className={styles.subtitle}>{page.meta_description}</p>
          
          <div className={styles.heroActions}>
            <Link href={`/developer/wizard?postcode=${page.postcode_prefix}&service=${page.service_type}`} className={styles.primaryCta}>
              Start Compliance Wizard
            </Link>
            <Link href="/book" className={styles.secondaryCta}>
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className={styles.contentSection}>
        <div className={styles.contentGrid}>
          
          <div className={styles.mainContent}>
            <div 
              className={styles.prose} 
              dangerouslySetInnerHTML={{ __html: page.page_content }} 
            />

            <div className={styles.wizardPromo}>
              <h3>Not sure exactly what you need?</h3>
              <p>Our free Developer Compliance Wizard will analyse your project details and generate a complete roadmap of required reports, tests, and estimated costs in 60 seconds.</p>
              <Link href="/developer/wizard" className={styles.promoBtn}>
                Try the Wizard Now →
              </Link>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.trustCard}>
              <h3>Why choose Avorria for {displayService}?</h3>
              <ul className={styles.trustList}>
                <li>✅ Fully accredited assessors</li>
                <li>✅ Fast turnaround times</li>
                <li>✅ Transparent fixed pricing</li>
                <li>✅ Dedicated project manager</li>
                <li>✅ Coverage across {page.town} and {page.county}</li>
              </ul>
            </div>

            <div className={styles.contactCard}>
              <h3>Discuss your project</h3>
              <p>Need urgent assistance with a site in {page.town}?</p>
              <a href="tel:0800000000" className={styles.phoneLink}>Call 0800 000 0000</a>
              <Link href="/book" className={styles.emailBtn}>Book Consultation</Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
