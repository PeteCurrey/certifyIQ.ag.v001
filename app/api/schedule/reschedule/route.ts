import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSizeBand, getServiceDuration, estimateTravelTime, getSchedulingSetting } from '@/lib/scheduling-engine'
import { addMinutes } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scheduledSlotId, newStartDatetime, reason } = body

    if (!scheduledSlotId || !newStartDatetime) {
      return NextResponse.json({ error: 'Missing required fields: scheduledSlotId, newStartDatetime' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Fetch current scheduled slot
    const { data: slot, error: slotErr } = await supabase
      .from('scheduled_slots')
      .select('*')
      .eq('id', scheduledSlotId)
      .maybeSingle()

    if (slotErr || !slot) {
      return NextResponse.json({ error: 'Scheduled slot not found' }, { status: 404 })
    }

    // 2. Fetch booking details
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', slot.booking_id)
      .maybeSingle()

    if (bookingErr || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const serviceType = booking.service_type
    const sizeBand = getSizeBand(serviceType, booking)
    const durationInfo = await getServiceDuration(supabase, serviceType, sizeBand)

    const startDate = new Date(newStartDatetime)
    const assessmentEndDate = addMinutes(startDate, durationInfo.durationMinutes)
    const endDate = addMinutes(assessmentEndDate, durationInfo.travelBufferMinutes)

    // 3. Update scheduled slot
    const { error: updateSlotErr } = await supabase
      .from('scheduled_slots')
      .update({
        start_datetime: startDate.toISOString(),
        assessment_end_datetime: assessmentEndDate.toISOString(),
        end_datetime: endDate.toISOString(),
        status: 'rescheduled'
      })
      .eq('id', scheduledSlotId)

    if (updateSlotErr) {
      throw updateSlotErr
    }

    // 4. Update booking
    const { error: updateBookingErr } = await supabase
      .from('bookings')
      .update({
        confirmed_datetime: startDate.toISOString()
      })
      .eq('id', slot.booking_id)

    if (updateBookingErr) {
      throw updateBookingErr
    }

    // 5. Log audit trail
    await supabase.from('aos_audit_log').insert({
      action: 'booking.rescheduled',
      target_table: 'scheduled_slots',
      target_id: scheduledSlotId,
      new_value: {
        new_start: startDate.toISOString(),
        reason: reason || 'Not specified'
      }
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Reschedule API error:', err)
    return NextResponse.json({ error: err.message || 'Failed to reschedule slot' }, { status: 500 })
  }
}
