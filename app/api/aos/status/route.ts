import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = ['not_started', 'en_route', 'on_site', 'survey_complete', 'submitted_qa', 'done']

export async function POST(request: NextRequest) {
  try {
    const { bookingId, status } = await request.json()

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'bookingId and status are required' }, { status: 400 })
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('bookings')
      .update({
        assessor_status: status,
        assessor_status_updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (error) {
      console.error('Status update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, status })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
