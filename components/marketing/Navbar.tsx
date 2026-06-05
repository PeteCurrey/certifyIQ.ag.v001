'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Home, HardHat, Wind, Building2, Factory, BarChart3, Lightbulb, Search, Zap } from 'lucide-react'
import styles from './Navbar.module.css'

interface DropdownItem {
  icon: string
  title: string
  desc: string
  href: string
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  const servicesRef = useRef<HTMLDivElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false)
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false)
        setToolsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const toggleServices = () => {
    setServicesOpen(!servicesOpen)
    setToolsOpen(false)
  }

  const toggleTools = () => {
    setToolsOpen(!toolsOpen)
    setServicesOpen(false)
  }

  const closeAll = () => {
    setServicesOpen(false)
    setToolsOpen(false)
    setMenuOpen(false)
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={closeAll}>
          <span className={styles.logoMark}>C</span>
          <span className={styles.logoText}>Avorria</span>
        </Link>
        
        {/* Desktop Links */}
        <div className={styles.links}>
          {/* Services Mega Dropdown */}
          <div className={styles.dropdownContainer} ref={servicesRef}>
            <button 
              className={`${styles.dropdownTrigger} ${servicesOpen ? styles.active : ''}`}
              onClick={toggleServices}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services <span className={styles.arrow}>▾</span>
            </button>
            {servicesOpen && (
              <div className={styles.megaMenu}>
                <div className={styles.megaInner}>
                  <div className={styles.megaCol}>
                    <h4 className={styles.menuHeading}>Residential Services</h4>
                    <Link href="/book?service=domestic" className={styles.menuItem} onClick={closeAll}>
                      <Home className={styles.menuIcon} size={20} />
                      <div>
                        <span className={styles.menuTitle}>Domestic EPC</span>
                        <span className={styles.menuDesc}>Energy certification for existing homes.</span>
                      </div>
                    </Link>
                    <Link href="/services/new-build-epc" className={styles.menuItem} onClick={closeAll}>
                      <HardHat className={styles.menuIcon} size={20} />
                      <div>
                        <span className={styles.menuTitle}>On-Construction EPC & SAP</span>
                        <span className={styles.menuDesc}>SAP calculations for new build dwellings.</span>
                      </div>
                    </Link>
                    <Link href="/services/air-tightness" className={styles.menuItem} onClick={closeAll}>
                      <Wind className={styles.menuIcon} size={20} />
                      <div>
                        <span className={styles.menuTitle}>Air Tightness Testing</span>
                        <span className={styles.menuDesc}>Part L leakage testing for residential builds.</span>
                      </div>
                    </Link>
                  </div>
                  <div className={styles.megaCol}>
                    <h4 className={styles.menuHeading}>Commercial Services</h4>
                    <Link href="/services/commercial-epc" className={styles.menuItem} onClick={closeAll}>
                      <Building2 className={styles.menuIcon} size={20} />
                      <div>
                        <span className={styles.menuTitle}>Commercial EPC</span>
                        <span className={styles.menuDesc}>SBEM energy assessments for business properties.</span>
                      </div>
                    </Link>
                    <Link href="/services/air-tightness" className={styles.menuItem} onClick={closeAll}>
                      <Factory className={styles.menuIcon} size={20} />
                      <div>
                        <span className={styles.menuTitle}>Commercial Air Tightness</span>
                        <span className={styles.menuDesc}>Blower door testing for non-domestic buildings.</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tools Dropdown */}
          <div className={styles.dropdownContainer} ref={toolsRef}>
            <button 
              className={`${styles.dropdownTrigger} ${toolsOpen ? styles.active : ''}`}
              onClick={toggleTools}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
            >
              Tools <span className={styles.arrow}>▾</span>
            </button>
            {toolsOpen && (
              <div className={styles.dropdownMenu}>
                <Link href="/estimate" className={styles.menuItem} onClick={closeAll}>
                  <BarChart3 className={styles.menuIcon} size={20} />
                  <div>
                    <span className={styles.menuTitle}>EPC Estimator</span>
                    <span className={styles.menuDesc}>Calculate your property's likely energy rating.</span>
                  </div>
                </Link>
                <Link href="/improve" className={styles.menuItem} onClick={closeAll}>
                  <Lightbulb className={styles.menuIcon} size={20} />
                  <div>
                    <span className={styles.menuTitle}>Improvement Advisor</span>
                    <span className={styles.menuDesc}>Cost-effective ways to boost efficiency.</span>
                  </div>
                </Link>
                <Link href="/lookup" className={styles.menuItem} onClick={closeAll}>
                  <Search className={styles.menuIcon} size={20} />
                  <div>
                    <span className={styles.menuTitle}>EPC Lookup</span>
                    <span className={styles.menuDesc}>Find and download an existing certificate.</span>
                  </div>
                </Link>
                <Link href="/tools/sap-checker" className={styles.menuItem} onClick={closeAll}>
                  <Zap className={styles.menuIcon} size={20} />
                  <div>
                    <span className={styles.menuTitle}>SAP Compliance Checker</span>
                    <span className={styles.menuDesc}>Check if your design will pass Part L.</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link href="/prices" className={styles.link}>Pricing</Link>
          <Link href="/blog" className={styles.link}>Blog</Link>
          <Link href="/faq" className={styles.link}>FAQ</Link>
          <Link href="/portal" className={styles.linkPortal}>My Account</Link>
          <Link href="/book" className={styles.cta}>Book Now</Link>
        </div>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileGroup}>
            <span className={styles.mobileGroupHeading}>Services</span>
            <Link href="/book?service=domestic" onClick={closeAll}>Domestic EPC</Link>
            <Link href="/services/new-build-epc" onClick={closeAll}>New Build EPC & SAP</Link>
            <Link href="/services/air-tightness" onClick={closeAll}>Air Tightness Testing</Link>
            <Link href="/services/commercial-epc" onClick={closeAll}>Commercial EPC</Link>
          </div>
          <div className={styles.mobileGroup}>
            <span className={styles.mobileGroupHeading}>Tools</span>
            <Link href="/estimate" onClick={closeAll}>Estimator</Link>
            <Link href="/improve" onClick={closeAll}>Advisor</Link>
            <Link href="/lookup" onClick={closeAll}>EPC Lookup</Link>
            <Link href="/tools/sap-checker" onClick={closeAll}>SAP Compliance Checker</Link>
          </div>
          <div className={styles.mobileGroup}>
            <span className={styles.mobileGroupHeading}>Links</span>
            <Link href="/prices" onClick={closeAll}>Pricing</Link>
            <Link href="/blog" onClick={closeAll}>Blog</Link>
            <Link href="/faq" onClick={closeAll}>FAQ</Link>
          </div>
          <Link href="/portal" className={styles.mobileLinkPortal} onClick={closeAll}>My Account</Link>
          <Link href="/book" className={styles.cta} onClick={closeAll}>Book Now</Link>
        </div>
      )}
    </nav>
  )
}
