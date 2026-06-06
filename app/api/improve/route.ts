import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client (requires ANTHROPIC_API_KEY in .env.local)
// Fallback to empty string to prevent build errors if not set
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
})

// Define the interface for the request payload
interface ImproveRequest {
  currentRating: string
  targetRating: string
  budgetLimit: number
  selectedFeatures: string[]
}

const SYSTEM_PROMPT = `
You are an expert UK Energy Assessor and Retrofit Coordinator. Your task is to generate a realistic, cost-effective retrofit roadmap to improve a property's EPC rating.
The user will provide their current EPC band, target band, a budget limit in GBP (£), and a list of identified property features (e.g., uninsulated loft, solid walls, single glazing).

You must return a JSON object ONLY. Do not include any conversational text or markdown formatting outside the JSON structure.

The JSON MUST follow this exact schema:
{
  "alreadyCompliant": boolean, // true if currentRating >= targetRating
  "reachedTarget": boolean, // true if finalRating reaches or exceeds targetRating within budget
  "finalRating": "A" | "B" | "C" | "D" | "E" | "F" | "G",
  "currentScore": number, // estimated SAP score (1-100) based on currentRating
  "finalScore": number, // estimated SAP score after improvements
  "summary": {
    "totalCost": number, // sum of upgrade costs
    "totalSavingAnnual": number, // sum of annual savings
    "totalCO2Reduction": number, // tonnes
    "paybackYears": number // totalCost / totalSavingAnnual (rounded to 1 decimal)
  },
  "path": [
    {
      "id": string, // snake_case identifier
      "title": string, // display title
      "description": string, // short description of the measure
      "cost": number, // estimated cost in GBP
      "savingAnnual": number, // estimated annual saving in GBP
      "sapPoints": number, // estimated SAP points added
      "newBand": string, // the estimated band AFTER this specific upgrade is applied
      "newScore": number // the estimated SAP score AFTER this specific upgrade is applied
    }
  ]
}

Guidelines:
- Prioritise cost-effective measures first (e.g., loft insulation, cavity wall insulation, draught proofing, LED lighting).
- If 'uninsulated_loft' is in selectedFeatures, upgrading it should almost always be the first step.
- Only include measures until the targetRating is reached OR the budgetLimit is exhausted.
- If the target cannot be reached within the budget, provide the best possible upgrades within the budget and set reachedTarget to false.
- Ensure the sum of costs does not exceed budgetLimit.
- Ensure realistic SAP score increments (e.g., A: 92-100, B: 81-91, C: 69-80, D: 55-68, E: 39-54, F: 21-38, G: 1-20).
`

export async function POST(req: Request) {
  try {
    const body: ImproveRequest = await req.json()
    const { currentRating, targetRating, budgetLimit, selectedFeatures } = body

    // Calculate if already compliant
    const bands = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    const currIdx = bands.indexOf(currentRating)
    const targetIdx = bands.indexOf(targetRating)

    if (currIdx <= targetIdx && currIdx !== -1) {
      return NextResponse.json({
        alreadyCompliant: true,
      })
    }

    // Check if API key is missing (for local dev resilience)
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key') {
      console.warn('ANTHROPIC_API_KEY missing. Returning fallback mock response.')
      // Fallback mock response so the UI doesn't break if keys aren't set
      return NextResponse.json({
        alreadyCompliant: false,
        reachedTarget: true,
        finalRating: "C",
        currentScore: 58,
        finalScore: 72,
        summary: {
          totalCost: 1450,
          totalSavingAnnual: 350,
          totalCO2Reduction: 0.9,
          paybackYears: 4.1
        },
        path: [
          {
            id: "loft_insulation",
            title: "Increase Loft Insulation (to 270mm)",
            description: "Increases depth of loft insulation from existing thin layers to 270mm standard.",
            cost: 450,
            savingAnnual: 140,
            sapPoints: 6,
            newBand: "D",
            newScore: 64
          },
          {
            id: "cavity_wall_insulation",
            title: "Cavity Wall Insulation",
            description: "Blows insulation material into empty cavity walls. Highly cost-effective.",
            cost: 1000,
            savingAnnual: 210,
            sapPoints: 8,
            newBand: "C",
            newScore: 72
          }
        ]
      })
    }

    const promptMessage = `
Current EPC Band: ${currentRating}
Target EPC Band: ${targetRating}
Budget Limit: £${budgetLimit}
Selected Property Features: ${selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'None specified'}

Generate the JSON roadmap.
`

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: promptMessage,
        }
      ]
    })

    const rawContent = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
    
    // Attempt to parse JSON. Claude might wrap in markdown blocks.
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : '{}'
    
    const parsedData = JSON.parse(jsonStr)

    return NextResponse.json(parsedData)
  } catch (error: any) {
    console.error('Improve API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate improvement plan' },
      { status: 500 }
    )
  }
}
