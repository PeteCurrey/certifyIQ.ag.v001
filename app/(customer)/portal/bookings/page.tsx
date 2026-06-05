'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import styles from './bookings.module.css'

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cust } = await supabase.from('customers').select('id').eq('auth_user_id', user.id).single()
      if (!cust) return
      const { data } = await supabase.from('bookings').select('*, properties(*)').eq('customer_id', cust.id).order('created_at', { ascending: false })
      setBookings(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><LoadingSpinner size={40} /></div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>My Bookings</h2>
        <Link href="/book" className={styles.newBooking}>+ New Booking</Link>
      </div>
      {bookings.length === 0 ? (
        <div className={styles.empty}>
          <p>No bookings found. Book your first EPC assessment below.</p>
          <Link href="/book" className={styles.cta}>Book an EPC →</Link>
        </div>
      ) : (
        <div className={styles.list}>
          {bookings.map(b => (
            <div key={b.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <span className={styles.ref}>{b.booking_ref}</span>
                  <h3>{b.properties?.address_line_1}, {b.properties?.town}</h3>
                  <p className={styles.postcode}>{b.properties?.postcode}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className={styles.cardMeta}>
                <div><span>Preferred Date</span><strong>{b.preferred_date}</strong></div>
                <div><span>Time Slot</span><strong style={{ textTransform: 'capitalize' }}>{b.preferred_time_slot}</strong></div>
                <div><span>Price Paid</span><strong>£{b.price_gbp}</strong></div>
                <div><span>Service</span><strong style={{ textTransform: 'capitalize' }}>{b.service_type}</strong></div>
              </div>
              {b.special_instructions && (
                <p className={styles.instructions}>Access notes: {b.special_instructions}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
