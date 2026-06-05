import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RatingBadge from '@/components/ui/RatingBadge'
import styles from './location.module.css'

interface LocationPageProps {
  params: Promise<{ slug: string }>
}

// Dynamic Metadata Generation
export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: pageData } = await supabase
    .from('location_seo_pages')
    .select('page_title, town, county, postcode_prefix')
    .eq('slug', slug)
    .eq('is_live', true)
    .single()

  if (!pageData) {
    return {
      title: 'EPC Assessor | CertifyIQ',
      description: 'Accredited energy performance assessments.',
    }
  }

  return {
    title: `${pageData.page_title} | CertifyIQ`,
    description: `Accredited energy performance certificate (EPC) assessor in ${pageData.town}, ${pageData.county} (${pageData.postcode_prefix}). Assessments from £65. Fast 24-hour turnaround.`,
    keywords: [`EPC ${pageData.town}`, `Energy Assessor ${pageData.town}`, `EPC Certificate ${pageData.postcode_prefix}`],
  }
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch page data from Supabase
  const { data: pageData } = await supabase
    .from('location_seo_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_live', true)
    .single()

  if (!pageData) {
    notFound()
  }

  const { town, county, postcode_prefix, page_title, page_content } = pageData

  // Structured Data (JSON-LD) for LocalBusiness SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': `CertifyIQ ${town}`,
    'image': 'https://certifyiq.co.uk/logo.png',
    'telephone': '01246 000 000',
    'email': 'info@certifyiq.co.uk',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': town,
      'addressRegion': county,
      'addressCountry': 'GB',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '53.235', // Approximates for Chesterfield/Derbyshire area
      'longitude': '-1.428',
    },
    'url': `https://certifyiq.co.uk/locations/${slug}`,
    'priceRange': '£65-£110',
    'areaServed': [
      {
        '@type': 'AdministrativeArea',
        'name': town,
      },
      {
        '@type': 'AdministrativeArea',
        'name': postcode_prefix,
      }
    ],
  }

  return (
    <div className={styles.container}>
      {/* JSON-LD Schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.hero}>
        <span className={styles.eyebrow}>Local RdSAP 10 Energy Assessor</span>
        <h1 className={styles.title}>{page_title}</h1>
        <p className={styles.subtitle}>
          Fast, transparent, fully accredited Energy Performance Certificates for properties in {town} and surrounding {postcode_prefix} postcode areas.
        </p>
        <div className={styles.ctas}>
          <Link 
            href={`/book?postcode=${postcode_prefix}1AA`} 
            className={styles.ctaPrimary}
            id={`book-cta-${town.toLowerCase()}`}
          >
            Book your EPC in {town} →
          </Link>
          <Link href="/lookup" className={styles.ctaSecondary}>
            Check Existing EPC
          </Link>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <h2>Accredited Energy Assessments in {town}, {county}</h2>
          <p className={styles.paragraph}>
            Whether you are selling a house, letting a property to new tenants, or looking to access government retrofit grants (like the Boiler Upgrade Scheme), you need a valid Energy Performance Certificate (EPC).
          </p>
          <p className={styles.paragraph}>
            {page_content} Our local Chesterfield-based energy assessors are fully accredited, insured, and certified under the latest RdSAP 10 methodology. We inspect your building structure, wall insulation, heating systems, controls, and lighting to calculate your property&apos;s thermodynamic efficiency.
          </p>

          <div className={styles.featureBox}>
            <h3>Why Choose CertifyIQ in {town}?</h3>
            <ul className={styles.list}>
              <li><strong>Local Expertise:</strong> We cover all addresses in {postcode_prefix} and surrounding Derbyshire areas.</li>
              <li><strong>Fast Lodgement:</strong> Your certificate is uploaded to the national register within 24 hours of our visit.</li>
              <li><strong>Fair Pricing:</strong> Flat rates from £65 with no hidden administration or booking fees.</li>
              <li><strong>RdSAP 10 Compliant:</strong> Fully trained in the latest 2026 assessment standards.</li>
            </ul>
          </div>
        </div>

        <div className={styles.pricingCard}>
          <h3>Pricing in {town}</h3>
          <p className={styles.priceIntro}>Fixed rates based on property type. Includes assessor visit &amp; lodgement.</p>
          
          <div className={styles.pricingList}>
            <div className={styles.priceRow}>
              <span>Apartment / Flat</span>
              <strong>£65</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Terraced House</span>
              <strong>£70</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Semi-Detached</span>
              <strong>£80</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Detached House</span>
              <strong>£95</strong>
            </div>
          </div>

          <Link 
            href={`/book?postcode=${postcode_prefix}1AA`} 
            className={styles.bookButton}
          >
            Book EPC Assessment
          </Link>
          <span className={styles.pricingNotes}>* Floor areas over 200m² priced on inspection.</span>
        </div>
      </div>

      {/* Localized reviews band */}
      <div className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>Trusted by {town} Landlords &amp; Homeowners</h2>
        <div className={styles.reviewsGrid}>
          <div className={styles.reviewCard}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.reviewText}>&ldquo;Excellent service in {town}. The assessor arrived right on time, was very polite, and I got my certificate the very next morning.&rdquo;</p>
            <span className={styles.reviewer}>— Robert H., Homeowner</span>
          </div>
          <div className={styles.reviewCard}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.reviewText}>&ldquo;I have used CertifyIQ for three rental properties in the {postcode_prefix} area. Booking was easy, and the prices are the best in Derbyshire.&rdquo;</p>
            <span className={styles.reviewer}>— Sarah T., Landlord</span>
          </div>
        </div>
      </div>
    </div>
  )
}
