import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// We would normally load custom fonts here to match the brand (e.g. Inter/Syne)
// For robustness without needing external static font files, we'll use Helvetica which is built-in.
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FAFAFA',
    color: '#18181B'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#0F766E', // Brand Teal
    paddingBottom: 20,
    marginBottom: 30
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#18181B'
  },
  logoAccent: {
    color: '#0F766E'
  },
  headerInfo: {
    alignItems: 'flex-end',
    fontSize: 10,
    color: '#52525B'
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#18181B'
  },
  subtitle: {
    fontSize: 12,
    color: '#52525B',
    marginBottom: 20,
    lineHeight: 1.5
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  tag: {
    backgroundColor: '#E4E4E7',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 10,
    color: '#52525B',
    textTransform: 'uppercase'
  },
  tagHighlight: {
    backgroundColor: '#CCFBF1',
    color: '#0F766E',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 10,
    textTransform: 'uppercase'
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E7'
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
    paddingBottom: 8
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5'
  },
  serviceMain: {
    flex: 1,
    paddingRight: 20
  },
  serviceName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4
  },
  serviceReason: {
    fontSize: 10,
    color: '#52525B',
    lineHeight: 1.4
  },
  serviceMeta: {
    width: 100,
    alignItems: 'flex-end'
  },
  serviceCost: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4
  },
  serviceStage: {
    fontSize: 10,
    color: '#A1A1AA'
  },
  riskSection: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 20,
    borderRadius: 8,
    marginBottom: 30
  },
  riskTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#DC2626',
    marginBottom: 10
  },
  riskItem: {
    fontSize: 10,
    color: '#991B1B',
    marginBottom: 4,
    flexDirection: 'row'
  },
  totalCostBox: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#5EEAD4',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center'
  },
  totalCostLabel: {
    fontSize: 12,
    color: '#0F766E',
    marginBottom: 8
  },
  totalCostValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#0F766E'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    paddingTop: 10
  },
  footerText: {
    fontSize: 8,
    color: '#A1A1AA'
  }
})

interface ComplianceReportPDFProps {
  project: any
  report: any
}

export default function ComplianceReportPDF({ project, report }: ComplianceReportPDFProps) {
  const services = report.required_services || []
  const risk = report.risk_analysis || {}

  const hasHighRisk = report.risk_score === 'HIGH'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Avorria<Text style={styles.logoAccent}>.</Text></Text>
          <View style={styles.headerInfo}>
            <Text>Developer Compliance Planner</Text>
            <Text>Ref: {project.id.split('-')[0].toUpperCase()}</Text>
            <Text>Generated: {new Date(report.created_at).toLocaleDateString('en-GB')}</Text>
          </View>
        </View>

        {/* Title Area */}
        <Text style={styles.title}>Compliance Roadmap</Text>
        <Text style={styles.subtitle}>
          {project.town}, {project.county} ({project.postcode}){'\n'}
          {project.number_of_units} Unit(s) • {project.construction_type}
        </Text>

        <View style={styles.tags}>
          <Text style={styles.tag}>{project.project_type}</Text>
          <Text style={styles.tagHighlight}>Stage: {project.project_stage}</Text>
          <Text style={styles.tagHighlight}>Risk: {report.risk_score}</Text>
        </View>

        {/* Required Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Services</Text>
          {services.map((service: any, idx: number) => (
            <View key={idx} style={styles.serviceRow} wrap={false}>
              <View style={styles.serviceMain}>
                <Text style={styles.serviceName}>{service.name} [{service.priority}]</Text>
                <Text style={styles.serviceReason}>{service.reason}</Text>
              </View>
              <View style={styles.serviceMeta}>
                <Text style={styles.serviceCost}>£{service.cost_min} - £{service.cost_max}</Text>
                <Text style={styles.serviceStage}>{service.stage}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Risk Analysis */}
        {(risk.factors?.length > 0 || risk.delays?.length > 0) && (
          <View style={styles.riskSection} wrap={false}>
            <Text style={styles.riskTitle}>Risk Analysis & Alerts</Text>
            {risk.factors?.map((f: string, i: number) => (
              <Text key={`f-${i}`} style={styles.riskItem}>• {f}</Text>
            ))}
            {risk.delays?.map((f: string, i: number) => (
              <Text key={`d-${i}`} style={styles.riskItem}>• {f}</Text>
            ))}
            {risk.recommendations?.map((f: string, i: number) => (
              <Text key={`r-${i}`} style={{...styles.riskItem, color: '#0F766E', marginTop: 8}}>→ {f}</Text>
            ))}
          </View>
        )}

        {/* Total Cost */}
        <View style={styles.totalCostBox} wrap={false}>
          <Text style={styles.totalCostLabel}>Estimated Total Compliance Cost</Text>
          <Text style={styles.totalCostValue}>£{report.estimated_cost_total_min} - £{report.estimated_cost_total_max}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Avorria Property Energy & Compliance</Text>
          <Text style={styles.footerText}>certifyiq.co.uk</Text>
        </View>
      </Page>
    </Document>
  )
}
