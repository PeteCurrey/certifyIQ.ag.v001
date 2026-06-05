import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'

export default async function PortfolioDashboard() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch the customer record
  const { data: customer } = await supabase.from('customers').select('id').eq('auth_user_id', user.id).single()
  
  if (!customer) {
    return <div style={{ color: '#fff' }}>Error loading portfolio. Please contact support.</div>
  }

  const { data: reports } = await supabase
    .from('compliance_reports')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })

  const total = reports?.length || 0
  const nonCompliant = reports?.filter(r => r.overall_score === 'NON COMPLIANT').length || 0
  const atRisk = reports?.filter(r => ['AT RISK', 'HIGH RISK'].includes(r.overall_score || '')).length || 0

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Landlord Portfolio Tracker</h1>
        <Link 
          href="/landlord-compliance" 
          style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-lime)', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, fontFamily: 'DM Mono, monospace' }}
        >
          + Assess New Property
        </Link>
      </div>

      {/* Aggregate Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#0D1A30', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ color: '#8BA3BF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Tracked Properties</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{total}</p>
        </div>
        <div style={{ background: 'rgba(255, 92, 92, 0.05)', border: '1px solid rgba(255, 92, 92, 0.2)', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ color: '#FF5C5C', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Illegal to Rent (F/G)</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'DM Mono, monospace', color: '#FF5C5C' }}>{nonCompliant}</p>
        </div>
        <div style={{ background: 'rgba(245, 166, 35, 0.05)', border: '1px solid rgba(245, 166, 35, 0.2)', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ color: '#F5A623', fontSize: '0.875rem', marginBottom: '0.5rem' }}>At Risk / Band C Gap</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'DM Mono, monospace', color: '#F5A623' }}>{atRisk}</p>
        </div>
      </div>

      {total === 0 ? (
        <div style={{ background: '#0D1A30', border: '1px solid #1E2D4A', padding: '4rem 2rem', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your portfolio is empty</h2>
          <p style={{ color: '#8BA3BF', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            Run a free compliance assessment on your properties and save them here to track your legislative risk and plan improvements.
          </p>
          <Link 
            href="/landlord-compliance" 
            style={{ padding: '0.75rem 1.5rem', background: '#1E2D4A', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 500 }}
          >
            Run an Assessment
          </Link>
        </div>
      ) : (
        <div style={{ background: '#0D1A30', border: '1px solid #1E2D4A', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1E2D4A', color: '#8BA3BF', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Property Address</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Current EPC</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Compliance Status</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports?.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #1E2D4A', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{r.address}</div>
                    <div style={{ color: '#8BA3BF', fontSize: '0.875rem' }}>{r.postcode}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <RatingBadge rating={r.current_rating} size="sm" />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      fontFamily: 'DM Mono, monospace',
                      background: r.overall_score === 'NON COMPLIANT' ? 'rgba(255, 92, 92, 0.1)' : r.overall_score.includes('RISK') ? 'rgba(245, 166, 35, 0.1)' : 'rgba(155, 255, 89, 0.1)',
                      color: r.overall_score === 'NON COMPLIANT' ? '#FF5C5C' : r.overall_score.includes('RISK') ? '#F5A623' : 'var(--accent-lime)'
                    }}>
                      {r.overall_score}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/landlord-compliance/report/${r.id}`} style={{ color: 'var(--accent-lime)', textDecoration: 'none', fontSize: '0.875rem' }}>
                      View Full Report →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
