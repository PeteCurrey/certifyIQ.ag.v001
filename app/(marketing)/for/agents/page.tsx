'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Zap, Check, Plug, Settings, HelpCircle, ArrowRight, Shield, Calendar, User, Star } from 'lucide-react'
import styles from './agents.module.css'

export default function AgencyLandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const faqs = [
    {
      q: "What CRM systems do you integrate with?",
      a: "We currently support Alto (Vebra), Street.co.uk and Reapit Foundations. Manual property entry and CSV import are also available. Further CRM integrations are in development."
    },
    {
      q: "What if a vendor doesn't respond to your contact?",
      a: "We send two contact attempts within 72 hours. If there's no response, we notify you immediately so you can follow up directly with your client. You can also choose to switch the billing to your agency account to move the booking forward."
    },
    {
      q: "Can I mix billing methods across my portfolio?",
      a: "Yes. You set a default preference for your account (agency pay or vendor pay), then override it on any individual property in your dashboard."
    },
    {
      q: "How long does the EPC assessment take?",
      a: "Domestic assessments typically take 30-60 minutes on site. Certificates are issued within 24 hours."
    },
    {
      q: "What if a property already has a valid EPC?",
      a: "We check the national register automatically. If a valid certificate exists, we notify you and log the expiry date. No job is created and nothing is charged."
    },
    {
      q: "Is there a minimum commitment?",
      a: "No. There are no monthly fees or minimum volumes. You pay only for completed EPCs."
    }
  ]

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.eyebrow}>
          <Zap size={16} /> New Agent Portal Live
        </div>
        <h1 className={styles.title}>
          Zero-touch EPCs for<br />modern estate agents
        </h1>
        <p className={styles.subtitle}>
          Connect your CRM. When a new property is instructed, we automatically check the EPC register, contact the vendor to arrange access, and manage the assessment. You don't lift a finger.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/agent/login" className={styles.btnPrimary}>
            Go to Agent Portal →
          </Link>
          <Link href="/contact" className={styles.btnSecondary}>
            Talk to Sales
          </Link>
        </div>
      </div>

      {/* Problem We Solve Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Your negotiators shouldn't be chasing EPCs</h2>
          <p className={styles.sectionSub}>Avorria automates the entire coordination loop from instruction to lodgement.</p>
          
          <div className={styles.twoColGrid}>
            <div className={styles.comparisonCard}>
              <h3 className={styles.cardHeading} style={{ color: '#EF4444' }}>The Old Way</h3>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <span className={styles.dotRed} />
                  <span className={styles.timelineText}>❶ Property instructed</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotRed} />
                  <span className={styles.timelineText}>❷ Negotiator remembers to book EPC (sometimes)</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotRed} />
                  <span className={styles.timelineText}>❸ Call around assessors, wait for quote</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotRed} />
                  <span className={styles.timelineText}>❹ Wait for confirmation</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotRed} />
                  <span className={styles.timelineText}>❺ Chase vendor to arrange access</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotRed} />
                  <span className={styles.timelineText}>❻ Wait for certificate</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotRed} />
                  <span className={styles.timelineText}>❼ Download and upload to CRM</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotRed} />
                  <span className={styles.timelineText}>❽ Hope it was done before the listing goes live</span>
                </div>
              </div>
              <span className={styles.cardFooterLabel}>8 steps. Multiple touchpoints. Easily forgotten.</span>
            </div>

            <div className={styles.comparisonCardActive}>
              <h3 className={styles.cardHeading} style={{ color: '#10B981' }}>The Avorria Way</h3>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <span className={styles.dotGreen} />
                  <span className={styles.timelineText}>❶ Property instructed in your CRM</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotGreen} />
                  <span className={styles.timelineText}>❷ Avorria detects it automatically</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotGreen} />
                  <span className={styles.timelineText}>❸ EPC register checked — no EPC found</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotGreen} />
                  <span className={styles.timelineText}>❹ Vendor contacted by us to arrange access</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotGreen} />
                  <span className={styles.timelineText}>❺ Assessment completed</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.dotGreen} />
                  <span className={styles.timelineText}>❻ Certificate issued and linked</span>
                </div>
              </div>
              <span className={styles.cardFooterLabel} style={{ color: '#9BFF59' }}>Zero steps for your team. All handled.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
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
                  <span>Instruction detected</span>
                  <span>✓</span>
                </div>
                <div className={styles.flowItem}>
                  <span>Register check</span>
                  <span>Pending</span>
                </div>
                <div className={styles.flowItem}>
                  <span>Contact vendor</span>
                  <span>-</span>
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

      {/* Portal Preview */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Your entire EPC pipeline. One screen.</h2>
          <p className={styles.sectionSub}>The Avorria Agent Portal gives you real-time visibility of every property's EPC status across your portfolio.</p>
          
          <div className={styles.mockupContainer}>
            <div className={styles.mockupHeader}>
              <span className={styles.mockupTitle}>Avorria Agent Portal | Premier Homes | 47 properties</span>
            </div>
            <div className={styles.mockupStats}>
              <div className={styles.mockupStatCard}>
                <span className={styles.mockupStatVal}>32</span>
                <span className={styles.mockupStatLabel}>Valid EPCs</span>
              </div>
              <div className={styles.mockupStatCard}>
                <span className={styles.mockupStatVal}>8</span>
                <span className={styles.mockupStatLabel}>In progress</span>
              </div>
              <div className={styles.mockupStatCard}>
                <span className={styles.mockupStatVal}>7</span>
                <span className={styles.mockupStatLabel}>Action needed</span>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className={styles.mockupTable}>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={styles.mockupRow}>
                    <td>14 Church Lane</td>
                    <td>Terraced · Sale</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Valid (exp 2034)</span></td>
                    <td style={{ color: '#8BA3BF' }}>None</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>7 Station Road</td>
                    <td>Semi · Let</td>
                    <td><span className={`${styles.badge} ${styles.badgeInfo}`}>Booked — 12 Jun</span></td>
                    <td style={{ color: '#8BA3BF' }}>View booking</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>The Old Vicarage</td>
                    <td>Detached · Sale</td>
                    <td><span className={`${styles.badge} ${styles.badgeDanger}`}>No EPC — vendor contacted</span></td>
                    <td style={{ color: '#9BFF59' }}>Resend email</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>22 Ashgate Road</td>
                    <td>Flat · Let</td>
                    <td><span className={`${styles.badge} ${styles.badgeWarning}`}>Expiring Sep 2026</span></td>
                    <td style={{ color: '#9BFF59' }}>Book renewal</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>Flat 3 Mill View</td>
                    <td>Flat · Let</td>
                    <td><span className={`${styles.badge} ${styles.badgeInfo}`}>Assessment today</span></td>
                    <td style={{ color: '#8BA3BF' }}>In progress</td>
                  </tr>
                  <tr className={styles.mockupRow}>
                    <td>12 Walton Avenue</td>
                    <td>Semi · Sale</td>
                    <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>Valid (exp 2031)</span></td>
                    <td style={{ color: '#8BA3BF' }}>None</td>
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

      {/* Billing Options */}
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
                <li className={styles.featureItem}><span className={styles.tick}>✓</span> One invoice per month</li>
                <li className={styles.featureItem}><span className={styles.tick}>✓</span> Direct debit available</li>
                <li className={styles.featureItem}><span className={styles.tick}>✓</span> No per-transaction payment needed</li>
                <li className={styles.featureItem}><span className={styles.tick}>✓</span> Monthly statement for accounts</li>
              </ul>
            </div>

            <div className={styles.billingCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <User size={24} style={{ color: '#8BA3BF' }} />
                <h3 className={styles.billingTitle}>Vendor/landlord pays — direct</h3>
              </div>
              <p className={styles.billingPrice}>Client payment link via Stripe</p>
              <ul className={styles.featureList}>
                <li className={styles.featureItem}><span className={styles.tick}>✓</span> No upfront cost to your agency</li>
                <li className={styles.featureItem}><span className={styles.tick}>✓</span> Vendor pays securely via Stripe</li>
                <li className={styles.featureItem}><span className={styles.tick}>✓</span> Automatic escalation if unpaid</li>
                <li className={styles.featureItem}><span className={styles.tick}>✓</span> You stay in control</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Everything agents need. Nothing they don't.</h2>
          <p className={styles.sectionSub}>Designed and optimized specifically for high-volume residential workflows.</p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>CRM Integration</h4>
              <p className={styles.featureDesc}>Direct sync with Alto, Street.co.uk and Reapit. No manual data entry. New instructions detected automatically.</p>
            </div>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>Automatic EPC check</h4>
              <p className={styles.featureDesc}>Every new property is cross-referenced with the national EPC register within minutes of instruction.</p>
            </div>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>Vendor outreach</h4>
              <p className={styles.featureDesc}>We contact your vendors and landlords directly — by email or SMS — so your team doesn't have to chase them.</p>
            </div>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>Monthly billing</h4>
              <p className={styles.featureDesc}>One invoice at the start of each month. All EPCs completed in the previous month, clearly itemised.</p>
            </div>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>Real-time dashboard</h4>
              <p className={styles.featureDesc}>See the status of every EPC across your portfolio — outstanding, in-progress, completed — in one screen.</p>
            </div>
            <div className={styles.featureCard}>
              <h4 className={styles.featureTitle}>EPC expiry alerts</h4>
              <p className={styles.featureDesc}>We alert you 90 days before any managed property's EPC expires, so renewals are never missed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Local service. National reach.</h2>
          <p className={styles.sectionSub}>Currently providing same-day assessment in Derbyshire and the East Midlands, with national coverage for commercial assessments.</p>
          
          <div className={styles.coverageContainer}>
            <div className={styles.mapLeft}>
              <h3 style={{ color: '#E8F4FF', fontSize: '1.5rem', marginBottom: '1rem' }}>Primary Coverage Zone</h3>
              <p style={{ color: '#8BA3BF', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Our in-house assessors provide guaranteed priority slots and same-day lodgements in Chesterfield, Derby, Sheffield, Nottingham, Matlock, Buxton, and Belper.
              </p>
              <p style={{ color: '#8BA3BF', lineHeight: 1.6 }}>
                For enterprise accounts and commercial requirements, we deliver national coverage through our vetted partner network of accredited Energy Assessors.
              </p>
            </div>
            <div className={styles.mapRight}>
              <div className={styles.mapWrapper}>
                <svg viewBox="0 0 200 300" style={{ width: '100%', maxHeight: '300px' }}>
                  <path d="M40 80 Q60 50 100 30 T160 50 Q180 100 150 180 T100 280 T40 180 Z" fill="#131A2D" stroke="#1E2D4A" strokeWidth="2" />
                  {/* Base / Primary */}
                  <circle cx="100" cy="140" r="8" fill="#9BFF59" />
                  <circle cx="100" cy="140" r="18" fill="none" stroke="#9BFF59" strokeWidth="1" strokeDasharray="3,3" />
                  {/* Secondary/Commercial Dots */}
                  <circle cx="110" cy="190" r="5" fill="#06B6D4" />
                  <circle cx="90" cy="110" r="5" fill="#06B6D4" />
                  <circle cx="130" cy="120" r="5" fill="#06B6D4" />
                  <circle cx="80" cy="160" r="5" fill="#06B6D4" />
                  
                  <text x="105" y="135" fill="#9BFF59" fontSize="8" fontWeight="bold">Chesterfield HQ</text>
                  <text x="115" y="195" fill="#06B6D4" fontSize="8">London</text>
                  <text x="50" y="115" fill="#06B6D4" fontSize="8">Manchester</text>
                  <text x="135" y="125" fill="#06B6D4" fontSize="8">Nottingham</text>
                </svg>
              </div>
              <div className={styles.mapLegend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendDotPrimary} />
                  <span>Same-Day Assured Zone</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDotSecondary} />
                  <span>National Partner Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Trusted by property professionals</h2>
          <p className={styles.sectionSub}>Read how estate agents are simplifying their operations with our zero-touch model.</p>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quote}>"We've completely eliminated EPC chasing from our process. Properties go live faster and our negotiators spend more time on what matters."</p>
              <span className={styles.authorName}>Sarah Jenkins</span>
              <span className={styles.authorRole}>Agency Manager, Independent Estate Agent, Derbyshire</span>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quote}>"The monthly invoice makes expenses simple. One line in our accounts — no individual receipts to track."</p>
              <span className={styles.authorName}>Mark Redman</span>
              <span className={styles.authorRole}>Partner, Letting Agency, Sheffield</span>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.quote}>"Setup took 10 minutes. Within an hour we could see our entire portfolio's EPC status for the first time."</p>
              <span className={styles.authorName}>David Wright</span>
              <span className={styles.authorRole}>Director, Sales & Lettings Agency, Derby</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSub}>Everything you need to know about integrating and using our agency portal.</p>
          
          <div className={styles.faqAccordion}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button 
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={activeFaq === index}
                >
                  <span>{faq.q}</span>
                  <span>{activeFaq === index ? '−' : '+'}</span>
                </button>
                {activeFaq === index && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.section} style={{ borderBottom: 'none' }}>
        <div className={styles.ctaBox}>
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