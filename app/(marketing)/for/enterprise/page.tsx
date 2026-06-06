import React from 'react'
import type { Metadata } from 'next'
import { Check, Shield, BarChart3, Clock, Sparkles } from 'lucide-react'
import styles from './enterprise.module.css'
import EnterpriseForm from './EnterpriseForm'

export const metadata: Metadata = {
  title: 'Avorria Enterprise | EPC & Compliance for Property Management Firms',
  description: 'Portfolio-level commercial EPC, TM44 and MEES compliance for property management consultancies. Dedicated account management, bulk pricing, and portfolio reporting.',
}

export default function EnterprisePage() {
  // Calculate months remaining until April 2027 dynamically (April 1st, 2027)
  const targetDate = new Date('2027-04-01')
  const now = new Date()
  const monthsRemaining = Math.max(0, (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth()))

  return (
    <div style={{ background: '#080D18' }}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Enterprise energy compliance</span>
          <h1 className={styles.title}>Commercial property compliance at scale.</h1>
          <p className={styles.subtitle}>
            For property management consultancies and commercial landlords managing multi-city portfolios. Dedicated account management, SLA-backed turnaround, and portfolio-level compliance reporting — across all UK locations.
          </p>
          <div className={styles.heroCtas}>
            <a href="#enquire" className={styles.btnPrimary}>Speak to our enterprise team</a>
            <a href="#reporting" className={styles.btnSecondary}>Request a portfolio audit</a>
          </div>
          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <span style={{ color: '#06B6D4' }}>✓</span> NDEA Level 3 & 4 accredited
            </div>
            <div className={styles.trustItem}>
              <span style={{ color: '#06B6D4' }}>✓</span> CIBSE TM44 (ACEA) accredited
            </div>
            <div className={styles.trustItem}>
              <span style={{ color: '#06B6D4' }}>✓</span> National coverage network
            </div>
            <div className={styles.trustItem}>
              <span style={{ color: '#06B6D4' }}>✓</span> BACS & Credit billing
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Every compliance obligation. One relationship.</h2>
          <p className={styles.sectionSub}>We manage all aspects of commercial energy assessments, calculations and statutory submissions.</p>
          
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>Commercial EPC (Level 3 & 4)</h3>
              <p className={styles.serviceDesc}>Non-Domestic Energy Performance Certificates for offices, retail, industrial and mixed-use. SBEM calculated, lodged to the national register. BRUKL reports included.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>TM44 Air Conditioning</h3>
              <p className={styles.serviceDesc}>Mandatory 5-yearly assessment for all AC systems over 12kW. CIBSE TM44 standard. Lodged to the Landmark Register. Portfolio scheduling available.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>Display Energy Certificates (DEC)</h3>
              <p className={styles.serviceDesc}>Annual DECs and Advisory Reports for public buildings over 250m². Schools, local authority buildings, NHS premises, leisure centres.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>MEES Compliance Review</h3>
              <p className={styles.serviceDesc}>Cross-reference your entire portfolio against the EPC register. Identify at-risk properties, expiring certificates, and properties below MEES thresholds — with a prioritised action plan.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>On-Construction EPCs & SAP</h3>
              <p className={styles.serviceDesc}>For developers and investors with construction activity. Design-stage SAP, air tightness testing, and OC-EPC lodgement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Timeline Section */}
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
            <div className={styles.timelineCard} style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <span className={styles.timelineDate} style={{ color: '#EF4444' }}>April 2027</span>
              <p className={styles.timelineDesc}>Band C required for all non-domestic rented property</p>
              <span className={styles.timelinePenalty}>Fine: up to £50,000 per property</span>
            </div>
            <div className={styles.timelineCard}>
              <span className={styles.timelineDate}>April 2030</span>
              <p className={styles.timelineDesc}>Band B required for all non-domestic rented property</p>
              <span className={styles.timelinePenalty}>Fine: up to £50,000 per property</span>
            </div>
          </div>

          <div className={styles.statCallout}>
            <div>
              <span className={styles.calloutStat}>£50,000</span>
              <span className={styles.calloutLabel}>Maximum fine per non-compliant property</span>
            </div>
            <div>
              <span className={styles.calloutStat} style={{ color: '#06B6D4' }}>{monthsRemaining} Months</span>
              <span className={styles.calloutLabel}>Remaining until April 2027 compliance deadline</span>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Reporting Mockup */}
      <section className={styles.section} id="reporting">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Complete visibility across your client portfolios</h2>
          <p className={styles.sectionSub}>Our enterprise clients receive a dedicated compliance dashboard showing every property's EPC status, TM44 status, and upcoming deadlines.</p>
          
          <div className={styles.mockupContainer}>
            <div className={styles.mockupHeader}>
              <span className={styles.mockupTitle}>Portfolio Dashboard — [Firm Name] | 847 properties</span>
            </div>
            <div className={styles.mockupStats}>
              <div className={styles.mockupStatCard}>
                <span className={styles.mockupStatVal}>623</span>
                <span className={styles.mockupStatLabel}>EPC Compliant</span>
              </div>
              <div className={styles.mockupStatCard}>
                <span className={styles.mockupStatVal}>47</span>
                <span className={styles.mockupStatLabel}>TM44 Due</span>
              </div>
              <div className={styles.mockupStatCard}>
                <span className={styles.mockupStatVal} style={{ color: '#F59E0B' }}>82</span>
                <span className={styles.mockupStatLabel}>MEES At Risk</span>
              </div>
              <div className={styles.mockupStatCard}>
                <span className={styles.mockupStatVal}>134</span>
                <span className={styles.mockupStatLabel}>Expiring &lt; 12m</span>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.mockupTable}>
                <thead>
                  <tr>
                    <th>Property Name</th>
                    <th>Area</th>
                    <th>EPC Rating</th>
                    <th>TM44 A/C Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Office Building, Canary Wharf</td>
                    <td>2,400m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Band B</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeWarning}`}>Due Jul 2026</span></td>
                  </tr>
                  <tr>
                    <td>Retail Unit, Leeds</td>
                    <td>340m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeWarning}`}>Band D</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Current</span></td>
                  </tr>
                  <tr>
                    <td>Industrial Unit, Birmingham</td>
                    <td>1,200m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Band C</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Current</span></td>
                  </tr>
                  <tr>
                    <td>Office Suite, Manchester</td>
                    <td>890m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeDanger}`}>Band E</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeDanger}`}>Overdue</span></td>
                  </tr>
                  <tr>
                    <td>Mixed Use, Sheffield</td>
                    <td>560m²</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Band C</span></td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Current</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.mockupActions}>
              <button className={styles.mockupBtn}>Export to CSV</button>
              <button className={styles.mockupBtn} style={{ background: '#06B6D4', color: '#ffffff' }}>Download compliance report</button>
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Terms Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Commercial terms built for commercial clients</h2>
          <p className={styles.sectionSub}>Bespoke workflows designed to slot perfectly into corporate purchasing systems.</p>
          
          <div className={styles.threeColGrid}>
            <div className={styles.termsCard}>
              <h3 className={styles.termsHeading}>Billing</h3>
              <p className={styles.termsText}>BACS bank transfer, purchase order, and credit account billing available. Monthly or quarterly invoicing to your accounts team. VAT invoices as standard.</p>
            </div>
            <div className={styles.termsCard}>
              <h3 className={styles.termsHeading}>SLAs</h3>
              <p className={styles.termsText}>Agreed turnaround times by property type. Standard: 5 working days from site visit. Priority: 48 hours. Emergency same-day available for urgent transactions.</p>
            </div>
            <div className={styles.termsCard}>
              <h3 className={styles.termsHeading}>Account management</h3>
              <p className={styles.termsText}>A dedicated account manager for portfolios of 20+ properties. Single point of contact for all bookings, queries and reporting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* National Coverage Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>One contract. Every UK location.</h2>
          <p className={styles.sectionSub}>Our accredited partner network covers all major UK cities, with direct delivery in the East Midlands.</p>
          
          <div className={styles.cityGrid}>
            <div className={styles.cityCard}>London</div>
            <div className={styles.cityCard}>Manchester</div>
            <div className={styles.cityCard}>Birmingham</div>
            <div className={styles.cityCard}>Leeds</div>
            <div className={styles.cityCard}>Sheffield</div>
            <div className={styles.cityCard}>Nottingham</div>
            <div className={styles.cityCard}>Derby</div>
            <div className={styles.cityCard}>Bristol</div>
            <div className={styles.cityCard}>Edinburgh</div>
            <div className={styles.cityCard}>Glasgow</div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#8BA3BF', fontSize: '0.9rem' }}>Coverage expanding. Contact us for specific locations.</p>
        </div>
      </section>

      {/* Enquiry Form Section */}
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
