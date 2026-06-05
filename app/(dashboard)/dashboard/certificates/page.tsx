'use client'
import React, { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, Loader2, Download, Search, Filter, Trash2 } from 'lucide-react'
import styles from './certificates.module.css'

const CERT_TYPES = ['All', 'EPC', 'Commercial EPC', 'EICR', 'Gas Safety', 'Fire Risk', 'SAP Calc', 'Air Test', 'Part L', 'BRUKL', 'Water Calc']

const MOCK_CERTS = [
  { id: 'c1', type: 'EPC', property: '14 Mill Lane, Derby', rating: 'D', issued: '2014-01-15', expires: '2024-01-15', status: 'Expired', file: true },
  { id: 'c2', type: 'Gas Safety', property: '7 Oak Street, Chesterfield', rating: null, issued: '2025-06-23', expires: '2026-06-23', status: 'Expiring Soon', file: true },
  { id: 'c3', type: 'Commercial EPC', property: 'Unit 4, Sheffield', rating: 'E', issued: '2016-06-17', expires: '2026-06-17', status: 'Expiring Soon', file: true },
  { id: 'c4', type: 'EICR', property: '22 Victoria Road, Matlock', rating: null, issued: '2021-07-03', expires: '2026-07-03', status: 'At Risk', file: true },
  { id: 'c5', type: 'EPC', property: '31 Beech Drive, Nottingham', rating: 'C', issued: '2016-07-05', expires: '2026-07-05', status: 'At Risk', file: true },
  { id: 'c6', type: 'Gas Safety', property: '103 Lime Street, Derby', rating: null, issued: '2026-04-08', expires: '2027-04-08', status: 'Valid', file: true },
  { id: 'c7', type: 'Fire Risk', property: 'Unit 4, Sheffield', rating: null, issued: '2023-01-12', expires: '2025-01-12', status: 'Expired', file: false },
  { id: 'c8', type: 'SAP Calc', property: 'Plot 7, Meadowbrook', rating: null, issued: '2026-05-01', expires: null, status: 'Valid', file: true },
  { id: 'c9', type: 'Air Test', property: 'Plot 7, Meadowbrook', rating: null, issued: null, expires: null, status: 'Missing', file: false },
]

interface AiAnalysisResult {
  certificate_type?: string
  property_address?: string
  expiry_date?: string
  rating?: string
  notes?: string
}

