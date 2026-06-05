import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postcode = searchParams.get('postcode')?.trim().toUpperCase().replace(/\s+/g, '')
  const address = searchParams.get('address')?.trim()

  if (!postcode) {
    return NextResponse.json({ error: 'Postcode parameter is required' }, { status: 400 })
  }

  const apiKey = process.env.EPC_REGISTER_API_KEY

  // If no API Key, use realistic mock data (good for testing/development)
  if (!apiKey || apiKey === 'your_epc_register_api_key_here') {
    // Return mock data for local testing
    const mockData = getMockEPCData(postcode, address)
    return NextResponse.json({ rows: mockData })
  }

  try {
    // Official OpenDataCommunities API Call
    // Authorization header requires Base64 encoded email:apikey or just token. 
    // Usually, OpenDataCommunities expects: Authorization: Basic <base64_encoded_credentials>
    // We assume EPC_REGISTER_API_KEY is the pre-encoded header or token.
    const url = new URL('https://epc.opendatacommunities.org/api/v1/domestic/search')
    url.searchParams.set('postcode', postcode)
    if (address) {
      url.searchParams.set('address', address)
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`EPC API returned status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching from EPC register:', error)
    // Fallback to mock data so the app doesn't crash
    return NextResponse.json({ 
      rows: getMockEPCData(postcode, address),
      warning: 'Using sandbox data due to connection issues.'
    })
  }
}

function getMockEPCData(postcode: string, address?: string) {
  const baseProperties = [
    {
      'address1': '10 High Street',
      'address2': '',
      'address3': '',
      'postcode': postcode,
      'current-energy-rating': 'D',
      'potential-energy-rating': 'C',
      'current-energy-efficiency': '62',
      'potential-energy-efficiency': '78',
      'property-type': 'House',
      'built-form': 'Semi-Detached',
      'inspection-date': '2018-05-12',
      'lodgement-datetime': '2018-05-12 14:22:01',
      'uprn': '100020123041',
      'lmk-key': 'mock-lmk-key-1'
    },
    {
      'address1': '12 High Street',
      'address2': '',
      'address3': '',
      'postcode': postcode,
      'current-energy-rating': 'C',
      'potential-energy-rating': 'B',
      'current-energy-efficiency': '72',
      'potential-energy-efficiency': '85',
      'property-type': 'House',
      'built-form': 'Semi-Detached',
      'inspection-date': '2021-08-20',
      'lodgement-datetime': '2021-08-20 09:15:30',
      'uprn': '100020123042',
      'lmk-key': 'mock-lmk-key-2'
    },
    {
      'address1': 'Flat 1, 14 High Street',
      'address2': '',
      'address3': '',
      'postcode': postcode,
      'current-energy-rating': 'E',
      'potential-energy-rating': 'C',
      'current-energy-efficiency': '45',
      'potential-energy-efficiency': '70',
      'property-type': 'Flat',
      'built-form': 'Mid-Terrace',
      'inspection-date': '2015-02-14',
      'lodgement-datetime': '2015-02-14 16:45:12',
      'uprn': '100020123043',
      'lmk-key': 'mock-lmk-key-3'
    }
  ]

  if (address) {
    const query = address.toLowerCase()
    return baseProperties.filter(p => 
      p.address1.toLowerCase().includes(query)
    )
  }

  return baseProperties
}
