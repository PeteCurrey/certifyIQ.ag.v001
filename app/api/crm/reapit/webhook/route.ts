import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// ─────────────────────────────────────────────────────────────
// POST /api/crm/reapit/webhook
// Receives property events from Reapit Foundations
// ─────────────────────────────────────────────────────────────

async function getReapitAccessToken(clientId: string, clientSecret: string): Promise<string | null> {
  try {
    const res = await fetch('https://connect.reapit.cloud/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.access_token || null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Validate Reapit signature (HMAC-SHA256)
  const signatureHeader = req.headers.get('x-reapit-signature') || ''
  const reapitCustomer = req.headers.get('reapit-customer') || ''

  const supabase = await createClient()

  // Find integration by customer ID
  const { data: integration } = await supabase
    .from('crm_integrations')
    .select('*, agent_accounts(id)')
    .eq('crm_type', 'reapit')
    .eq('customer_id', reapitCustomer)
    .eq('is_active', true)
    .single()

  if (!integration) {
    console.warn(`[Reapit Webhook] Unknown customer: ${reapitCustomer}`)
    return NextResponse.json({ received: true }) // Return 200 to prevent retries
  }

  // Validate signature
  if (integration.webhook_secret && signatureHeader) {
    const hmac = crypto.createHmac('sha256', integration.webhook_secret)
    hmac.update(rawBody)
    const expected = hmac.digest('hex')

    if (!crypto.timingSafeEqual(
      Buffer.from(signatureHeader.replace('sha256=', ''), 'hex'),
      Buffer.from(expected, 'hex')
    )) {
      console.error('[Reapit Webhook] Signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const events = Array.isArray(JSON.parse(rawBody)) ? JSON.parse(rawBody) : [JSON.parse(rawBody)]

  for (const event of events) {
    const { eventType, entityId, entityType } = event

    if (entityType !== 'property') continue

    if (eventType === 'Created' || eventType === 'Modified') {
      // Fetch full property details from Reapit
      let accessToken = integration.access_token
      if (!accessToken && integration.client_id && integration.client_secret) {
        accessToken = await getReapitAccessToken(integration.client_id, integration.api_secret || '')
      }

      if (accessToken) {
        const propRes = await fetch(`https://platform.reapit.cloud/properties/${entityId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'reapit-customer': reapitCustomer,
            'api-version': '2020-01-31',
          },
        })

        if (propRes.ok) {
          const prop = await propRes.json()

          await supabase.from('agent_properties').upsert({
            agent_account_id: integration.agent_account_id,
            crm_property_id: entityId,
            crm_type: 'reapit',
            crm_raw_data: prop,
            source: 'reapit',
            address_line_1: prop.address?.line1 || '',
            address_line_2: prop.address?.line2 || '',
            town: prop.address?.town || prop.address?.county || '',
            postcode: prop.address?.postcode || '',
            property_type: prop.type || 'unknown',
            bedrooms: prop.bedrooms || null,
            tenure: prop.lettingInfo ? 'let' : 'sale',
            vendor_name: prop.vendorInfo?.name || '',
            vendor_email: prop.vendorInfo?.email || '',
            vendor_phone: prop.vendorInfo?.mobilePhone || prop.vendorInfo?.workPhone || '',
            instructed_at: prop.created || new Date().toISOString(),
            epc_check_status: 'pending',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'agent_account_id,crm_type,crm_property_id',
            ignoreDuplicates: false,
          })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
