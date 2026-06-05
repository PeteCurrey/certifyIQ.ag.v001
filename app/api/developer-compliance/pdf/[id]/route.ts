import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { renderToStream } from '@react-pdf/renderer'
import ComplianceReportPDF from '@/components/pdf/ComplianceReportPDF'
import React from 'react'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(DB_URL, DB_KEY)

  try {
    const { data: report, error } = await supabase
      .from('developer_compliance_reports')
      .select('*, developer_projects(*)')
      .eq('id', resolvedParams.id)
      .single()

    if (error || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const project = report.developer_projects

    // Render the React-PDF document to a Node stream
    const stream = await renderToStream(React.createElement(ComplianceReportPDF, { project, report }))

    // Convert the stream into a web ReadableStream for NextResponse
    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk))
        stream.on('end', () => controller.close())
        stream.on('error', (err) => controller.error(err))
      }
    })

    // Return as a downloadable PDF
    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Avorria_Compliance_Roadmap_${project.postcode.replace(' ', '')}.pdf"`,
      },
    })

  } catch (error: any) {
    console.error('PDF Generation Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
