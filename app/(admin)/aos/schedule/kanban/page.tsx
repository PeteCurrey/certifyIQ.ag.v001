'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Clock } from 'lucide-react'
import styles from './kanban.module.css'
import JobDetailDrawer from '@/components/admin/JobDetailDrawer'
import ScheduleJobModal from '@/components/admin/ScheduleJobModal'

interface Booking {
  id: string
  booking_ref: string
  service_type: string
  status: string
  price_gbp: number
  preferred_date: string
  preferred_time_slot: string
  confirmed_datetime: string | null
  special_instructions: string
  customer_id: string
  assessor_id: string | null
  created_at: string
  customers: { full_name: string; email: string; phone: string } | null
  properties: { address_line_1: string; town: string; postcode: string; property_type: string; bed_count: number; floor_area_sqm: number } | null
  scheduled_slots?: { id: string; start_datetime: string; end_datetime: string; status: string; estimated_distance_miles: number; requires_overnight: boolean } | null
}

const COLUMNS = [
  { id: 'NEW_BOOKINGS', title: 'New Bookings', status: 'paid' },
  { id: 'AWAITING_CONTACT', title: 'Awaiting Contact', status: 'pending_quote' },
  { id: 'SCHEDULED', title: 'Scheduled', status: 'scheduled' },
  { id: 'EN_ROUTE', title: 'En Route', status: 'en_route' },
  { id: 'ON_SITE', title: 'On Site', status: 'on_site' },
  { id: 'QA_CERT', title: 'QA / Cert', status: 'assessment_complete' },
  { id: 'COMPLETE', title: 'Complete', status: 'certificate_issued' },
  { id: 'ON_HOLD', title: 'On Hold', status: 'on_hold' }
]

const SERVICE_COLORS: Record<string, string> = {
  domestic: '#0d9488',
  commercial_level3: '#2563eb',
  commercial_level4: '#1d4ed8',
  commercial_level5: '#1e3a8a',
  commercial_tm44: '#7c3aed',
  commercial_dec: '#d97706',
  on_construction_design: '#16a34a',
  on_construction_as_built: '#15803d',
  air_tightness_domestic: '#ea580c',
  air_tightness_commercial: '#c2410c'
}

