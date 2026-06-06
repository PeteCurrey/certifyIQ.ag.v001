import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  agencyName: string
  email: string
  phone: string
  dashboardUrl: string
}

export default function AdminNewAgent({ agencyName, email, phone, dashboardUrl }: Props) {
  return (
    <EmailWrapper badge="New Registration">
      <h2 style={base.h2}>New agent registered</h2>
      <p style={base.p}>
        A new estate agency has created an account on the Avorria portal.
      </p>
      <div style={base.infoBox}>
        <div style={base.infoRow}>
          <span style={{ color: '#888' }}>Agency Name</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{agencyName}</span>
        </div>
        <div style={base.infoRow}>
          <span style={{ color: '#888' }}>Email</span>
          <span style={{ color: '#fff' }}>{email}</span>
        </div>
        <div style={{ ...base.infoRow, borderBottom: 'none' }}>
          <span style={{ color: '#888' }}>Phone</span>
          <span style={{ color: '#fff' }}>{phone}</span>
        </div>
      </div>
      <p style={base.p}>
        They are currently in the <strong>pending setup</strong> state. Please review their account and assist with CRM connection if required.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <a href={dashboardUrl} style={base.cta}>Review in AOS →</a>
      </div>
    </EmailWrapper>
  )
}
