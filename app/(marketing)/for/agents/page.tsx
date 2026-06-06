'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Zap, Calendar, User, ArrowRight, CheckCircle2, Building, Plug, BarChart2, Bell, RefreshCw, Clock } from 'lucide-react'
import styles from './agents.module.css'

const STATS = [
  { value: '2,800+', label: 'EPCs managed' },
  { value: '48hr', label: 'Avg. turnaround' },
  { value: '£0', label: 'Admin cost to agents' },
]

const FEATURES = [
  { icon: Plug, title: 'CRM Integration', desc: 'Direct sync with Alto, Street.co.uk and Reapit. No manual data entry. New instructions detected automatically.' },
  { icon: RefreshCw, title: 'Automatic EPC check', desc: 'Every new property is cross-referenced with the national EPC register within minutes of instruction.' },
  { icon: User, title: 'Vendor outreach', desc: 'We contact your vendors and landlords directly — by email or SMS — so your team doesn\'t have to chase.' },
  { icon: Calendar, title: 'Monthly billing', desc: 'One invoice at the start of each month. All EPCs completed in the previous month, clearly itemised.' },
  { icon: BarChart2, title: 'Real-time dashboard', desc: 'See the status of every EPC across your portfolio — outstanding, in-progress, completed — in one screen.' },
  { icon: Bell, title: 'EPC expiry alerts', desc: 'We alert you 90 days before any managed property\'s EPC expires, so renewals are never missed.' },
]

