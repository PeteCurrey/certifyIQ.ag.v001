import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import Stripe from 'stripe'
import { createHmac } from 'crypto'

// ─────────────────────────────────────────────────────────────
// GET /api/crm/vendor-chase
// Vercel Cron — runs daily at 09:00 UTC
// Chases vendors who haven't paid or responded in 72+ hours
// ─────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  const manualTest = req.nextUrl.searchParams.get('test') === 'true'
  if (!manualTest && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const cutoff72h = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()

  // Find properties still awaiting vendor payment > 72 hours ago
  const { data: stalledProperties } = await supabase
    .from('agent_properties')
    .select(`
      *,
      agent_accounts(id, agency_name, email)
    `)
    .eq('epc_job_status', 'awaiting_payment')
    .lt('vendor_payment_link_sent_at', cutoff72h)
    .lt('vendor_payment_reminder_count', 2) // Max 2 reminders
    .not('vendor_email', 'is', null)

  let chased = 0

  for (const prop of stalledProperties || []) {
    const propertyAddress = [prop.address_line_1, prop.address_line_2, prop.town, prop.postcode]
      .filter(Boolean).join(', ')
    const agencyName = prop.agent_accounts?.agency_name || 'Your estate agent'
    const epcPrice = prop.price_gbp || 75

    // Renew the Stripe payment link
    const newPaymentLink = await stripe.paymentLinks.create({
      line_items: [{
        price_data: {
          currency: 'gbp',
          unit_amount: Math.round(epcPrice * 100),
          product_data: {
            name: `EPC Assessment — ${propertyAddress}`,
            description: `Arranged by ${agencyName}.`,
          },
        } as Stripe.PriceCreateParams,
        quantity: 1,
      } as Stripe.PaymentLinkCreateParams.LineItem],
      after_completion: {
        type: 'redirect',
        redirect: { url: `${process.env.NEXT_PUBLIC_SITE_URL}/schedule/${prop.id}?paid=true` },
      },
      metadata: { property_id: prop.id, billing_type: 'vendor_direct' },
    })

    // Send reminder to vendor
    await resend.emails.send({
      from: 'Avorria <assessments@avorria.co.uk>',
      to: prop.vendor_email,
      subject: `Reminder: EPC assessment payment outstanding | ${propertyAddress}`,
      html: buildReminderHtml({ propertyAddress, agencyName, paymentLink: newPaymentLink.url, amount: epcPrice }),
    })

    // Generate signed tokens for agent CTA buttons (CSRF-safe)
    const signingKey = process.env.CRON_SECRET || 'secret'
    const coverToken = signToken({ propertyId: prop.id, action: 'cover' }, signingKey)
    const remindToken = signToken({ propertyId: prop.id, action: 'remind' }, signingKey)

    // Alert the agent
    if (prop.agent_accounts?.email) {
      await resend.emails.send({
        from: 'Avorria <no-reply@avorria.co.uk>',
        to: prop.agent_accounts.email,
        subject: `Action needed: vendor hasn't paid for ${propertyAddress}`,
        html: buildAgentChaseAlertHtml({
          propertyAddress,
          vendorName: prop.vendor_name || 'The vendor',
          coverUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/agent/cover-property?token=${coverToken}`,
          remindUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/agent/remind-vendor?token=${remindToken}`,
        }),
      })
    }

    // Update reminder count and new link expiry
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await supabase
      .from('agent_properties')
      .update({
        vendor_payment_reminder_count: (prop.vendor_payment_reminder_count || 0) + 1,
        vendor_payment_link_sent_at: new Date().toISOString(),
        vendor_payment_link_expires_at: newExpiry.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', prop.id)

    chased++
  }

  return NextResponse.json({ ok: true, chased })
}

// ─── Signed token helper ─────────────────────────────────────

function signToken(payload: object, secret: string): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}.${sig}`
}

// ─── Email HTML helpers ───────────────────────────────────────

function buildReminderHtml(opts: {
  propertyAddress: string
  agencyName: string
  paymentLink: string
  amount: number
}): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e8e8e8;padding:2rem;border-radius:12px;">
      <h1 style="font-size:1.5rem;color:#fff;margin:0 0 1.5rem;">Avorria<span style="color:#9bff59;">.</span></h1>
      <h2 style="color:#fff;margin:0 0 1rem;">EPC payment reminder</h2>
      <p style="color:#aaa;">We contacted you recently about an EPC assessment for <strong style="color:#fff;">${opts.propertyAddress}</strong>, arranged by ${opts.agencyName}.</p>
      <p style="color:#aaa;">We noticed payment is still outstanding. Properties that go to market without a valid EPC can face legal issues — we'd like to help you get this sorted quickly.</p>
      <div style="text-align:center;margin:2rem 0;">
        <p style="font-size:2rem;font-weight:700;color:#fff;margin:0 0 1rem;font-family:monospace;">£${opts.amount.toFixed(2)}</p>
        <a href="${opts.paymentLink}" style="display:inline-block;background:#9bff59;color:#0a0a0a;font-weight:700;padding:0.875rem 2rem;border-radius:8px;text-decoration:none;">
          Complete payment →
        </a>
      </div>
      <p style="color:#666;font-size:0.8rem;">If you believe you've already paid, please contact <a href="mailto:assessments@avorria.co.uk" style="color:#9bff59;">assessments@avorria.co.uk</a></p>
    </div>
  `
}

function buildAgentChaseAlertHtml(opts: {
  propertyAddress: string
  vendorName: string
  coverUrl: string
  remindUrl: string
}): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e8e8e8;padding:2rem;border-radius:12px;">
      <h1 style="font-size:1.5rem;color:#fff;margin:0 0 1.5rem;">Avorria<span style="color:#9bff59;">.</span></h1>
      <h2 style="color:#fff;margin:0 0 1rem;">Vendor hasn't paid — action needed</h2>
      <p style="color:#aaa;">${opts.vendorName} at <strong style="color:#fff;">${opts.propertyAddress}</strong> has not completed payment for their EPC within 72 hours of our initial contact.</p>
      <p style="color:#aaa;">Please choose how you'd like to proceed:</p>
      <div style="display:flex;gap:1rem;margin:2rem 0;flex-wrap:wrap;">
        <a href="${opts.coverUrl}" style="display:inline-block;background:#9bff59;color:#0a0a0a;font-weight:700;padding:0.875rem 1.5rem;border-radius:8px;text-decoration:none;flex:1;text-align:center;min-width:200px;">
          Cover on my account →
        </a>
        <a href="${opts.remindUrl}" style="display:inline-block;background:transparent;color:#e8e8e8;font-weight:600;padding:0.875rem 1.5rem;border-radius:8px;text-decoration:none;border:1px solid #333;flex:1;text-align:center;min-width:200px;">
          Give them more time
        </a>
      </div>
      <p style="color:#666;font-size:0.8rem;">These links are signed and expire in 7 days. Do not share them.</p>
    </div>
  `
}
