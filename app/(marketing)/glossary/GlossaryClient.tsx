'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import styles from './glossary.module.css'

interface Term {
  letter: string
  term: string
  definition: string
  related?: { text: string; href: string }
}

const TERMS: Term[] = [
  { letter: 'A', term: 'Air Permeability', definition: 'The rate at which air leaks through the building envelope, measured in m³/h/m² at 50 Pascals. The lower the figure, the more airtight the building. Mandatory Part L compliance test for all new builds since 2022.', related: { text: 'Air Tightness Testing', href: '/book?service=air_tightness' } },
  { letter: 'A', term: 'Air Source Heat Pump (ASHP)', definition: 'A renewable heating system that extracts heat from outside air to heat a building. Typically improves EPC ratings by 1–2 bands when replacing a gas boiler.' },
  { letter: 'A', term: 'ATTMA', definition: 'Air Tightness Testing and Measurement Association. The professional body that accredits engineers to carry out air permeability testing. Level 1 covers domestic; Level 2 covers commercial.', related: { text: 'Book an air test', href: '/book?service=air_tightness' } },
  { letter: 'A', term: 'Approved Document L', definition: 'The part of UK Building Regulations covering energy efficiency. Divided into L1A (new dwellings), L1B (existing dwellings), L2A (new non-domestic), L2B (existing non-domestic).' },
  { letter: 'B', term: 'Band (EPC)', definition: 'The letter rating given to a property after EPC assessment, from A (most efficient, 92–100) to G (least efficient, 1–20).' },
  { letter: 'B', term: 'BREEAM', definition: 'Building Research Establishment Environmental Assessment Method. A sustainability framework for commercial buildings, broader in scope than a commercial EPC.' },
  { letter: 'B', term: 'BRUKL Report', definition: 'Building Regulations UK Part L report. A compliance document produced alongside a commercial On-Construction EPC, demonstrating the building meets Part L2A targets.' },
  { letter: 'C', term: 'Cavity Wall Insulation', definition: 'Insulation material injected into the cavity between the inner and outer leaves of a wall. One of the most cost-effective EPC improvements for properties built after 1920.' },
  { letter: 'C', term: 'CO₂ Emissions', definition: 'The carbon dioxide output of a property, measured in tonnes per year. Displayed on EPC certificates as both current and potential figures.' },
  { letter: 'D', term: 'DEA', definition: 'Domestic Energy Assessor. The qualified professional who carries out RdSAP assessments on existing homes. Must be accredited by a body such as Elmhurst Energy.', related: { text: 'Book a DEA visit', href: '/book' } },
  { letter: 'D', term: 'Default Value', definition: 'When an assessor cannot confirm specific data on site, RdSAP software applies a conservative default value. Confirmed data always produces a more accurate result.' },
  { letter: 'D', term: 'DER', definition: 'Dwelling Emission Rate. The calculated CO₂ emissions for a new dwelling in kgCO₂/m²/year. Must be equal to or lower than the Target Emission Rate (TER) to pass Part L.' },
  { letter: 'D', term: 'DFEE', definition: 'Dwelling Fabric Energy Efficiency. A metric measuring how efficiently the building fabric retains heat. Must be equal to or lower than the TFEE to pass Part L 2021.' },
  { letter: 'D', term: 'DSM', definition: 'Dynamic Simulation Modelling. The calculation method for the most complex commercial buildings (Level 5 EPCs), creating a full 3D thermal model.' },
  { letter: 'E', term: 'Elmhurst Energy', definition: 'The UK\'s largest government-approved EPC accreditation scheme, responsible for over 50% of all EPCs lodged in England and Wales. All Avorria assessors are Elmhurst-accredited.' },
  { letter: 'E', term: 'EPC', definition: 'Energy Performance Certificate. A legally required document showing a property\'s energy efficiency rating from A to G, valid for 10 years.', related: { text: 'EPC Lookup', href: '/lookup' } },
  { letter: 'E', term: 'EPC Register', definition: 'The official government database of all lodged EPCs in England and Wales, accessible at epc.opendatacommunities.org.', related: { text: 'Search EPCs', href: '/lookup' } },
  { letter: 'F', term: 'Fabric First', definition: 'A design approach prioritising the energy efficiency of the building\'s physical structure before adding renewable technology. Generally the most cost-effective strategy.' },
  { letter: 'F', term: 'Future Homes Standard', definition: 'A UK government policy requiring new homes to produce 75–80% less carbon than current standards. Will mandate heat pumps or equivalent low-carbon heating in new builds.' },
  { letter: 'G', term: 'G-value', definition: 'The solar heat gain coefficient of a window, indicating how much solar energy passes through the glass. Used in SAP calculations for new builds.' },
  { letter: 'H', term: 'Heat Pump', definition: 'A highly efficient heating system that moves heat from one place to another rather than generating it, achieving efficiencies of 250–350%. Significantly improves EPC ratings.' },
  { letter: 'I', term: 'iSBEM', definition: 'The free government-provided software implementation of SBEM, used by NDEAs for Level 3 and some Level 4 commercial EPC calculations.' },
  { letter: 'L', term: 'Loft Insulation', definition: 'Insulation installed at joist or rafter level in a roof space. One of the cheapest and most impactful EPC improvements — 270mm mineral wool can add 3–8 SAP points.' },
  { letter: 'M', term: 'MEES', definition: 'Minimum Energy Efficiency Standards. Regulations requiring rented properties in England and Wales to meet minimum EPC ratings. Current domestic minimum: Band E. Commercial: rising to C by April 2027, B by April 2030.', related: { text: 'For Landlords', href: '/for/landlords' } },
  { letter: 'M', term: 'MVHR', definition: 'Mechanical Ventilation with Heat Recovery. A whole-house ventilation system that recovers up to 90% of heat from extracted air. Required in very airtight buildings.' },
  { letter: 'N', term: 'NDEA', definition: 'Non-Domestic Energy Assessor. The qualified professional who carries out commercial EPC assessments using SBEM or DSM methodology, qualified at Level 3, 4, or 5.' },
  { letter: 'O', term: 'OC-EPC', definition: 'On-Construction Energy Performance Certificate. The EPC issued for a new build property once complete, based on the as-built SAP calculation and air tightness test result.', related: { text: 'New Build EPC & SAP', href: '/book?service=sap' } },
  { letter: 'O', term: 'OCDEA', definition: 'On-Construction Domestic Energy Assessor. The assessor qualified to produce SAP calculations and EPCs for new dwellings and conversions.' },
  { letter: 'P', term: 'Part L', definition: 'The section of UK Building Regulations covering conservation of fuel and power. See also Approved Document L.' },
  { letter: 'P', term: 'PEA', definition: 'Predicted Energy Assessment. A document produced from the design stage SAP calculation, showing the predicted energy efficiency before construction. Required by Building Control.', related: { text: 'New Build EPC & SAP', href: '/book?service=sap' } },
  { letter: 'R', term: 'RdSAP', definition: 'Reduced Data Standard Assessment Procedure. The calculation methodology used for EPC assessments of existing domestic properties.' },
  { letter: 'R', term: 'RdSAP 10', definition: 'The latest version of the RdSAP methodology, launched in 2025. More detailed data collection with improved accuracy for heat pumps, solar, and fabric performance.', related: { text: 'What is RdSAP 10?', href: '/blog/what-is-rdsap-10' } },
  { letter: 'S', term: 'SAP', definition: 'Standard Assessment Procedure. The UK government\'s approved method for calculating the energy performance of new and converted dwellings. SAP score: 1–100+.', related: { text: 'New Build EPC & SAP', href: '/book?service=sap' } },
  { letter: 'S', term: 'SAP Score', definition: 'A numerical score from 1 (extremely poor) to 100+ (net zero or better) representing a property\'s energy cost efficiency. A = 92+, G = 1–20.' },
  { letter: 'S', term: 'SBEM', definition: 'Simplified Building Energy Model. The calculation methodology used for Level 3 and Level 4 commercial EPC assessments.' },
  { letter: 'S', term: 'Solid Wall Insulation', definition: 'Insulation applied to solid walls (no cavity), either externally (EWI) or internally (IWI). More costly than cavity wall insulation but high impact for older properties.' },
  { letter: 'T', term: 'TER', definition: 'Target Emission Rate. The maximum CO₂ emissions allowed for a new dwelling under Part L. The DER must be equal to or lower than the TER to pass compliance.' },
  { letter: 'T', term: 'TFEE', definition: 'Target Fabric Energy Efficiency. The maximum allowed fabric energy demand for a new dwelling. The DFEE must be equal to or lower than the TFEE.' },
  { letter: 'T', term: 'Thermal Bridge', definition: 'A structural element that conducts heat between the warm interior and cold exterior more readily than surrounding materials.' },
  { letter: 'T', term: 'U-value', definition: 'A measure of how effectively a building element insulates, in W/m²K. Lower U-values = better insulation. Key input in SAP and SBEM calculations.' },
  { letter: 'V', term: 'Valid EPC', definition: 'An EPC lodged on the national register less than 10 years ago. A property being sold or rented must have a valid EPC to comply with the law.' },
  { letter: 'Z', term: 'Zero Carbon Home', definition: 'A new dwelling that produces no net CO₂ emissions annually. Requires very high insulation, exceptional airtightness, renewable generation, and low-carbon heating. SAP score 100+.' },
]

