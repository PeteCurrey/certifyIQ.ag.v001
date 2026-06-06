import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  agencyName: string
  invoiceRef: string
  periodLabel: string
  jobs: number
  total: number
  dueDate: string
  paymentUrl: string
}

export default function AgentInvoice({ agencyName, invoiceRef, periodLabel, jobs, total, dueDate, paymentUrl }: Props) {
  return (
    <EmailWrapper badge="Monthly Invoice">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ margin: '0 0 0.25rem', color: '#888', fontSize: '0.8rem' }}>To</p>
          <p style={{ margin: 0, color: '#fff', fontWeight: 600 }}>{agencyName}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 0.25rem', color: '#888', fontSize: '0.8rem' }}>Invoice</p>
          <p style={{ margin: 0, color: '#fff', fontFamily: 'monospace', fontSize: '0.85rem' }}>{invoiceRef}</p>
        </div>
      </div>
      <div style={base.infoBox}>
        <div style={base.infoRow}>
          <span style={{ color: '#888' }}>Period</span>
          <span style={{ color: '#fff' }}>{periodLabel}</span>
        </div>
        <div style={base.infoRow}>
          <span style={{ color: '#888' }}>EPCs completed</span>
          <span style={{ color: '#fff' }}>{jobs}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.875rem' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>Total Due</span>
          <span style={{ color: '#9bff59', fontWeight: 700, fontSize: '1.25rem', fontFamily: 'monospace' }}>
            £{total.toFixed(2)}
          </span>
        </div>
      </div>
      <p style={base.p}>
        Payment due by <strong style={{ color: '#fff' }}>{dueDate}</strong>. Bank transfer or card payment accepted.
      </p>
      <a href={paymentUrl} style={base.cta}>View & Pay Invoice →</a>
    </EmailWrapper>
  )
}
