import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get('postcode')

  if (!postcode) {
    return NextResponse.json({ error: 'Postcode required' }, { status: 400 })
  }

  const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase()

  try {
    // First validate the postcode and get location data via postcodes.io (free, no key needed)
    const postcodeRes = await fetch(
      `https://api.postcodes.io/postcodes/${cleanPostcode}`,
      { next: { revalidate: 86400 } }
    )
    const postcodeData = await postcodeRes.json()

    if (!postcodeRes.ok || postcodeData.status !== 200) {
      return NextResponse.json({ error: 'Invalid postcode or postcode not found' }, { status: 404 })
    }

    const { admin_district, admin_ward, region, latitude, longitude } = postcodeData.result
    const town = admin_district || admin_ward || region || ''

    // Try getAddress.io if API key is set (provides real street-level addresses)
    const getAddressKey = process.env.GETADDRESS_API_KEY
    if (getAddressKey) {
      const gaRes = await fetch(
        `https://api.getaddress.io/find/${cleanPostcode}?api-key=${getAddressKey}&expand=true`,
        { next: { revalidate: 3600 } }
      )
      if (gaRes.ok) {
        const gaData = await gaRes.json()
        const addresses = (gaData.addresses || []).map((a: any) => {
          // getAddress returns structured address objects when expand=true
          const parts = [
            a.line_1,
            a.line_2,
            a.line_3,
            a.line_4,
          ].filter(Boolean)
          return {
            line1: parts[0] || '',
            line2: parts.slice(1).join(', ') || '',
            town: a.town_or_city || town,
            county: a.county || '',
            postcode: postcode.toUpperCase(),
          }
        }).filter((a: any) => a.line1)

        if (addresses.length > 0) {
          return NextResponse.json({ addresses, town })
        }
      }
    }

    // Fallback: return postcode location data only (user fills address manually)
    return NextResponse.json({
      addresses: [],
      town,
      county: postcodeData.result.admin_county || '',
      latitude,
      longitude,
      message: 'Postcode validated. Please enter your address manually.'
    })
  } catch (err: any) {
    console.error('Address lookup error:', err)
    return NextResponse.json({ error: 'Failed to look up postcode' }, { status: 500 })
  }
}
