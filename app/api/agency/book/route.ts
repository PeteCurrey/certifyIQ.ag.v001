import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(DB_URL, DB_KEY)

  try {
    const { 
      agencyId, 
      branchId, 
      propertyType, 
      addressLine1, 
      town, 
      postcode, 
      serviceType, 
      dateSlot, 
      timeSlot, 
      price, 
      notes 
    } = await request.json()

    if (!agencyId) return NextResponse.json({ error: 'Agency ID required' }, { status: 400 })

    // 1. Create or Find Property
    let propId = null
    const { data: existingProp } = await supabase
      .from('agency_properties')
      .select('id')
      .eq('agency_id', agencyId)
      .eq('postcode', postcode)
      .eq('address_line_1', addressLine1)
      .single()

    if (existingProp) {
      propId = existingProp.id
    } else {
      const { data: newProp, error: propErr } = await supabase
        .from('agency_properties')
        .insert({
          agency_id: agencyId,
          branch_id: branchId || null,
          address_line_1: addressLine1,
          town,
          postcode,
          property_type: propertyType,
          compliance_status: 'unknown'
        })
        .select()
        .single()
      
      if (propErr) throw propErr
      propId = newProp.id
    }

    // 2. Create Job
    const jobRef = `EPC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    const { data: job, error: jobErr } = await supabase
      .from('agency_jobs')
      .insert({
        agency_id: agencyId,
        branch_id: branchId || null,
        property_id: propId,
        service_type: serviceType,
        status: 'booked',
        job_ref: jobRef,
        price_gbp: price,
        booked_date: dateSlot,
        booked_time_slot: timeSlot,
        access_notes: notes
      })
      .select()
      .single()

    if (jobErr) throw jobErr

    return NextResponse.json({ success: true, jobRef })

  } catch (error: any) {
    console.error('Job Booking Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
