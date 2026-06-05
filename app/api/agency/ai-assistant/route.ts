import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(DB_URL, DB_KEY)
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  try {
    const { messages, agencyId, propertyId } = await request.json()

    // Fetch context: agency properties + compliance alerts
    let context = ''

    if (agencyId) {
      const { data: props } = await supabase
        .from('agency_properties')
        .select('address_line_1, postcode, current_epc_rating, epc_expiry_date, compliance_status')
        .eq('agency_id', agencyId)
        .limit(30)

      if (props && props.length > 0) {
        const expiring = props.filter(p => {
          if (!p.epc_expiry_date) return false
          const days = Math.ceil((new Date(p.epc_expiry_date).getTime() - Date.now()) / 86400000)
          return days < 90
        })

        context = `\n\nAGENCY PORTFOLIO CONTEXT:\nTotal properties: ${props.length}\nProperties with EPC expiring in 90 days: ${expiring.length}\n`
        if (expiring.length > 0) {
          context += `Expiring soon:\n${expiring.map(p => `- ${p.address_line_1}, ${p.postcode} (Band ${p.current_epc_rating}, expires ${p.epc_expiry_date})`).join('\n')}\n`
        }
      }

      if (propertyId) {
        const { data: prop } = await supabase
          .from('agency_properties')
          .select('*')
          .eq('id', propertyId)
          .single()

        if (prop) {
          context += `\nFOCUS PROPERTY: ${prop.address_line_1}, ${prop.postcode}\nType: ${prop.property_type}\nCurrent EPC: Band ${prop.current_epc_rating}\nExpiry: ${prop.epc_expiry_date}\nCompliance: ${prop.compliance_status}\n`
        }
      }
    }

    const systemPrompt = `You are Ava, Avorria's expert AI Compliance Assistant embedded in the Avorria Estate Agent Portal. You are a knowledgeable UK property compliance specialist.

Your role is to help estate agents, letting agents, and property managers with:
- EPC compliance questions (MEES regulations, F/G bands, exemptions)
- When EPCs expire and need renewing (EPCs last 10 years)
- What services are required for different property types
- Part L, SAP calculations, Air Tightness Testing requirements
- MEES minimum standards (currently E, rising to C by 2028 for new lettings)
- Compliance risk assessment and recommendations

Always be professional, concise, and action-oriented. If a property needs urgent action, recommend ordering via Avorria immediately. Always suggest next steps.
${context}`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      system: systemPrompt,
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
    })

    const reply = (response.content[0] as any).text

    return NextResponse.json({ reply })

  } catch (error: any) {
    console.error('AI Assistant Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
