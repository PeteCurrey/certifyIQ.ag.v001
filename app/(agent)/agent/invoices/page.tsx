'use client'
import React from 'react'
import { Download, FileText } from 'lucide-react'
import styles from './invoices.module.css'

type InvoiceStatus = 'paid' | 'draft' | 'issued' | 'overdue'

interface Invoice {
  id: string
  ref: string
  period: string
  jobs: number
  total: number
  status: InvoiceStatus
  due: string
  paid?: string
}

const MOCK_INVOICES: Invoice[] = [
  { id: '1', ref: 'AVR-INV-AG202506-0012', period: 'June 2025', jobs: 12, total: 780, status: 'draft', due: '2025-07-07' },
  { id: '2', ref: 'AVR-INV-AG202505-0009', period: 'May 2025', jobs: 9, total: 585, status: 'paid', due: '2025-06-07', paid: '2025-06-05' },
  { id: '3', ref: 'AVR-INV-AG202504-0015', period: 'April 2025', jobs: 15, total: 975, status: 'paid', due: '2025-05-07', paid: '2025-05-04' },
  { id: '4', ref: 'AVR-INV-AG202403-0007', period: 'March 2025', jobs: 7, total: 455, status: 'paid', due: '2025-04-07', paid: '2025-04-03' },
]

const STATUS_CLASS: Record<InvoiceStatus, string> = {
  paid: styles.statusPaid,
  draft: styles.statusDraft,
  issued: styles.statusIssued,
  overdue: styles.statusOverdue,
}

const totalOutstanding = MOCK_INVOICES.filter(i => i.status === 'issued' || i.status === 'overdue').reduce((s, i) => s + i.total, 0)
const totalPaid = MOCK_INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)

export default function InvoicesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Invoices & Billing</h1>
          <p>Monthly invoices for all EPC assessments arranged via your agent account.</p>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>This Month (Draft)</p>
          <p className={styles.summaryAmount}>£{MOCK_INVOICES[0].total.toFixed(2)}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Outstanding</p>
          <p className={styles.summaryAmount} style={{ color: totalOutstanding > 0 ? '#ff4757' : 'var(--text-primary)' }}>
            £{totalOutstanding.toFixed(2)}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Total Paid (YTD)</p>
          <p className={styles.summaryAmount} style={{ color: 'var(--accent-lime)' }}>£{totalPaid.toFixed(2)}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>EPCs This Month</p>
          <p className={styles.summaryAmount}>{MOCK_INVOICES[0].jobs}</p>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice Ref</th>
              <th>Period</th>
              <th>EPCs</th>
              <th>Total</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INVOICES.map(inv => (
              <tr key={inv.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={14} color="var(--text-secondary)" />
                    <span className={styles.refCode}>{inv.ref}</span>
                  </div>
                </td>
                <td>{inv.period}</td>
                <td>{inv.jobs}</td>
                <td><span className={styles.amount}>£{inv.total.toFixed(2)}</span></td>
                <td>
                  <span className={`${styles.statusPill} ${STATUS_CLASS[inv.status]}`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </td>
                <td>{inv.due}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {(inv.status === 'issued' || inv.status === 'overdue') && (
                      <button className={styles.payBtn}>Pay Now</button>
                    )}
                    {inv.status !== 'draft' && (
                      <button className={styles.downloadBtn}>
                        <Download size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />
                        PDF
                      </button>
                    )}
                    {inv.status === 'draft' && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Issued on 1st July</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.billingInfoCard}>
        <h3>Billing Configuration</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Default Billing Mode</span>
          <span className={styles.infoValue}>Agency pays (monthly invoice)</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Payment Terms</span>
          <span className={styles.infoValue}>7 days from invoice date</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Invoice Day</span>
          <span className={styles.infoValue}>1st of each month</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Billing Email</span>
          <span className={styles.infoValue}>billing@youragency.co.uk</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>VAT Registered</span>
          <span className={styles.infoValue}>No</span>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button className={styles.primaryBtn}>Update Billing Settings</button>
        </div>
      </div>
    </div>
  )
}
