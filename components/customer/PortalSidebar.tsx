'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, Home, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './PortalSidebar.module.css'

export default function PortalSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const menuItems = [
    { name: 'Dashboard', href: '/portal', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/portal/bookings', icon: Calendar },
    { name: 'My Properties', href: '/portal/properties', icon: Home },
    { name: 'Profile', href: '/portal/profile', icon: User },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Link href="/" className={styles.logo}>

          <span className={styles.logoText}>Avorria</span>
        </Link>
        <span className={styles.portalBadge}>Client Portal</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
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
