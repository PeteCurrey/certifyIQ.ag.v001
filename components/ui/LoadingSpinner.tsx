import React from 'react'

export default function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: '2px solid var(--border-subtle)',
      borderTop: '2px solid var(--accent-lime)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  )
}
