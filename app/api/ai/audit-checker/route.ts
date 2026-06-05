import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
  }

  try {
    const { surveyData, photoTags, photoNotes, bookingRef, serviceType } = await request.json()

    const userContent = `Review this EPC survey submission for quality and consistency.

Survey data: ${JSON.stringify(surveyData || {})}
Photo evidence tags (one array per photo): ${JSON.stringify(photoTags || [])}
Photo assessor notes: ${JSON.stringify(photoNotes || [])}
Photo count: ${(photoTags || []).length}
Service type: ${serviceType || 'domestic'}
Booking ref: ${bookingRef || 'unknown'}

Check for ALL of the following:

1. DATA CONSISTENCY: Do the photo tags contradict the survey data?
   (e.g. photo tagged "Combi Boiler" but survey says "Regular Boiler")
   
2. MISSING EVIDENCE: For each key survey data point, is there photo evidence?
   Required evidence per element:
   - Boiler type and age: photo of boiler (with label if possible)
   - Wall construction: photo of wall (where accessible)
   - Loft insulation: photo of loft space or hatch (if accessible)
   - Windows: at least one window photo
   - Meters: photo of meter(s)
   - Front of property: mandatory for all assessments
   
3. MISSING REQUIRED FIELDS: Which RdSAP 10 fields are null/empty that should be filled?
   
4. DATA QUALITY RISKS: Any values that seem unlikely or would trigger an accreditation body audit?
   
5. PHOTO QUALITY: Are any photos flagged as poor/unusable quality?

Return JSON:
{
  "overall_status": "pass" | "pass_with_warnings" | "fail",
  "can_submit": boolean,
  "summary": "one sentence plain English summary",
  "flags": [
    {
      "severity": "critical" | "warning" | "info",
      "category": "consistency" | "missing_evidence" | "missing_data" | "data_quality" | "photo_quality",
      "field": "field name or element",
      "issue": "plain English description of the problem",
      "suggestion": "what the assessor should do to resolve this"
    }
  ],
  "required_actions_before_submit": [
    "plain English list of things that MUST be fixed (critical flags only)"
  ],
  "estimated_audit_risk": "low" | "medium" | "high",
  "positive_notes": [
    "things the assessor did well — keep this encouraging"
  ]
}

can_submit = true only if there are zero critical flags.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: `You are a senior EPC quality assurance auditor reviewing survey data and photographic evidence before lodgement. Your job is to identify inconsistencies, missing evidence, and data quality issues. You are thorough but fair. Flag real problems only — not theoretical ones. Return ONLY valid JSON.`,
        messages: [{ role: 'user', content: userContent }]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`Claude Audit API error ${response.status}:`, errText)
      return NextResponse.json({
        overall_status: 'fail',
        can_submit: false,
        summary: 'Audit check failed — please try again.',
        flags: [],
        required_actions_before_submit: ['Audit check failed. Please try again.'],
        estimated_audit_risk: 'high',
        positive_notes: []
      })
    }

    const data = await response.json()
    const rawText = data.content?.[0]?.text || '{}'
    const cleaned = rawText.replace(/```json\n?|```/g, '').trim()

    let auditResult
    try {
      auditResult = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse audit result:', rawText)
      return NextResponse.json({
        overall_status: 'fail',
        can_submit: false,
        summary: 'Could not parse audit result.',
        flags: [],
        required_actions_before_submit: ['Please re-run the audit check.'],
        estimated_audit_risk: 'high',
        positive_notes: []
      })
    }

    return NextResponse.json(auditResult)
  } catch (error: any) {
    console.error('Audit Checker Error:', error)
    return NextResponse.json({
      overall_status: 'fail',
      can_submit: false,
      summary: 'Internal error during audit check.',
      flags: [],
      required_actions_before_submit: ['An error occurred. Please try again.'],
      estimated_audit_risk: 'high',
      positive_notes: []
    }, { status: 200 })
  }
}
