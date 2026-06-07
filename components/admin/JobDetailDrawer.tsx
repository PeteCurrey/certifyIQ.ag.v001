'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Calendar, Clock, User, DollarSign, MapPin, Phone, Mail, FileText, RefreshCcw, MoreVertical } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import ScheduleJobModal from './ScheduleJobModal'

interface JobDetailDrawerProps {
  bookingId: string
  isOpen: boolean
  onClose: () => void
}

const STATUS_STEPS = ['paid', 'scheduled', 'en_route', 'on_site', 'assessment_complete', 'certificate_issued']
const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  pending_payment: 'Pending',
  scheduled: 'Scheduled',
  en_route: 'En Route',
  on_site: 'On Site',
  assessment_complete: 'QA/Cert',
  certificate_issued: 'Complete',
  cancelled: 'Cancelled'
}

const SERVICE_COLORS: Record<string, string> = {
  domestic: '#0d9488',
  commercial_level3: '#2563eb',
  commercial_level4: '#1d4ed8',
  commercial_tm44: '#7c3aed',
  commercial_dec: '#d97706',
  on_construction_design: '#16a34a',
  air_tightness_domestic: '#ea580c'
}

export default function JobDetailDrawer({ bookingId, isOpen, onClose }: JobDetailDrawerProps) {
  const [booking, setBooking] = useState<any | null>(null)
  const [slot, setSlot] = useState<any | null>(null)
  const [assessor, setAssessor] = useState<any | null>(null)
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!isOpen || !bookingId) return
    async function load() {
      setLoading(true)
      const [bookingRes, slotRes, logRes] = await Promise.all([
        supabase.from('bookings').select('*, customers(*), properties(*)').eq('id', bookingId).maybeSingle(),
        supabase.from('scheduled_slots').select('*').eq('booking_id', bookingId).maybeSingle(),
        supabase.from('aos_audit_log').select('*').eq('target_id', bookingId).order('created_at', { ascending: false }).limit(20)
      ])
      const b = bookingRes.data
      setBooking(b)
      setSlot(slotRes.data)
      setAuditLog(logRes.data || [])

      if (b?.assessor_id) {
        const { data: asr } = await supabase.from('assessors').select('*').eq('id', b.assessor_id).maybeSingle()
        setAssessor(asr)
      }
      setLoading(false)
    }
    load()
  }, [bookingId, isOpen])

  if (!isOpen) return null

  const color = booking ? (SERVICE_COLORS[booking.service_type] || '#6b7280') : '#6b7280'
  const stepIdx = booking ? STATUS_STEPS.indexOf(booking.status) : -1

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          zIndex: 49, backdropFilter: 'blur(2px)'
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 500, zIndex: 50,
        background: 'var(--bg-surface)', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>
              {booking?.booking_ref || '—'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                background: color, color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase'
              }}>
                {booking?.service_type?.replace(/_/g, ' ')}
              </span>
              <span style={{
                background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4, fontWeight: 600
              }}>
                {STATUS_LABELS[booking?.status] || booking?.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 4
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Status timeline */}
        {booking && (
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {STATUS_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i <= stepIdx ? color : 'var(--border-subtle)',
                    transition: 'background 0.3s'
                  }} />
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {STATUS_STEPS.map((step, i) => (
                <span key={step} style={{
                  fontSize: '0.6rem', color: i <= stepIdx ? color : 'var(--text-muted)',
                  fontWeight: i === stepIdx ? 700 : 400
                }}>
                  {STATUS_LABELS[step]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.5rem' }}>
          {['details', 'scheduling', 'customer', 'financials', 'history'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 600,
              color: activeTab === tab ? color : 'var(--text-muted)',
              borderBottom: activeTab === tab ? `2px solid ${color}` : '2px solid transparent',
              textTransform: 'capitalize', transition: 'all 0.2s'
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {loading && <p style={{ color: 'var(--text-muted)' }}>Loading...</p>}

          {!loading && booking && (
            <>
              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <section>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Property</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MapPin size={14} color="var(--text-muted)" />
                        <span style={{ fontSize: '0.9rem' }}>
                          {booking.properties?.address_line_1}, {booking.properties?.town}, {booking.properties?.postcode}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: 22 }}>
                        {booking.properties?.property_type} · {booking.properties?.bed_count} bed
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Service Details</h3>
                    <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 8, padding: '0.75rem', fontSize: '0.85rem' }}>
                      <div style={{ marginBottom: 6 }}><strong>Service:</strong> {booking.service_type?.replace(/_/g, ' ')}</div>
                      {booking.floor_area_sqm && <div style={{ marginBottom: 6 }}><strong>Floor Area:</strong> {booking.floor_area_sqm} m²</div>}
                      {booking.bed_count && <div style={{ marginBottom: 6 }}><strong>Bedrooms:</strong> {booking.bed_count}</div>}
                    </div>
                  </section>
                </div>
              )}

              {/* SCHEDULING TAB */}
              {activeTab === 'scheduling' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {slot ? (
                    <section>
                      <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Current Schedule</h3>
                      <div style={{ background: 'rgba(15,118,110,0.05)', border: '1px solid rgba(15,118,110,0.2)', borderRadius: 8, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
                          <Calendar size={14} color={color} />
                          <strong>{format(parseISO(slot.start_datetime), 'EEEE d MMMM yyyy')}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                          <Clock size={14} color={color} />
                          <span>{format(parseISO(slot.start_datetime), 'HH:mm')} — {format(parseISO(slot.assessment_end_datetime || slot.end_datetime), 'HH:mm')}</span>
                        </div>
                        {assessor && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                            <User size={14} color={color} />
                            <span>{assessor.full_name}</span>
                          </div>
                        )}
                        {slot.estimated_distance_miles > 0 && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            🚗 ~{slot.estimated_distance_miles} miles · ~{slot.estimated_travel_minutes} min travel
                          </div>
                        )}
                        {slot.requires_overnight && (
                          <div style={{ background: 'rgba(217,119,6,0.1)', color: '#d97706', padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                            🌙 Overnight stay required
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setScheduleModalOpen(true)}
                        style={{
                          marginTop: 12, padding: '0.5rem 1rem', borderRadius: 6, border: `1px solid ${color}`,
                          color, background: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                        }}
                      >
                        <RefreshCcw size={12} style={{ marginRight: 6, display: 'inline' }} />
                        Reschedule
                      </button>
                    </section>
                  ) : (
                    <section>
                      <div style={{
                        background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.2)',
                        borderRadius: 8, padding: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem'
                      }}>
                        ⚠ This job has not been scheduled yet
                      </div>
                      <button
                        onClick={() => setScheduleModalOpen(true)}
                        style={{
                          padding: '0.75rem 1.5rem', borderRadius: 8, border: 'none',
                          background: color, color: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700
                        }}
                      >
                        Schedule this job →
                      </button>
                    </section>
                  )}
                </div>
              )}

              {/* CUSTOMER TAB */}
              {activeTab === 'customer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <section>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Customer Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User size={14} color="var(--text-muted)" />
                        <strong>{booking.customers?.full_name}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Mail size={14} color="var(--text-muted)" />
                        <a href={`mailto:${booking.customers?.email}`} style={{ color: color }}>{booking.customers?.email}</a>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Phone size={14} color="var(--text-muted)" />
                        <a href={`tel:${booking.customers?.phone}`} style={{ color: color }}>{booking.customers?.phone || 'Not provided'}</a>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* FINANCIALS TAB */}
              {activeTab === 'financials' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <section>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Price Breakdown</h3>
                    <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 8, padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                        <span>Assessment price</span>
                        <strong>£{booking.price_gbp}</strong>
                      </div>
                      {booking.vat_applicable && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                          <span>VAT (20%)</span>
                          <strong>£{booking.vat_amount_gbp}</strong>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: '1rem', fontWeight: 700 }}>
                        <span>Total</span>
                        <span style={{ color }}>£{booking.total_inc_vat_gbp || booking.price_gbp}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ marginRight: 8 }}>Method:</span>
                      <strong style={{ textTransform: 'uppercase' }}>{booking.payment_method || 'Stripe'}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      <span style={{ marginRight: 8 }}>Payment status:</span>
                      <strong style={{ color: booking.stripe_payment_status === 'succeeded' ? 'var(--accent-lime)' : 'var(--accent-amber)' }}>
                        {booking.stripe_payment_status || 'Unpaid'}
                      </strong>
                    </div>
                  </section>
                </div>
              )}

              {/* HISTORY TAB */}
              {activeTab === 'history' && (
                <div>
                  <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Audit Trail</h3>
                  {auditLog.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No audit events recorded.</p>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {auditLog.map((log: any) => (
                      <div key={log.id} style={{
                        background: 'var(--bg-surface-elevated)', borderRadius: 6,
                        padding: '0.75rem', fontSize: '0.8rem'
                      }}>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{log.action}</div>
                        <div style={{ color: 'var(--text-muted)' }}>
                          {format(parseISO(log.created_at), 'dd MMM yyyy HH:mm')}
                        </div>
                        {log.user_email && <div style={{ color: 'var(--text-secondary)' }}>by {log.user_email}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {booking && scheduleModalOpen && (
        <ScheduleJobModal
          bookingId={booking.id}
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          onConfirm={() => setScheduleModalOpen(false)}
        />
      )}
    </>
  )
}
