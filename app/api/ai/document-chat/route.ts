import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    const { analysis_id, message, extraction, analysis } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch existing chat history
    const { data: chatRecord } = await supabase
      .from('analysis_chats')
      .select('messages')
      .eq('analysis_id', analysis_id)
      .single()

    const history = chatRecord?.messages || []

    // Build the context-rich system prompt
    const systemPrompt = `You are Avorria's AI Property Compliance Advisor. You have already analysed the user's document and have full access to the analysis results below.

DOCUMENT ANALYSIS CONTEXT:
Document Type: ${extraction?.document_type || 'Unknown'}
Property: ${extraction?.property_address || 'Not specified'}
Current Rating: ${extraction?.current_rating || 'N/A'}
Potential Rating: ${extraction?.potential_rating || 'N/A'}
Expiry Date: ${extraction?.expiry_date || 'N/A'}
Floor Area: ${extraction?.floor_area_sqm ? extraction.floor_area_sqm + ' m²' : 'N/A'}
Heating: ${extraction?.primary_heating || 'N/A'}
Compliance Status: ${extraction?.compliance_status || 'N/A'}
Test Result: ${extraction?.test_result || 'N/A'}

AI ANALYSIS SUMMARY:
${analysis?.plain_english_summary || ''}

KEY RISKS:
${(analysis?.risks || []).map((r: any) => `- ${r.title}: ${r.description} (${r.severity})`).join('\n')}

IMPROVEMENT OPPORTUNITIES:
${[...(analysis?.quick_wins || []), ...(analysis?.medium_term || []), ...(analysis?.long_term || [])]
  .map((w: any) => `- ${w.title}: ${w.description} (${w.estimated_cost})`)
  .join('\n')}

MEES POSITION: ${analysis?.mees_position || 'N/A'}

INSTRUCTIONS:
- Answer questions specifically about THIS property and THIS document
- Be concrete, cite actual findings from the analysis
- Give actionable advice with realistic cost estimates
- If recommending a service, mention it naturally and suggest they book via Avorria
- Keep responses concise (2-4 paragraphs max)
- Never make up data not in the analysis context above`

    const messages = [
      ...history,
      { role: 'user', content: message }
    ]

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages
    })

    const reply = (response.content[0] as any).text

    // Save updated chat history
    const updatedMessages = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: reply }
    ]

    await supabase
      .from('analysis_chats')
      .update({ messages: updatedMessages, updated_at: new Date().toISOString() })
      .eq('analysis_id', analysis_id)

    return NextResponse.json({ success: true, reply })

  } catch (error: any) {
    console.error('Document Chat Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
