import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  propertyAddress: string
  epcRating: string
  certificateUrl: string
  validUntil: string
}

export default function EpcCertificateIssued({ propertyAddress, epcRating, certificateUrl, validUntil }: Props) {
  return (
    <EmailWrapper badge="Certificate Issued">
      <h2 style={base.h2}>Your EPC is ready</h2>
      <p style={base.p}>
        The Energy Performance Certificate (EPC) assessment for <strong style={{ color: '#fff' }}>{propertyAddress}</strong> has been completed and lodged on the national register.
      </p>
      <div style={{ ...base.infoBox, textAlign: 'center' }}>
        <p style={{ margin: '0 0 0.5rem', color: '#888', fontSize: '0.875rem' }}>Energy Rating</p>
        <p style={{ margin: '0 0 1.5rem', color: '#fff', fontSize: '3rem', fontWeight: 800, fontFamily: 'monospace' }}>
          {epcRating}
        </p>
        <a href={certificateUrl} style={base.cta}>View & Download Certificate →</a>
        <p style={{ margin: '1rem 0 0', color: '#666', fontSize: '0.8rem' }}>
          Valid until {validUntil}
        </p>
      </div>
      <p style={base.p}>
        This certificate is valid for 10 years and can be used for selling or letting the property.
      </p>
    </EmailWrapper>
  )
}
