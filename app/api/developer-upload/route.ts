import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(DB_URL, DB_KEY)

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('project_id') as string
    const customerId = formData.get('customer_id') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!projectId) {
       return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Prepare file for upload
    const fileExt = file.name.split('.').pop()
    const fileName = `${projectId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // We need to convert File to ArrayBuffer for Supabase Storage
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 1. Upload to Storage
    const { data: storageData, error: storageErr } = await supabase
      .storage
      .from('developer-drawings')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (storageErr) throw storageErr

    // 2. Simple Rule-Based "AI" Review Logic
    // In a real app with Gemini/OpenAI, we'd send the buffer/text here.
    // For now, we simulate an intelligent review based on file type and project context.
    
    let aiNotes = ''
    const lowerName = file.name.toLowerCase()
    
    if (lowerName.includes('plan') || lowerName.includes('layout')) {
        aiNotes = 'Floor plans detected. An assessor will review these to calculate total floor area and heat loss perimeters for SAP/SBEM calculations.'
    } else if (lowerName.includes('elev') || lowerName.includes('section')) {
        aiNotes = 'Elevations/Sections detected. These are required to calculate glazing ratios and building volume.'
    } else if (lowerName.includes('spec')) {
        aiNotes = 'Specification document detected. We will review U-values, heating system details, and ventilation strategy against Part L targets.'
    } else {
        aiNotes = 'Document uploaded successfully. Our compliance team will review this file alongside your project details.'
    }

    // 3. Save Metadata to DB
    const { error: dbErr } = await supabase
      .from('developer_uploads')
      .insert({
        project_id: projectId,
        customer_id: customerId || null,
        file_name: file.name,
        file_path: storageData.path,
        file_size_bytes: file.size,
        content_type: file.type,
        ai_review_status: 'completed',
        ai_review_notes: aiNotes
      })

    if (dbErr) {
        // Attempt cleanup if DB insert fails
        await supabase.storage.from('developer-drawings').remove([storageData.path])
        throw dbErr
    }

    return NextResponse.json({ success: true, file_path: storageData.path, ai_notes: aiNotes })

  } catch (error: any) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
