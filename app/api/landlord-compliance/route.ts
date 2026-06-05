import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(DB_URL, DB_KEY)

  try {
    const body = await request.json()
    const { action } = body

    if (action === 'generate_report') {
      const { lmk_key, address, postcode, current_rating, potential_rating, property_data } = body

      // Rule-based logic for compliance
      let overall_score = 'PASS'
      let mees_status = 'COMPLIANT'
      let band_c_gap = 0

      const rating = current_rating.toUpperCase()
      
      // Basic Compliance Rules
      if (['F', 'G'].includes(rating)) {
        overall_score = 'NON COMPLIANT'
        mees_status = 'ILLEGAL TO RENT'
      } else if (rating === 'E') {
        overall_score = 'HIGH RISK'
        mees_status = 'CURRENTLY COMPLIANT (AT RISK)'
      } else if (rating === 'D') {
        overall_score = 'AT RISK'
        mees_status = 'COMPLIANT'
      }

      // Band C Gap Analysis
      const bands = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
      const currentIndex = bands.indexOf(rating)
      const targetIndex = bands.indexOf('C')
      band_c_gap = Math.max(0, currentIndex - targetIndex)

      const report_data = {
        generated_at: new Date().toISOString(),
        property_data,
        insights: {
          future_risk: rating === 'E' ? 'High Risk' : rating === 'D' ? 'Elevated Risk' : 'Low Risk',
          upgrade_required: band_c_gap > 0 ? true : false,
          estimated_timeline: band_c_gap > 0 ? 'Within 2-4 years depending on legislation' : 'N/A'
        }
      }

      const { data, error } = await supabase.from('compliance_reports').insert({
        lmk_key,
        address,
        postcode,
        current_rating: rating,
        potential_rating,
        overall_score,
        mees_status,
        band_c_gap,
        report_data
      }).select('id').single()

      if (error) throw error
      return NextResponse.json({ id: data.id, report_data, overall_score, mees_status, band_c_gap })
    }

    if (action === 'save_to_portfolio') {
      const { report_id, customer_id } = body
      
      const { data, error } = await supabase
        .from('compliance_reports')
        .update({ customer_id })
        .eq('id', report_id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Landlord Compliance error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
