import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSizeBand, getServiceDuration, estimateTravelTime, getSchedulingSetting } from '@/lib/scheduling-engine'
import { addMinutes } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, assessorId, startDatetime } = body

    if (!bookingId || !assessorId || !startDatetime) {
      return NextResponse.json({ error: 'Missing required fields: bookingId, assessorId, startDatetime' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Fetch booking details with property and customer info
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('*, properties(*), customers(*)')
      .eq('id', bookingId)
      .maybeSingle()

    if (bookingErr || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const serviceType = booking.service_type
    const propertyPostcode = booking.properties?.postcode || ''

    // 2. Get durations
    const sizeBand = getSizeBand(serviceType, booking)
    const durationInfo = await getServiceDuration(supabase, serviceType, sizeBand)

    // 3. Estimate travel
    const basePostcode = await getSchedulingSetting(supabase, 'base_postcode', 'S40 2EJ')
    const travelInfo = await estimateTravelTime(basePostcode, propertyPostcode)

    const startDate = new Date(startDatetime)
    const assessmentEndDate = addMinutes(startDate, durationInfo.durationMinutes)
    const endDate = addMinutes(assessmentEndDate, durationInfo.travelBufferMinutes)

    // 4. Check for double booking conflicts
    const { data: conflicts } = await supabase
      .from('scheduled_slots')
      .select('id')
      .eq('assessor_id', assessorId)
      .neq('status', 'cancelled')
      .lt('start_datetime', endDate.toISOString())
      .gt('end_datetime', startDate.toISOString())

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Time conflict: Assessor is already busy during this slot' }, { status: 409 })
    }

    // 5. Create scheduled_slot
    const { data: scheduledSlot, error: insertErr } = await supabase
      .from('scheduled_slots')
      .insert({
        booking_id: bookingId,
        assessor_id: assessorId,
        start_datetime: startDate.toISOString(),
        assessment_end_datetime: assessmentEndDate.toISOString(),
        end_datetime: endDate.toISOString(),
        client_postcode: propertyPostcode,
        travel_from_postcode: basePostcode,
        estimated_travel_minutes: travelInfo.minutes,
        estimated_distance_miles: travelInfo.miles,
        status: 'scheduled'
      })
      .select()
      .single()

    if (insertErr) {
      throw insertErr
    }

    // 6. Update booking
    const { error: updateErr } = await supabase
      .from('bookings')
      .update({
        status: 'scheduled',
        assessor_id: assessorId,
        confirmed_datetime: startDate.toISOString()
      })
      .eq('id', bookingId)

    if (updateErr) {
      throw updateErr
    }

    // 7. Audit logging
    await supabase.from('aos_audit_log').insert({
      action: 'booking.scheduled',
      target_table: 'bookings',
      target_id: bookingId,
      new_value: {
        assessor_id: assessorId,
        start_datetime: startDate.toISOString(),
        status: 'scheduled'
      }
    })

    return NextResponse.json({
      success: true,
      scheduledSlot,
      confirmationSent: true
    })
  } catch (err: any) {
    console.error('Confirm slot API error:', err)
    return NextResponse.json({ error: err.message || 'Failed to confirm slot' }, { status: 500 })
  }
}
