import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { Building2, Users, FileText, CheckCircle, AlertTriangle, TrendingUp, Search } from 'lucide-react'
import Link from 'next/link'

export default async function AgencyDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // In a real scenario, this would query document_leads, master_properties with org_id matching the user's agency.
  // For the prototype, we mock some aggregate data.

  const mockLeads = [
    { id: 1, name: 'John Smith', property: '14 Mill Lane', doc: 'EPC (D)', score: 85, status: 'New' },
    { id: 2, name: 'Sarah Connor', property: 'Unit 4, Sheffield', doc: 'Commercial EPC', score: 65, status: 'Contacted' },
    { id: 3, name: 'Mike Johnson', property: '7 Oak Street', doc: 'Gas Safety', score: 90, status: 'Converted' },
  ]

  const mockPortfolioStats = {
    totalProperties: 124,
    compliant: 89,
    atRisk: 22,
    critical: 13
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#E8F4FF', margin: '0 0 0.5rem' }}>
            Agency CRM & Compliance Hub
          </h1>
          <p style={{ color: '#8BA3BF', margin: 0 }}>Overview of your landlords, properties, and AI-generated leads.</p>
        </div>
        <div style={{ background: 'rgba(155, 255, 89, 0.1)', color: '#9BFF59', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>
          Agency Pro Plan Active
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: 12 }}>
          <Building2 size={24} color="#60A5FA" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#8BA3BF', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>Managed Properties</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#E8F4FF', margin: 0 }}>{mockPortfolioStats.totalProperties}</p>
        </div>
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: 12 }}>
          <CheckCircle size={24} color="#10B981" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#8BA3BF', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>Compliant</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#E8F4FF', margin: 0 }}>{mockPortfolioStats.compliant}</p>
        </div>
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: 12, borderLeft: '3px solid #F59E0B' }}>
          <AlertTriangle size={24} color="#F59E0B" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#8BA3BF', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>At Risk (Next 90 Days)</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#E8F4FF', margin: 0 }}>{mockPortfolioStats.atRisk}</p>
        </div>
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: 12, borderLeft: '3px solid #EF4444' }}>
          <AlertTriangle size={24} color="#EF4444" style={{ marginBottom: '1rem' }} />
          <p style={{ color: '#8BA3BF', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>Critical (Expired)</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#E8F4FF', margin: 0 }}>{mockPortfolioStats.critical}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Leads Table */}
        <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #1E2D4A', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#E8F4FF', margin: 0 }}>Recent Landlord Leads (AI Analyser)</h2>
            <Link href="/agency/leads" style={{ color: '#9BFF59', fontSize: '0.85rem', textDecoration: 'none' }}>View All →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#162036', color: '#8BA3BF', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Lead Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Property</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Doc Analysed</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Lead Score</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLeads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #1E2D4A', color: '#E8F4FF', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>{lead.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#8BA3BF' }}>{lead.property}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{lead.doc}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #9BFF59', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9BFF59', fontWeight: 700, fontSize: '0.85rem' }}>
                      {lead.score}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      background: lead.status === 'New' ? 'rgba(59, 130, 246, 0.1)' : lead.status === 'Converted' ? 'rgba(16, 185, 129, 0.1)' : '#162036',
                      color: lead.status === 'New' ? '#60A5FA' : lead.status === 'Converted' ? '#10B981' : '#8BA3BF',
                      padding: '0.3rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600
                    }}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#0F1628', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: 12 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#E8F4FF', margin: '0 0 1rem' }}>Quick Actions</h3>
            
            <button style={{ width: '100%', padding: '0.75rem', background: '#9BFF59', color: '#080D18', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
              Import Properties (CSV)
            </button>
            <button style={{ width: '100%', padding: '0.75rem', background: '#162036', color: '#E8F4FF', border: '1px solid #1E2D4A', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
              Invite Landlord
            </button>
            <button style={{ width: '100%', padding: '0.75rem', background: '#162036', color: '#E8F4FF', border: '1px solid #1E2D4A', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Generate Portfolio Report
            </button>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(155,255,89,0.1), rgba(96,165,250,0.1))', border: '1px solid rgba(155,255,89,0.3)', padding: '1.5rem', borderRadius: 12 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#E8F4FF', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#9BFF59" /> Upsell Opportunity
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#8BA3BF', margin: '0 0 1rem', lineHeight: 1.5 }}>
              13 properties in your portfolio have F/G rated EPCs. Booking EPC improvement assessments for these properties could generate £1,950 in commission.
            </p>
            <button style={{ background: 'transparent', color: '#9BFF59', border: '1px solid #9BFF59', padding: '0.5rem 1rem', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              Review Properties
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