export default function AosKanbanPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [assessors, setAssessors] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedAssessor, setSelectedAssessor] = useState('all')
  const [selectedService, setSelectedService] = useState('all')
  const [loading, setLoading] = useState(true)
  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scheduleJobId, setScheduleJobId] = useState<string | null>(null)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [bookingsRes, assessorsRes] = await Promise.all([
          supabase.from('bookings').select('*, customers(*), properties(*), scheduled_slots(*)'),
          supabase.from('assessors').select('*')
        ])
        if (bookingsRes.data) setBookings(bookingsRes.data as Booking[])
        if (assessorsRes.data) setAssessors(assessorsRes.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    loadData()
    const channel = supabase.channel('aos_kanban')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scheduled_slots' }, () => loadData())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination || source.droppableId === destination.droppableId) return
    const booking = bookings.find(b => b.id === draggableId)
    if (!booking) return
    const destCol = COLUMNS.find(c => c.id === destination.droppableId)
    if (!destCol) return
    if (booking.status === 'certificate_issued') { alert('Cannot move a completed job back.'); return }
    if (destCol.id === 'EN_ROUTE' || destCol.id === 'ON_SITE') { alert('En Route / On Site statuses are set by assessors via mobile.'); return }
    if (destCol.id === 'SCHEDULED' && !booking.scheduled_slots) {
      setScheduleJobId(booking.id); setScheduleModalOpen(true); return
    }
    const updatedBookings = bookings.map(b => b.id === draggableId ? { ...b, status: destCol.status } : b)
    setBookings(updatedBookings)
    try {
      if (destCol.id === 'NEW_BOOKINGS' && booking.scheduled_slots) {
        await supabase.from('scheduled_slots').delete().eq('booking_id', booking.id)
        await supabase.from('bookings').update({ status: 'paid', confirmed_datetime: null, assessor_id: null }).eq('id', booking.id)
      } else {
        await supabase.from('bookings').update({ status: destCol.status }).eq('id', booking.id)
      }
      await supabase.from('aos_audit_log').insert({ action: 'booking.status_changed_kanban', target_table: 'bookings', target_id: booking.id, new_value: { status: destCol.status } })
    } catch (err) { console.error(err); setBookings(bookings) }
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.booking_ref.toLowerCase().includes(search.toLowerCase()) ||
      b.properties?.address_line_1.toLowerCase().includes(search.toLowerCase()) ||
      b.customers?.full_name.toLowerCase().includes(search.toLowerCase())
    const matchesAssessor = selectedAssessor === 'all' || (selectedAssessor === 'unassigned' && !b.assessor_id) || b.assessor_id === selectedAssessor
    const matchesService = selectedService === 'all' || b.service_type === selectedService
    return matchesSearch && matchesAssessor && matchesService
  })

  const getColBookings = (colId: string, status: string) => {
    return filteredBookings.filter(b => {
      if (colId === 'NEW_BOOKINGS') return b.status === 'paid' && !b.scheduled_slots
      if (colId === 'SCHEDULED') return (b.status === 'scheduled' || b.status === 'paid') && b.scheduled_slots
      return b.status === status
    })
  }

  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.price_gbp || 0), 0)
  const unassignedCount = bookings.filter(b => !b.assessor_id && b.status !== 'cancelled').length
  const overnightCount = bookings.filter(b => b.scheduled_slots?.requires_overnight).length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Job Management Board</h1>
          <p>Drag jobs to update statuses, optimise dispatch routes, and manage assessor bookings.</p>
        </div>
        <div className={styles.viewSwitcher}>
          <button className={`${styles.viewTab} ${styles.viewTabActive}`}>Kanban</button>
          <Link href="/aos/schedule/calendar" className={styles.viewTab}>Calendar</Link>
          <Link href="/aos/schedule/map" className={styles.viewTab}>Map View</Link>
          <Link href="/aos/schedule/settings" className={styles.viewTab}>Settings</Link>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.searchField}>
          <input type="text" className={styles.selectField} placeholder="Search ref, address, client..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }} />
        </div>
        <select className={styles.selectField} value={selectedAssessor} onChange={e => setSelectedAssessor(e.target.value)}>
          <option value="all">All Assessors</option>
          <option value="unassigned">Unassigned</option>
          {assessors.map(a => <option key={a.id} value={a.id}>{a.full_name}</option>)}
        </select>
        <select className={styles.selectField} value={selectedService} onChange={e => setSelectedService(e.target.value)}>
          <option value="all">All Services</option>
          <option value="domestic">Domestic EPC</option>
          <option value="commercial_level3">Commercial Level 3</option>
          <option value="commercial_level4">Commercial Level 4</option>
          <option value="commercial_tm44">TM44</option>
          <option value="commercial_dec">DEC</option>
          <option value="air_tightness_domestic">Air Tightness</option>
        </select>
      </div>

      <div className={styles.mainLayout}>
        <div className={styles.boardScrollWrapper}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.board}>
              {COLUMNS.map(col => {
                const list = getColBookings(col.id, col.status)
                return (
                  <div key={col.id} className={styles.column}>
                    <div className={styles.columnHeader}>
                      <span className={styles.columnTitle}>{col.title}</span>
                      <span className={styles.countBadge}>{list.length}</span>
                    </div>
                    <Droppable droppableId={col.id}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={styles.dropZone}>
                          {list.map((booking, idx) => {
                            const borderCol = SERVICE_COLORS[booking.service_type] || '#ccc'
                            const assessor = assessors.find(a => a.id === booking.assessor_id)
                            const isUrgent = booking.preferred_date && (new Date(booking.preferred_date).getTime() - Date.now()) < 172800000
                            return (
                              <Draggable key={booking.id} draggableId={booking.id} index={idx}>
                                {(providedDrag) => (
                                  <div
                                    ref={providedDrag.innerRef}
                                    {...providedDrag.draggableProps}
                                    {...providedDrag.dragHandleProps}
                                    className={styles.card}
                                    style={{ borderLeft: `4px solid ${borderCol}`, ...providedDrag.draggableProps.style }}
                                    onClick={() => { setActiveJobId(booking.id); setDrawerOpen(true) }}
                                  >
                                    <div className={styles.cardHeader}>
                                      <span className={styles.typePill} style={{ backgroundColor: borderCol }}>
                                        {booking.service_type.replace(/_/g, ' ')}
                                      </span>
                                      <span className={styles.refVal}>{booking.booking_ref}</span>
                                    </div>
                                    <div className={styles.addressText}>{booking.properties?.address_line_1 || 'No address'}</div>
                                    <div className={styles.propInfo}>{booking.properties?.town} · {booking.properties?.postcode}</div>
                                    {booking.scheduled_slots && (
                                      <div className={styles.scheduleDetails}>
                                        <Clock size={12} />
                                        <span>{new Date(booking.scheduled_slots.start_datetime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                      </div>
                                    )}
                                    <div className={styles.bottomRow}>
                                      <span className={styles.priceVal}>£{booking.price_gbp}</span>
                                      <div className={styles.assessorRow}>
                                        {assessor ? (
                                          <div className={styles.avatar} title={assessor.full_name}>{assessor.full_name[0]}</div>
                                        ) : (
                                          <span style={{ color: 'var(--accent-red)', fontWeight: 600, fontSize: '0.75rem' }}>Unassigned</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className={styles.badgeContainer}>
                                      {booking.scheduled_slots?.requires_overnight && <span className={`${styles.badge} ${styles.overnight}`}>🌙 Overnight</span>}
                                      {isUrgent && <span className={`${styles.badge} ${styles.urgent}`}>🔥 Urgent</span>}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )
              })}
            </div>
          </DragDropContext>
        </div>

        <div className={styles.sidebar}>
          <span className={styles.sidebarTitle}>Operations Summary</span>
          <div className={styles.statRow}><span>Gross active value</span><span className={styles.statVal}>£{totalRevenue.toLocaleString()}</span></div>
          <div className={styles.statRow}><span>Unassigned jobs</span><span className={`${styles.statVal} ${unassignedCount > 0 ? styles.alertText : ''}`}>{unassignedCount}</span></div>
          <div className={styles.statRow}><span>Overnight pending</span><span className={styles.statVal}>{overnightCount}</span></div>
        </div>
      </div>

      {activeJobId && <JobDetailDrawer bookingId={activeJobId} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />}
      {scheduleJobId && (
        <ScheduleJobModal bookingId={scheduleJobId} isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} onConfirm={() => { setScheduleModalOpen(false); router.refresh() }} />
      )}
    </div>
  )
}
