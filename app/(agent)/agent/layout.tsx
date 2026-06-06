'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Home, FileText, Settings, LogOut, Bell, Menu } from 'lucide-react'
import styles from './agent.module.css'

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [agencyName, setAgencyName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Pages that don't need the dashboard sidebar
  const isAuthOrOnboarding = pathname === '/agent/login' || pathname === '/agent/onboarding'

  useEffect(() => {
    if (isAuthOrOnboarding) {
      setLoading(false)
      return
    }

    async function loadAgency() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/agent/login')
        return
      }

      const { data: agentAccount } = await supabase
        .from('agent_accounts')
        .select('agency_name, onboarding_complete')
        .eq('auth_user_id', user.id)
        .single()

      if (!agentAccount?.onboarding_complete && pathname !== '/agent/onboarding') {
        router.push('/agent/onboarding')
        return
      }

      if (agentAccount) {
        setAgencyName(agentAccount.agency_name)
      }
      setLoading(false)
    }

    loadAgency()
  }, [pathname, router, supabase, isAuthOrOnboarding])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/agent/login')
    router.refresh()
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-obsidian)' }} />
  }

  if (isAuthOrOnboarding) {
    return <>{children}</>
  }

  const navItems = [
    { name: 'Dashboard', href: '/agent/dashboard', icon: LayoutDashboard },
    { name: 'Properties', href: '/agent/properties', icon: Home },
    { name: 'Invoices & Billing', href: '/agent/invoices', icon: FileText },
    { name: 'Settings', href: '/agent/settings', icon: Settings },
  ]

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>Avorria<span style={{ color: 'var(--accent-lime)' }}>.</span></span>
          </Link>
          <div className={styles.portalBadge}>Agent Portal</div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={handleSignOut} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
            <h2 className={styles.headerTitle}>
              {navItems.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))?.name || 'Portal'}
            </h2>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.agencyName}>
              <Bell size={18} style={{ cursor: 'pointer', marginRight: '0.5rem' }} />
              {agencyName}
              <div className={styles.avatar}>
                {agencyName ? agencyName.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}
