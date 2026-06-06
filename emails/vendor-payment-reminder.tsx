import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  propertyAddress: string
  agencyName: string
  paymentLink: string
  amount: number
}

export default function VendorPaymentReminder({ propertyAddress, agencyName, paymentLink, amount }: Props) {
  return (
    <EmailWrapper badge="Reminder">
      <h2 style={base.h2}>EPC payment reminder</h2>
      <p style={base.p}>
        We contacted you recently about an EPC assessment for <strong style={{ color: '#fff' }}>{propertyAddress}</strong>, arranged by {agencyName}.
      </p>
      <p style={base.p}>
        We noticed payment is still outstanding. Properties that go to market without a valid EPC can face legal issues — we'd like to help you get this sorted quickly.
      </p>
      <div style={{ textAlign: 'center', margin: '2.5rem 0' }}>
        <p style={{ margin: '0 0 1rem', color: '#fff', fontSize: '2rem', fontWeight: 700, fontFamily: 'monospace' }}>
          £{amount.toFixed(2)}
        </p>
        <a href={paymentLink} style={base.cta}>Complete Payment →</a>
      </div>
      <p style={{ ...base.p, fontSize: '0.8rem', color: '#666' }}>
        If you believe you've already paid, please ignore this email or contact us.
      </p>
    </EmailWrapper>
  )
}
