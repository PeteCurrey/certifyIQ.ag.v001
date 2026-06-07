import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate counter (resets on server restart)
let dailyRequestCount = 0
let countResetDate = new Date().toDateString()

function getAuthHeader(): string {
  const key = process.env.EPC_API_KEY
  if (!key) return ''
  // The new API uses Bearer token, not Basic auth
  return `Bearer ${key}`
}

function normalisePostcode(pc: string): string {
  return pc.trim().toUpperCase().replace(/\s+/g, ' ')
}

function incrementCounter() {
  const today = new Date().toDateString()
  if (today !== countResetDate) {
    dailyRequestCount = 0
    countResetDate = today
  }
  dailyRequestCount++
  if (dailyRequestCount > 4800) {
    console.warn(`[EPC API] Daily request count: ${dailyRequestCount} — approaching 5,000 limit`)
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lmk = searchParams.get('lmk')
  const type = searchParams.get('type') || 'domestic'
  const postcode = searchParams.get('postcode')
  const address = searchParams.get('address') || ''

  const auth = getAuthHeader()
  if (!auth) {
    return NextResponse.json({ error: 'EPC register not configured' }, { status: 503 })
  }

  // MODE B: Fetch full certificate detail
  if (lmk) {
    incrementCounter()
    // New API has a unified endpoint for both domestic and non-domestic certificates
    const endpoint = `https://api.get-energy-performance-data.communities.gov.uk/api/certificate?certificate_number=${encodeURIComponent(lmk)}`

    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json', Authorization: auth },
        next: { revalidate: 3600 }, // cache 1 hour
      })
      if (res.status === 401 || res.status === 403) {
        console.error('[EPC API] Unauthorized — check EPC_API_KEY')
        return NextResponse.json({ error: 'EPC register not configured or invalid key' }, { status: 503 })
      }
      if (!res.ok) {
        return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
      }
      const rawData = await res.json()
      // The new API returns {"data": { ... }}
      const data = rawData.data || rawData

      // Fetch recommendations if domestic
      let recommendations = []
      if (type !== 'non-domestic') {
        // The new API might have a different endpoint for recommendations or include it.
        // As per docs, it might be /api/domestic-recommendations
        const recEndpoint = `https://api.get-energy-performance-data.communities.gov.uk/api/domestic-recommendations/search?certificate_number=${encodeURIComponent(lmk)}`
        try {
          incrementCounter()
          const recRes = await fetch(recEndpoint, {
            headers: { Accept: 'application/json', Authorization: auth },
            next: { revalidate: 3600 },
          })
          if (recRes.ok) {
            const recData = await recRes.json()
            recommendations = recData.data || []
          }
        } catch (e) {
          console.error('[EPC API] Failed to fetch recommendations', e)
        }
      }

      return NextResponse.json({ ...data, recommendations })
    } catch (err) {
      console.error('[EPC API] Certificate fetch error:', err)
      return NextResponse.json({ error: 'Failed to fetch certificate' }, { status: 500 })
    }
  }

  // MODE A: Postcode search
  if (!postcode) {
    return NextResponse.json({ error: 'Postcode required' }, { status: 400 })
  }

  const normPostcode = normalisePostcode(postcode)
  const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i
  if (!postcodeRegex.test(normPostcode)) {
    return NextResponse.json({ error: 'Invalid postcode format' }, { status: 400 })
  }

  incrementCounter()

  const params = new URLSearchParams({
    postcode: normPostcode,
    page_size: '25', // The new API uses page_size
  })
  if (address) params.set('address', address)

  const domesticUrl = `https://api.get-energy-performance-data.communities.gov.uk/api/domestic/search?${params}`

  try {
    const domesticRes = await fetch(domesticUrl, {
      headers: { Accept: 'application/json', Authorization: auth },
      next: { revalidate: 900 }, // cache 15 min
    })

    if (domesticRes.status === 401 || domesticRes.status === 403) {
      console.error('[EPC API] Unauthorized — check EPC_API_KEY')
      return NextResponse.json({ error: 'EPC register not configured or invalid key' }, { status: 503 })
    }
    if (domesticRes.status === 400) {
      return NextResponse.json({ error: 'Invalid postcode format' }, { status: 400 })
    }
    
    let domesticRows: any[] = []
    if (domesticRes.ok) {
      const domesticData = await domesticRes.json()
      // New API returns an array or an object with error. If error, data.error exists.
      if (Array.isArray(domesticData.data)) {
        domesticRows = domesticData.data
      } else if (Array.isArray(domesticData)) {
        domesticRows = domesticData
      }
    }

    // If no domestic results, also try non-domestic
    let nonDomesticRows: any[] = []
    if (domesticRows.length === 0) {
      incrementCounter()
      const nonDomParams = new URLSearchParams({ postcode: normPostcode, page_size: '10' })
      if (address) nonDomParams.set('address', address)
      try {
        const ndRes = await fetch(
          `https://api.get-energy-performance-data.communities.gov.uk/api/non-domestic/search?${nonDomParams}`,
          { headers: { Accept: 'application/json', Authorization: auth }, next: { revalidate: 900 } }
        )
        if (ndRes.ok) {
          const ndData = await ndRes.json()
          if (Array.isArray(ndData.data)) {
            nonDomesticRows = ndData.data
          } else if (Array.isArray(ndData)) {
            nonDomesticRows = ndData
          }
        }
      } catch {
        // Non-domestic search failed silently
      }
    }

    const total = domesticRows.length + nonDomesticRows.length
    return NextResponse.json({ domestic: domesticRows, nonDomestic: nonDomesticRows, total })
  } catch (err) {
    console.error('[EPC API] Search error:', err)
    return NextResponse.json({ error: 'Failed to query EPC register' }, { status: 500 })
  }
}
