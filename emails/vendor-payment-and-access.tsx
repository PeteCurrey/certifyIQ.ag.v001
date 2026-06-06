import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  vendorName: string
  propertyAddress: string
  agencyName: string
  paymentLink: string
  amount: number
  expiryDate: string
}

export default function VendorPaymentAndAccess({ vendorName, propertyAddress, agencyName, paymentLink, amount, expiryDate }: Props) {
  return (
    <EmailWrapper badge="Action Required">
      <h2 style={base.h2}>EPC assessment — payment required</h2>
      <p style={base.p}>Dear {vendorName},</p>
      <p style={base.p}>
        <strong>{agencyName}</strong> has requested an Energy Performance Certificate (EPC) assessment for your property at <strong style={{ color: '#fff' }}>{propertyAddress}</strong>.
      </p>
      <p style={base.p}>
        Payment is required before we can book your assessment. The certificate will be emailed to you upon completion and is valid for 10 years.
      </p>
      <div style={{ ...base.infoBox, textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem', color: '#888', fontSize: '0.875rem' }}>Amount due</p>
        <p style={{ margin: '0 0 1.5rem', color: '#fff', fontSize: '2.5rem', fontWeight: 700, fontFamily: 'monospace' }}>
          £{amount.toFixed(2)}
        </p>
        <a href={paymentLink} style={base.cta}>Pay & Book Assessment →</a>
        <p style={{ margin: '1rem 0 0', color: '#666', fontSize: '0.75rem' }}>
          Payment link expires {expiryDate}
        </p>
      </div>
      <p style={{ ...base.p, fontSize: '0.9rem' }}>
        Once payment is confirmed, you'll be able to choose a convenient date and time for the assessor's visit.
      </p>
    </EmailWrapper>
  )
}
