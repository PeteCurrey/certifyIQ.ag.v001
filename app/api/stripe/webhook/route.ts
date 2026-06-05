import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' as any })
  : null

export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event: Stripe.Event

  if (!stripe) {
    // Return early if Stripe isn't configured
    return NextResponse.json({ received: true, info: 'Stripe webhook received but ignored (no secret key)' })
  }

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    await handlePaymentSuccess(paymentIntent)
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const metadata = paymentIntent.metadata
  if (!metadata || !metadata.email) {
    console.error('Payment succeeded but missing customer metadata:', paymentIntent.id)
    return
  }

  const supabase = createAdminClient()

  try {
    // 1. Get or Create Customer
    let customerId: string

    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', metadata.email)
      .maybeSingle()

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
        .select('id')
        .single()

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
      .select('id')
      .single()

    if (propErr || !newProperty) throw new Error(`Failed to create property: ${propErr?.message}`)

    // 3. Generate Booking Reference (CIQ-YYYYMMDD-XXXX)
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase()
    const bookingRef = `CIQ-${today}-${randStr}`

    // 4. Create Booking
    const { data: newBooking, error: bookErr } = await supabase
      .from('bookings')
      .insert({
        booking_ref: bookingRef,
        property_id: newProperty.id,
        customer_id: customerId,
        service_type: metadata.serviceType || 'domestic',
        status: 'paid',
        preferred_date: metadata.preferredDate,
        preferred_time_slot: metadata.preferredTimeSlot || 'any',
        price_gbp: parseFloat(metadata.priceGbp),
        stripe_payment_intent_id: paymentIntent.id,
        stripe_payment_status: 'succeeded',
        special_instructions: metadata.specialInstructions || '',
      })
      .select('id')
      .single()

    if (bookErr || !newBooking) throw new Error(`Failed to create booking: ${bookErr?.message}`)

    // 5. Initialize Assessment
    const { error: assessErr } = await supabase
      .from('assessments')
      .insert({
        booking_id: newBooking.id,
        status: 'not_started',
      })

    if (assessErr) throw new Error(`Failed to initialize assessment: ${assessErr.message}`)

    console.log(`Successfully processed booking ${bookingRef} for payment intent ${paymentIntent.id}`)

    // 6. Optional: Send email with Resend
    // We will build Resend templates in a separate file.
  } catch (error) {
    console.error('Error handling payment success database sync:', error)
  }
}
