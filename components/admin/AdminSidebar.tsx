'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, ClipboardList, Settings, LogOut, Users, BarChart3, MapPin, AlertTriangle, Inbox, Globe, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { hasPermission, UserRole } from '@/lib/aos/permissions'
import styles from './AdminSidebar.module.css'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [role, setRole] = useState<UserRole | null>(null)

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('aos_users')
          .select('role')
          .eq('email', user.email)
          .maybeSingle()
        if (data?.role) {
          setRole(data.role as UserRole)
        }
      }
    }
    checkRole()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/aos/login')
    router.refresh()
  }

  const allMenuItems = [
    { name: 'Dashboard', href: '/aos', icon: LayoutDashboard, permissionKey: 'dashboard' },
    { name: 'Job Schedule', href: '/aos/schedule', icon: Calendar, permissionKey: 'bookings' },
    { name: 'Central Dispatch', href: '/aos/dispatch', icon: MapPin, permissionKey: 'bookings' },
    { name: 'Assessments', href: '/aos/assessments', icon: ClipboardList, permissionKey: 'bookings' },
    { name: 'Leads CRM', href: '/aos/leads', icon: Inbox, permissionKey: 'quotes' },
    { name: 'QA Alerts (AI)', href: '/aos/qa-alerts', icon: AlertTriangle, permissionKey: 'users' },
    { name: 'Team Directory', href: '/aos/team', icon: Users, permissionKey: 'users' },
    { name: 'User Management', href: '/aos/users', icon: Users, permissionKey: 'users' },
    { name: 'Revenue', href: '/aos/revenue', icon: BarChart3, permissionKey: 'analytics' },
    { name: 'Website Content', href: '/aos/website', icon: Globe, permissionKey: 'content' },
    { name: 'Agent Accounts', href: '/aos/agents', icon: Building2, permissionKey: 'integrations' },
    { name: 'Settings', href: '/aos/settings', icon: Settings, permissionKey: 'settings' },
  ]

  const menuItems = role
    ? allMenuItems.filter(item => hasPermission(role, item.permissionKey))
    : []

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Avorria<span style={{ color: 'var(--accent-lime)' }}>.</span></span>
        </Link>
        <span className={styles.portalBadge}>Avorria Operating System</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/aos' && pathname.startsWith(item.href + '/'))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Icon className={styles.icon} size={18} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <button className={styles.signOutButton} onClick={handleSignOut}>
          <LogOut className={styles.icon} size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
