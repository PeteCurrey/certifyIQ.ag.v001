import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export const config = { api: { bodyParser: false } }

export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook signature or secret' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Primary event: Stripe Checkout Session completed (one-time payment)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    if (session.payment_status === 'paid') {
      await handleCheckoutComplete(session)
    }
  }

  // Vendor-direct payment link (from agent portal billing path)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any
    if (paymentIntent.metadata?.billing_type === 'vendor_direct') {
      await handleVendorDirectPayment(paymentIntent)
    } else {
      await handlePaymentIntentSuccess(paymentIntent)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as any
    await handlePaymentFailed(paymentIntent)
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as any
    await handleRefund(charge)
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutComplete(session: any) {
  const metadata = session.metadata || {}
  const supabase = createAdminClient()

  try {
    const bookingId = metadata.bookingId
    const bookingRef = metadata.bookingRef

    if (!bookingId && !bookingRef) {
      console.error('checkout.session.completed: no bookingId or bookingRef in metadata', session.id)
      return
    }

    // Update booking status to paid
    const updateQuery = bookingId
      ? supabase.from('bookings').update({ status: 'paid', stripe_payment_status: 'succeeded', stripe_payment_intent_id: session.payment_intent || session.id }).eq('id', bookingId)
      : supabase.from('bookings').update({ status: 'paid', stripe_payment_status: 'succeeded', stripe_payment_intent_id: session.payment_intent || session.id }).eq('booking_ref', bookingRef)

    const { error: updateErr } = await updateQuery
    if (updateErr) {
      console.error('Failed to update booking status:', updateErr.message)
    }

    // Create lead in CRM
    if (metadata.email) {
      await supabase.from('leads').upsert({
        source: 'booking',
        status: 'converted',
        name: metadata.fullName || '',
        email: metadata.email,
        phone: metadata.phone || '',
        service_interest: metadata.serviceType || 'domestic-epc',
        estimated_value_gbp: parseFloat(metadata.priceGbp || '0'),
      }, { onConflict: 'email' })
    }

    // Send confirmation email
    if (metadata.email && metadata.fullName) {
      try {
        const { sendBookingConfirmation } = await import('@/lib/email')
        await sendBookingConfirmation({
          toEmail: metadata.email,
          customerName: metadata.fullName,
          bookingRef: bookingRef || '',
          propertyAddress: `${metadata.addressLine1 || ''}, ${metadata.town || ''}`,
          preferredDate: metadata.preferredDate || '',
          price: parseFloat(metadata.priceGbp || '0'),
          serviceType: metadata.serviceType || 'Domestic EPC',
        })
      } catch (emailErr) {
        console.error('Failed to send confirmation email:', emailErr)
      }
    }

    console.log(`✅ Booking ${bookingRef || bookingId} confirmed via Stripe session ${session.id}`)
  } catch (err) {
    console.error('Error in handleCheckoutComplete:', err)
  }
}

async function handlePaymentIntentSuccess(paymentIntent: any) {
  const metadata = paymentIntent.metadata || {}
  if (!metadata?.email) return

  const supabase = createAdminClient()
  try {
    await supabase.from('bookings')
      .update({ status: 'paid', stripe_payment_status: 'succeeded' })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    console.log(`✅ Payment intent ${paymentIntent.id} succeeded`)
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error)
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  const supabase = createAdminClient()
  await supabase.from('bookings')
    .update({ status: 'payment_failed', stripe_payment_status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}

async function handleRefund(charge: any) {
  const supabase = createAdminClient()
  await supabase.from('bookings')
    .update({ status: 'refunded', stripe_payment_status: 'refunded' })
    .eq('stripe_payment_intent_id', charge.payment_intent)
}

async function handleVendorDirectPayment(paymentIntent: any) {
  const { property_id } = paymentIntent.metadata || {}
  if (!property_id) {
    console.error('[Vendor Direct] No property_id in payment intent metadata')
    return
  }

  const supabase = createAdminClient()

  // Mark property as vendor_paid and update job status
  await supabase
    .from('agent_properties')
    .update({
      epc_job_status: 'payment_received',
      billing_status: 'vendor_paid',
      vendor_payment_intent_id: paymentIntent.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', property_id)

  // Fetch property details for confirmation email
  const { data: prop } = await supabase
    .from('agent_properties')
    .select('*, agent_accounts(agency_name)')
    .eq('id', property_id)
    .single()

  if (prop?.vendor_email) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    const propertyAddress = [prop.address_line_1, prop.address_line_2, prop.town, prop.postcode]
      .filter(Boolean).join(', ')

    await resend.emails.send({
      from: 'Avorria <assessments@avorria.co.uk>',
      to: prop.vendor_email,
      subject: 'EPC payment confirmed — assessment being arranged',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e8e8e8;padding:2rem;border-radius:12px;">
          <h1 style="font-size:1.5rem;color:#fff;margin:0 0 1.5rem;">Avorria<span style="color:#9bff59;">.</span></h1>
          <h2 style="color:#fff;margin:0 0 1rem;">Payment confirmed ✓</h2>
          <p style="color:#aaa;">Thank you — we've received your payment for the EPC assessment at <strong style="color:#fff;">${propertyAddress}</strong>.</p>
          <div style="background:#111;border:1px solid rgba(155,255,89,0.2);border-radius:8px;padding:1.25rem;margin:1.5rem 0;">
            <p style="color:#9bff59;margin:0;font-weight:600;">✓ Payment of £${(paymentIntent.amount / 100).toFixed(2)} received</p>
          </div>
          <p style="color:#aaa;">An assessor will be in touch within 24 hours to arrange a convenient time for the visit. Please ensure an adult (18+) is present to provide access.</p>
          <p style="color:#666;font-size:0.8rem;margin-top:1.5rem;">Questions? Email <a href="mailto:assessments@avorria.co.uk" style="color:#9bff59;">assessments@avorria.co.uk</a></p>
        </div>
      `,
    })
  }

  console.log(`✅ Vendor direct payment confirmed for property ${property_id}`)
}

