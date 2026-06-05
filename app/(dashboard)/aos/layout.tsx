import React from 'react'

export default function AosLayout({ children }: { children: React.ReactNode }) {
  // We'll skip complex gating for this prototype, assume logged in.
  return (
    <div style={{ padding: '2rem', minHeight: 'calc(100vh - 70px)', background: '#050810' }}>
      {children}
    </div>
  )
}
