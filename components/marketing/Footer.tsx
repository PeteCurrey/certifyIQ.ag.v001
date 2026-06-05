import React from 'react'
import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'
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
            <p className={styles.tagline}>RdSAP 10 certified EPCs for homeowners, landlords and agents across Chesterfield & Derbyshire.</p>
            <div className={styles.contact}>
              <a href="tel:01246000000" className={styles.contactItem}>
                <Phone size={16} className={styles.icon} />
                <span>01246 000 000</span>
              </a>
              <a href="mailto:info@avorria.co.uk" className={styles.contactItem}>
                <Mail size={16} className={styles.icon} />
                <span>info@avorria.co.uk</span>
              </a>
            </div>
          </div>
          <div className={styles.col}>
            <h4>Services</h4>
            <Link href="/book?service=domestic">Domestic EPC</Link>
            <Link href="/services/commercial-epc">Commercial EPC</Link>
            <Link href="/services/new-build-epc">New Build EPC & SAP</Link>
            <Link href="/services/air-tightness">Air Tightness Testing</Link>
          </div>
          <div className={styles.col}>
            <h4>Tools</h4>
            <Link href="/estimate">EPC Estimator</Link>
            <Link href="/improve">Improvement Advisor</Link>
            <Link href="/lookup">EPC Lookup</Link>
            <Link href="/tools/sap-checker">SAP Checker</Link>
          </div>
          <div className={styles.col}>
            <h4>Resources</h4>
            <Link href="/blog">Blog</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/blog/epc-ratings-for-landlords-2028">Landlord Guide</Link>
            <Link href="/blog">Agent Guide</Link>
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
