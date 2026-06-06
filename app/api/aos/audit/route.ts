import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: Request) {
  try {
    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // Verify caller is super_admin
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authErr } = await adminClient.auth.getUser(token)
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: caller } = await adminClient
      .from('aos_users')
      .select('role')
      .eq('email', user.email)
      .single()

    if (!caller || caller.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get filter query params
    const { searchParams } = new URL(request.url)
    const filterUser = searchParams.get('user')
    const filterAction = searchParams.get('action')
    const filterStart = searchParams.get('startDate')
    const filterEnd = searchParams.get('endDate')

    let query = adminClient
      .from('aos_audit_log')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterUser) {
      query = query.ilike('user_email', `%${filterUser}%`)
    }
    if (filterAction) {
      query = query.eq('action', filterAction)
    }
    if (filterStart) {
      query = query.gte('created_at', filterStart)
    }
    if (filterEnd) {
      query = query.lte('created_at', filterEnd)
    }

    const { data: logs, error: fetchErr } = await query
    if (fetchErr) throw fetchErr

    return NextResponse.json(logs)
  } catch (err: any) {
    console.error('Audit API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
