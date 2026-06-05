import { NextResponse } from 'next/server'
import { sendEnquiryNotification } from '@/lib/email'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, type, ...details } = body

    if (!name || !email || !type) {
      return NextResponse.json({ error: 'Missing name, email, or enquiry type' }, { status: 400 })
    }

    // Call Resend notifier
    const emailRes = await sendEnquiryNotification({
      type,
      name,
      email,
      phone,
      details,
    })

    // Store in database under email_log or system notes if Supabase is connected
    const supabase = createAdminClient()
    const { error: logErr } = await supabase.from('email_log').insert({
      recipient: 'admin',
      subject: `New ${type} enquiry from ${name}`,
      status: emailRes.success ? 'sent' : 'failed',
      error_message: emailRes.success ? null : (emailRes.error as any)?.message || 'Unknown Resend error',
    })

    if (logErr) {
      console.warn('Could not log enquiry to email_log table:', logErr.message)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error handling corporate/partner enquiry:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
