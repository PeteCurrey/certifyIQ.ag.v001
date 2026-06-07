'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Calendar as BigCalendar, dateFnsLocalizer, Views, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enGB } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import styles from './calendar.module.css'
import ScheduleJobModal from '@/components/admin/ScheduleJobModal'
import JobDetailDrawer from '@/components/admin/JobDetailDrawer'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-GB': enGB }
})

const SERVICE_COLORS: Record<string, string> = {
  domestic: '#0d9488',
  commercial_level3: '#2563eb',
  commercial_level4: '#1d4ed8',
  commercial_tm44: '#7c3aed',
  commercial_dec: '#d97706',
  on_construction_design: '#16a34a',
  on_construction_as_built: '#15803d',
  air_tightness_domestic: '#ea580c',
  air_tightness_commercial: '#c2410c'
}

interface CalEvent extends Event {
  id: string
  bookingId: string
  serviceType: string
  address: string
  assessorId?: string
}

export default function AosCalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([])
  const [unscheduled, setUnscheduled] = useState<any[]>([])
  const [currentView, setCurrentView] = useState<any>(Views.WEEK)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduleJobId, setScheduleJobId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [slotsRes, bookingsRes] = await Promise.all([
          supabase.from('scheduled_slots').select('*, bookings(booking_ref, service_type, properties(address_line_1, town))').neq('status', 'cancelled'),
          supabase.from('bookings').select('id, booking_ref, service_type, properties(address_line_1, town, postcode)').eq('status', 'paid').is('confirmed_datetime', null)
        ])
        const calEvents: CalEvent[] = (slotsRes.data || []).map((slot: any) => ({
          id: slot.id,
          bookingId: slot.booking_id,
          title: `${slot.bookings?.service_type?.replace(/_/g, ' ')} — ${slot.bookings?.properties?.address_line_1}`,
          start: new Date(slot.start_datetime),
          end: new Date(slot.end_datetime),
          serviceType: slot.bookings?.service_type || 'domestic',
          address: slot.bookings?.properties?.address_line_1 || '',
          assessorId: slot.assessor_id
        }))
        setEvents(calEvents)
        setUnscheduled(bookingsRes.data || [])
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
    const channel = supabase.channel('aos_calendar').on('postgres_changes', { event: '*', schema: 'public', table: 'scheduled_slots' }, load).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const eventStyleGetter = (event: CalEvent) => ({
    style: {
      backgroundColor: SERVICE_COLORS[event.serviceType] || '#6b7280',
      border: 'none', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', padding: '2px 6px'
    }
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}><h1>Schedule Calendar</h1></div>
        <div className={styles.viewSwitcher}>
          <Link href="/aos/schedule/kanban" className={styles.viewTab}>Kanban</Link>
          <button className={`${styles.viewTab} ${styles.viewTabActive}`}>Calendar</button>
          <Link href="/aos/schedule/map" className={styles.viewTab}>Map View</Link>
          <Link href="/aos/schedule/settings" className={styles.viewTab}>Settings</Link>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <span className={styles.sidebarTitle}>Unscheduled ({unscheduled.length})</span>
          <div className={styles.unscheduledList}>
            {unscheduled.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>All jobs scheduled ✓</p>}
            {unscheduled.map(b => (
              <div key={b.id} className={styles.unscheduledChip} onClick={() => { setScheduleJobId(b.id); setScheduleModalOpen(true) }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{b.booking_ref}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{b.service_type?.replace(/_/g, ' ')}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{b.properties?.address_line_1}, {b.properties?.town}</div>
                <div style={{ color: 'var(--accent-lime)', fontSize: '0.7rem', marginTop: '0.25rem' }}>Click to schedule →</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.calendarContainer}>
          <BigCalendar
            localizer={localizer}
            events={events}
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            views={[Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 19, 0, 0)}
            step={30}
            timeslots={2}
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(evt: CalEvent) => { setActiveBookingId(evt.bookingId); setDrawerOpen(true) }}
            selectable
          />
        </div>
      </div>

      {activeBookingId && <JobDetailDrawer bookingId={activeBookingId} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />}
      {scheduleJobId && <ScheduleJobModal bookingId={scheduleJobId} isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} onConfirm={() => setScheduleModalOpen(false)} />}
    </div>
  )
}
