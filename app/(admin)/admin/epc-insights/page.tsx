import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function EPCInsightsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: searches } = await supabase.from('epc_searches').select('*').order('created_at', { ascending: false })
  const { data: leads } = await supabase.from('epc_leads').select('*').order('created_at', { ascending: false })

  const totalSearches = searches?.length || 0
  const totalLeads = leads?.length || 0
  
  const badRatingsCount = searches?.filter(s => ['D', 'E', 'F', 'G'].includes(s.rating || '')).length || 0

  return (
    <div style={{ color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>EPC Register Insights</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#0D1A30', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ color: '#8BA3BF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Searches</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{totalSearches}</p>
        </div>
        <div style={{ background: '#0D1A30', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ color: '#8BA3BF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Searched D-G Ratings</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'DM Mono, monospace', color: '#F5A623' }}>{badRatingsCount}</p>
        </div>
        <div style={{ background: '#0D1A30', border: '1px solid #1E2D4A', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ color: '#8BA3BF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Leads Generated</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'DM Mono, monospace', color: 'var(--accent-lime)' }}>{totalLeads}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '1rem' }}>Recent Searches</h2>
      <div style={{ background: '#0D1A30', border: '1px solid #1E2D4A', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#1E2D4A', color: '#8BA3BF', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Time</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Postcode</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Property Viewed</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {(searches || []).slice(0, 50).map((s: any) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #1E2D4A', fontSize: '0.875rem' }}>
                <td style={{ padding: '0.75rem 1rem' }}>{new Date(s.created_at).toLocaleString()}</td>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'DM Mono, monospace' }}>{s.postcode}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{s.lmk_key ? 'Yes' : 'No'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{s.rating || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
