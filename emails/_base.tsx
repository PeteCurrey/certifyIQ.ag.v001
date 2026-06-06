import * as React from 'react'

// Shared base styles
export const base = {
  wrapper: {
    fontFamily: 'Inter, -apple-system, sans-serif',
    maxWidth: '620px',
    margin: '0 auto',
    background: '#0a0a0a',
    color: '#e8e8e8',
    borderRadius: '12px',
    overflow: 'hidden',
  } as React.CSSProperties,
  header: {
    padding: '2rem',
    borderBottom: '1px solid #1a1a1a',
  } as React.CSSProperties,
  logo: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  } as React.CSSProperties,
  dot: { color: '#9bff59' } as React.CSSProperties,
  badge: {
    fontSize: '0.7rem',
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    display: 'block',
    marginTop: '0.25rem',
  } as React.CSSProperties,
  body: {
    padding: '2rem',
  } as React.CSSProperties,
  h2: {
    fontSize: '1.35rem',
    color: '#fff',
    margin: '0 0 1rem',
  } as React.CSSProperties,
  p: {
    color: '#aaa',
    lineHeight: 1.6,
    margin: '0 0 1rem',
  } as React.CSSProperties,
  infoBox: {
    background: '#111',
    border: '1px solid #1a1a1a',
    borderRadius: '8px',
    padding: '1.25rem',
    margin: '1.5rem 0',
  } as React.CSSProperties,
  infoRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    padding: '0.5rem 0',
    borderBottom: '1px solid #1a1a1a',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  cta: {
    display: 'inline-block',
    background: '#9bff59',
    color: '#0a0a0a',
    fontWeight: 700,
    padding: '0.875rem 1.75rem',
    borderRadius: '8px',
    textDecoration: 'none',
  } as React.CSSProperties,
  footer: {
    padding: '1.5rem 2rem',
    borderTop: '1px solid #1a1a1a',
    fontSize: '0.8rem',
    color: '#555',
  } as React.CSSProperties,
}

export function EmailWrapper({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div style={base.wrapper}>
      <div style={base.header}>
        <p style={base.logo}>Avorria<span style={base.dot}>.</span></p>
        {badge && <span style={base.badge}>{badge}</span>}
      </div>
      <div style={base.body}>{children}</div>
      <div style={base.footer}>
        Avorria · <a href="mailto:assessments@avorria.co.uk" style={{ color: '#9bff59' }}>assessments@avorria.co.uk</a> · avorria.co.uk
      </div>
    </div>
  )
}
