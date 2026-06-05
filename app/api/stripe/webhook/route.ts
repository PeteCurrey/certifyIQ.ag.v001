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

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any
    await handlePaymentSuccess(paymentIntent)
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as any
    await handlePaymentFailed(paymentIntent)
  } else if (event.type === 'charge.refunded') {
    const charge = event.data.object as any
    await handleRefund(charge)
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSuccess(paymentIntent: any) {
  const metadata = paymentIntent.metadata
  if (!metadata?.email) {
    console.error('Payment succeeded but missing customer metadata:', paymentIntent.id)
    return
  }

  const supabase = createAdminClient()
  try {
    // 1. Get or Create Customer
    let customerId: string
    const { data: existingCustomer } = await supabase
      .from('customers').select('id').eq('email', metadata.email).maybeSingle()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from('customers')
        .insert({
          full_name: metadata.fullName,
          email: metadata.email,
          phone: metadata.phone,
          customer_type: metadata.customerType || 'homeowner',
          company_name: metadata.companyName || null,
        })
        .select('id').single()
      if (custErr || !newCustomer) throw new Error(`Failed to create customer: ${custErr?.message}`)
      customerId = newCustomer.id
    }

    // 2. Create Property
    const { data: newProperty, error: propErr } = await supabase
      .from('properties')
      .insert({
        customer_id: customerId,
        address_line_1: metadata.addressLine1,
        address_line_2: metadata.addressLine2 || '',
        town: metadata.town,
        county: metadata.county || '',
        postcode: metadata.postcode,
        property_type: metadata.propertyType,
        bed_count: parseInt(metadata.bedCount || '3', 10),
      })
      .select('id').single()
    if (propErr || !newProperty) throw new Error(`Failed to create property: ${propErr?.message}`)

    // 3. Update booking status to paid
    await supabase.from('bookings')
      .update({ status: 'paid', stripe_payment_status: 'succeeded' })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    // 4. Also create leads record for CRM
    await supabase.from('leads').insert({
      source: 'booking',
      status: 'converted',
      name: metadata.fullName,
      email: metadata.email,
      phone: metadata.phone,
      service_interest: metadata.serviceType || 'domestic-epc',
      estimated_value_gbp: parseFloat(metadata.priceGbp || '0'),
    }).single()

    // 5. Send email with Resend
    const { sendBookingConfirmation } = await import('@/lib/email')
    await sendBookingConfirmation({
      toEmail: metadata.email,
      customerName: metadata.fullName,
      bookingRef: metadata.bookingRef,
      propertyAddress: `${metadata.addressLine1}, ${metadata.town}`,
      preferredDate: metadata.preferredDate,
      price: parseFloat(metadata.priceGbp || '0'),
      serviceType: metadata.serviceType || 'Domestic EPC',
    })

    console.log(`Successfully processed booking ${metadata.bookingRef} for PI ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
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
