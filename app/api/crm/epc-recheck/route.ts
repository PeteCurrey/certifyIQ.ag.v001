import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─────────────────────────────────────────────────────────────
// GET /api/crm/epc-recheck
// Called by Vercel Cron daily at 02:00 UTC
// Checks EPC register for properties with status = 'pending'
// and also re-checks properties with expiring EPCs
// ─────────────────────────────────────────────────────────────

const EPC_API_BASE = 'https://epc.opendatacommunities.org/api/v1/domestic'
const EPC_API_AUTH = process.env.EPC_API_AUTH || '' // Basic auth string

async function lookupEpcByPostcode(postcode: string): Promise<{
  rating: string | null
  expiry: string | null
  lmkKey: string | null
}> {
  try {
    const cleanPostcode = postcode.replace(/\s+/g, '+')
    const res = await fetch(
      `${EPC_API_BASE}/search?postcode=${cleanPostcode}&size=1`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(EPC_API_AUTH).toString('base64')}`,
          Accept: 'application/json',
        },
      }
    )

    if (!res.ok) return { rating: null, expiry: null, lmkKey: null }

    const data = await res.json()
    const rows = data.rows || []

    if (rows.length === 0) return { rating: null, expiry: null, lmkKey: null }

    const latest = rows[0]
    return {
      rating: latest['current-energy-rating'] || null,
      expiry: latest['lodgement-date']
        ? new Date(
            new Date(latest['lodgement-date']).getTime() +
              10 * 365.25 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0]
        : null,
      lmkKey: latest['lmk-key'] || null,
    }
  } catch {
    return { rating: null, expiry: null, lmkKey: null }
  }
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  const manualTest = req.nextUrl.searchParams.get('test') === 'true'

  if (!manualTest && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Properties that haven't been checked yet OR check failed
  const { data: properties, error } = await supabase
    .from('agent_properties')
    .select('id, postcode, address_line_1, agent_account_id, billing_override, epc_job_status')
    .in('epc_check_status', ['pending', 'check_failed'])
    .limit(200)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let checked = 0
  let epcRequired = 0
  let hasValidEpc = 0

  for (const prop of properties || []) {
    const { rating, expiry, lmkKey } = await lookupEpcByPostcode(prop.postcode)

    const hasValid =
      rating !== null &&
      expiry !== null &&
      new Date(expiry) > new Date()

    await supabase
      .from('agent_properties')
      .update({
        epc_check_status: 'checked',
        epc_check_last_run: new Date().toISOString(),
        existing_epc_rating: rating,
        existing_epc_expiry: expiry,
        existing_epc_lmk_key: lmkKey,
        epc_required: !hasValid,
        updated_at: new Date().toISOString(),
      })
      .eq('id', prop.id)

    if (!hasValid && prop.epc_job_status === 'none') {
      // Trigger outreach pipeline for this property
      await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/crm/vendor-outreach`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-cron-secret': process.env.CRON_SECRET || '',
          },
          body: JSON.stringify({ propertyId: prop.id }),
        }
      )
      epcRequired++
    } else {
      hasValidEpc++
    }

    checked++

    // Throttle API calls
    await new Promise(r => setTimeout(r, 300))
  }

  return NextResponse.json({ ok: true, checked, epcRequired, hasValidEpc })
}
