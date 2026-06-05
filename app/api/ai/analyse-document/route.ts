import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// ─── Health Score Calculator ──────────────────────────────────────────────────
function calculateHealthScore(extraction: any): { score: number; rating: string } {
  let score = 100
  const docType = (extraction.document_type || '').toLowerCase()

  if (docType.includes('epc') || docType.includes('commercial epc')) {
    const rating = (extraction.current_rating || '').toUpperCase()
    if (rating === 'G') score -= 40
    else if (rating === 'F') score -= 30
    else if (rating === 'E') score -= 20
    else if (rating === 'D') score -= 10
    else if (rating === 'A' || rating === 'B') score += 5

    const expiry = extraction.expiry_date ? new Date(extraction.expiry_date) : null
    if (expiry) {
      const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000)
      if (daysLeft < 0) score -= 25
      else if (daysLeft < 90) score -= 10
    }
  }

  if (docType.includes('gas safety')) {
    const expiry = extraction.expiry_date ? new Date(extraction.expiry_date) : null
    if (!expiry) score -= 20
    else {
      const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000)
      if (daysLeft < 0) score -= 30
      else if (daysLeft < 30) score -= 15
    }
  }

  if (docType.includes('eicr') || docType.includes('electrical')) {
    const outcome = (extraction.outcome || '').toLowerCase()
    if (outcome.includes('unsatisfactory') || outcome.includes('fail')) score -= 35
    else if (outcome.includes('improvement')) score -= 10
  }

  if (docType.includes('air tightness') || docType.includes('air test')) {
    const result = parseFloat(extraction.test_result || '0')
    if (result > 10) score -= 25
    else if (result > 5) score -= 10
  }

  score = Math.max(0, Math.min(100, score))

  let rating = 'Excellent'
  if (score < 40) rating = 'Critical'
  else if (score < 55) rating = 'At Risk'
  else if (score < 70) rating = 'Moderate'
  else if (score < 85) rating = 'Good'

  return { score, rating }
}