const LETTERS = [...new Set(TERMS.map(t => t.letter))].sort()

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'EPC and Energy Assessment Glossary',
  description: 'Definitions of key terms used in EPC assessments, SAP calculations, and energy efficiency.',
  hasDefinedTerm: TERMS.map(t => ({
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.definition,
  })),
}

export default function GlossaryClient() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return TERMS
    const q = search.toLowerCase()
    return TERMS.filter(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
  }, [search])

  const visibleLetters = [...new Set(filtered.map(t => t.letter))].sort()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <div className={styles.container}>
        <div className={styles.hero}>
          <span className={styles.eyebrow}>Reference</span>
          <h1 className={styles.title}>EPC & Energy Assessment Glossary</h1>
          <p className={styles.subtitle}>Plain English definitions for every term you'll encounter during an EPC assessment, SAP calculation, or MEES compliance review.</p>
          <div className={styles.searchWrap}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search terms…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* A–Z nav */}
        {!search.trim() && (
          <div className={styles.azNav}>
            {LETTERS.map(l => (
              <a key={l} href={`#letter-${l}`} className={styles.azLink}>{l}</a>
            ))}
          </div>
        )}

        <div className={styles.terms}>
          {visibleLetters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className={styles.letterGroup}>
              <div className={styles.letterHeading}>{letter}</div>
              {filtered.filter(t => t.letter === letter).map(term => (
                <div key={term.term} className={styles.termCard}>
                  <h2 className={styles.termName}>{term.term}</h2>
                  <p className={styles.termDef}>{term.definition}</p>
                  {term.related && (
                    <Link href={term.related.href} className={styles.termLink}>
                      {term.related.text} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className={styles.noResults}>
              <p>No terms matching "{search}".</p>
              <button className={styles.clearBtn} onClick={() => setSearch('')}>Clear search</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