const FAQS = [
  { q: 'What CRM systems do you integrate with?', a: 'We currently support Alto (Vebra), Street.co.uk and Reapit Foundations. Manual property entry and CSV import are also available. Further CRM integrations are in development.' },
  { q: 'What if a vendor doesn\'t respond to your contact?', a: 'We send two contact attempts within 72 hours. If there\'s no response, we notify you immediately so you can follow up directly with your client. You can also choose to switch the billing to your agency account to move the booking forward.' },
  { q: 'Can I mix billing methods across my portfolio?', a: 'Yes. You set a default preference for your account (agency pay or vendor pay), then override it on any individual property in your dashboard.' },
  { q: 'How long does the EPC assessment take?', a: 'Domestic assessments typically take 30-60 minutes on site. Certificates are issued within 24 hours.' },
  { q: 'What if a property already has a valid EPC?', a: 'We check the national register automatically. If a valid certificate exists, we notify you and log the expiry date. No job is created and nothing is charged.' },
  { q: 'Is there a minimum commitment?', a: 'No. There are no monthly fees or minimum volumes. You pay only for completed EPCs.' },
]

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      let start = 0
      const step = to / 50
      const timer = setInterval(() => {
        start += step
        if (start >= to) { setCount(to); clearInterval(timer) }
        else setCount(Math.floor(start))
      }, 30)
    }, { threshold: 0.4 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function AgencyLandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  return (
    <div className={styles.pageRoot}>

      {/* ── FULL-SCREEN HERO ── */}
      <section className={styles.heroSection}>
        <Image
          src="/agents-hero.png"
          alt="Modern estate agent street scene at golden hour"
          fill
          priority
          className={styles.heroBg}
          sizes="100vw"
        />
        {/* gradient overlay: dark at top (for nav), rich at bottom */}
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <Zap size={15} />
            <span>New Agent Portal — Live</span>
          </div>

          <h1 className={styles.heroTitle}>
            Zero-touch EPCs for<br />modern estate agents
          </h1>

          <p className={styles.heroSub}>
            Connect your CRM. When a new property is instructed we automatically
            check the EPC register, contact the vendor to arrange access, and
            manage the assessment end-to-end. Your team doesn't lift a finger.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/agent/login" className={styles.btnPrimary}>
              Go to Agent Portal <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className={styles.btnGhost}>
              Talk to Sales
            </Link>
          </div>

          {/* Trust badges */}
          <div className={styles.heroTrust}>
            {['Alto · Street · Reapit integrations', 'No monthly fees', 'First EPC free'].map(t => (
              <div key={t} className={styles.trustBadge}>
                <CheckCircle2 size={14} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ── STAT STRIP ── */}
      <div className={styles.statStrip}>
        {[
          { num: 2800, suffix: '+', label: 'EPCs managed' },
          { num: 48, suffix: 'hr', label: 'Avg. turnaround' },
          { num: 0, suffix: '', label: 'Admin cost to your team' },
        ].map(s => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statNum}>
              {s.label === 'Admin cost to your team' ? '£0' : <><Counter to={s.num} />{s.suffix}</>}
            </span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── PROBLEM WE SOLVE ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Your negotiators shouldn't be chasing EPCs</h2>
          <p className={styles.sectionSub}>Avorria automates the entire coordination loop from instruction to lodgement.</p>

          <div className={styles.twoColGrid}>
            {/* Old way */}
            <div className={styles.comparisonCard}>
              <h3 className={styles.cardHeading} style={{ color: '#EF4444' }}>The Old Way</h3>
              <div className={styles.timeline}>
                {['Property instructed', 'Negotiator remembers to book EPC (sometimes)', 'Call around assessors, wait for quote', 'Wait for confirmation', 'Chase vendor to arrange access', 'Wait for certificate', 'Download and upload to CRM', 'Hope it was done before listing goes live'].map((t, i) => (
                  <div key={i} className={styles.timelineItem}>
                    <span className={styles.dotRed} />
                    <span className={styles.timelineText}>❶❷❸❹❺❻❼❽[{i}]</span>
                    <span className={styles.timelineText}>{t}</span>
                  </div>
                ))}
              </div>
              <span className={styles.cardFooterLabel}>8 steps. Multiple touchpoints. Easily forgotten.</span>
            </div>

            {/* New way */}
            <div className={styles.comparisonCardActive}>
              <h3 className={styles.cardHeading} style={{ color: '#10B981' }}>The Avorria Way</h3>
              <div className={styles.timeline}>
                {['Property instructed in your CRM', 'Avorria detects it automatically', 'EPC register checked — no EPC found', 'Vendor contacted by us to arrange access', 'Assessment completed', 'Certificate issued and linked'].map((t, i) => (
                  <div key={i} className={styles.timelineItem}>
                    <span className={styles.dotGreen} />
                    <span className={styles.timelineText}>{t}</span>
                  </div>
                ))}
              </div>
              <span className={styles.cardFooterLabel} style={{ color: '#9BFF59' }}>Zero steps for your team. All handled.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Connect once. Works forever.</h2>
          <p className={styles.sectionSub}>A one-time 5-minute setup connects your CRM. From that point, every new instruction is handled automatically.</p>

          <div className={styles.stepGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>01</div>
              <h3 className={styles.stepTitle}>Connect your CRM</h3>
              <p className={styles.stepDesc}>Connect Alto, Street or Reapit to your Avorria account. One-time OAuth setup — takes 5 minutes. No IT team needed.</p>
              <div className={styles.logoRow}>
                <span className={styles.logoBadge}>Alto</span>
                <span className={styles.logoBadge}>Street</span>
                <span className={styles.logoBadge}>Reapit</span>
              </div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>02</div>
              <h3 className={styles.stepTitle}>We handle everything</h3>
              <p className={styles.stepDesc}>Every new instruction triggers an automatic EPC register check. If no valid EPC exists, we contact your vendor or landlord directly to arrange access.</p>
              <div className={styles.miniFlow}>
                <div className={`${styles.flowItem} ${styles.flowActive}`}>
                  <span>Instruction detected</span><span>✓</span>
                </div>
                <div className={styles.flowItem}>
                  <span>Register check</span><span>Pending</span>
                </div>
                <div className={styles.flowItem}>
                  <span>Contact vendor</span><span>–</span>
                </div>
              </div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>03</div>
              <h3 className={styles.stepTitle}>Certificate delivered, invoice monthly</h3>
              <p className={styles.stepDesc}>Your EPC certificate is delivered within 24 hours of assessment. All completed EPCs are invoiced to your agency on the 1st of each month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTAL MOCKUP ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Your entire EPC pipeline. One screen.</h2>
          <p className={styles.sectionSub}>The Avorria Agent Portal gives you real-time visibility of every property's EPC status across your portfolio.</p>

          <div className={styles.mockupContainer}>
            <div className={styles.mockupHeader}>
              <span className={styles.mockupTitle}>Avorria Agent Portal | Premier Homes | 47 properties</span>
            </div>
            <div className={styles.mockupStats}>
              {[['32', 'Valid EPCs'], ['8', 'In progress'], ['7', 'Action needed']].map(([v, l]) => (
                <div key={l} className={styles.mockupStatCard}>
                  <span className={styles.mockupStatVal}>{v}</span>
                  <span className={styles.mockupStatLabel}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.mockupTable}>
                <thead>
                  <tr><th>Address</th><th>Type</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  <tr className={styles.mockupRow}>
                    <td>14 Church Lane</td><td>Terraced · Sale</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Valid (exp 2034)</span></td>
                    <td style={{ color: '#8BA3BF' }}>None</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>7 Station Road</td><td>Semi · Let</td>
                    <td><span className={`${styles.badge} ${styles.badgeInfo}`}>Booked — 12 Jun</span></td>
                    <td style={{ color: '#8BA3BF' }}>View booking</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>The Old Vicarage</td><td>Detached · Sale</td>
                    <td><span className={`${styles.badge} ${styles.badgeDanger}`}>No EPC — vendor contacted</span></td>
                    <td style={{ color: '#9BFF59' }}>Resend email</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>22 Ashgate Road</td><td>Flat · Let</td>
                    <td><span className={`${styles.badge} ${styles.badgeWarning}`}>Expiring Sep 2026</span></td>
                    <td style={{ color: '#9BFF59' }}>Book renewal</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>Flat 3 Mill View</td><td>Flat · Let</td>
                    <td><span className={`${styles.badge} ${styles.badgeInfo}`}>Assessment today</span></td>
                    <td style={{ color: '#8BA3BF' }}>In progress</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.mockupFooter}>
              <span>This month: 12 EPCs completed</span>
              <strong style={{ color: '#E8F4FF' }}>£840 due 1 Jul</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Everything agents need. Nothing they don't.</h2>
          <p className={styles.sectionSub}>Designed and optimised specifically for high-volume residential workflows.</p>

          <div className={styles.featuresGrid}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>
                  <Icon size={22} />
                </div>
                <h4 className={styles.featureTitle}>{title}</h4>
                <p className={styles.featureDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BILLING ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Billing that works for how you work</h2>
          <p className={styles.sectionSub}>Set your preference once. Change it per property anytime.</p>

          <div className={styles.billingGrid}>
            <div className={styles.billingCardFeatured}>
              <span className={styles.promoBadge}>Recommended</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Calendar size={24} style={{ color: '#06B6D4' }} />
                <h3 className={styles.billingTitle}>Agency pays — monthly invoice</h3>
              </div>
              <p className={styles.billingPrice}>Single aggregated monthly statement</p>
              <ul className={styles.featureList}>
                {['One invoice per month', 'Direct debit available', 'No per-transaction payment needed', 'Monthly statement for accounts'].map(f => (
                  <li key={f} className={styles.featureItem}><span className={styles.tick}>✓</span> {f}</li>
                ))}
              </ul>
            </div>

            <div className={styles.billingCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <User size={24} style={{ color: '#8BA3BF' }} />
                <h3 className={styles.billingTitle}>Vendor/landlord pays — direct</h3>
              </div>
              <p className={styles.billingPrice}>Client payment link via Stripe</p>
              <ul className={styles.featureList}>
                {['No upfront cost to your agency', 'Vendor pays securely via Stripe', 'Automatic escalation if unpaid', 'You stay in control'].map(f => (
                  <li key={f} className={styles.featureItem}><span className={styles.tick}>✓</span> {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Trusted by property professionals</h2>
          <p className={styles.sectionSub}>Read how estate agents are simplifying their operations with our zero-touch model.</p>

          <div className={styles.testimonialGrid}>
            {[
              { quote: '"We\'ve completely eliminated EPC chasing from our process. Properties go live faster and our negotiators spend more time on what matters."', name: 'Sarah Jenkins', role: 'Agency Manager, Independent Estate Agent, Derbyshire' },
              { quote: '"The monthly invoice makes expenses simple. One line in our accounts — no individual receipts to track."', name: 'Mark Redman', role: 'Partner, Letting Agency, Sheffield' },
              { quote: '"Setup took 10 minutes. Within an hour we could see our entire portfolio\'s EPC status for the first time."', name: 'David Wright', role: 'Director, Sales & Lettings Agency, Derby' },
            ].map(({ quote, name, role }) => (
              <div key={name} className={styles.testimonialCard}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.quote}>{quote}</p>
                <span className={styles.authorName}>{name}</span>
                <span className={styles.authorRole}>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSub}>Everything you need to know about integrating and using our agency portal.</p>

          <div className={styles.faqAccordion}>
            {FAQS.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  aria-expanded={activeFaq === i}
                >
                  <span>{faq.q}</span>
                  <span className={styles.faqToggle}>{activeFaq === i ? '−' : '+'}</span>
                </button>
                {activeFaq === i && (
                  <div className={styles.faqAnswer}><p>{faq.a}</p></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className={styles.section} style={{ borderBottom: 'none' }}>
        <div className={styles.ctaBox}>
          <div className={styles.ctaGlow} />
          <h2 className={styles.ctaTitle}>Ready to eliminate EPC admin from your agency?</h2>
          <p className={styles.ctaSub}>Setup takes 5 minutes. First EPC is free.</p>
          <div className={styles.ctaButtons}>
            <Link href="/agent/onboarding" className={styles.ctaBtnPrimary}>
              Connect your CRM — get started
            </Link>
            <Link href="/contact?type=agent-demo" className={styles.ctaBtnSecondary}>
              Book a demo call
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}