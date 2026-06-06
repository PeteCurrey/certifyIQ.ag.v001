import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// ─────────────────────────────────────────────────────────────
// POST /api/crm/street/webhook
// Receives property events from Street.co.uk
// ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Validate Street webhook signature
  const signatureHeader = req.headers.get('x-street-signature') || ''
  const supabase = await createClient()

  // Find the matching integration by looking up the webhook secret
  // In practice, Street sends a shared secret we validate against
  const expectedWebhookSecret = process.env.STREET_WEBHOOK_SECRET || ''
  
  if (expectedWebhookSecret) {
    const hmac = crypto.createHmac('sha256', expectedWebhookSecret)
    hmac.update(rawBody)
    const expectedSig = hmac.digest('hex')
    
    if (!crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expectedSig))) {
      console.error('[Street Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const body = JSON.parse(rawBody)
  const { event, data } = body

  console.log(`[Street Webhook] Event: ${event}`)

  // Handle property events
  if (event === 'property.created' || event === 'property.updated') {
    const prop = data?.property || data
    
    // Find matching agent_account by Street branch/agency ID
    const { data: integration } = await supabase
      .from('crm_integrations')
      .select('agent_account_id')
      .eq('crm_type', 'street')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (integration) {
      await supabase.from('agent_properties').upsert({
        agent_account_id: integration.agent_account_id,
        crm_property_id: String(prop.id || prop.property_id),
        crm_type: 'street',
        crm_raw_data: prop,
        source: 'street',
        address_line_1: prop.address?.line1 || '',
        address_line_2: prop.address?.line2 || '',
        town: prop.address?.town || '',
        postcode: prop.address?.postcode || '',
        property_type: prop.propertyType || 'unknown',
        bedrooms: prop.bedrooms || null,
        tenure: prop.lettings ? 'let' : 'sale',
        vendor_name: prop.vendor?.name || '',
        vendor_email: prop.vendor?.email || '',
        vendor_phone: prop.vendor?.phone || '',
        instructed_at: prop.createdAt || new Date().toISOString(),
        epc_check_status: 'pending',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'agent_account_id,crm_type,crm_property_id',
        ignoreDuplicates: false,
      })
    }
  }

  return NextResponse.json({ received: true })
}

// ─────────────────────────────────────────────────────────────
// GET /api/crm/street/webhook
// Street OAuth callback — exchanges code for tokens
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get('code')
  const state = searchParams.get('state') // agent_account_id encoded in state

  if (!code) {
    return NextResponse.redirect(new URL('/agent/settings?crm=street&error=no_code', req.url))
  }

  const supabase = await createClient()

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://api.street.co.uk/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.STREET_CLIENT_ID || '',
        client_secret: process.env.STREET_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/crm/street/webhook`,
      }),
    })

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.status}`)
    }

    const tokens = await tokenRes.json()
    const agentAccountId = state // State carries the agent ID

    // Store tokens
    await supabase.from('crm_integrations').upsert({
      agent_account_id: agentAccountId,
      crm_type: 'street',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      is_active: true,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'agent_account_id,crm_type',
    })

    await supabase.from('agent_accounts').update({
      crm_type: 'street',
      crm_connected: true,
      crm_connected_at: new Date().toISOString(),
    }).eq('id', agentAccountId)

    return NextResponse.redirect(new URL('/agent/settings?crm=street&connected=true', req.url))
  } catch (err: any) {
    console.error('[Street OAuth]', err)
    return NextResponse.redirect(new URL(`/agent/settings?crm=street&error=${encodeURIComponent(err.message)}`, req.url))
  }
}
