import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import styles from './location.module.css'

type Props = {
  params: Promise<{ location: string }>
}

async function getPageData(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase
    .from('landlord_compliance_seo_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_live', true)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const page = await getPageData(resolvedParams.location)
  if (!page) return { title: 'Not Found' }

  return {
    title: page.page_title,
    description: page.meta_description,
    alternates: {
      canonical: `https://certifyiq.co.uk/landlord-compliance/${page.slug}`,
    },
    openGraph: {
      title: page.page_title,
      description: page.meta_description,
      url: `https://certifyiq.co.uk/landlord-compliance/${page.slug}`,
    },
  }
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('landlord_compliance_seo_pages')
    .select('slug')
    .eq('is_live', true)

  return (data || []).map((p: { slug: string }) => ({ location: p.slug }))
}

export const revalidate = 86400

export default async function LandlordComplianceLocationPage({ params }: Props) {
  const resolvedParams = await params
  const page = await getPageData(resolvedParams.location)

  if (!page) notFound()

  const stats = [
    { label: 'MEES Minimum Band', value: 'E', note: 'Current legal minimum' },
    { label: 'Proposed Band C Target', value: '2028', note: 'Government consultation' },
    { label: 'Fine for Non-Compliance', value: '£30k', note: 'Per property maximum' },
    { label: 'EPC Validity', value: '10 yrs', note: 'Must be in date' },
  ]

  const faqs = [
    {
      q: `What EPC rating do landlords in ${page.town} need?`,
      a: `Under current MEES regulations, all privately rented properties in ${page.town} must have a minimum EPC rating of Band E. Properties rated F or G are illegal to let. The Government has proposed raising this to Band C by 2028.`,
    },
    {
      q: `How much is the fine for renting a non-compliant property in ${page.county}?`,
      a: `Local authorities in ${page.county} can issue fines of up to £30,000 per property for landlords who rent a property without a valid, compliant EPC. The fine for not having any EPC is up to £5,000.`,
    },
    {
      q: `How do I check if my ${page.town} rental property is EPC compliant?`,
      a: `Use our free Landlord Compliance Checker above. Enter your postcode, select your property, and receive an instant compliance report showing your current EPC rating, MEES status, Band C gap, and a personalised improvement roadmap.`,
    },
    {
      q: `Can Avorria carry out an EPC in ${page.town}?`,
      a: `Yes. Avorria's Elmhurst-accredited energy assessors cover all of ${page.county} including ${page.town} (${page.postcode_prefix}). We deliver certified EPC reports within 24 hours of inspection. Book online for same-week availability.`,
    },
    {
      q: `What happens if my ${page.town} property is Band F or G?`,
      a: `A Band F or G property in ${page.town} is currently illegal to let without a valid exemption registered on the PRS Exemptions Register. You must not grant a new tenancy and must carry out improvement works to reach at least Band E before the property can be legally rented.`,
    },
  ]

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.breadcrumb}>
            <Link href="/landlord-compliance">Landlord Compliance Checker</Link>
            <span>›</span>
            <span>{page.town}</span>
          </div>
          <div className={styles.eyebrow}>
            <span className={styles.pill}>Free Tool</span>
            <span className={styles.pill}>{page.county}</span>
            <span className={styles.pill}>Elmhurst Accredited</span>
          </div>
          <h1 className={styles.title}>
            Landlord Compliance Checker<br />
            <span className={styles.titleHighlight}>{page.town}, {page.county}</span>
          </h1>
          <p className={styles.subtitle}>
            Instantly check if your {page.town} rental property meets MEES regulations.
            Get a full compliance report including EPC rating, MEES status, Band C gap analysis,
            and an AI-powered improvement roadmap — completely free.
          </p>
          <Link href="/landlord-compliance#checker" className={styles.ctaBtn}>
            Check My Property Now →
          </Link>
        </div>
      </section>

      {/* Stats Strip */}
      <section className={styles.statsStrip}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statBox}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statNote}>{s.note}</div>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <section className={styles.contentSection}>
        <div className={styles.contentGrid}>
          <div className={styles.contentMain}>
            <h2 className={styles.sectionTitle}>
              MEES Compliance for {page.town} Landlords
            </h2>
            <p className={styles.bodyText}>{page.page_content}</p>

            <div className={styles.alertBox}>
              <div className={styles.alertIcon}>⚠️</div>
              <div>
                <strong>Important:</strong> Landlords who continue to let a property with an EPC rating below
                Band E in {page.town} face fines of up to <strong>£30,000 per property</strong> from {page.county} Council.
                Check your compliance status now using our free tool.
              </div>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: '3rem' }}>
              What Our Compliance Checker Covers
            </h2>
            <div className={styles.featureGrid}>
              {[
                { icon: '🏠', title: 'Current EPC Rating', desc: 'Pulled directly from the official Government EPC Register.' },
                { icon: '⚖️', title: 'MEES Legal Status', desc: 'Instant check — compliant, at risk, or illegal to rent.' },
                { icon: '📈', title: 'Band C Gap Analysis', desc: 'How many bands to the proposed 2028 legislative standard.' },
                { icon: '🤖', title: 'AI Improvement Planner', desc: 'Personalised roadmap to the most cost-effective upgrades.' },
                { icon: '📋', title: 'Full Compliance Report', desc: 'PDF-ready report you can save and share with your agent.' },
                { icon: '📍', title: 'Portfolio Tracking', desc: 'Save multiple {page.town} properties to your Avorria portfolio.' },
              ].map((f, i) => (
                <div key={i} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <strong className={styles.featureTitle}>{f.title}</strong>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle}>Need an EPC in {page.town}?</h3>
              <p className={styles.sideCardText}>
                Avorria's Elmhurst-accredited assessors cover {page.town} ({page.postcode_prefix}) and all of {page.county}.
                Same-week availability. Certificate delivered within 24 hours.
              </p>
              <Link href="/book" className={styles.sideCtaBtn}>
                Book an EPC from £65
              </Link>
              <Link href="/landlord-compliance" className={styles.sideLinkBtn}>
                Free Compliance Check
              </Link>
            </div>

            <div className={styles.sideCard} style={{ marginTop: '1.5rem' }}>
              <h3 className={styles.sideCardTitle}>Legislation Timeline</h3>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot} style={{ background: '#FF5C5C' }}></div>
                  <div>
                    <strong>Now (2024)</strong>
                    <p>Minimum Band E — F/G illegal</p>
                  </div>
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot} style={{ background: '#F5A623' }}></div>
                  <div>
                    <strong>2026–2027</strong>
                    <p>Band C proposals confirmed</p>
                  </div>
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot} style={{ background: 'var(--accent-lime)' }}></div>
                  <div>
                    <strong>2028</strong>
                    <p>Proposed: Band C minimum</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.faqInner}>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Landlord Compliance FAQs — {page.town}
          </h2>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{faq.q}</h3>
                <p className={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <h2>Ready to check your {page.town} properties?</h2>
        <p>Join hundreds of {page.county} landlords using Avorria to stay compliant and plan ahead.</p>
        <div className={styles.ctaRow}>
          <Link href="/landlord-compliance#checker" className={styles.ctaBtn}>
            Free Compliance Check →
          </Link>
          <Link href="/book" className={styles.ctaBtnSecondary}>
            Book an EPC Assessment
          </Link>
        </div>
      </section>
    </div>
  )
}
