'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import RatingBadge from '@/components/ui/RatingBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Home, FileText, ArrowRight, Download, CheckCircle } from 'lucide-react'
import styles from './portal.module.css'

interface Customer {
  id: string
  full_name: string
  email: string
  customer_type: string
}

interface Property {
  id: string
  address_line_1: string
  town: string
  postcode: string
  property_type: string
  current_epc_rating: string
}

interface Booking {
  id: string
  booking_ref: string
  service_type: string
  status: string
  preferred_date: string
  confirmed_datetime: string
  price_gbp: number
  properties: Property
}

interface Certificate {
  id: string
  current_rating: string
  potential_rating: string
  valid_until: string
  pdf_url: string
  properties: Property
}

export default function CustomerPortalDashboard() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadPortalData() {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr || !user) {
          throw new Error('User session not found. Please log in.')
        }

        // 1. Fetch Customer Profile
        const { data: custData, error: custErr } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', user.id)
          .single()

        if (custErr || !custData) {
          throw new Error(`Profile not found: ${custErr?.message}`)
        }
        setCustomer(custData)

        // 2. Fetch Bookings (with joined properties details)
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*, properties(*)')
          .eq('customer_id', custData.id)
          .order('created_at', { ascending: false })

        setBookings(bookingsData || [])

        // 3. Fetch Properties
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('*')
          .eq('customer_id', custData.id)

        setProperties(propertiesData || [])

        // 4. Fetch Certificates (with joined properties details)
        const { data: certificatesData } = await supabase
          .from('certificates')
          .select('*, properties(*)')
          .eq('properties.customer_id', custData.id)

        setCertificates(certificatesData || [])
      } catch (err: any) {
        console.error('Portal load error:', err)
        setErrorMsg(err.message || 'An error occurred loading dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    loadPortalData()
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingArea}>
        <LoadingSpinner size={48} />
        <p>Synchronizing portal session...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className={styles.errorArea}>
        <h2>Session Error</h2>
        <p>{errorMsg}</p>
        <Link href="/login" className={styles.loginCta}>
          Go to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      {/* Welcome banner */}
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <h2>Hello, {customer?.full_name || 'Client'}</h2>
          <p>Manage your properties, track live assessor bookings, and download registered Energy Performance Certificates.</p>
        </div>
        <div className={styles.badgePanel}>
          <span className={styles.userTypeBadge}>
            Account: {customer?.customer_type}
          </span>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        {/* Main Section: Bookings & Timeline */}
        <div className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <Calendar className={styles.headerIcon} />
            <h3>Your Assessment Bookings</h3>
          </div>

          {bookings.length === 0 ? (
            <div className={styles.emptyCard}>
              <p>You do not have any bookings registered to your account.</p>
              <Link href="/book" className={styles.bookCta}>
                Book your first EPC assessment now →
              </Link>
            </div>
          ) : (
            <div className={styles.bookingsList}>
              {bookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                  <div className={styles.bookingHeader}>
                    <div>
                      <span className={styles.refLabel}>Booking Ref</span>
                      <h4 className={styles.refVal}>{booking.booking_ref}</h4>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className={styles.bookingBody}>
                    <div className={styles.propertyLine}>
                      <Home size={16} />
                      <span>{booking.properties?.address_line_1}, {booking.properties?.town}</span>
                    </div>

                    <div className={styles.metaRow}>
                      <div>
                        <span className={styles.metaLabel}>Date Requested:</span>
                        <span className={styles.metaVal}>{booking.preferred_date}</span>
                      </div>
                      <div>
                        <span className={styles.metaLabel}>Slot Preferred:</span>
                        <span className={styles.metaVal} style={{ textTransform: 'capitalize' }}>
                          {booking.preferred_time_slot}
                        </span>
                      </div>
                      <div>
                        <span className={styles.metaLabel}>Order Total:</span>
                        <span className={styles.metaVal}>£{booking.price_gbp}</span>
                      </div>
                    </div>
                  </div>

                  {booking.status === 'certificate_issued' && (
                    <div className={styles.bookingFooter}>
                      <span className={styles.successNote}>
                        <CheckCircle size={16} style={{ color: 'var(--accent-lime)' }} />
                        Certificate successfully lodged
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section: Properties & Registered Certificates */}
        <div className={styles.sidebar}>
          <div className={styles.sectionHeader}>
            <FileText className={styles.headerIcon} />
            <h3>Registered Certificates</h3>
          </div>

          {certificates.length === 0 ? (
            <div className={styles.emptyCard}>
              <p>No certificates issued yet. Certificates will display here once they are generated and lodged by your assessor.</p>
            </div>
          ) : (
            <div className={styles.certsList}>
              {certificates.map((cert) => (
                <div key={cert.id} className={styles.certCard}>
                  <div className={styles.certHeader}>
                    <RatingBadge rating={cert.current_rating} size="sm" />
                    <div className={styles.certAddress}>
                      <h4>{cert.properties?.address_line_1}</h4>
                      <p>Expiry: {cert.valid_until}</p>
                    </div>
                  </div>
                  
                  <div className={styles.certActions}>
                    <Link 
                      href={`/improve?rating=${cert.current_rating}&postcode=${cert.properties?.postcode}`} 
                      className={styles.actionBtnGhost}
                    >
                      Improve rating to C
                    </Link>
                    <a 
                      href={cert.pdf_url || '#'} 
                      download 
                      target="_blank" 
                      rel="noreferrer"
                      className={styles.actionBtnPrimary}
                    >
                      <Download size={14} />
                      PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
            <Home className={styles.headerIcon} />
            <h3>My Properties</h3>
          </div>

          <div className={styles.propertiesList}>
            {properties.length === 0 ? (
              <p className={styles.emptyText}>No properties registered.</p>
            ) : (
              properties.map((p) => (
                <div key={p.id} className={styles.propertyRow}>
                  <div>
                    <h4>{p.address_line_1}</h4>
                    <p>{p.postcode}</p>
                  </div>
                  {p.current_epc_rating && (
                    <RatingBadge rating={p.current_epc_rating} size="sm" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
