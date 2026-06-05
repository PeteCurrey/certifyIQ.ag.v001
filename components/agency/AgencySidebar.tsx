'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './AgencySidebar.module.css'

const navItems = [
  { href: '/agency', icon: '◉', label: 'Dashboard' },
  { href: '/agency/book', icon: '＋', label: 'Order Service' },
  { href: '/agency/jobs', icon: '◫', label: 'Jobs' },
  { href: '/agency/properties', icon: '⌂', label: 'Properties' },
  { href: '/agency/reports', icon: '⬇', label: 'Reports' },
  { href: '/agency/ai-assistant', icon: '✦', label: 'AI Assistant' },
  { href: '/agency/messages', icon: '◻', label: 'Messages' },
  { href: '/agency/branches', icon: '⊞', label: 'Branches' },
  { href: '/agency/billing', icon: '£', label: 'Billing' },
  { href: '/agency/settings', icon: '⚙', label: 'Settings' },
]

export default function AgencySidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>A</span>
        {!collapsed && <span className={styles.logoText}>Avorria</span>}
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/agency' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.icon}>{item.icon}</span>
              {!collapsed && <span className={styles.label}>{item.label}</span>}
              {isActive && !collapsed && <span className={styles.activeDot} />}
            </Link>
          )
        })}
      </nav>

      <div className={styles.bottom}>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
    </aside>
  )
}
