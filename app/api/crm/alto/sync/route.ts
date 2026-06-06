import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─────────────────────────────────────────────────────────────
// GET /api/crm/alto/sync
// Called by Vercel Cron every 15 minutes
// Also used for manual test trigger
// ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Verify cron secret
  const secret = req.headers.get('x-cron-secret')
  const manualTest = req.nextUrl.searchParams.get('test') === 'true'
  
  if (!manualTest && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const baseUrl = process.env.ALTO_BASE_URL || 'https://webservices.vebra.com/export'

  // Get all agent accounts with Alto integration
  const { data: integrations, error: integError } = await supabase
    .from('crm_integrations')
    .select('*, agent_accounts(id, status)')
    .eq('crm_type', 'alto')
    .eq('is_active', true)

  if (integError) {
    console.error('[Alto Sync] Failed to fetch integrations:', integError)
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }

  const results: { agentId: string; imported: number; errors: string[] }[] = []

  for (const integration of integrations || []) {
    const { agent_account_id, api_key, last_sync_cursor } = integration
    const agentAccountId: string = agent_account_id

    if (!api_key) {
      results.push({ agentId: agentAccountId, imported: 0, errors: ['No API key configured'] })
      continue
    }

    try {
      // Fetch properties from Alto's Vebra export API
      // Using the since= parameter for delta polling
      const sinceParam = last_sync_cursor ? `?since=${encodeURIComponent(last_sync_cursor)}` : ''
      const response = await fetch(`${baseUrl}/v2/property${sinceParam}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(api_key + ':').toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        next: { revalidate: 0 },
      })

      if (!response.ok) {
        const msg = `Alto API error: ${response.status} ${response.statusText}`
        console.error(`[Alto Sync] Agent ${agentAccountId}:`, msg)
        
        await supabase.from('crm_integrations').update({
          crm_sync_error: msg,
          updated_at: new Date().toISOString(),
        }).eq('id', integration.id)

        results.push({ agentId: agentAccountId, imported: 0, errors: [msg] })
        continue
      }

      const data = await response.json()
      const properties = data.properties || data || []
      let imported = 0

      for (const prop of properties) {
        const { error: upsertError } = await supabase
          .from('agent_properties')
          .upsert({
            agent_account_id: agentAccountId,
            crm_property_id: String(prop.id || prop.property_id),
            crm_type: 'alto',
            crm_raw_data: prop,
            source: 'alto',
            address_line_1: prop.address?.line1 || prop.address1 || '',
            address_line_2: prop.address?.line2 || prop.address2 || '',
            town: prop.address?.town || prop.town || '',
            postcode: prop.address?.postcode || prop.postcode || '',
            property_type: prop.property_type || prop.type || 'unknown',
            bedrooms: prop.bedrooms || null,
            tenure: prop.channel === 'lettings' ? 'let' : 'sale',
            vendor_name: prop.vendor?.name || prop.contact_name || '',
            vendor_email: prop.vendor?.email || prop.contact_email || '',
            vendor_phone: prop.vendor?.phone || prop.contact_phone || '',
            instructed_at: prop.listed_at || prop.created_at || new Date().toISOString(),
            epc_check_status: 'pending',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'agent_account_id,crm_type,crm_property_id',
            ignoreDuplicates: false,
          })

        if (upsertError) {
          console.error(`[Alto Sync] Upsert error for property ${prop.id}:`, upsertError)
        } else {
          imported++
        }
      }

      // Update cursor to now for next delta poll
      const newCursor = new Date().toISOString()
      await supabase.from('crm_integrations').update({
        last_sync_cursor: newCursor,
        crm_sync_error: null,
        updated_at: new Date().toISOString(),
      }).eq('id', integration.id)

      await supabase.from('agent_accounts').update({
        crm_last_sync_at: newCursor,
        crm_connected: true,
        crm_sync_error: null,
      }).eq('id', agentAccountId)

      results.push({ agentId: agentAccountId, imported, errors: [] })
    } catch (err: any) {
      console.error(`[Alto Sync] Exception for agent ${agentAccountId}:`, err)
      results.push({ agentId: agentAccountId, imported: 0, errors: [err.message] })
    }
  }

  return NextResponse.json({ ok: true, processed: integrations?.length ?? 0, results })
}
