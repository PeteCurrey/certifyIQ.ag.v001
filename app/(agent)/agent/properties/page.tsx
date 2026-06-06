'use client'
import React, { useState } from 'react'
import { Search, Plus, X, Home, AlertCircle, CheckCircle2, Clock, Download } from 'lucide-react'
import styles from './properties.module.css'

type EpcStatus = 'valid' | 'needed' | 'in_progress' | 'expiring'
type BillingPref = 'agency' | 'vendor'

interface Property {
  id: string
  address: string
  town: string
  postcode: string
  tenure: 'sale' | 'let'
  epcStatus: EpcStatus
  epcRating: string | null
  epcExpiry: string | null
  billing: BillingPref
  vendorName: string
  vendorEmail: string
  vendorPhone: string
  jobStatus: string
}

const MOCK_PROPERTIES: Property[] = [
  { id: '1', address: '14 Church Lane', town: 'Chesterfield', postcode: 'S40 1AA', tenure: 'sale', epcStatus: 'valid', epcRating: 'C', epcExpiry: '2030-03-15', billing: 'agency', vendorName: 'James Henderson', vendorEmail: 'james@email.com', vendorPhone: '07700 900001', jobStatus: 'certificate_issued' },
  { id: '2', address: '22 Ashgate Road', town: 'Chesterfield', postcode: 'S40 3BA', tenure: 'sale', epcStatus: 'needed', epcRating: null, epcExpiry: null, billing: 'vendor', vendorName: 'Sarah Mitchell', vendorEmail: 'sarah@email.com', vendorPhone: '07700 900002', jobStatus: 'awaiting_payment' },
  { id: '3', address: '7 Station Road', town: 'Dronfield', postcode: 'S18 1PD', tenure: 'let', epcStatus: 'in_progress', epcRating: null, epcExpiry: null, billing: 'agency', vendorName: 'Robert Clarke', vendorEmail: 'r.clarke@email.com', vendorPhone: '07700 900003', jobStatus: 'scheduled' },
  { id: '4', address: 'The Old Vicarage', town: 'Matlock', postcode: 'DE4 3AS', tenure: 'sale', epcStatus: 'needed', epcRating: null, epcExpiry: null, billing: 'vendor', vendorName: 'Emma Thompson', vendorEmail: 'emma.t@email.com', vendorPhone: '07700 900004', jobStatus: 'awaiting_contact' },
  { id: '5', address: '18 Newbold Road', town: 'Chesterfield', postcode: 'S41 7NS', tenure: 'let', epcStatus: 'expiring', epcRating: 'D', epcExpiry: '2026-09-01', billing: 'agency', vendorName: 'Mike Patel', vendorEmail: 'm.patel@email.com', vendorPhone: '07700 900005', jobStatus: 'none' },
]

const EPC_STATUS_CONFIG: Record<EpcStatus, { label: string; className: string; icon: React.ReactNode }> = {
  valid: { label: 'Valid EPC', className: styles.epcStatusValid, icon: <CheckCircle2 size={12} /> },
  needed: { label: 'EPC Needed', className: styles.epcStatusNeeded, icon: <AlertCircle size={12} /> },
  in_progress: { label: 'In Progress', className: styles.epcStatusProgress, icon: <Clock size={12} /> },
  expiring: { label: 'Expiring Soon', className: styles.epcStatusNeeded, icon: <AlertCircle size={12} /> },
}

