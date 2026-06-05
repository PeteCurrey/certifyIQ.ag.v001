import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(DB_URL, DB_KEY)

  try {
    const body = await request.json()
    const { action } = body
    const userAgent = request.headers.get('user-agent') || 'unknown'

    if (action === 'log_search') {
      const { postcode, address_query, lmk_key, rating } = body
      const { data, error } = await supabase.from('epc_searches').insert({
        postcode,
        address_query,
        lmk_key,
        rating,
        user_agent: userAgent
      }).select('id').single()

      if (error) throw error
      return NextResponse.json({ id: data.id })
    }

    if (action === 'log_lead') {
      const { search_id, lmk_key, action_taken } = body
      const { data, error } = await supabase.from('epc_leads').insert({
        search_id,
        lmk_key,
        action_taken
      })
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('EPC analytics error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
