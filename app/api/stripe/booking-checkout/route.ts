import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      serviceCategory,
      fullName, email, phone, customerType, companyName,
      addressLine1, addressLine2, town, county, postcode,
      propertyType, bedCount,
      preferredDate, preferredTimeSlot, specialInstructions,
      priceGbp,
      buildingUseType, floorArea, numberOfFloors, hasExistingEpc, commercialLevel,
      sapPropertyType, plotCount, sapStage, targetStartDate,
      airTestPropertyType, airTestConstructionType, airTestFloorArea, hasDesignSap, designAirTarget
    } = body

    if (!email || !fullName || !postcode || !addressLine1 || !priceGbp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Get or Create Customer
    let customerId: string
    const { data: existingCustomer } = await supabase
      .from('customers').select('id').eq('email', email).maybeSingle()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from('customers')
        .insert({ full_name: fullName, email, phone, customer_type: customerType || 'homeowner', company_name: companyName || null })
        .select('id').single()
      if (custErr || !newCustomer) throw new Error(`Customer create failed: ${custErr?.message}`)
      customerId = newCustomer.id
    }

    // 2. Create Property
    let finalPropertyType = propertyType
    let finalServiceType = 'domestic'
    if (serviceCategory === 'commercial') { finalServiceType = `commercial_level_${commercialLevel || 3}`; finalPropertyType = buildingUseType || 'Commercial' }
    else if (serviceCategory === 'sap') { finalServiceType = 'on_construction_sap'; finalPropertyType = sapPropertyType || 'New Build' }
    else if (serviceCategory === 'air_tightness') { finalServiceType = 'air_tightness_test'; finalPropertyType = airTestPropertyType || 'New Build' }

    const { data: newProperty, error: propErr } = await supabase
      .from('properties')
      .insert({ customer_id: customerId, address_line_1: addressLine1, address_line_2: addressLine2 || '', town, county: county || '', postcode, property_type: finalPropertyType, bed_count: parseInt(bedCount || '3', 10) })
      .select('id').single()
    if (propErr || !newProperty) throw new Error(`Property create failed: ${propErr?.message}`)

    // 3. Generate booking ref and create pending booking
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase()
    const bookingRef = `AVR-${today}-${randStr}`

    const { data: newBooking, error: bookErr } = await supabase
      .from('bookings')
      .insert({
        booking_ref: bookingRef,
        property_id: newProperty.id,
        customer_id: customerId,
        service_type: finalServiceType,
        status: 'pending_payment',
        preferred_date: preferredDate || null,
        preferred_time_slot: preferredTimeSlot || 'any',
        price_gbp: parseFloat(priceGbp),
        stripe_payment_status: 'pending',
        special_instructions: specialInstructions || '',
        building_use_type: buildingUseType || null,
        floor_area: (floorArea || airTestFloorArea) ? parseFloat(floorArea || airTestFloorArea) : null,
        number_of_floors: numberOfFloors ? parseInt(numberOfFloors, 10) : null,
        has_existing_epc: hasExistingEpc || false,
        plot_count: plotCount ? parseInt(plotCount, 10) : null,
        sap_stage: sapStage || null,
        target_start_date: targetStartDate || null,
        construction_type: airTestConstructionType || null,
        has_design_sap: hasDesignSap || false,
        design_air_target: designAirTarget ? parseFloat(designAirTarget) : null
      })
      .select('id').single()
    if (bookErr || !newBooking) throw new Error(`Booking create failed: ${bookErr?.message}`)

    // Create assessment row
    await supabase.from('assessments').insert({ booking_id: newBooking.id, status: 'not_started' })

    // 4. Create Stripe Checkout Session
    const amountPence = Math.round(parseFloat(priceGbp) * 100)
    const serviceLabel =
      serviceCategory === 'domestic' ? 'Domestic EPC Assessment' :
      serviceCategory === 'commercial' ? 'Commercial EPC Assessment' :
      serviceCategory === 'sap' ? 'New Build SAP Calculations & EPC' :
      'Air Tightness Test'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: serviceLabel,
              description: `${addressLine1}, ${town}, ${postcode} | Ref: ${bookingRef}`,
              metadata: { bookingRef, service: serviceCategory },
            },
            unit_amount: amountPence,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingRef,
        bookingId: newBooking.id,
        fullName, email, phone,
        customerType: customerType || 'homeowner',
        companyName: companyName || '',
        addressLine1,
        addressLine2: addressLine2 || '',
        town, county: county || '', postcode,
        propertyType: finalPropertyType,
        bedCount: bedCount || '3',
        preferredDate: preferredDate || '',
        serviceType: serviceLabel,
        priceGbp: priceGbp.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://avorria.co.uk'}/book/success?ref=${bookingRef}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://avorria.co.uk'}/book?cancelled=true`,
    })

    // 5. Store Stripe session ID on the booking
    await supabase.from('bookings').update({ stripe_payment_intent_id: session.payment_intent as string || session.id }).eq('id', newBooking.id)

    return NextResponse.json({ url: session.url, bookingRef })
  } catch (error: any) {
    console.error('Stripe booking checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
