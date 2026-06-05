import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'

// Define premium fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff' }, // Regular
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZJhjp-Ek-_EeA.woff', fontWeight: 600 }, // SemiBold
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZJhjp-Ek-_EeA.woff', fontWeight: 700 }, // Bold
  ]
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 20
  },
  logoText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#080D18'
  },
  logoSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2
  },
  titleArea: {
    marginBottom: 30
  },
  docTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#080D18',
    marginBottom: 8
  },
  docSub: {
    fontSize: 12,
    color: '#64748B'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  gridItem: {
    width: '48%',
    marginBottom: 12
  },
  label: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2
  },
  value: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: 600
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 4
  },
  serviceStage: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 600,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  serviceReason: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.5
  },
  riskBoxHigh: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    padding: 12,
    marginBottom: 16
  },
  riskBoxMedium: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 12,
    marginBottom: 16
  },
  riskBoxLow: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    padding: 12,
    marginBottom: 16
  },
  riskTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4,
    color: '#0F172A'
  },
  riskText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.4
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footerText: {
    fontSize: 9,
    color: '#94A3B8'
  }
})

const ComplianceReportPDF = ({ report, project }: { report: any, project: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>Avorria</Text>
          <Text style={styles.logoSub}>Property Energy & Compliance</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={styles.label}>Report Reference</Text>
          <Text style={styles.value}>{report.id.split('-')[0].toUpperCase()}</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleArea}>
        <Text style={styles.docTitle}>Project Compliance Plan</Text>
        <Text style={styles.docSub}>{project.project_type} • {project.postcode} {project.town} • Generated {new Date(report.created_at).toLocaleDateString()}</Text>
      </View>

      {/* Project Specs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Specifications</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Construction Type</Text>
            <Text style={styles.value}>{project.construction_type}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Heating Strategy</Text>
            <Text style={styles.value}>{project.heating_strategy}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Scale</Text>
            <Text style={styles.value}>{project.number_of_units} unit(s) • {project.number_of_storeys} storey(s)</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Current Phase</Text>
            <Text style={styles.value}>{project.project_stage}</Text>
          </View>
        </View>
      </View>

      {/* Risk Analysis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compliance Risk Analysis</Text>
        <View style={
          report.risk_score === 'HIGH' ? styles.riskBoxHigh :
          report.risk_score === 'MEDIUM' ? styles.riskBoxMedium :
          styles.riskBoxLow
        }>
          <Text style={styles.riskTitle}>Overall Risk Profile: {report.risk_score}</Text>
          {report.risk_analysis?.factors?.map((f: string, i: number) => (
            <Text key={i} style={styles.riskText}>• {f}</Text>
          ))}
          {report.risk_analysis?.recommendations?.map((r: string, i: number) => (
             <Text key={i} style={[styles.riskText, { marginTop: 4, fontWeight: 600 }]}>Action: {r}</Text>
          ))}
        </View>
      </View>

      {/* Required Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Assessments & Testing</Text>
        {report.required_services?.map((svc: any, idx: number) => (
          <View key={idx} style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <View>
                 <Text style={styles.serviceName}>{svc.name}</Text>
                 <Text style={styles.serviceStage}>{svc.stage} • {svc.priority} Priority</Text>
               </View>
               <View style={{ textAlign: 'right' }}>
                 <Text style={styles.label}>Est. Budget</Text>
                 <Text style={styles.value}>£{svc.cost_min} - £{svc.cost_max}</Text>
               </View>
            </View>
            <Text style={styles.serviceReason}>{svc.reason}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Avorria Ltd • 124 City Road, London, EC1V 2NX</Text>
        <Text style={styles.footerText}>Page 1 of 1</Text>
      </View>
    </Page>
  </Document>
)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(DB_URL, DB_KEY)

  try {
    const { data: report, error } = await supabase
      .from('developer_compliance_reports')
      .select('*, developer_projects(*)')
      .eq('id', id)
      .single()

    if (error || !report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const stream = await renderToStream(<ComplianceReportPDF report={report} project={report.developer_projects} />)

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': \`attachment; filename="Avorria_Compliance_Plan_\${report.developer_projects.postcode.replace(' ', '_')}.pdf"\`
      }
    })
  } catch (error: any) {
    console.error('PDF Generation Error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
