import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Building2, FileText, CalendarClock, Settings, LogOut, FileSearch, ShieldAlert } from 'lucide-react'
import styles from './dashboard.module.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.appContainer}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>Avorria</Link>
          <span className={styles.versionBadge}>Compliance OS</span>
        </div>
        
        <nav className={styles.navMenu}>
          <p className={styles.navLabel}>Overview</p>
          <Link href="/dashboard" className={`${styles.navLink} ${styles.active}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/dashboard/properties" className={styles.navLink}>
            <Building2 size={18} /> Properties
          </Link>
          <Link href="/dashboard/certificates" className={styles.navLink}>
            <FileText size={18} /> Certificates
          </Link>
          
          <p className={styles.navLabel}>Compliance Engine</p>
          <Link href="/dashboard/risks" className={styles.navLink}>
            <ShieldAlert size={18} /> Risk Analysis
          </Link>
          <Link href="/dashboard/tasks" className={styles.navLink}>
            <CalendarClock size={18} /> Tasks & Timeline
          </Link>
          <Link href="/dashboard/ai-assistant" className={styles.navLink}>
             <span className={styles.aiIcon}>✨</span> AI Assistant
          </Link>

          <p className={styles.navLabel}>Management</p>
          <Link href="/dashboard/team" className={styles.navLink}>
            <Settings size={18} /> Team & Settings
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>JS</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>John Smith</span>
              <span className={styles.userRole}>Portfolio Landlord</span>
            </div>
          </div>
          <button className={styles.logoutBtn}><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.searchBar}>
            <FileSearch size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search properties, certificates, or UPRN..." className={styles.searchInput} />
          </div>
          <div className={styles.headerActions}>
            <Link href="/dashboard/book" className={styles.bookBtn}>Book Service</Link>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  )
}
