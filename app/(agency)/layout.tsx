import AgencySidebar from '@/components/agency/AgencySidebar'
import AgencyHeader from '@/components/agency/AgencyHeader'

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <AgencySidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AgencyHeader />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  )
}
