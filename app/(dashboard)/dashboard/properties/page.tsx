'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Building2, Upload, ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import styles from './properties.module.css'

const MOCK_PROPERTIES = [
  { id: '1', address: '14 Mill Lane, Derby DE1 3EF', type: 'Terraced', status: 'Let', score: 32, epcExpiry: '2024-01-15', gasSafety: null, eicr: '2026-08-10', risk: 'High' },
  { id: '2', address: '7 Oak Street, Chesterfield S40 2JL', type: 'Semi-Detached', status: 'Let', score: 48, epcExpiry: '2027-03-20', gasSafety: '2026-06-23', eicr: '2026-09-14', risk: 'Medium' },
  { id: '3', address: 'Unit 4, Sheffield S1 2FF', type: 'Commercial', status: 'Let', score: 41, epcExpiry: '2026-06-17', gasSafety: null, eicr: '2027-01-01', risk: 'High' },
  { id: '4', address: '22 Victoria Road, Matlock DE4 3BT', type: 'Detached', status: 'Let', score: 55, epcExpiry: '2027-09-11', gasSafety: '2027-02-14', eicr: '2026-07-03', risk: 'Medium' },
  { id: '5', address: '31 Beech Drive, Nottingham NG1 4AB', type: 'Semi-Detached', status: 'Vacant', score: 82, epcExpiry: '2026-07-05', gasSafety: '2027-01-12', eicr: '2028-01-20', risk: 'Low' },
  { id: '6', address: '103 Lime Street, Derby DE1 7LL', type: 'Flat', status: 'Let', score: 91, epcExpiry: '2026-08-01', gasSafety: '2027-04-08', eicr: '2028-04-01', risk: 'Low' },
  { id: '7', address: 'Plot 7, Meadowbrook Dev, Belper', type: 'New Build', status: 'Under Construction', score: 0, epcExpiry: null, gasSafety: null, eicr: null, risk: 'Pending' },
]

function ScoreBadge({ score, risk }: { score: number, risk: string }) {
  const color = risk === 'High' ? '#F87171' : risk === 'Medium' ? '#F59E0B' : risk === 'Low' ? '#9BFF59' : '#8BA3BF'
  return (
    <div className={styles.scoreBadge} style={{ color, borderColor: color }}>
      {risk === 'Pending' ? '—' : score}
    </div>
  )
}

function ExpDate({ date, label }: { date: string | null, label: string }) {
  if (!date) return <span className={styles.expMissing}>Missing</span>
  const d = new Date(date)
  const now = new Date()
  const daysUntil = Math.ceil((d.getTime() - now.getTime()) / 86400000)
  const isExpired = daysUntil < 0
  const isWarning = daysUntil <= 30 && daysUntil >= 0
  const isAtRisk = daysUntil <= 90 && daysUntil > 30

  if (isExpired) return <span className={styles.expExpired}>Expired {Math.abs(daysUntil)}d ago</span>
  if (isWarning) return <span className={styles.expWarning}>Expires {daysUntil}d</span>
  if (isAtRisk) return <span className={styles.expAtRisk}>Expires {daysUntil}d</span>
  return <span className={styles.expOk}>{d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
}

export default function PropertiesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showUpload, setShowUpload] = useState(false)

  const filtered = MOCK_PROPERTIES.filter(p => {
    const matchSearch = p.address.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || p.risk === filter
    return matchSearch && matchFilter
  })

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Property Portfolio</h1>
          <p className={styles.pageSub}>47 properties across 1 portfolio</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.importBtn} onClick={() => setShowUpload(true)}>
            <Upload size={16} /> Bulk Import
          </button>
          <Link href="/dashboard/properties/add" className={styles.addBtn}>
            <Plus size={16} /> Add Property
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className={styles.toolBar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by address or postcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterTabs}>
          {['All', 'High', 'Medium', 'Low', 'Pending'].map(f => (
            <button
              key={f}
              className={`${styles.filterTab} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* CSV Import Modal */}
      {showUpload && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>Bulk Import Portfolio</h2>
            <p className={styles.modalDesc}>Upload a CSV with Address, Property Type, Tenancy Status, EPC Expiry, and Gas Safety Expiry. We'll auto-create records and run compliance scoring.</p>
            <div className={styles.dropZone}>
              <Upload size={40} color="#4A6280" />
              <p>Drop CSV file here or click to browse</p>
              <span>.CSV, .XLS, .XLSX supported</span>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowUpload(false)}>Cancel</button>
              <button className={styles.modalSubmit}>Import Portfolio</button>
            </div>
          </div>
        </div>
      )}

      {/* Properties Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Score</th>
              <th>Property</th>
              <th>Type</th>
              <th>Status</th>
              <th>EPC</th>
              <th>Gas Safety</th>
              <th>EICR</th>
              <th>Risk</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className={styles.tableRow}>
                <td><ScoreBadge score={p.score} risk={p.risk} /></td>
                <td>
                  <div className={styles.propAddress}>{p.address}</div>
                </td>
                <td><span className={styles.typeTag}>{p.type}</span></td>
                <td><span className={styles.statusTag} data-status={p.status.toLowerCase().replace(' ', '-')}>{p.status}</span></td>
                <td><ExpDate date={p.epcExpiry} label="EPC" /></td>
                <td><ExpDate date={p.gasSafety} label="Gas Safety" /></td>
                <td><ExpDate date={p.eicr} label="EICR" /></td>
                <td>
                  <span className={styles.riskTag} data-risk={p.risk.toLowerCase()}>{p.risk}</span>
                </td>
                <td>
                  <Link href={`/dashboard/properties/${p.id}`} className={styles.viewBtn}>
                    View <ChevronRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
