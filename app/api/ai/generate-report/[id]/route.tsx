import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZJhjp-Ek-_EeA.woff', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZJhjp-Ek-_EeA.woff', fontWeight: 700 },
  ]
})

const s = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Inter', backgroundColor: '#ffffff', fontSize: 11 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, borderBottomWidth: 2, borderBottomColor: '#080D18', paddingBottom: 20 },
  logo: { fontSize: 22, fontWeight: 700, color: '#080D18' },
  logoSub: { fontSize: 9, color: '#64748B', marginTop: 2 },
  refBox: { textAlign: 'right' },
  refLabel: { fontSize: 9, color: '#94A3B8' },
  refVal: { fontSize: 11, fontWeight: 600, color: '#0F172A' },

  heroCard: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 20, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 20 },
  scoreCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#080D18', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 22, fontWeight: 700, color: '#ffffff', textAlign: 'center' },
  scoreLabel: { fontSize: 8, color: '#94A3B8', textAlign: 'center' },
  heroRight: { flex: 1 },
  heroHeadline: { fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6 },
  heroAddress: { fontSize: 10, color: '#64748B', marginBottom: 4 },
  heroRating: { fontSize: 10, color: '#64748B' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingBottom: 5 },
  bodyText: { fontSize: 10, color: '#334155', lineHeight: 1.6, marginBottom: 8 },
  
  grid2: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  dataCard: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 6, padding: 12 },
  dataLabel: { fontSize: 9, color: '#94A3B8', marginBottom: 3 },
  dataVal: { fontSize: 12, fontWeight: 700, color: '#0F172A' },

  improvementCard: { backgroundColor: '#F0FDF4', borderRadius: 6, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#10B981' },
  impTitle: { fontSize: 10, fontWeight: 700, color: '#065F46', marginBottom: 4 },
  impDetail: { fontSize: 9, color: '#065F46', lineHeight: 1.5 },
  impMeta: { flexDirection: 'row', gap: 16, marginTop: 6 },
  impMetaItem: { fontSize: 9, color: '#047857' },

  riskCardHigh: { backgroundColor: '#FEF2F2', borderRadius: 6, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#EF4444' },
  riskCardMed: { backgroundColor: '#FFFBEB', borderRadius: 6, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#F59E0B' },
  riskCardLow: { backgroundColor: '#F0F9FF', borderRadius: 6, padding: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#3B82F6' },
  riskTitle: { fontSize: 10, fontWeight: 700, color: '#0F172A', marginBottom: 3 },
  riskText: { fontSize: 9, color: '#475569', lineHeight: 1.5 },

  actionBox: { backgroundColor: '#080D18', borderRadius: 8, padding: 16, marginBottom: 20 },
  actionLabel: { fontSize: 9, color: '#9BFF59', marginBottom: 4 },
  actionText: { fontSize: 11, fontWeight: 600, color: '#ffffff', lineHeight: 1.5 },

  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 },
  footerText: { fontSize: 8, color: '#94A3B8' },
})

const RATING_COLORS: Record<string, string> = {
  Critical: '#EF4444', 'At Risk': '#F59E0B', Moderate: '#F59E0B', Good: '#10B981', Excellent: '#059669'
}

function AnalysisReportPDF({ data }: { data: any }) {
  const { extraction, analysis, health_score, compliance_rating } = data
  const ratingColor = RATING_COLORS[compliance_rating] || '#64748B'

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.logo}>Avorria</Text>
            <Text style={s.logoSub}>Property Energy & Compliance Platform</Text>
          </View>
          <View style={s.refBox}>
            <Text style={s.refLabel}>DOCUMENT INTELLIGENCE REPORT</Text>
            <Text style={s.refVal}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
          </View>
        </View>

        {/* Hero Score Card */}
        <View style={s.heroCard}>
          <View style={s.scoreCircle}>
            <Text style={s.scoreNum}>{health_score}</Text>
            <Text style={s.scoreLabel}>Health Score</Text>
          </View>
          <View style={s.heroRight}>
            <Text style={s.heroHeadline}>{analysis?.headline || 'Document Analysis Complete'}</Text>
            {extraction?.property_address && <Text style={s.heroAddress}>📍 {extraction.property_address}</Text>}
            <Text style={s.heroRating}>
              Document Type: {extraction?.document_type || 'N/A'}  •  Compliance Rating: {compliance_rating}
              {extraction?.current_rating ? `  •  EPC Rating: ${extraction.current_rating}` : ''}
              {extraction?.expiry_date ? `  •  Expiry: ${extraction.expiry_date}` : ''}
            </Text>
          </View>
        </View>

        {/* Plain English Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Plain English Summary</Text>
          <Text style={s.bodyText}>{analysis?.plain_english_summary || ''}</Text>
          {analysis?.compliance_position && (
            <Text style={s.bodyText}>{analysis.compliance_position}</Text>
          )}
        </View>

        {/* Data Grid */}
        {(extraction?.current_rating || extraction?.expiry_date || extraction?.floor_area_sqm) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Key Document Data</Text>
            <View style={s.grid2}>
              {extraction?.current_rating && (
                <View style={s.dataCard}>
                  <Text style={s.dataLabel}>Current Rating</Text>
                  <Text style={s.dataVal}>{extraction.current_rating}</Text>
                </View>
              )}
              {extraction?.potential_rating && (
                <View style={s.dataCard}>
                  <Text style={s.dataLabel}>Potential Rating</Text>
                  <Text style={s.dataVal}>{extraction.potential_rating}</Text>
                </View>
              )}
              {extraction?.floor_area_sqm && (
                <View style={s.dataCard}>
                  <Text style={s.dataLabel}>Floor Area</Text>
                  <Text style={s.dataVal}>{extraction.floor_area_sqm} m²</Text>
                </View>
              )}
              {extraction?.expiry_date && (
                <View style={s.dataCard}>
                  <Text style={s.dataLabel}>Expiry Date</Text>
                  <Text style={s.dataVal}>{extraction.expiry_date}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Risks */}
        {analysis?.risks?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Risks Identified</Text>
            {analysis.risks.slice(0, 4).map((risk: any, i: number) => (
              <View key={i} style={risk.severity === 'High' || risk.severity === 'Critical' ? s.riskCardHigh : risk.severity === 'Medium' ? s.riskCardMed : s.riskCardLow}>
                <Text style={s.riskTitle}>{risk.title} — {risk.severity} Risk</Text>
                <Text style={s.riskText}>{risk.description}</Text>
                {risk.regulatory_ref && <Text style={s.riskText}>Regulatory Reference: {risk.regulatory_ref}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Quick Wins */}
        {analysis?.quick_wins?.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Recommended Improvements</Text>
            {[...(analysis.quick_wins || []), ...(analysis.medium_term || [])].slice(0, 4).map((w: any, i: number) => (
              <View key={i} style={s.improvementCard}>
                <Text style={s.impTitle}>{w.title}</Text>
                <Text style={s.impDetail}>{w.description}</Text>
                <View style={s.impMeta}>
                  {w.estimated_cost && <Text style={s.impMetaItem}>Cost: {w.estimated_cost}</Text>}
                  {w.impact && <Text style={s.impMetaItem}>Impact: {w.impact}</Text>}
                  {w.payback && <Text style={s.impMetaItem}>Payback: {w.payback}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Next Action */}
        {analysis?.next_action && (
          <View style={s.actionBox}>
            <Text style={s.actionLabel}>RECOMMENDED NEXT ACTION</Text>
            <Text style={s.actionText}>{analysis.next_action}</Text>
          </View>
        )}

        <View style={s.footer}>
          <Text style={s.footerText}>Avorria Ltd — Property Energy & Compliance</Text>
          <Text style={s.footerText}>This report is generated by AI and should be used for guidance only.</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('document_analyses')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
  }

  const pdfData = {
    extraction: data.raw_extraction,
    analysis: data.analysis_result,
    health_score: data.health_score,
    compliance_rating: data.compliance_rating
  }

  try {
    const stream = await renderToStream(<AnalysisReportPDF data={pdfData} />)
    const addr = (data.raw_extraction?.property_address || 'report').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Avorria_Analysis_${addr}.pdf"`
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'PDF generation failed: ' + err.message }, { status: 500 })
  }
}
