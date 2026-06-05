'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, User, Settings, Menu, X, LayoutDashboard, Calendar, ClipboardList, LogOut, Users, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './AdminHeader.module.css'

export default function AdminHeader() {
  const [assessorName, setAssessorName] = useState<string | null>(null)
  const [accreditationNum, setAccreditationNum] = useState<string | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getAssessorDetails() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch assessor record
        const { data, error } = await supabase
          .from('assessors')
          .select('full_name, accreditation_number, is_super_admin')
          .eq('auth_user_id', user.id)
          .single()

        if (data) {
          setAssessorName(data.full_name)
          setAccreditationNum(data.accreditation_number)
          if (data.is_super_admin) {
            setIsSuperAdmin(true)
          }
        } else {
          setAssessorName(user.email ?? 'Assessor')
        }
      }
    }
    getAssessorDetails()
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
        <h1>Assessor Console</h1>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionIcon} title="Notifications">
          <Bell size={20} />
          <span className={styles.badge} />
        </button>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <User size={16} />
          </div>
          <div className={styles.meta}>
            <span className={styles.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {assessorName || 'Assessor'}
              {isSuperAdmin && (
                <span style={{ fontSize: '0.6rem', color: 'var(--accent-amber)', background: 'rgba(245,166,35,0.15)', padding: '0.05rem 0.25rem', borderRadius: '4px', border: '1px solid rgba(245,166,35,0.3)' }}>
                  Admin
                </span>
              )}
            </span>
            {accreditationNum && (
              <span className={styles.accreditation}>{accreditationNum}</span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className={styles.drawerOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Avorria Admin</span>
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
                href="/admin" 
                className={styles.drawerLink} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/admin/schedule" 
                className={styles.drawerLink} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={18} />
                <span>Job Schedule</span>
              </Link>
              <Link 
                href="/admin/assessments" 
                className={styles.drawerLink} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <ClipboardList size={18} />
                <span>Assessments</span>
              </Link>
              {isSuperAdmin && (
                <>
                  <Link 
                    href="/admin/team" 
                    className={styles.drawerLink} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users size={18} />
                    <span>Team Directory</span>
                  </Link>
                  <Link 
                    href="/admin/revenue" 
                    className={styles.drawerLink} 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3 size={18} />
                    <span>Revenue</span>
                  </Link>
                </>
              )}
              <Link 
                href="/admin/settings" 
                className={styles.drawerLink} 
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={18} />
                <span>Settings</span>
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
