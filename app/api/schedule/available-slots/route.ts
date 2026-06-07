import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { findAvailableSlots } from '@/lib/scheduling-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get('serviceType')
    const sizeBand = searchParams.get('sizeBand')
    const postcode = searchParams.get('postcode')
    const assessorId = searchParams.get('assessorId') || undefined
    const fromDateStr = searchParams.get('fromDate')

    if (!serviceType || !sizeBand || !postcode) {
      return NextResponse.json({ error: 'Missing required parameters: serviceType, sizeBand, postcode' }, { status: 400 })
    }

    const requestedDate = fromDateStr ? new Date(fromDateStr) : undefined
    const supabase = createAdminClient()

    const slots = await findAvailableSlots(supabase, {
      serviceType,
      sizeBand,
      clientPostcode: postcode,
      assessorId,
      requestedDate
    })

    return NextResponse.json({ slots })
  } catch (err: any) {
    console.error('Available slots API error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch available slots' }, { status: 500 })
  }
}
