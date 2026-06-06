'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Calendar } from 'lucide-react'
import styles from './schedule.module.css'

const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

type Step = 'contact' | 'datetime' | 'confirm' | 'done'

export default function SchedulePage({ params }: { params: { bookingRef: string } }) {
  const searchParams = useSearchParams()
  const isPaid = searchParams.get('paid') === 'true'
  const { bookingRef } = params

  const [step, setStep] = useState<Step>('contact')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [bookedDate, setBookedDate] = useState('')

  const steps: Step[] = ['contact', 'datetime', 'confirm', 'done']
  const stepIndex = steps.indexOf(step)

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await fetch('/api/agent/schedule-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingRef, name, email, phone, date, time, notes }),
      })
      setBookedDate(`${date} at ${time}`)
      setStep('done')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const googleCalUrl = bookedDate
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=EPC+Assessment&dates=${date.replace(/-/g, '')}T090000/${date.replace(/-/g, '')}T100000&details=EPC+assessment+for+${encodeURIComponent(bookingRef)}`
    : '#'

  return (
    <div className={styles.hero}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <h1>Avorria<span className={styles.dot}>.</span></h1>
        </div>

        {step !== 'done' && (
          <div className={styles.progressBar}>
            {steps.slice(0, 3).map((s, i) => (
              <div key={s} className={`${styles.progressStep} ${i <= stepIndex ? styles.done : ''}`} />
            ))}
          </div>
        )}

        {isPaid && step === 'contact' && (
          <div className={styles.paidBadge}>
            <CheckCircle2 size={16} /> Payment confirmed — please choose a time
          </div>
        )}

        {/* Step 1: Contact */}
        {step === 'contact' && (
          <>
            <h2 className={styles.stepTitle}>Your contact details</h2>
            <p className={styles.stepSubtitle}>
              We need these to confirm your appointment and send a reminder before the assessor arrives.
            </p>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label}>First & Last Name</label>
                <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone Number</label>
                <input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="07700 900000" />
              </div>
            </div>
            <div className={styles.fieldFull}>
              <label className={styles.label}>Email Address</label>
              <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@email.com" />
            </div>
            <button className={styles.nextBtn} disabled={!name || !email} onClick={() => setStep('datetime')}>
              Choose a date &amp; time →
            </button>
          </>
        )}

        {/* Step 2: Date & Time */}
        {step === 'datetime' && (
          <>
            <h2 className={styles.stepTitle}>Choose date &amp; time</h2>
            <p className={styles.stepSubtitle}>Select a date and preferred time slot. Appointments are typically 45–90 minutes.</p>
            <div className={styles.fieldFull}>
              <label className={styles.label}>Preferred Date</label>
              <input className={styles.input} type="date" min={minDateStr} max={maxDateStr} value={date} onChange={e => setDate(e.target.value)} />
            </div>
            {date && (
              <>
                <div className={styles.fieldFull}>
                  <label className={styles.label}>Preferred Time</label>
                  <div className={styles.timeSlots}>
                    {TIME_SLOTS.map(t => (
                      <div key={t} className={`${styles.slot} ${time === t ? styles.slotActive : ''}`} onClick={() => setTime(t)}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.fieldFull}>
                  <label className={styles.label}>Access Notes (optional)</label>
                  <input className={styles.input} value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Key under mat, ring bell twice" />
                </div>
              </>
            )}
            <button className={styles.nextBtn} disabled={!date || !time} onClick={() => setStep('confirm')}>
              Review booking →
            </button>
          </>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <>
            <h2 className={styles.stepTitle}>Confirm your booking</h2>
            <p className={styles.stepSubtitle}>Please check the details below are correct before confirming.</p>
            <div style={{ background: 'var(--bg-obsidian)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Name', value: name },
                { label: 'Email', value: email },
                { label: 'Phone', value: phone },
                { label: 'Date', value: new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Time', value: time },
                ...(notes ? [{ label: 'Access Notes', value: notes }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button className={styles.nextBtn} disabled={loading} onClick={handleConfirm}>
              {loading ? 'Confirming...' : 'Confirm booking ✓'}
            </button>
          </>
        )}

        {/* Step 4: Done */}
        {step === 'done' && (
          <>
            <div className={styles.successIcon}>
              <CheckCircle2 size={32} color="var(--accent-lime)" />
            </div>
            <h2 className={styles.successTitle}>Booking confirmed!</h2>
            <p className={styles.successDesc}>
              Your EPC assessment has been booked for <strong>{bookedDate}</strong>. A confirmation has been sent to <strong>{email}</strong>. An assessor will arrive at the agreed time — please ensure an adult (18+) is home to provide access.
            </p>
            <div className={styles.calLinks}>
              <a href={googleCalUrl} target="_blank" rel="noopener noreferrer" className={styles.calBtn}>
                <Calendar size={18} /> Add to Google Calendar
              </a>
              <a href={`webcal://cal.avorria.co.uk/booking/${bookingRef}.ics`} className={styles.calBtn}>
                <Calendar size={18} /> Add to Apple / Outlook Calendar
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