// ─── Service Recommendation Engine ────────────────────────────────────────────
function recommendServices(extraction: any, mode: string): string[] {
  const services: string[] = []
  const docType = (extraction.document_type || '').toLowerCase()
  const rating = (extraction.current_rating || '').toUpperCase()

  if (docType.includes('epc')) {
    if (['E', 'F', 'G'].includes(rating)) services.push('EPC Improvement Consultancy')
    const expiry = extraction.expiry_date ? new Date(extraction.expiry_date) : null
    if (!expiry || expiry < new Date()) services.push('New Domestic EPC')
  }

  if (docType.includes('commercial epc')) {
    services.push('Commercial EPC')
    services.push('MEES Compliance Review')
  }

  if (docType.includes('sap') || docType.includes('brukl') || docType.includes('part l')) {
    services.push('SAP Calculations')
    services.push('Air Tightness Testing')
    services.push('On Construction EPC')
  }

  if (docType.includes('gas safety')) services.push('Gas Safety Certificate')
  if (docType.includes('eicr')) services.push('EICR')
  if (docType.includes('fire risk')) services.push('Fire Risk Assessment')
  if (docType.includes('air tightness')) services.push('Air Tightness Testing')

  if (mode === 'landlord') services.push('MEES Compliance Review')
  if (mode === 'developer') services.push('SAP Calculations', 'Part L Compliance Report')

  return [...new Set(services)]
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const mode = (formData.get('mode') as string) || 'auto'
    const sessionId = (formData.get('session_id') as string) || ''

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const isPdf = file.type === 'application/pdf'

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // ── Step 1: Structured Extraction ─────────────────────────────────────────
    const extractionPrompt = `You are an expert UK property compliance specialist. Analyse this document and extract ALL data.
Return ONLY a valid JSON object with no markdown:
{
  "document_type": "EPC" | "Commercial EPC" | "SAP Calculation" | "BRUKL Report" | "Part L Report" | "Air Tightness Report" | "Water Calculation" | "Overheating Assessment" | "Gas Safety Certificate" | "EICR" | "Fire Risk Assessment" | "Other",
  "property_address": "<full address or null>",
  "property_type": "<house type or null>",
  "floor_area_sqm": <number or null>,
  "current_rating": "<A/B/C/D/E/F/G or null>",
  "potential_rating": "<A/B/C/D/E/F/G or null>",
  "issue_date": "<YYYY-MM-DD or null>",
  "expiry_date": "<YYYY-MM-DD or null>",
  "assessor_name": "<name or null>",
  "energy_efficiency_score": <number or null>,
  "potential_efficiency_score": <number or null>,
  "primary_heating": "<heating type or null>",
  "hot_water": "<type or null>",
  "glazing": "<single/double/triple or null>",
  "wall_insulation": "<type or null>",
  "roof_insulation": "<type or null>",
  "recommendations": [
    {
      "description": "<recommendation>",
      "estimated_cost_min": <number or null>,
      "estimated_cost_max": <number or null>,
      "potential_saving_per_year": <number or null>,
      "likely_new_rating": "<rating or null>",
      "payback_years": <number or null>
    }
  ],
  "outcome": "<Pass/Fail/Satisfactory/Unsatisfactory for EICR, or null>",
  "test_result": "<numeric result for air tests, or null>",
  "target_result": "<target value for air tests, or null>",
  "compliance_status": "<Compliant/Non-Compliant/At Risk or null>",
  "key_findings": ["<finding 1>", "<finding 2>"],
  "certificate_number": "<ref or null>"
}`

    let extractionContent: any[] = isPdf
      ? [{ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }]
      : [{ type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } }]
    extractionContent.push({ type: 'text', text: 'Extract all compliance data from this document.' })

    const extractionRes = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: extractionPrompt,
      messages: [{ role: 'user', content: extractionContent }]
    })

    let extraction: any = {}
    try {
      extraction = JSON.parse((extractionRes.content[0] as any).text)
    } catch {
      extraction = { document_type: 'Other', key_findings: [] }
    }

    // ── Step 2: Plain-English Analysis + Improvement Roadmap ──────────────────
    const analysisRes = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      system: `You are Avorria's AI compliance advisor, helping UK property owners and landlords understand their documents.
Write in warm, professional, plain English. No jargon. Be specific, practical and honest.
The user is a ${mode === 'landlord' ? 'landlord' : mode === 'developer' ? 'property developer' : mode === 'commercial' ? 'commercial property owner' : 'property owner'}.
Return ONLY a JSON object:
{
  "headline": "<one compelling sentence summarising the main finding>",
  "plain_english_summary": "<3-4 sentences explaining what this document means in plain English>",
  "compliance_position": "<1-2 sentences on their current legal/compliance position>",
  "quick_wins": [
    {
      "title": "<short action title>",
      "description": "<what to do and why>",
      "estimated_cost": "<e.g. £150-£300>",
      "impact": "<e.g. Could improve EPC from D to C>",
      "difficulty": "Easy" | "Moderate" | "Complex",
      "payback": "<e.g. 3-4 years>"
    }
  ],
  "medium_term": [same structure],
  "long_term": [same structure],
  "risks": [
    {
      "title": "<risk name>",
      "description": "<clear explanation of the risk>",
      "severity": "Low" | "Medium" | "High" | "Critical",
      "regulatory_ref": "<e.g. MEES Regulations 2018 or null>"
    }
  ],
  "opportunities": [
    {
      "title": "<opportunity title>",
      "description": "<what the opportunity is>",
      "potential_value": "<e.g. Could increase rental value by £50-100/month>"
    }
  ],
  "mees_position": "<specific MEES analysis if EPC, or null>",
  "next_action": "<the single most important thing this person should do today>"
}`,
      messages: [{
        role: 'user',
        content: `Document Type: ${extraction.document_type}
Address: ${extraction.property_address || 'Not found'}
Current Rating: ${extraction.current_rating || 'N/A'}
Potential Rating: ${extraction.potential_rating || 'N/A'}
Expiry: ${extraction.expiry_date || 'N/A'}
Key Findings: ${JSON.stringify(extraction.key_findings)}
Recommendations: ${JSON.stringify(extraction.recommendations)}
Outcome: ${extraction.outcome || 'N/A'}
Test Result: ${extraction.test_result || 'N/A'}

Please generate the full analysis.`
      }]
    })

    let analysis: any = {}
    try {
      analysis = JSON.parse((analysisRes.content[0] as any).text)
    } catch {
      analysis = {
        headline: 'Document analysed successfully',
        plain_english_summary: 'Your document has been processed. Please review the extracted details below.',
        quick_wins: [], medium_term: [], long_term: [], risks: [], opportunities: []
      }
    }

    const { score, rating } = calculateHealthScore(extraction)
    const services = recommendServices(extraction, mode)

    // ── Step 3: Lead Score ─────────────────────────────────────────────────────
    const leadScore = Math.min(100,
      (score < 55 ? 40 : score < 70 ? 20 : 10) +
      (services.length * 10) +
      (mode === 'landlord' || mode === 'commercial' ? 20 : 10)
    )

    // ── Step 4: Save to Supabase ───────────────────────────────────────────────
    const { data: savedAnalysis, error: saveErr } = await supabase
      .from('document_analyses')
      .insert({
        session_id: sessionId || null,
        document_type: extraction.document_type,
        analysis_mode: mode,
        file_name: file.name,
        property_address: extraction.property_address,
        raw_extraction: extraction,
        analysis_result: analysis,
        health_score: score,
        compliance_rating: rating,
        lead_score: leadScore,
        services_recommended: services
      })
      .select('id')
      .single()

    if (saveErr) {
      console.error('Supabase save error:', saveErr)
      // Still return analysis even if save fails
    }

    // ── Step 5: Create chat record ─────────────────────────────────────────────
    if (savedAnalysis?.id) {
      await supabase.from('analysis_chats').insert({
        analysis_id: savedAnalysis.id,
        messages: []
      })
    }

    return NextResponse.json({
      success: true,
      analysis_id: savedAnalysis?.id || null,
      extraction,
      analysis,
      health_score: score,
      compliance_rating: rating,
      services_recommended: services,
      lead_score: leadScore
    })

  } catch (error: any) {
    console.error('Document Analysis Error:', error)
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
}
