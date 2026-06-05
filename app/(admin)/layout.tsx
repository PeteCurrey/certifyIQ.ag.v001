'use client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', background: 'var(--bg-obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-obsidian)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AdminHeader />
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  )
}