export default function CertificatesPage() {
  const [selectedType, setSelectedType] = useState('All')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = MOCK_CERTS.filter(c => {
    const matchType = selectedType === 'All' || c.type === selectedType
    const matchSearch = c.property.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadFile(file)
    setUploading(true)
    setAiResult(null)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/ai/document-analysis', {
        method: 'POST', body: form
      })
      const data = await res.json()
      if (data.extracted) setAiResult(data.extracted)
    } catch (err) {
      setAiResult({ notes: 'AI analysis unavailable — please fill in details manually.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Certificate Centre</h1>
          <p className={styles.pageSub}>Document vault — all compliance certificates in one place</p>
        </div>
        <button className={styles.uploadBtn} onClick={() => { setShowUploadModal(true); setAiResult(null); setUploadFile(null) }}>
          <Upload size={16} /> Upload Certificate
        </button>
      </div>

      {/* Summary Stats */}
      <div className={styles.summaryRow}>
        {[
          { label: 'Valid', count: 3, color: '#9BFF59' },
          { label: 'At Risk', count: 2, color: '#F59E0B' },
          { label: 'Expiring Soon', count: 2, color: '#FB923C' },
          { label: 'Expired', count: 2, color: '#F87171' },
          { label: 'Missing', count: 1, color: '#8BA3BF' },
        ].map(s => (
          <div key={s.label} className={styles.summaryCard}>
            <span className={styles.summaryCount} style={{ color: s.color }}>{s.count}</span>
            <span className={styles.summaryLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className={styles.toolBar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search property or certificate type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.typeScroll}>
          {CERT_TYPES.map(t => (
            <button
              key={t}
              className={`${styles.typeBtn} ${selectedType === t ? styles.typeBtnActive : ''}`}
              onClick={() => setSelectedType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Grid */}
      <div className={styles.certsGrid}>
        {filtered.map(cert => (
          <div key={cert.id} className={`${styles.certCard} ${styles[`status_${cert.status.toLowerCase().replace(/ /g, '_')}`]}`}>
            <div className={styles.certHeader}>
              <div className={styles.certTypeTag}>{cert.type}</div>
              <div className={styles.certStatus} data-status={cert.status.toLowerCase().replace(' ', '-')}>{cert.status}</div>
            </div>
            <p className={styles.certProperty}>{cert.property}</p>
            {cert.rating && <div className={styles.certRating}>EPC Rating: <strong>{cert.rating}</strong></div>}
            <div className={styles.certDates}>
              {cert.issued && <span>Issued: {new Date(cert.issued).toLocaleDateString('en-GB')}</span>}
              {cert.expires && (
                <span className={cert.status !== 'Valid' ? styles.expiredDate : ''}>
                  Expires: {new Date(cert.expires).toLocaleDateString('en-GB')}
                </span>
              )}
              {!cert.expires && !cert.issued && <span className={styles.missingDates}>No dates recorded</span>}
            </div>
            <div className={styles.certActions}>
              {cert.file ? (
                <button className={styles.downloadBtn}><Download size={14} /> Download</button>
              ) : (
                <button className={styles.uploadCertBtn} onClick={() => setShowUploadModal(true)}>
                  <Upload size={14} /> Upload
                </button>
              )}
              <button className={styles.renewBtn}>Renew</button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal with AI Analysis */}
      {showUploadModal && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>Upload Certificate</h2>
            <p className={styles.modalDesc}>Upload a certificate or compliance document. Our AI will automatically read the expiry date, property address, and certificate type.</p>

            <input
              type="file"
              ref={fileRef}
              style={{ display: 'none' }}
              accept="application/pdf,image/png,image/jpeg"
              onChange={handleFileChange}
            />

            {!uploadFile ? (
              <div className={styles.dropZone} onClick={() => fileRef.current?.click()}>
                <Upload size={40} color="#4A6280" />
                <p>Drop PDF or Image here, or click to upload</p>
                <span>AI will automatically extract all details</span>
              </div>
            ) : (
              <div className={styles.filePreview}>
                <FileText size={20} color="#9BFF59" />
                <span>{uploadFile.name}</span>
                {uploading && <Loader2 size={16} className={styles.spin} color="#9BFF59" />}
              </div>
            )}

            {uploading && (
              <div className={styles.aiThinking}>
                <Loader2 size={18} className={styles.spin} color="#9BFF59" />
                <span>Claude AI is reading your document...</span>
              </div>
            )}

            {aiResult && (
              <div className={styles.aiResult}>
                <div className={styles.aiResultHeader}>
                  <CheckCircle size={16} color="#9BFF59" />
                  <span>AI Analysis Complete</span>
                </div>
                {aiResult.certificate_type && <div className={styles.aiField}><label>Type:</label><span>{aiResult.certificate_type}</span></div>}
                {aiResult.property_address && <div className={styles.aiField}><label>Property:</label><span>{aiResult.property_address}</span></div>}
                {aiResult.expiry_date && <div className={styles.aiField}><label>Expiry:</label><span>{aiResult.expiry_date}</span></div>}
                {aiResult.rating && <div className={styles.aiField}><label>Rating:</label><span>{aiResult.rating}</span></div>}
                {aiResult.notes && <div className={styles.aiNotes}>{aiResult.notes}</div>}
              </div>
            )}

            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className={styles.modalSubmit} disabled={!uploadFile || uploading}>
                {uploading ? 'Analysing...' : 'Save Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