export default function PropertiesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tenureFilter, setTenureFilter] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES)

  const filtered = properties.filter(p => {
    const matchSearch = p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.postcode.toLowerCase().includes(search.toLowerCase()) ||
      p.town.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.epcStatus === statusFilter
    const matchTenure = tenureFilter === 'all' || p.tenure === tenureFilter
    return matchSearch && matchStatus && matchTenure
  })

  const updateBilling = (id: string, billing: BillingPref) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, billing } : p))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Properties</h1>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn}>
            <Download size={16} /> Export CSV
          </button>
          <button className={styles.primaryBtn}>
            <Plus size={16} /> Add Manually
          </button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by address, town or postcode..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="needed">EPC Needed</option>
          <option value="in_progress">In Progress</option>
          <option value="valid">Valid EPC</option>
          <option value="expiring">Expiring Soon</option>
        </select>
        <select className={styles.filterSelect} value={tenureFilter} onChange={e => setTenureFilter(e.target.value)}>
          <option value="all">Sales & Lettings</option>
          <option value="sale">For Sale</option>
          <option value="let">To Let</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Home size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <h3>No properties found</h3>
            <p>Try adjusting your filters or connect your CRM in Settings.</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Tenure</th>
                <th>EPC Status</th>
                <th>Rating</th>
                <th>Billing</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const statusCfg = EPC_STATUS_CONFIG[p.epcStatus]
                return (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.addressCol}>
                        <span className={styles.addressMain}>{p.address}</span>
                        <span className={styles.addressSub}>{p.town}, {p.postcode}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.tenurePill}>{p.tenure === 'sale' ? 'Sale' : 'Let'}</span>
                    </td>
                    <td>
                      <span className={`${styles.epcStatusPill} ${statusCfg.className}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </td>
                    <td>
                      {p.epcRating ? (
                        <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{p.epcRating}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <select
                        className={styles.billingSelect}
                        value={p.billing}
                        onChange={e => updateBilling(p.id, e.target.value as BillingPref)}
                      >
                        <option value="agency">Agency pays</option>
                        <option value="vendor">Vendor pays</option>
                      </select>
                    </td>
                    <td>
                      <button className={styles.actionBtn} onClick={() => setSelectedProperty(p)}>
                        View →
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide-over */}
      <div className={`${styles.overlay} ${selectedProperty ? styles.overlayOpen : ''}`} onClick={() => setSelectedProperty(null)}>
        <div className={`${styles.slideOver} ${selectedProperty ? styles.slideOverOpen : ''}`} onClick={e => e.stopPropagation()}>
          {selectedProperty && (
            <>
              <div className={styles.slideHeader}>
                <h2 className={styles.slideTitle}>{selectedProperty.address}</h2>
                <button className={styles.closeBtn} onClick={() => setSelectedProperty(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.slideContent}>
                <div className={styles.detailCard}>
                  <p className={styles.detailTitle}>Property Details</p>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Town</span><span className={styles.detailValue}>{selectedProperty.town}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Postcode</span><span className={styles.detailValue}>{selectedProperty.postcode}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Tenure</span><span className={styles.detailValue}>{selectedProperty.tenure === 'sale' ? 'For Sale' : 'To Let'}</span></div>
                </div>
                <div className={styles.detailCard}>
                  <p className={styles.detailTitle}>EPC Status</p>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Status</span><span className={styles.detailValue}>{EPC_STATUS_CONFIG[selectedProperty.epcStatus].label}</span></div>
                  {selectedProperty.epcRating && <div className={styles.detailRow}><span className={styles.detailLabel}>Rating</span><span className={styles.detailValue}>{selectedProperty.epcRating}</span></div>}
                  {selectedProperty.epcExpiry && <div className={styles.detailRow}><span className={styles.detailLabel}>Expires</span><span className={styles.detailValue}>{selectedProperty.epcExpiry}</span></div>}
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Job Status</span><span className={styles.detailValue}>{selectedProperty.jobStatus.replace(/_/g, ' ')}</span></div>
                </div>
                <div className={styles.detailCard}>
                  <p className={styles.detailTitle}>Vendor Contact</p>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Name</span><span className={styles.detailValue}>{selectedProperty.vendorName}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Email</span><span className={styles.detailValue}>{selectedProperty.vendorEmail}</span></div>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Phone</span><span className={styles.detailValue}>{selectedProperty.vendorPhone}</span></div>
                </div>
                <div className={styles.detailCard}>
                  <p className={styles.detailTitle}>Billing</p>
                  <div className={styles.detailRow}><span className={styles.detailLabel}>Responsibility</span><span className={styles.detailValue}>{selectedProperty.billing === 'agency' ? 'Agency' : 'Vendor'}</span></div>
                </div>
              </div>
              <div className={styles.slideFooter}>
                {selectedProperty.epcStatus === 'needed' && (
                  <button className={styles.primaryBtn} style={{ flex: 1, justifyContent: 'center' }}>
                    Trigger Outreach
                  </button>
                )}
                <button className={styles.secondaryBtn} onClick={() => setSelectedProperty(null)}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
