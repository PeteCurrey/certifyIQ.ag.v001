import React from 'react'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'

export default function AgentBand() {
  return (
    <section style={{ background: '#0F1628', padding: '5rem 2rem', borderTop: '1px solid #1E2D4A', borderBottom: '1px solid #1E2D4A' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem' }}>
        <div style={{ flex: '1 1 500px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(155, 255, 89, 0.1)', color: '#9BFF59', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <Building2 size={16} /> For Estate Agents
          </div>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'Syne, sans-serif', color: '#E8F4FF', margin: '0 0 1rem', lineHeight: 1.2 }}>
            Automate your EPC pipeline
          </h2>
          <p style={{ color: '#8BA3BF', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Connect your CRM (Alto, Street, Reapit). When a new property is instructed, we automatically check the EPC register, contact the vendor to arrange access, and manage the assessment. You don't lift a finger.
          </p>
          <Link href="/for/agents" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#E8F4FF', color: '#080D18', padding: '0.875rem 1.75rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
            Learn more about the Agent Portal <ArrowRight size={18} />
          </Link>
        </div>
        <div style={{ flex: '1 1 400px', background: '#080D18', border: '1px solid #1E2D4A', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(155, 255, 89, 0.05)', border: '1px solid rgba(155, 255, 89, 0.2)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ display: 'block', color: '#8BA3BF', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Automated Step 1</span>
              <strong style={{ color: '#9BFF59' }}>CRM Sync</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#E8F4FF', fontSize: '0.9rem' }}>We detect new instructions automatically.</p>
            </div>
            <div style={{ background: '#131A2D', border: '1px solid #1E2D4A', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ display: 'block', color: '#8BA3BF', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Automated Step 2</span>
              <strong style={{ color: '#E8F4FF' }}>EPC Check & Vendor Contact</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#8BA3BF', fontSize: '0.9rem' }}>If no valid EPC, we email the vendor to schedule.</p>
            </div>
            <div style={{ background: '#131A2D', border: '1px solid #1E2D4A', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ display: 'block', color: '#8BA3BF', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Automated Step 3</span>
              <strong style={{ color: '#E8F4FF' }}>Assessment & Certification</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#8BA3BF', fontSize: '0.9rem' }}>We visit, lodge the EPC, and sync it back to you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
