import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

// ─────────────────────────────────────────────────────────────
// GET /api/invoicing/generate
// Vercel Cron — runs daily at 00:00 UTC
// On the 1st of each month, generates monthly invoices
// for all active agents with billable jobs
// ─────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  const manualTest = req.nextUrl.searchParams.get('test') === 'true'
  if (!manualTest && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  // Only run on the 1st of the month unless manual test
  if (!manualTest && today.getDate() !== 1) {
    return NextResponse.json({ ok: true, skipped: 'Not the 1st of the month' })
  }

  const supabase = await createClient()

  // Period = previous month
  const periodStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const periodEnd = new Date(today.getFullYear(), today.getMonth(), 0)
  const periodLabel = periodStart.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  // Find all agent accounts with agency billing
  const { data: agents } = await supabase
    .from('agent_accounts')
    .select('id, agency_name, billing_email, email, stripe_customer_id, vat_registered, billing_day')
    .eq('status', 'active')

  let generated = 0

  for (const agent of agents || []) {
    // Find completed jobs this month (agency billing only)
    const { data: completedProperties } = await supabase
      .from('agent_properties')
      .select('id, address_line_1, address_line_2, town, postcode, price_gbp, updated_at')
      .eq('agent_account_id', agent.id)
      .eq('billing_status', 'on_monthly_invoice')
      .eq('epc_job_status', 'certificate_issued')
      .gte('updated_at', periodStart.toISOString())
      .lte('updated_at', periodEnd.toISOString())

    if (!completedProperties || completedProperties.length === 0) continue

    const subtotal = completedProperties.reduce((sum, p) => sum + (p.price_gbp || 75), 0)
    const vatRate = agent.vat_registered ? 0.20 : 0
    const vatAmount = subtotal * vatRate
    const total = subtotal + vatAmount

    const invoiceRef = `AVR-INV-AG${periodStart.getFullYear()}${String(periodStart.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + 7)

    // Create invoice
    const { data: invoice, error: invError } = await supabase
      .from('agent_invoices')
      .insert({
        agent_account_id: agent.id,
        invoice_ref: invoiceRef,
        invoice_period_start: periodStart.toISOString().split('T')[0],
        invoice_period_end: periodEnd.toISOString().split('T')[0],
        status: 'issued',
        subtotal_gbp: subtotal,
        vat_gbp: vatAmount,
        total_gbp: total,
        job_count: completedProperties.length,
        due_date: dueDate.toISOString().split('T')[0],
        issued_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (invError || !invoice) {
      console.error(`[Invoice Gen] Failed to create invoice for agent ${agent.id}:`, invError)
      continue
    }

    // Create invoice line items
    await supabase.from('agent_invoice_items').insert(
      completedProperties.map(p => ({
        agent_invoice_id: invoice.id,
        agent_property_id: p.id,
        address: [p.address_line_1, p.address_line_2, p.town, p.postcode].filter(Boolean).join(', '),
        service_type: 'Domestic EPC',
        completed_date: p.updated_at?.split('T')[0],
        price_gbp: p.price_gbp || 75,
        vat_gbp: (p.price_gbp || 75) * vatRate,
        description: 'RdSAP 10 Energy Performance Certificate',
      }))
    )

    // Mark properties as invoiced
    await supabase
      .from('agent_properties')
      .update({ billing_status: 'invoiced' })
      .in('id', completedProperties.map(p => p.id))

    // Email invoice to agent
    const billingEmail = agent.billing_email || agent.email
    if (billingEmail) {
      await resend.emails.send({
        from: 'Avorria Billing <billing@avorria.co.uk>',
        to: billingEmail,
        subject: `Your Avorria invoice — ${periodLabel} — £${total.toFixed(2)}`,
        html: buildInvoiceEmailHtml({
          agencyName: agent.agency_name,
          invoiceRef,
          periodLabel,
          jobs: completedProperties.length,
          subtotal,
          vatAmount,
          total,
          dueDate: dueDate.toLocaleDateString('en-GB'),
          paymentUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/agent/invoices`,
        }),
      })
    }

    generated++
  }

  return NextResponse.json({ ok: true, generated, period: periodLabel })
}

function buildInvoiceEmailHtml(opts: {
  agencyName: string
  invoiceRef: string
  periodLabel: string
  jobs: number
  subtotal: number
  vatAmount: number
  total: number
  dueDate: string
  paymentUrl: string
}): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:620px;margin:0 auto;background:#0a0a0a;color:#e8e8e8;border-radius:12px;overflow:hidden;">
      <div style="padding:2rem;border-bottom:1px solid #1a1a1a;">
        <h1 style="font-size:1.5rem;color:#fff;margin:0 0 0.25rem;">Avorria<span style="color:#9bff59;">.</span></h1>
        <span style="font-size:0.75rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Monthly Invoice</span>
      </div>
      <div style="padding:2rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;">
          <div>
            <p style="color:#888;font-size:0.8rem;margin:0 0 0.25rem;">To</p>
            <p style="color:#fff;font-weight:600;margin:0;">${opts.agencyName}</p>
          </div>
          <div style="text-align:right;">
            <p style="color:#888;font-size:0.8rem;margin:0 0 0.25rem;">Invoice</p>
            <p style="color:#fff;font-family:monospace;margin:0;font-size:0.85rem;">${opts.invoiceRef}</p>
          </div>
        </div>
        <div style="background:#111;border-radius:8px;padding:1.5rem;margin-bottom:1.5rem;">
          <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #1a1a1a;">
            <span style="color:#888;">Period</span>
            <span style="color:#fff;">${opts.periodLabel}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #1a1a1a;">
            <span style="color:#888;">EPCs completed</span>
            <span style="color:#fff;">${opts.jobs}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #1a1a1a;">
            <span style="color:#888;">Subtotal</span>
            <span style="color:#fff;">£${opts.subtotal.toFixed(2)}</span>
          </div>
          ${opts.vatAmount > 0 ? `
          <div style="display:flex;justify-content:space-between;padding:0.625rem 0;border-bottom:1px solid #1a1a1a;">
            <span style="color:#888;">VAT (20%)</span>
            <span style="color:#fff;">£${opts.vatAmount.toFixed(2)}</span>
          </div>` : ''}
          <div style="display:flex;justify-content:space-between;padding:0.875rem 0 0;">
            <span style="color:#fff;font-weight:700;font-size:1.1rem;">Total Due</span>
            <span style="color:#9bff59;font-weight:700;font-size:1.25rem;font-family:monospace;">£${opts.total.toFixed(2)}</span>
          </div>
        </div>
        <p style="color:#888;font-size:0.85rem;margin-bottom:1.5rem;">Payment due by <strong style="color:#fff;">${opts.dueDate}</strong>. Bank transfer or card payment accepted.</p>
        <a href="${opts.paymentUrl}" style="display:inline-block;background:#9bff59;color:#0a0a0a;font-weight:700;padding:0.875rem 1.75rem;border-radius:8px;text-decoration:none;">
          View &amp; Pay Invoice →
        </a>
      </div>
      <div style="padding:1.5rem 2rem;border-top:1px solid #1a1a1a;">
        <p style="color:#555;font-size:0.8rem;margin:0;">Avorria · assessments@avorria.co.uk · avorria.co.uk</p>
      </div>
    </div>
  `
}
