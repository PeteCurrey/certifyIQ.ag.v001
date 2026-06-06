import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  propertyAddress: string
  appointmentDate: string // e.g. "Wednesday 12th June at 10:00 AM"
  assessorName?: string
}

export default function VendorScheduleConfirmed({ propertyAddress, appointmentDate, assessorName = 'an Avorria assessor' }: Props) {
  return (
    <EmailWrapper badge="Booking Confirmed">
      <h2 style={base.h2}>Assessment confirmed</h2>
      <p style={base.p}>
        Your EPC assessment for <strong style={{ color: '#fff' }}>{propertyAddress}</strong> has been confirmed.
      </p>
      <div style={base.infoBox}>
        <p style={{ margin: '0 0 0.5rem', color: '#888', fontSize: '0.875rem' }}>Appointment Time</p>
        <p style={{ margin: 0, color: '#9bff59', fontSize: '1.1rem', fontWeight: 700 }}>
          {appointmentDate}
        </p>
      </div>
      <p style={base.p}>
        <strong>{assessorName}</strong> will arrive within 30 minutes of this time. The assessment typically takes 45–90 minutes depending on the size of the property.
      </p>
      <p style={base.p}>
        Please ensure an adult (over 18) is present to provide access to all rooms, the boiler, and the loft if applicable.
      </p>
    </EmailWrapper>
  )
}
