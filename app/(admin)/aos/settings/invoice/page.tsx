'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// ─── Types ────────────────────────────────────────────────────────────────────
interface InvoiceSettings {
  invoice_company_name: string
  invoice_company_address: string
  invoice_bank_name: string
  invoice_account_name: string
  invoice_sort_code: string
  invoice_account_number: string
  invoice_vat_number: string
  invoice_contact_email: string
  invoice_contact_phone: string
}

const DEFAULTS: InvoiceSettings = {
  invoice_company_name: 'Avorria Ltd',
  invoice_company_address: '123 Business Park\nChesterfield\nDerbyshire\nS40 1AA',
  invoice_bank_name: 'Barclays Bank',
  invoice_account_name: 'Avorria Ltd',
  invoice_sort_code: '00-00-00',
  invoice_account_number: '00000000',
  invoice_vat_number: 'GB123456789',
  invoice_contact_email: 'billing@avorria.com',
  invoice_contact_phone: '0800 123 4567',
}

// ─── Live Invoice Preview ─────────────────────────────────────────────────────
function InvoicePreview({ settings }: { settings: InvoiceSettings }) {
  const today = new Date()
  const dueDate = new Date(today)
  dueDate.setDate(today.getDate() + 14)
  const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div style={{
      background: '#fff',
      color: '#111',
      borderRadius: '12px',
      padding: '40px',
      fontFamily: 'system-ui, sans-serif',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12)',
      fontSize: '14px',
      lineHeight: '1.5',
      position: 'sticky',
      top: '24px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#080D18', letterSpacing: '-0.5px' }}>
            {settings.invoice_company_name || 'Avorria Ltd'}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', whiteSpace: 'pre-line' }}>
            {settings.invoice_company_address || '—'}
          </div>
          {settings.invoice_vat_number && (
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
              VAT No: {settings.invoice_vat_number}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#080D18' }}>INVOICE</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>AVR-2025-0001</div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#555' }}>
            <div><strong>Issued:</strong> {formatDate(today)}</div>
            <div><strong>Due:</strong> {formatDate(dueDate)}</div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ background: '#f7f8fa', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Bill To</div>
        <div style={{ fontWeight: 600, color: '#111' }}>Sample Client Ltd</div>
        <div style={{ fontSize: '12px', color: '#555' }}>contact@sampleclient.com</div>
      </div>

      {/* Line Items */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th style={{ textAlign: 'left', padding: '8px 0', color: '#555', fontWeight: 600 }}>Description</th>
            <th style={{ textAlign: 'right', padding: '8px 0', color: '#555', fontWeight: 600 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px 0' }}>
              <div style={{ fontWeight: 500 }}>Commercial EPC Assessment</div>
              <div style={{ fontSize: '11px', color: '#888' }}>123 Example Street, Chesterfield</div>
            </td>
            <td style={{ textAlign: 'right', padding: '12px 0' }}>£185.00</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
        <div style={{ width: '220px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ color: '#666' }}>Subtotal</span><span>£185.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ color: '#666' }}>VAT (20%)</span><span>£37.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #111', marginTop: '4px', fontWeight: 700, fontSize: '15px' }}>
            <span>Total Due</span><span>£222.00</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Payment Details — Please Pay Within 14 Days
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '12px' }}>
          <div><span style={{ color: '#555' }}>Bank:</span> <strong>{settings.invoice_bank_name || '—'}</strong></div>
          <div><span style={{ color: '#555' }}>Account Name:</span> <strong>{settings.invoice_account_name || '—'}</strong></div>
          <div><span style={{ color: '#555' }}>Sort Code:</span> <strong style={{ fontFamily: 'monospace' }}>{settings.invoice_sort_code || '—'}</strong></div>
          <div><span style={{ color: '#555' }}>Account No:</span> <strong style={{ fontFamily: 'monospace' }}>{settings.invoice_account_number || '—'}</strong></div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#555' }}>
          Reference: <strong style={{ fontFamily: 'monospace' }}>AVR-2025-0001</strong>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
        <span>{settings.invoice_contact_email}</span>
        <span>{settings.invoice_contact_phone}</span>
        <span>Thank you for your business.</span>
      </div>
    </div>
  )
}

// ─── Field Component ──────────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-surface-elevated)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  borderRadius: '8px',
  padding: '0.65rem 0.9rem',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  width: '100%',
  transition: 'border-color 0.2s',
  outline: 'none',
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvoiceSettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const [settings, setSettings] = useState<InvoiceSettings>(DEFAULTS)

  useEffect(() => {
    async function load() {
      // 1. Check super admin status
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/aos/login'); return }

      const { data: assessor } = await supabase
        .from('assessors')
        .select('is_super_admin')
        .eq('auth_user_id', user.id)
        .single()

      if (!assessor?.is_super_admin) {
        setAccessDenied(true)
        setLoading(false)
        return
      }

      // 2. Load settings
      const { data } = await supabase
        .from('system_settings')
        .select('*')
        .eq('id', 'global')
        .single()

      if (data) {
        setSettings({
          invoice_company_name: data.invoice_company_name ?? DEFAULTS.invoice_company_name,
          invoice_company_address: data.invoice_company_address ?? DEFAULTS.invoice_company_address,
          invoice_bank_name: data.invoice_bank_name ?? DEFAULTS.invoice_bank_name,
          invoice_account_name: data.invoice_account_name ?? DEFAULTS.invoice_account_name,
          invoice_sort_code: data.invoice_sort_code ?? DEFAULTS.invoice_sort_code,
          invoice_account_number: data.invoice_account_number ?? DEFAULTS.invoice_account_number,
          invoice_vat_number: data.invoice_vat_number ?? DEFAULTS.invoice_vat_number,
          invoice_contact_email: data.invoice_contact_email ?? DEFAULTS.invoice_contact_email,
          invoice_contact_phone: data.invoice_contact_phone ?? DEFAULTS.invoice_contact_phone,
        })
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleChange = (key: keyof InvoiceSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const { error } = await supabase
      .from('system_settings')
      .upsert({ id: 'global', ...settings, updated_at: new Date().toISOString() })
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LoadingSpinner size={40} />
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px' }}>🔒</div>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>Super Admin Only</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
          Invoice settings are restricted to super administrators. Contact your system admin for access.
        </p>
        <Link href="/aos/settings" style={{ color: 'var(--accent-lime)', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
          ← Back to Settings
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/aos/settings" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-lime)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ← Settings
        </Link>
        <span style={{ color: 'var(--border-subtle)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Invoice Configuration</span>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)', margin: 0 }}>
            Invoice Design & Settings
          </h1>
          <span style={{ background: 'rgba(155,255,89,0.1)', color: 'var(--accent-lime)', border: '1px solid rgba(155,255,89,0.3)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Super Admin
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
          Edit the company details and bank information that appear on all BACS invoices. Changes apply to all future invoices. The live preview updates as you type.
        </p>
      </div>

      {/* Two-column layout: Form left, Preview right */}
      <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: '40px', alignItems: 'start' }}>
        {/* ── LEFT: Form ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Company Details Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Company Details</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>Appears in the invoice header and footer</p>
            </div>

            <Field label="Company Name">
              <input
                id="inv-company-name"
                style={inputStyle}
                value={settings.invoice_company_name}
                onChange={e => handleChange('invoice_company_name', e.target.value)}
                placeholder="e.g. Avorria Ltd"
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              />
            </Field>

            <Field label="Registered Address" hint="Use line breaks to format the address">
              <textarea
                id="inv-company-address"
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                value={settings.invoice_company_address}
                onChange={e => handleChange('invoice_company_address', e.target.value)}
                placeholder={"123 Business Park\nChesterfield\nDerbyshire\nS40 1AA"}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              />
            </Field>

            <Field label="VAT Registration Number">
              <input
                id="inv-vat-number"
                style={inputStyle}
                value={settings.invoice_vat_number}
                onChange={e => handleChange('invoice_vat_number', e.target.value)}
                placeholder="e.g. GB123456789"
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Billing Email">
                <input
                  id="inv-email"
                  type="email"
                  style={inputStyle}
                  value={settings.invoice_contact_email}
                  onChange={e => handleChange('invoice_contact_email', e.target.value)}
                  placeholder="billing@avorria.com"
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                />
              </Field>
              <Field label="Contact Phone">
                <input
                  id="inv-phone"
                  type="tel"
                  style={inputStyle}
                  value={settings.invoice_contact_phone}
                  onChange={e => handleChange('invoice_contact_phone', e.target.value)}
                  placeholder="0800 123 4567"
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                />
              </Field>
            </div>
          </div>

          {/* Bank Details Card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Bank Details</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>These appear in the payment instructions section of every BACS invoice</p>
            </div>

            {/* Security notice */}
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '12px 14px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                <strong style={{ color: '#FCD34D' }}>Handle with care.</strong> Changes to bank details apply immediately to all future invoices. Verify all details carefully before saving.
              </p>
            </div>

            <Field label="Bank Name">
              <input
                id="inv-bank-name"
                style={inputStyle}
                value={settings.invoice_bank_name}
                onChange={e => handleChange('invoice_bank_name', e.target.value)}
                placeholder="e.g. Barclays Bank"
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              />
            </Field>

            <Field label="Account Name" hint="Must match the name on your bank account exactly">
              <input
                id="inv-account-name"
                style={inputStyle}
                value={settings.invoice_account_name}
                onChange={e => handleChange('invoice_account_name', e.target.value)}
                placeholder="e.g. Avorria Ltd"
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Sort Code" hint="Format: 00-00-00">
                <input
                  id="inv-sort-code"
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                  value={settings.invoice_sort_code}
                  onChange={e => handleChange('invoice_sort_code', e.target.value)}
                  placeholder="00-00-00"
                  maxLength={8}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                />
              </Field>
              <Field label="Account Number" hint="8-digit number">
                <input
                  id="inv-account-number"
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
                  value={settings.invoice_account_number}
                  onChange={e => handleChange('invoice_account_number', e.target.value)}
                  placeholder="00000000"
                  maxLength={8}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-amber)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                />
              </Field>
            </div>
          </div>

          {/* Save Button */}
          <button
            id="save-invoice-settings"
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saved ? 'rgba(155,255,89,0.15)' : 'var(--accent-amber)',
              color: saved ? 'var(--accent-lime)' : 'var(--bg-obsidian)',
              border: saved ? '1px solid rgba(155,255,89,0.4)' : '1px solid transparent',
              borderRadius: '10px',
              padding: '0.85rem 2.5rem',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-start',
            }}
          >
            {saving ? (
              <><LoadingSpinner size={16} /> Saving…</>
            ) : saved ? (
              <>✓ Saved successfully</>
            ) : (
              <>Save Invoice Settings</>
            )}
          </button>
        </div>

        {/* ── RIGHT: Live Preview ───────────────────────────────────────────── */}
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Live Invoice Preview
            </span>
            <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: 'var(--accent-lime)', boxShadow: '0 0 6px rgba(155,255,89,0.5)', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-lime)' }}>Updates as you type</span>
          </div>
          <InvoicePreview settings={settings} />
        </div>
      </div>
    </div>
  )
}
