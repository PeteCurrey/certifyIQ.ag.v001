'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, User, HelpCircle, Menu, X, LayoutDashboard, Calendar, Home, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './PortalHeader.module.css'

export default function PortalHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? null)
      }
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className={styles.header}>
      <button 
        className={styles.burger} 
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <div className={styles.titleArea}>
        <h1>Welcome Back</h1>
      </div>

      <div className={styles.actions}>
        <Link href="/faq" className={styles.actionIcon} title="Help Center">
          <HelpCircle size={20} />
        </Link>
        <button className={styles.actionIcon} title="Notifications">
          <Bell size={20} />
          <span className={styles.badge} />
        </button>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <User size={16} />
          </div>
          <span className={styles.email}>{userEmail || 'Client'}</span>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className={styles.drawerOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Avorria</span>
              <button 
                className={styles.closeButton} 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className={styles.drawerNav}>
              <Link 
                href="/portal" 
                className={styles.drawerLink} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/portal/bookings" 
                className={styles.drawerLink} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={18} />
                <span>My Bookings</span>
              </Link>
              <Link 
                href="/portal/properties" 
                className={styles.drawerLink} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={18} />
                <span>My Properties</span>
              </Link>
              <Link 
                href="/portal/profile" 
                className={styles.drawerLink} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
              <button className={styles.drawerSignOut} onClick={handleSignOut}>
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
