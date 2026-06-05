import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate counter (resets on server restart)
let dailyRequestCount = 0
let countResetDate = new Date().toDateString()

function getAuthHeader(): string {
  const email = process.env.EPC_API_EMAIL
  const key = process.env.EPC_API_KEY
  if (!email || !key) return ''
  return 'Basic ' + Buffer.from(`${email}:${key}`).toString('base64')
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
    const endpoint = type === 'non-domestic'
      ? `https://epc.opendatacommunities.org/api/v1/non-domestic/certificate/${encodeURIComponent(lmk)}`
      : `https://epc.opendatacommunities.org/api/v1/domestic/certificate/${encodeURIComponent(lmk)}`

    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json', Authorization: auth },
        next: { revalidate: 3600 }, // cache 1 hour
      })
      if (res.status === 401) {
        console.error('[EPC API] Unauthorized — check EPC_API_EMAIL and EPC_API_KEY')
        return NextResponse.json({ error: 'EPC register not configured' }, { status: 503 })
      }
      if (!res.ok) {
        return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
      }
      const data = await res.json()

      // Fetch recommendations if domestic
      let recommendations = []
      if (type !== 'non-domestic') {
        const recEndpoint = `https://epc.opendatacommunities.org/api/v1/domestic/recommendations/${encodeURIComponent(lmk)}`
        try {
          incrementCounter()
          const recRes = await fetch(recEndpoint, {
            headers: { Accept: 'application/json', Authorization: auth },
            next: { revalidate: 3600 },
          })
          if (recRes.ok) {
            const recData = await recRes.json()
            recommendations = recData.rows || []
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
    size: '25',
  })
  if (address) params.set('address', address)

  const domesticUrl = `https://epc.opendatacommunities.org/api/v1/domestic/search?${params}`

  try {
    const domesticRes = await fetch(domesticUrl, {
      headers: { Accept: 'application/json', Authorization: auth },
      next: { revalidate: 900 }, // cache 15 min
    })

    if (domesticRes.status === 401) {
      console.error('[EPC API] Unauthorized — check EPC_API_EMAIL and EPC_API_KEY')
      return NextResponse.json({ error: 'EPC register not configured' }, { status: 503 })
    }
    if (domesticRes.status === 400) {
      return NextResponse.json({ error: 'Invalid postcode format' }, { status: 400 })
    }
    if (!domesticRes.ok) {
      return NextResponse.json({ domestic: [], nonDomestic: [], total: 0 })
    }

    const domesticData = await domesticRes.json()
    const domesticRows: any[] = domesticData.rows || []

    // If no domestic results, also try non-domestic
    let nonDomesticRows: any[] = []
    if (domesticRows.length === 0) {
      incrementCounter()
      const nonDomParams = new URLSearchParams({ postcode: normPostcode, size: '10' })
      if (address) nonDomParams.set('address', address)
      try {
        const ndRes = await fetch(
          `https://epc.opendatacommunities.org/api/v1/non-domestic/search?${nonDomParams}`,
          { headers: { Accept: 'application/json', Authorization: auth }, next: { revalidate: 900 } }
        )
        if (ndRes.ok) {
          const ndData = await ndRes.json()
          nonDomesticRows = ndData.rows || []
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
