import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function buildPhotoPrompt(context?: object): string {
  return `Analyse this photograph taken during a UK property EPC assessment.
Identify and return the following as JSON:

{
  "tags": [array of relevant tags from this list:
    "Combi Boiler" | "Regular Boiler" | "Back Boiler" | "Heat Pump ASHP" |
    "Heat Pump GSHP" | "Electric Storage Heater" | "Gas Fire" | "Open Fireplace" |
    "Single Glazed" | "Double Glazed" | "Triple Glazed" | "Secondary Glazing" |
    "Roof Space" | "Loft Insulation" | "No Loft Insulation" |
    "Cavity Wall" | "Solid Wall" | "External Wall Insulation" |
    "Solar PV Panels" | "Solar Thermal" | "Wind Turbine" |
    "Smart Meter" | "Gas Meter" | "Electric Meter" |
    "Radiator" | "Underfloor Heating" | "TRV Controls" |
    "Room Thermostat" | "Smart Controls" | "Programmer Timer" |
    "LED Lighting" | "Fluorescent Lighting" | "Halogen Lighting" |
    "Suspended Timber Floor" | "Solid Concrete Floor" |
    "Boiler Flue" | "MVHR Unit" | "Extract Fan" |
    "Service Penetration" | "Air Leakage Risk" |
    "Evidence: Insulation Certificate" | "Evidence: Boiler Manual"
  ],
  "primary_element": "the single most important item in this photo",
  "confidence": "high" | "medium" | "low",
  "boiler_model": "extracted model/serial number if visible, else null",
  "boiler_efficiency_estimate": "estimated band A-G if visible, else null",
  "insulation_thickness_mm": "estimated mm if visible, else null",
  "evidence_quality": "good" | "poor" | "unusable",
  "flags": [
    "any concerns e.g. 'Boiler label not readable', 'Insulation depth uncertain', 'Possible asbestos ceiling tiles'"
  ],
  "assessor_note_suggestion": "a short plain-English note the assessor could add to their survey based on what's visible"
}

${context ? `Survey context so far: ${JSON.stringify(context)}` : ''}

Return ONLY the JSON object. No other text.`
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { imageBase64, mimeType, surveyContext, bookingId } = body

    if (!imageBase64) {
      return NextResponse.json({ error: 'imageBase64 is required' }, { status: 400 })
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const resolvedMimeType = validMimeTypes.includes(mimeType) ? mimeType : 'image/jpeg'

    // Strip data URI prefix if accidentally included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: `You are an AI assistant supporting UK EPC (Energy Performance Certificate) assessors during on-site property surveys. You analyse photographs taken during assessments and extract relevant data points. Return ONLY valid JSON. No preamble, no markdown, no explanation.`,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: resolvedMimeType,
                  data: cleanBase64
                }
              },
              {
                type: 'text',
                text: buildPhotoPrompt(surveyContext)
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`Claude API error ${response.status}:`, errText)
      return NextResponse.json({ tags: [], error: 'Analysis failed', confidence: 'low' }, { status: 200 })
    }

    const data = await response.json()
    const rawText = data.content?.[0]?.text || '{}'
    const cleaned = rawText.replace(/```json\n?|```/g, '').trim()

    let result
    try {
      result = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse Claude response as JSON:', rawText)
      return NextResponse.json({ tags: [], error: 'Analysis failed', confidence: 'low' }, { status: 200 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Photo Analysis Error:', error)
    return NextResponse.json({ tags: [], error: error.message, confidence: 'low' }, { status: 200 })
  }
}
