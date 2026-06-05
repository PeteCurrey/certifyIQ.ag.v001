import React from 'react'

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending_payment:      { label: 'Pending Payment',   bg: 'rgba(161, 161, 170, 0.12)', color: 'var(--text-secondary)' },
  paid:                 { label: 'Paid',               bg: 'rgba(15, 118, 110, 0.12)', color: 'var(--accent-lime)' },
  scheduled:            { label: 'Scheduled',          bg: 'rgba(59, 130, 246, 0.12)', color: '#2563EB' },
  in_progress:          { label: 'In Progress',        bg: 'rgba(217, 119, 6, 0.12)', color: 'var(--accent-amber)' },
  assessment_complete:  { label: 'Assessed',           bg: 'rgba(20, 184, 166, 0.12)', color: '#0D9488' },
  certificate_issued:   { label: 'Certificate Issued', bg: 'rgba(15, 118, 110, 0.12)', color: 'var(--accent-lime)' },
  cancelled:            { label: 'Cancelled',          bg: 'rgba(220, 38, 38, 0.12)', color: 'var(--accent-red)' },
  refunded:             { label: 'Refunded',           bg: 'rgba(220, 38, 38, 0.12)', color: 'var(--accent-red)' },
}

export default function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: 'rgba(161, 161, 170, 0.12)', color: 'var(--text-secondary)' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      background: cfg.bg,
      color: cfg.color,
      fontSize: '0.75rem',
      fontFamily: 'var(--font-mono, monospace)',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      border: `1px solid ${cfg.color}15`,
    }}>
      {cfg.label}
    </span>
  )
}
