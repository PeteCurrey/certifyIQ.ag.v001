import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assessorId, startDatetime, endDatetime } = body

    if (!assessorId || !startDatetime || !endDatetime) {
      return NextResponse.json({ error: 'Missing parameters: assessorId, startDatetime, endDatetime' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: conflicts, error } = await supabase
      .from('scheduled_slots')
      .select('*, bookings(booking_ref, service_type)')
      .eq('assessor_id', assessorId)
      .neq('status', 'cancelled')
      .lt('start_datetime', endDatetime)
      .gt('end_datetime', startDatetime)

    if (error) {
      throw error
    }

    return NextResponse.json({
      hasConflict: conflicts && conflicts.length > 0,
      conflictingJobs: conflicts || []
    })
  } catch (err: any) {
    console.error('Check conflicts API error:', err)
    return NextResponse.json({ error: err.message || 'Failed to check conflicts' }, { status: 500 })
  }
}
