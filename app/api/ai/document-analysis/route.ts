import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')
    const mediaType = file.type

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    const systemPrompt = `You are an expert UK property compliance specialist with deep knowledge of all UK property certificates (EPC, EICR, Gas Safety, Fire Risk Assessments, SAP Calculations, Air Tightness Test Reports, Commercial EPCs, BRUKL Reports, Part L Compliance Reports, and Water Efficiency Calculations).

Analyse the provided document and extract the following information. Respond ONLY with a valid JSON object, no markdown, no extra text:
{
  "certificate_type": "EPC" | "Commercial EPC" | "EICR" | "Gas Safety" | "Fire Risk" | "SAP Calc" | "Air Test" | "Part L" | "BRUKL" | "Water Calc" | "Unknown",
  "property_address": "<full address if found, or null>",
  "issue_date": "<YYYY-MM-DD format, or null>",
  "expiry_date": "<YYYY-MM-DD format, or null>",
  "rating": "<EPC rating letter if applicable, or null>",
  "assessor_name": "<name if visible, or null>",
  "notes": "<a single sentence of any important compliance observations you notice, or null>"
}`

    let contentBlock: any[] = []

    if (mediaType === 'application/pdf') {
      contentBlock.push({
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data: base64Data }
      })
    } else if (mediaType.startsWith('image/')) {
      contentBlock.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: base64Data }
      })
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    contentBlock.push({ type: 'text', text: 'Extract the compliance certificate data from this document.' })

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: contentBlock }]
    })

    const text = (response.content[0] as any).text
    let extracted = {}

    try {
      extracted = JSON.parse(text)
    } catch {
      extracted = { notes: 'AI analysis completed — please review document details manually.' }
    }

    return NextResponse.json({ success: true, extracted })

  } catch (error: any) {
    console.error('Document Analysis Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
