import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendBookingConfirmation } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      serviceCategory, // 'domestic' | 'commercial' | 'sap' | 'air_tightness'
      fullName,
      email,
      phone,
      customerType,
      companyName,
      addressLine1,
      addressLine2,
      town,
      county,
      postcode,
      propertyType,
      bedCount,
      preferredDate,
      preferredTimeSlot,
      priceGbp,
      specialInstructions,
      paymentMethod, // 'stripe' or 'sandbox' or 'quote'
      quoteRequired,

      // Additional fields for new services
      buildingUseType, floorArea, numberOfFloors, hasExistingEpc, commercialLevel,
      sapPropertyType, plotCount, sapStage, targetStartDate,
      airTestPropertyType, airTestConstructionType, airTestFloorArea, hasDesignSap, designAirTarget
    } = body

    if (!email || !fullName || !postcode || !addressLine1) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Get or Create Customer
    let customerId: string
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from('customers')
        .insert({
          full_name: fullName,
          email,
          phone,
          customer_type: customerType || 'homeowner',
          company_name: companyName || null,
        })
        .select('id')
        .single()

      if (custErr || !newCustomer) {
        throw new Error(`Failed to create customer: ${custErr?.message}`)
      }
      customerId = newCustomer.id
    }

    // Determine actual service type and actual property type
    let finalServiceType = 'domestic'
    let finalPropertyType = propertyType

    if (serviceCategory === 'commercial') {
      finalServiceType = `commercial_level_${commercialLevel || 3}`
      finalPropertyType = buildingUseType || 'Commercial'
    } else if (serviceCategory === 'sap') {
      finalServiceType = 'on_construction_sap'
      finalPropertyType = sapPropertyType || 'New Build'
    } else if (serviceCategory === 'air_tightness') {
      finalServiceType = 'air_tightness_test'
      finalPropertyType = airTestPropertyType || 'New Build'
    }

    // 2. Create Property
    const { data: newProperty, error: propErr } = await supabase
      .from('properties')
      .insert({
        customer_id: customerId,
        address_line_1: addressLine1,
        address_line_2: addressLine2 || '',
        town,
        county: county || '',
        postcode,
        property_type: finalPropertyType,
        bed_count: parseInt(bedCount || '3', 10),
      })
      .select('id')
      .single()

    if (propErr || !newProperty) {
      throw new Error(`Failed to create property: ${propErr?.message}`)
    }

    // 3. Generate Booking Reference
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase()
    const bookingRef = `AVR-${today}-${randStr}`

    // 4. Create Booking
    const bookingPayload: any = {
      booking_ref: bookingRef,
      property_id: newProperty.id,
      customer_id: customerId,
      service_type: finalServiceType,
      status: quoteRequired ? 'quote_requested' : (paymentMethod === 'sandbox' ? 'paid' : 'pending_payment'),
      preferred_date: preferredDate || null,
      preferred_time_slot: preferredTimeSlot || 'any',
      price_gbp: priceGbp ? parseFloat(priceGbp) : null,
      stripe_payment_intent_id: paymentMethod === 'sandbox' ? 'mock_intent_sandbox' : null,
      stripe_payment_status: paymentMethod === 'sandbox' ? 'succeeded' : (quoteRequired ? null : 'pending'),
      special_instructions: specialInstructions || '',
      
      // additional fields
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
    }

    const { data: newBooking, error: bookErr } = await supabase
      .from('bookings')
      .insert(bookingPayload)
      .select('id')
      .single()

    if (bookErr || !newBooking) {
      throw new Error(`Failed to create booking: ${bookErr?.message}`)
    }

    // 5. Initialize Assessment (if not purely quote requested)
    // If it's quote_requested, we might still initialize an assessment row or not, let's just initialize it so the admin can fill it later
    const { error: assessErr } = await supabase
      .from('assessments')
      .insert({
        booking_id: newBooking.id,
        status: 'not_started',
      })

    if (assessErr) {
      throw new Error(`Failed to initialize assessment: ${assessErr.message}`)
    }

    // 6. Send Booking Confirmation Email
    if (!quoteRequired) {
      await sendBookingConfirmation({
        toEmail: email,
        customerName: fullName,
        bookingRef,
        propertyAddress: `${addressLine1}, ${town}`,
        preferredDate,
        price: parseFloat(priceGbp),
      })
    } else {
      // In a real app we'd send a quote received email, but using booking confirmation with null price is fine for now
      // Or we can just skip sending email for quote request in this demo
    }

    return NextResponse.json({
      success: true,
      bookingRef,
      bookingId: newBooking.id,
    })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
