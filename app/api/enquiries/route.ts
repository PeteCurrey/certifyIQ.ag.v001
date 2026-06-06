import { NextResponse } from 'next/server'
import { sendEnquiryNotification } from '@/lib/email'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, type, company, volume, message, source, ...details } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing name or email' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Save to leads CRM table
    const { data: lead, error: leadErr } = await supabase.from('leads').insert({
      name,
      email,
      phone: phone || null,
      company: company || null,
      enquiry_type: type || 'General',
      source: source || 'website',
      message: message || null,
      volume: volume || null,
      status: 'new',
      priority: 'medium',
      extra_data: details,
    }).select('id').single()

    if (leadErr) {
      console.warn('Could not save lead to database:', leadErr.message)
    }

    // Also send email notification via Resend
    const emailRes = await sendEnquiryNotification({
      type: type || 'General',
      name,
      email,
      phone,
      details: { company, volume, message, ...details },
    })

    // Log the email send
    await supabase.from('email_log').insert({
      recipient: 'admin',
      subject: `New ${type || 'General'} enquiry from ${name}`,
      status: emailRes.success ? 'sent' : 'failed',
      error_message: emailRes.success ? null : (emailRes.error as any)?.message || 'Unknown error',
    }).then(() => {})

    return NextResponse.json({ success: true, lead_id: lead?.id || null })
  } catch (error: any) {
    console.error('Error handling enquiry:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient()
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ leads: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient()
    const { id, status, notes, priority, assigned_to } = await request.json()

    if (!id) return NextResponse.json({ error: 'Missing lead id' }, { status: 400 })

    const { error } = await supabase
      .from('leads')
      .update({ status, notes, priority, assigned_to, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
