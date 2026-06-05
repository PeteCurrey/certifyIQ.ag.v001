import React from 'react'
import { ShieldCheck } from 'lucide-react'

export default function ElmhurstBadge() {
  return (
    <>
      <style>{`
        .elmhurst-badge-container {
          display: inline-flex;
          align-items: center;
          gap: 1.25rem;
          background: var(--bg-surface);
          border: 1.5px solid var(--accent-lime);
          border-radius: 12px;
          padding: 1.25rem 1.75rem;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
          text-align: left;
          max-width: 100%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .elmhurst-badge-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(15, 118, 110, 0.08);
          border-color: #115E59;
        }
        .elmhurst-badge-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 118, 110, 0.1);
          border-radius: 50%;
          padding: 0.75rem;
          flex-shrink: 0;
        }
        .elmhurst-badge-title {
          font-family: var(--font-headings, sans-serif);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.2;
        }
        .elmhurst-badge-sub {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0.25rem 0 0 0;
          line-height: 1.3;
        }
      `}</style>
      <a
        href="https://www.elmhurstenergy.co.uk"
        target="_blank"
        rel="noopener noreferrer"
        className="elmhurst-badge-container"
      >
        <div className="elmhurst-badge-icon-wrap">
          <ShieldCheck size={28} color="var(--accent-lime)" />
        </div>
        <div>
          <h4 className="elmhurst-badge-title">Elmhurst Energy</h4>
          <p className="elmhurst-badge-sub">Accredited Domestic Energy Assessor</p>
        </div>
      </a>
    </>
  )
}
