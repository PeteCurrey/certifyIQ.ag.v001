import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import Stripe from 'stripe'

// ─────────────────────────────────────────────────────────────
// POST /api/crm/vendor-outreach
// Triggered after EPC check confirms EPC is required.
// Forks on billing_preference: agency vs vendor
// ─────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get('x-cron-secret')
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { propertyId } = await req.json()
  if (!propertyId) {
    return NextResponse.json({ error: 'propertyId is required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Fetch the property and its agent account
  const { data: property, error } = await supabase
    .from('agent_properties')
    .select(`
      *,
      agent_accounts(
        id,
        agency_name,
        billing_preference,
        billing_email,
        stripe_customer_id
      )
    `)
    .eq('id', propertyId)
    .single()

  if (error || !property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }

  // Determine effective billing preference
  const billingPref = property.billing_override || property.agent_accounts?.billing_preference || 'agency'
  const agencyName = property.agent_accounts?.agency_name || 'Your estate agent'
  const propertyAddress = [property.address_line_1, property.address_line_2, property.town, property.postcode]
    .filter(Boolean).join(', ')

  // Update job status
  await supabase
    .from('agent_properties')
    .update({ epc_job_status: 'awaiting_contact', updated_at: new Date().toISOString() })
    .eq('id', propertyId)

  // ─── PATH A: Agency billing ───────────────────────────────
  if (billingPref === 'agency') {
    // Email vendor to request access only — no payment needed
    const vendorEmail = property.vendor_email || property.landlord_email
    if (vendorEmail) {
      const { data: emailData } = await resend.emails.send({
        from: 'Avorria <assessments@avorria.co.uk>',
        to: vendorEmail,
        subject: `EPC assessment arranged for ${propertyAddress}`,
        html: buildAccessRequestHtml({
          vendorName: property.vendor_name || property.landlord_name || 'Dear Occupant',
          propertyAddress,
          agencyName,
          bookingRef: `AVR-${propertyId.slice(0, 8).toUpperCase()}`,
        }),
      })

      // Log outreach
      await supabase.from('vendor_outreach_log').insert({
        agent_property_id: propertyId,
        outreach_type: 'email',
        recipient_email: vendorEmail,
        template_name: 'vendor-access-request',
        resend_email_id: emailData?.id,
        subject: `EPC assessment arranged for ${propertyAddress}`,
        status: 'sent',
      })

      await supabase
        .from('agent_properties')
        .update({
          epc_job_status: 'contact_sent',
          billing_status: 'on_monthly_invoice',
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId)
    }
  }

  // ─── PATH B: Vendor billing ───────────────────────────────
  if (billingPref === 'vendor') {
    const vendorEmail = property.vendor_email || property.landlord_email
    if (vendorEmail) {
      // Create a Stripe Payment Link for the vendor
      const epcPrice = deriveEpcPrice(property.property_type, property.bedrooms)

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              unit_amount: Math.round(epcPrice * 100),
              product_data: {
                name: `EPC Assessment — ${propertyAddress}`,
                description: `Arranged by ${agencyName}. Valid for 10 years from lodgement.`,
              },
            } as Stripe.PriceCreateParams,
            quantity: 1,
          } as Stripe.PaymentLinkCreateParams.LineItem,
        ],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/schedule/${propertyId}?paid=true`,
          },
        },
        metadata: {
          property_id: propertyId,
          billing_type: 'vendor_direct',
        },
      })

      const linkExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      const { data: emailData } = await resend.emails.send({
        from: 'Avorria <assessments@avorria.co.uk>',
        to: vendorEmail,
        subject: `EPC assessment — payment required | ${propertyAddress}`,
        html: buildPaymentRequestHtml({
          vendorName: property.vendor_name || property.landlord_name || 'Dear Occupant',
          propertyAddress,
          agencyName,
          paymentLink: paymentLink.url,
          amount: epcPrice,
          expiryDate: linkExpiry.toLocaleDateString('en-GB'),
        }),
      })

      await supabase.from('vendor_outreach_log').insert({
        agent_property_id: propertyId,
        outreach_type: 'email',
        recipient_email: vendorEmail,
        template_name: 'vendor-payment-and-access',
        resend_email_id: emailData?.id,
        subject: `EPC assessment — payment required | ${propertyAddress}`,
        status: 'sent',
      })

      await supabase
        .from('agent_properties')
        .update({
          epc_job_status: 'awaiting_payment',
          billing_status: 'awaiting_vendor_payment',
          price_gbp: epcPrice,
          vendor_payment_link_sent_at: new Date().toISOString(),
          vendor_payment_link_expires_at: linkExpiry.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', propertyId)
    }
  }

  return NextResponse.json({ ok: true, billingPath: billingPref })
}

// ─── Helpers ─────────────────────────────────────────────────

function deriveEpcPrice(propertyType: string, bedrooms: number | null): number {
  if (!bedrooms) return 75
  const beds = bedrooms
  if (propertyType?.toLowerCase().includes('flat') || propertyType?.toLowerCase().includes('apartment')) return 65
  if (beds <= 2) return 70
  if (beds === 3) return 80
  if (beds === 4) return 95
  return 110
}

function buildAccessRequestHtml(opts: {
  vendorName: string
  propertyAddress: string
  agencyName: string
  bookingRef: string
}): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e8e8e8;padding:2rem;border-radius:12px;">
      <div style="margin-bottom:2rem;">
        <h1 style="font-size:1.5rem;color:#fff;margin:0 0 0.5rem;">Avorria<span style="color:#9bff59;">.</span></h1>
        <span style="font-size:0.75rem;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Energy Performance Certificates</span>
      </div>
      <h2 style="font-size:1.25rem;color:#fff;margin:0 0 1rem;">EPC assessment arranged for your property</h2>
      <p style="color:#aaa;margin-bottom:1rem;">Dear ${opts.vendorName},</p>
      <p style="color:#aaa;margin-bottom:1.5rem;">
        ${opts.agencyName} has arranged an Energy Performance Certificate (EPC) assessment for your property at:
        <strong style="color:#fff;display:block;margin-top:0.5rem;">${opts.propertyAddress}</strong>
      </p>
      <p style="color:#aaa;margin-bottom:0.5rem;">An assessor will be in touch shortly to arrange a suitable time. Please ensure an adult (18+) is present to provide access.</p>
      <div style="background:#111;border:1px solid #222;border-radius:8px;padding:1rem;margin:1.5rem 0;">
        <p style="margin:0;font-size:0.8rem;color:#888;">Booking Reference: <strong style="color:#9bff59;font-family:monospace;">${opts.bookingRef}</strong></p>
      </div>
      <p style="color:#666;font-size:0.8rem;">Questions? Email us at <a href="mailto:assessments@avorria.co.uk" style="color:#9bff59;">assessments@avorria.co.uk</a></p>
    </div>
  `
}

function buildPaymentRequestHtml(opts: {
  vendorName: string
  propertyAddress: string
  agencyName: string
  paymentLink: string
  amount: number
  expiryDate: string
}): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e8e8e8;padding:2rem;border-radius:12px;">
      <div style="margin-bottom:2rem;">
        <h1 style="font-size:1.5rem;color:#fff;margin:0 0 0.5rem;">Avorria<span style="color:#9bff59;">.</span></h1>
      </div>
      <h2 style="font-size:1.25rem;color:#fff;margin:0 0 1rem;">EPC assessment — payment required</h2>
      <p style="color:#aaa;margin-bottom:1rem;">Dear ${opts.vendorName},</p>
      <p style="color:#aaa;margin-bottom:1.5rem;">
        ${opts.agencyName} has requested an EPC for <strong style="color:#fff;">${opts.propertyAddress}</strong>.
        Payment is required before we can book your assessment.
      </p>
      <div style="background:#111;border:1px solid #222;border-radius:8px;padding:1.25rem;margin:1.5rem 0;text-align:center;">
        <p style="font-size:0.8rem;color:#888;margin:0 0 0.5rem;">Amount due</p>
        <p style="font-size:2.5rem;font-weight:700;color:#fff;margin:0 0 1rem;font-family:monospace;">£${opts.amount.toFixed(2)}</p>
        <a href="${opts.paymentLink}" style="display:inline-block;background:#9bff59;color:#0a0a0a;font-weight:700;padding:0.875rem 2rem;border-radius:8px;text-decoration:none;font-size:1rem;">
          Pay &amp; Book Assessment →
        </a>
        <p style="font-size:0.75rem;color:#666;margin-top:0.75rem;">Payment link expires ${opts.expiryDate}</p>
      </div>
      <p style="color:#aaa;font-size:0.9rem;">Once payment is confirmed, we'll contact you to arrange a convenient appointment. The certificate will be emailed to you and is valid for 10 years.</p>
      <p style="color:#666;font-size:0.8rem;margin-top:1.5rem;">Questions? Email us at <a href="mailto:assessments@avorria.co.uk" style="color:#9bff59;">assessments@avorria.co.uk</a></p>
    </div>
  `
}
