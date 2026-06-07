import React from 'react'
import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.col}>
            <div className={styles.brand}>

              <span className={styles.logoText}>Avorria<span style={{ color: 'var(--accent-lime)' }}>.</span></span>
            </div>
            <p className={styles.tagline}>RdSAP 10 certified EPCs for homeowners, landlords and agents across {SITE_CONFIG.address}.</p>
            <div className={styles.contact}>
              <a href={SITE_CONFIG.phoneHref} className={styles.contactItem}>
                <Phone size={16} className={styles.icon} />
                <span>{SITE_CONFIG.phone}</span>
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} className={styles.contactItem}>
                <Mail size={16} className={styles.icon} />
                <span>{SITE_CONFIG.email}</span>
              </a>
            </div>
          </div>
          <div className={styles.col}>
            <h4>Services</h4>
            <Link href="/services/domestic-epc">Domestic EPC</Link>
            <Link href="/services/commercial-epc">Commercial EPC</Link>
            <Link href="/services/new-build-epc">New Build EPC & SAP</Link>
            <Link href="/services/air-tightness">Air Tightness Testing</Link>
            <Link href="/services/tm44">TM44 Inspection</Link>
            <Link href="/services/display-energy-certificate">Display Energy Certificate</Link>
            <Link href="/services/mees-compliance">MEES Compliance</Link>
          </div>
          <div className={styles.col}>
            <h4>Commercial</h4>
            <Link href="/services/commercial-epc">Commercial EPC</Link>
            <Link href="/services/tm44">TM44 Inspection</Link>
            <Link href="/services/display-energy-certificate">Display Energy Certificate</Link>
            <Link href="/commercial/london">London</Link>
            <Link href="/commercial/manchester">Manchester</Link>
            <Link href="/commercial/birmingham">Birmingham</Link>
            <Link href="/commercial/sheffield">Sheffield</Link>
            <Link href="/commercial/leeds">Leeds</Link>
            <Link href="/commercial">View all cities</Link>
          </div>
          <div className={styles.col}>
            <h4>Tools</h4>
            <Link href="/estimate">EPC Estimator</Link>
            <Link href="/improve">Improvement Advisor</Link>
            <Link href="/epc-register">EPC Lookup</Link>
            <Link href="/tools/sap-checker">SAP Checker</Link>
          </div>
          <div className={styles.col}>
            <h4>Resources</h4>
            <Link href="/blog">Blog</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/glossary">Glossary</Link>
            <Link href="/for/enterprise">For Enterprise</Link>
            <Link href="/for/landlords">Landlord Guide</Link>
            <Link href="/for/agents">For Agents</Link>
            <Link href="/for/developers">Developer Guide</Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Avorria Ltd. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <span className={styles.accreditation}>Elmhurst Energy Accredited · RdSAP 10 · ICO Registered</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
