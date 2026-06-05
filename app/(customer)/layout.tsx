import PortalSidebar from '@/components/customer/PortalSidebar'
import PortalHeader from '@/components/customer/PortalHeader'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080D18' }}>
      <PortalSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PortalHeader />
        <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
      </div>
    </div>
  )
}
