'use client'
import React, { useState } from 'react'
import styles from './settings.module.css'

type TabKey = 'agency' | 'crm' | 'billing' | 'notifications' | 'danger'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'agency', label: 'Agency Profile' },
  { key: 'crm', label: 'CRM Integration' },
  { key: 'billing', label: 'Billing & Payments' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'danger', label: 'Danger Zone' },
]

const NOTIF_ITEMS = [
  { key: 'new_property', title: 'New Property Detected', desc: 'Alert when a new instruction is synced from your CRM.' },
  { key: 'epc_needed', title: 'EPC Required', desc: 'Alert when a property has no valid EPC.' },
  { key: 'vendor_paid', title: 'Vendor Payment Received', desc: 'When a vendor pays for their own EPC via Stripe.' },
  { key: 'epc_issued', title: 'Certificate Issued', desc: 'When an EPC certificate is lodged and delivered.' },
  { key: 'vendor_chase', title: 'Vendor Chase Needed', desc: 'Alert when a vendor hasn\'t responded within 72 hours.' },
  { key: 'invoice_ready', title: 'Invoice Ready', desc: 'When your monthly invoice is generated.' },
  { key: 'epc_expiry', title: 'EPC Expiry Alert', desc: 'Properties with EPCs expiring within 90 days.' },
]

export default function AgentSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('agency')
  const [billingPref, setBillingPref] = useState<'agency' | 'vendor'>('agency')
  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_ITEMS.map(n => [n.key, true]))
  )

  const toggleNotif = (key: string) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your agency profile, CRM connections, billing, and notification preferences.</p>
      </div>

      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Agency Profile */}
      {activeTab === 'agency' && (
        <>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Agency Information</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Agency / Company Name</label>
                <input className={styles.input} defaultValue="Chesterfield Estates Ltd" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Trading Name</label>
                <input className={styles.input} defaultValue="Chesterfield Estates" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Agency Type</label>
                <select className={styles.select}>
                  <option>Independent</option>
                  <option>Franchise</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                  <option>Corporate</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone Number</label>
                <input className={styles.input} defaultValue="01246 123456" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Contact Email</label>
                <input className={styles.input} type="email" defaultValue="info@chesterfield-estates.co.uk" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Website</label>
                <input className={styles.input} defaultValue="https://chesterfield-estates.co.uk" />
              </div>
            </div>
            <button className={styles.saveBtn}>Save Changes</button>
          </div>
        </>
      )}

      {/* CRM Integration */}
      {activeTab === 'crm' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>CRM Connections</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Connect your property management CRM. We'll automatically detect new instructions and check for valid EPCs.
          </p>

          {[
            { name: 'Alto (Vebra)', status: 'Connected', icon: '🔗', connected: true },
            { name: 'Street', status: 'Not connected', icon: '⬡', connected: false },
            { name: 'Reapit', status: 'Not connected', icon: '⬡', connected: false },
          ].map(crm => (
            <div key={crm.name} className={styles.crmCard}>
              <div className={styles.crmInfo}>
                <span className={styles.crmName}>{crm.icon} {crm.name}</span>
                <span className={styles.crmStatus}>{crm.status}</span>
              </div>
              {crm.connected ? (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span className={styles.connectedPill}>✓ Connected</span>
                  <button className={styles.connectBtn}>Disconnect</button>
                </div>
              ) : (
                <button className={styles.connectBtn}>Connect →</button>
              )}
            </div>
          ))}

          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Alto API Key</h3>
            <div className={styles.field}>
              <label className={styles.label}>API Key (from Vebra)</label>
              <input className={styles.input} type="password" placeholder="Your Alto export API key" />
            </div>
            <button className={styles.saveBtn} style={{ marginTop: '1rem' }}>Test & Save Connection</button>
          </div>
        </div>
      )}

      {/* Billing */}
      {activeTab === 'billing' && (
        <>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Default Billing Preference</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              This sets how EPC costs are handled by default. You can override this per property.
            </p>
            <div className={styles.billingToggle}>
              <div
                className={`${styles.billingOpt} ${billingPref === 'agency' ? styles.billingOptActive : ''}`}
                onClick={() => setBillingPref('agency')}
              >
                <h4>Agency Pays</h4>
                <p>All EPC costs are added to your monthly invoice. No vendor contact needed for payment.</p>
              </div>
              <div
                className={`${styles.billingOpt} ${billingPref === 'vendor' ? styles.billingOptActive : ''}`}
                onClick={() => setBillingPref('vendor')}
              >
                <h4>Vendor Pays</h4>
                <p>We send a Stripe payment link directly to the vendor. Assessment arranged after payment.</p>
              </div>
            </div>
            <button className={styles.saveBtn} style={{ marginTop: '1.5rem' }}>Save Billing Preference</button>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Invoice Settings</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Billing Email</label>
                <input className={styles.input} type="email" defaultValue="billing@chesterfield-estates.co.uk" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Invoice Day</label>
                <select className={styles.select} defaultValue="1">
                  {[1, 7, 14, 28].map(d => <option key={d} value={d}>{d}{d === 1 ? 'st' : d === 7 ? 'th' : d === 14 ? 'th' : 'th'} of each month</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>VAT Number (optional)</label>
                <input className={styles.input} placeholder="GB123456789" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Payment Terms (days)</label>
                <input className={styles.input} type="number" defaultValue={7} />
              </div>
            </div>
            <button className={styles.saveBtn}>Save Invoice Settings</button>
          </div>
        </>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Email Notifications</h2>
          {NOTIF_ITEMS.map(item => (
            <div key={item.key} className={styles.notifRow}>
              <div className={styles.notifInfo}>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={notifs[item.key]} onChange={() => toggleNotif(item.key)} />
                <span className={styles.toggleSlider} />
              </label>
            </div>
          ))}
          <button className={styles.saveBtn} style={{ marginTop: '1.5rem' }}>Save Notification Preferences</button>
        </div>
      )}

      {/* Danger Zone */}
      {activeTab === 'danger' && (
        <div className={styles.section} style={{ borderColor: 'rgba(255, 71, 87, 0.3)' }}>
          <h2 className={styles.sectionTitle} style={{ color: '#ff4757' }}>Danger Zone</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            These actions are irreversible. Please be certain before proceeding.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
              <div>
                <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>Disconnect All CRMs</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Stop all property syncing immediately.</p>
              </div>
              <button className={styles.dangerBtn}>Disconnect</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid rgba(255,71,87,0.2)', borderRadius: '8px' }}>
              <div>
                <h4 style={{ color: '#ff4757', margin: '0 0 0.25rem' }}>Close Agent Account</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Permanently close your account. Outstanding invoices must be cleared first.</p>
              </div>
              <button className={styles.dangerBtn}>Close Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
