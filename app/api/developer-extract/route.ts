import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Convert file to base64 for Claude Vision
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')
    const mediaType = file.type === 'application/pdf' ? 'application/pdf' : (file.type.startsWith('image/') ? file.type : 'image/jpeg')

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    
    const systemPrompt = `You are an expert UK architectural technician and building regulations consultant.
Analyze the provided drawing/plan. Extract the following metadata to help auto-fill a compliance wizard.
Respond ONLY with a JSON object in this exact format, with no markdown formatting or other text:
{
  "project_type": "Single Dwelling" | "Multiple Dwellings" | "Apartment Block" | "Extension" | "Conversion" | "Commercial Building" | "Mixed Use Development" | "Unknown",
  "number_of_units": <integer>,
  "floor_area_sqm": <number or null>,
  "number_of_storeys": <integer>,
  "construction_type": "Timber Frame" | "Masonry" | "Steel Frame" | "SIPS" | "ICF" | "Unknown"
}
If a value cannot be confidently determined from the drawing, use null or "Unknown" or a sensible default (like 1 for units).`

    let contentBlock: any = []
    
    if (mediaType === 'application/pdf') {
      contentBlock.push({
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: base64Data
        }
      })
    } else if (mediaType.startsWith('image/')) {
      contentBlock.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data
        }
      })
    } else {
        return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or Image.' }, { status: 400 })
    }
    
    contentBlock.push({ type: 'text', text: 'Extract the required metadata from this plan.' })

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: contentBlock
        }
      ]
    })

    const replyText = (response.content[0] as any).text
    
    let extractedData = {}
    try {
      extractedData = JSON.parse(replyText)
    } catch (e) {
      console.error('Failed to parse Claude JSON response:', replyText)
      extractedData = {
        project_type: 'Unknown',
        number_of_units: 1,
        floor_area_sqm: null,
        number_of_storeys: 1,
        construction_type: 'Unknown'
      }
    }

    return NextResponse.json({ 
      success: true, 
      extractedData 
    })

  } catch (error: any) {
    console.error('Developer Extract Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
