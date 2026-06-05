'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, ClipboardList, Settings, LogOut, Users, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './AdminSidebar.module.css'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('assessors')
          .select('is_super_admin')
          .eq('auth_user_id', user.id)
          .single()
        if (data?.is_super_admin) {
          setIsSuperAdmin(true)
        }
      }
    }
    checkRole()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Job Schedule', href: '/admin/schedule', icon: Calendar },
    { name: 'Assessments', href: '/admin/assessments', icon: ClipboardList },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  if (isSuperAdmin) {
    // Insert after Assessments or keep order
    menuItems.splice(3, 0, { name: 'Team Directory', href: '/admin/team', icon: Users })
    menuItems.splice(4, 0, { name: 'Revenue', href: '/admin/revenue', icon: BarChart3 })
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Link href="/" className={styles.logo}>

          <span className={styles.logoText}>Avorria<span style={{ color: 'var(--accent-lime)' }}>.</span></span>
        </Link>
        <span className={styles.portalBadge}>Assessor Portal</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
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
