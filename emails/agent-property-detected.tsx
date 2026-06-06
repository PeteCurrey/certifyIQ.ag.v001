import * as React from 'react'
import { EmailWrapper, base } from './_base'

interface Props {
  agencyName: string
  propertyAddress: string
  epcStatus: 'missing' | 'expired' | 'expiring_soon'
  dashboardUrl: string
}

export default function AgentPropertyDetected({ agencyName, propertyAddress, epcStatus, dashboardUrl }: Props) {
  const statusLabel = epcStatus === 'missing' ? 'No EPC found'
    : epcStatus === 'expired' ? 'EPC expired'
    : 'EPC expiring soon'
  const statusColor = epcStatus === 'expiring_soon' ? '#feca57' : '#ff4757'

  return (
    <EmailWrapper badge="Agent Alert">
      <h2 style={base.h2}>New property — EPC {statusLabel}</h2>
      <p style={base.p}>
        A new property has been detected in your CRM and we've checked the national EPC register.
      </p>
      <div style={base.infoBox}>
        <div style={base.infoRow}>
          <span style={{ color: '#888' }}>Property</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{propertyAddress}</span>
        </div>
        <div style={{ ...base.infoRow, borderBottom: 'none' }}>
          <span style={{ color: '#888' }}>EPC Status</span>
          <span style={{ color: statusColor, fontWeight: 700 }}>{statusLabel}</span>
        </div>
      </div>
      <p style={base.p}>
        We've already begun the process of arranging an EPC assessment. You can track progress in your agent dashboard.
      </p>
      <a href={dashboardUrl} style={base.cta}>View in Dashboard →</a>
    </EmailWrapper>
  )
}
