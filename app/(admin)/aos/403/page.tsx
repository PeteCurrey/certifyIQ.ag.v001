'use client'
import React from 'react'
import Link from 'next/link'

export default function AccessRestricted403() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'var(--text-primary)',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0d1527 0%, #030712 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '3rem 2.5rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.9rem',
          color: 'var(--accent-lime, #9BFF59)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          display: 'block',
          marginBottom: '1rem',
        }}>AOS</span>
        
        <h1 style={{
          fontFamily: 'var(--font-headings, sans-serif)',
          fontSize: '2rem',
          fontWeight: 700,
          margin: '0 0 1rem 0',
          color: 'var(--text-primary)',
        }}>403 — Access Restricted</h1>
        
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          margin: '0 0 2rem 0',
        }}>
          You don't have permission to access this module.
          <br />
          Contact your administrator if you believe this is incorrect.
        </p>
        
        <Link 
          href="/aos"
          style={{
            display: 'inline-block',
            background: 'var(--accent-lime, #9BFF59)',
            color: '#000',
            fontWeight: 700,
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#aaff6b'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-lime, #9BFF59)'}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
