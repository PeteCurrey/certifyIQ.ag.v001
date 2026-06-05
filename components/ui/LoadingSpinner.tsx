import React from 'react'

export default function LoadingSpinner({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: '2px solid #1E2D4A',
      borderTop: '2px solid #9BFF59',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  )
}
