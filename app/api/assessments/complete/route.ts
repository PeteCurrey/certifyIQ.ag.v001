import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendCertificateIssued } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Get booking details
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*, customers(*), properties(*)')
      .eq('id', bookingId)
      .single()

    if (bErr || !booking) {
      throw new Error('Booking not found')
    }

    // 2. Update booking status
    await supabase
      .from('bookings')
      .update({ status: 'assessment_complete', updated_at: new Date().toISOString() })
      .eq('id', bookingId)

    // 3. Update assessment status
    await supabase
      .from('assessments')
      .update({ status: 'complete', completed_at: new Date().toISOString() })
      .eq('booking_id', bookingId)

    // 4. Send Email
    if (booking.customers?.email) {
      await sendCertificateIssued({
        toEmail: booking.customers.email,
        customerName: booking.customers.full_name || 'Customer',
        bookingRef: booking.booking_ref,
        propertyAddress: `${booking.properties?.address_line_1}, ${booking.properties?.town}`,
        certificateUrl: `/portal/certificates/${bookingId}`, // Dummy URL for now
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error completing assessment:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
