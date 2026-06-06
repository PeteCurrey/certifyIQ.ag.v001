import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  vendorName: string
  propertyAddress: string
  agencyName: string
  scheduleUrl: string
  bookingRef: string
}

export default function VendorAccessRequest({ vendorName, propertyAddress, agencyName, scheduleUrl, bookingRef }: Props) {
  return (
    <EmailWrapper badge="Energy Performance Certificates">
      <h2 style={base.h2}>EPC assessment arranged for your property</h2>
      <p style={base.p}>Dear {vendorName},</p>
      <p style={base.p}>
        <strong>{agencyName}</strong> has arranged an Energy Performance Certificate (EPC) assessment for your property at:
      </p>
      <p style={{ ...base.p, color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>
        {propertyAddress}
      </p>
      <p style={base.p}>
        Please choose a convenient date and time for our assessor to visit. Appointments typically take 45–90 minutes.
      </p>
      <div style={base.infoBox}>
        <div style={{ ...base.infoRow, borderBottom: 'none' }}>
          <span style={{ color: '#888' }}>Booking Reference</span>
          <span style={{ color: '#9bff59', fontFamily: 'monospace', fontWeight: 700 }}>{bookingRef}</span>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <a href={scheduleUrl} style={base.cta}>Choose Date & Time →</a>
      </div>
    </EmailWrapper>
  )
}
