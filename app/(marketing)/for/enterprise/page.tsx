import React from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Check, Shield, BarChart3, Clock, ArrowRight, Building2, FileText, AlertTriangle } from 'lucide-react'
import styles from './enterprise.module.css'
import EnterpriseForm from './EnterpriseForm'

export const metadata: Metadata = {
  title: 'Avorria Enterprise | EPC & Compliance for Property Management Firms',
  description: 'Portfolio-level commercial EPC, TM44 and MEES compliance for property management consultancies. Dedicated account management, bulk pricing, and portfolio reporting.',
}

export default function EnterprisePage() {
  const targetDate = new Date('2027-04-01')
  const now = new Date()
  const monthsRemaining = Math.max(0, (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth()))

  const services = [
    { icon: Building2, title: 'Commercial EPC (Level 3 & 4)', desc: 'Non-Domestic Energy Performance Certificates for offices, retail, industrial and mixed-use. SBEM calculated, lodged to the national register. BRUKL reports included.' },
    { icon: Clock, title: 'TM44 Air Conditioning', desc: 'Mandatory 5-yearly assessment for all AC systems over 12kW. CIBSE TM44 standard. Lodged to the Landmark Register. Portfolio scheduling available.' },
    { icon: FileText, title: 'Display Energy Certificates (DEC)', desc: 'Annual DECs and Advisory Reports for public buildings over 250m². Schools, local authority buildings, NHS premises, leisure centres.' },
    { icon: AlertTriangle, title: 'MEES Compliance Review', desc: 'Cross-reference your entire portfolio against the EPC register. Identify at-risk properties, expiring certificates, and properties below MEES thresholds.' },
    { icon: BarChart3, title: 'On-Construction EPCs & SAP', desc: 'For developers and investors with construction activity. Design-stage SAP, air tightness testing, and OC-EPC lodgement.' },
    { icon: Shield, title: 'Portfolio Audit & Reporting', desc: 'Structured compliance reports across your portfolio, flagging upcoming renewals and Band upgrade requirements with prioritised action lists.' },
  ]

  return (
    <div className={styles.pageRoot}>

      {/* ── FULL-SCREEN HERO ── */}
      <section className={styles.heroSection}>
        <Image
          src="/enterprise-hero.png"
          alt="Aerial view of London city at dusk"
          fill
          priority
          className={styles.heroBg}
          sizes="100vw"
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Enterprise energy compliance</span>

          <h1 className={styles.heroTitle}>
            Commercial property<br />compliance at scale.
          </h1>

          <p className={styles.heroSub}>
            For property management consultancies and commercial landlords managing
            multi-city portfolios. Dedicated account management, SLA-backed turnaround,
            and portfolio-level compliance reporting — across all UK locations.
          </p>

          <div className={styles.heroCtas}>
            <a href="#enquire" className={styles.btnPrimary}>
              Speak to our enterprise team <ArrowRight size={16} />
            </a>
            <a href="#reporting" className={styles.btnGhost}>
              Request a portfolio audit
            </a>
          </div>

          {/* accreditation trust row */}
          <div className={styles.trustRow}>
            {[
              'NDEA Level 3 & 4 accredited',
              'CIBSE TM44 (ACEA) accredited',
              'National coverage network',
              'BACS & Credit billing',
            ].map(t => (
              <div key={t} className={styles.trustItem}>
                <Check size={13} style={{ color: '#06B6D4', flexShrink: 0 }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <div className={styles.scrollDot} />
        </div>
      </section>

      {/* ── URGENCY BANNER ── */}
      <div className={styles.urgencyBar}>
        <AlertTriangle size={16} />
        <span>
          <strong>{monthsRemaining} months</strong> until the April 2027 Band C MEES deadline.
          Penalties up to <strong>£50,000 per property</strong>.
        </span>
        <a href="#enquire" className={styles.urgencyLink}>Start your portfolio audit →</a>
      </div>

      {/* ── SERVICES GRID ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Every compliance obligation. One relationship.</h2>
          <p className={styles.sectionSub}>We manage all aspects of commercial energy assessments, calculations and statutory submissions.</p>

          <div className={styles.servicesGrid}>
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className={styles.serviceCard}>
                <div className={styles.serviceIconWrap}>
                  <Icon size={22} />
                </div>
                <h3 className={styles.serviceTitle}>{title}</h3>
                <p className={styles.serviceDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEES TIMELINE ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>MEES deadlines are creating portfolio-wide urgency</h2>
          <p className={styles.sectionSub}>Ensure your assets stay rentable. Penalties for letting non-compliant spaces are substantial.</p>

          <div className={styles.timelineGrid}>
            <div className={styles.timelineCard}>
              <span className={styles.timelineDate}>April 2025</span>
              <p className={styles.timelineDesc}>All commercial rented properties must hold a valid EPC</p>
              <span className={styles.timelinePenalty}>Enforced sitewide</span>
            </div>
            <div className={styles.timelineCard} style={{ border: '1px solid rgba(239,68,68,0.35)', boxShadow: '0 0 30px rgba(239,68,68,0.06)' }}>
              <span className={styles.timelineDateRed}>April 2027</span>
              <p className={styles.timelineDesc}>Band C required for all non-domestic rented property</p>
              <span className={styles.timelinePenaltyRed}>Fine: up to £50,000 per property</span>
            </div>
            <div className={styles.timelineCard}>
              <span className={styles.timelineDate}>April 2030</span>
              <p className={styles.timelineDesc}>Band B required for all non-domestic rented property</p>
              <span className={styles.timelinePenalty}>Fine: up to £50,000 per property</span>
            </div>
          </div>

          <div className={styles.statCallout}>
            <div className={styles.calloutItem}>
              <span className={styles.calloutStat}>£50,000</span>
              <span className={styles.calloutLabel}>Maximum fine per non-compliant property</span>
            </div>
            <div className={styles.calloutDivider} />
            <div className={styles.calloutItem}>
              <span className={styles.calloutStat} style={{ color: '#06B6D4' }}>{monthsRemaining} Months</span>
              <span className={styles.calloutLabel}>Remaining until April 2027 compliance deadline</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO DASHBOARD MOCKUP ── */}
      <section className={styles.section} id="reporting">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Complete visibility across your client portfolios</h2>
          <p className={styles.sectionSub}>Our enterprise clients receive a dedicated compliance dashboard showing every property's EPC status, TM44 status, and upcoming deadlines.</p>

          <div className={styles.mockupContainer}>
            <div className={styles.mockupHeader}>
              <span className={styles.mockupTitle}>Portfolio Dashboard — [Firm Name] | 847 properties</span>
              <span className={styles.mockupLive}><span className={styles.liveDot} />Live</span>
            </div>
            <div className={styles.mockupStats}>
              {[['623', 'EPC Compliant', ''], ['47', 'TM44 Due', ''], ['82', 'MEES At Risk', '#FBBF24'], ['134', 'Expiring < 12m', '']].map(([v, l, c]) => (
                <div key={l} className={styles.mockupStatCard}>
                  <span className={styles.mockupStatVal} style={c ? { color: c } : {}}>{v}</span>
                  <span className={styles.mockupStatLabel}>{l}</span>
                </div>
              ))}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.mockupTable}>
                <thead>
                  <tr><th>Property Name</th><th>Area</th><th>EPC Rating</th><th>TM44 A/C Status</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Office Building, Canary Wharf</td><td>2,400m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Band B</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeWarning}`}>Due Jul 2026</span></td>
                  </tr>
                  <tr>
                    <td>Retail Unit, Leeds</td><td>340m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeWarning}`}>Band D</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Current</span></td>
                  </tr>
                  <tr>
                    <td>Industrial Unit, Birmingham</td><td>1,200m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Band C</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Current</span></td>
                  </tr>
                  <tr>
                    <td>Office Suite, Manchester</td><td>890m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeDanger}`}>Band E</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeDanger}`}>Overdue</span></td>
                  </tr>
                  <tr>
                    <td>Mixed Use, Sheffield</td><td>560m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Band C</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Current</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.mockupActions}>
              <button className={styles.mockupBtn}>Export to CSV</button>
              <button className={styles.mockupBtn} style={{ background: '#06B6D4', color: '#ffffff', borderColor: '#06B6D4' }}>Download compliance report</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMERCIAL TERMS ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Commercial terms built for commercial clients</h2>
          <p className={styles.sectionSub}>Bespoke workflows designed to slot perfectly into corporate purchasing systems.</p>

          <div className={styles.threeColGrid}>
            {[
              { heading: 'Billing', text: 'BACS bank transfer, purchase order, and credit account billing available. Monthly or quarterly invoicing to your accounts team. VAT invoices as standard.' },
              { heading: 'SLAs', text: 'Agreed turnaround times by property type. Standard: 5 working days from site visit. Priority: 48 hours. Emergency same-day available for urgent transactions.' },
              { heading: 'Account management', text: 'A dedicated account manager for portfolios of 20+ properties. Single point of contact for all bookings, queries and reporting.' },
            ].map(({ heading, text }) => (
              <div key={heading} className={styles.termsCard}>
                <h3 className={styles.termsHeading}>{heading}</h3>
                <p className={styles.termsText}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NATIONAL COVERAGE ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>One contract. Every UK location.</h2>
          <p className={styles.sectionSub}>Our accredited partner network covers all major UK cities, with direct delivery in the East Midlands.</p>

          <div className={styles.cityGrid}>
            {['London', 'Manchester', 'Birmingham', 'Leeds', 'Sheffield', 'Nottingham', 'Derby', 'Bristol', 'Edinburgh', 'Glasgow'].map(c => (
              <div key={c} className={styles.cityCard}>{c}</div>
            ))}
          </div>
          <p className={styles.coverageNote}>Coverage expanding. Contact us for specific locations.</p>
        </div>
      </section>

      {/* ── ENQUIRY FORM ── */}
      <section className={styles.section} id="enquire" style={{ borderBottom: 'none' }}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Tell us about your portfolio</h2>
          <p className={styles.sectionSub}>Provide details below and an Enterprise Account Executive will compile a compliance proposal.</p>
          <EnterpriseForm />
        </div>
      </section>
    </div>
  )
}
