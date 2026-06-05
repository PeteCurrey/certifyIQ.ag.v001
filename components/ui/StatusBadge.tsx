import React from 'react'

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending_payment:      { label: 'Pending Payment',   bg: '#1E2D4A', color: '#8BA3BF' },
  paid:                 { label: 'Paid',               bg: '#091A12', color: '#9BFF59' },
  scheduled:            { label: 'Scheduled',          bg: '#0D1A30', color: '#60A5FA' },
  in_progress:          { label: 'In Progress',        bg: '#1A1200', color: '#F5A623' },
  assessment_complete:  { label: 'Assessed',           bg: '#0A1A10', color: '#7ED321' },
  certificate_issued:   { label: 'Certificate Issued', bg: '#091A12', color: '#9BFF59' },
  cancelled:            { label: 'Cancelled',          bg: '#1A0808', color: '#FF5C5C' },
  refunded:             { label: 'Refunded',           bg: '#1A0808', color: '#FF5C5C' },
}

export default function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: '#1E2D4A', color: '#8BA3BF' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      background: cfg.bg,
      color: cfg.color,
      fontSize: '0.75rem',
      fontFamily: 'DM Mono, monospace',
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  )
}
