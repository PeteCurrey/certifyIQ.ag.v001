import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  propertyAddress: string
  amountPaid: number
  scheduleUrl: string
}

export default function VendorPaymentConfirmed({ propertyAddress, amountPaid, scheduleUrl }: Props) {
  return (
    <EmailWrapper badge="Payment Confirmed">
      <h2 style={base.h2}>Payment received ✓</h2>
      <p style={base.p}>
        Thank you — we've received your payment of <strong style={{ color: '#fff' }}>£{amountPaid.toFixed(2)}</strong> for the EPC assessment at:
      </p>
      <p style={{ ...base.p, color: '#fff', fontWeight: 600 }}>
        {propertyAddress}
      </p>
      <div style={{ ...base.infoBox, border: '1px solid rgba(155,255,89,0.2)' }}>
        <p style={{ margin: 0, color: '#9bff59', fontWeight: 600 }}>
          ✓ Payment successful
        </p>
      </div>
      <p style={base.p}>
        You can now choose a convenient date and time for the assessor's visit using the link below:
      </p>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href={scheduleUrl} style={base.cta}>Book Appointment →</a>
      </div>
    </EmailWrapper>
  )
}
