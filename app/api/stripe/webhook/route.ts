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

  // Also handle payment_intent.succeeded for any direct PI flows
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any
    await handlePaymentIntentSuccess(paymentIntent)
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
