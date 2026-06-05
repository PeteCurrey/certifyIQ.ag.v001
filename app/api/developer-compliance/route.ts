import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(DB_URL, DB_KEY)

  try {
    const data = await request.json()
    const {
      project_type,
      postcode,
      town,
      county,
      country,
      number_of_units,
      floor_area_sqm,
      number_of_storeys,
      construction_type,
      heating_strategy,
      ventilation_strategy,
      project_stage,
      customer_id
    } = data

    // 1. Create Project Record
    const { data: project, error: projectErr } = await supabase
      .from('developer_projects')
      .insert({
        customer_id: customer_id || null,
        project_type,
        postcode,
        town,
        county,
        country: country || 'UK',
        number_of_units: parseInt(number_of_units) || 1,
        floor_area_sqm: parseFloat(floor_area_sqm) || null,
        number_of_storeys: parseInt(number_of_storeys) || 1,
        construction_type,
        heating_strategy,
        ventilation_strategy,
        project_stage
      })
      .select('id')
      .single()

    if (projectErr) throw projectErr

    // 2. Compliance Engine Logic

    const requiredServices: any[] = []
    let riskScore = 'LOW'
    const riskAnalysis: any = { factors: [], delays: [], regulatory: [], recommendations: [] }
    let costMin = 0
    let costMax = 0

    // Timeline Deliverables structure
    const timeline = {
      planning: { active: false, deliverables: [] as string[] },
      design: { active: false, deliverables: [] as string[] },
      pre_construction: { active: false, deliverables: [] as string[] },
      construction: { active: false, deliverables: [] as string[] },
      completion: { active: false, deliverables: [] as string[] }
    }

    const isCommercial = ['Commercial Building', 'Industrial Unit', 'Retail Unit', 'Office Building', 'Mixed Use Development'].includes(project_type)
    const units = parseInt(number_of_units) || 1
    const stage = project_stage || 'Planning Stage'

    // Service Rules
    if (!isCommercial) {
      // Domestic Rules
      requiredServices.push({
        name: 'SAP Calculations',
        reason: 'Required by Building Regulations Part L for all new dwellings.',
        stage: 'Design Stage',
        priority: 'Critical',
        cost_min: 75 * units,
        cost_max: 150 * units
      })
      timeline.design.deliverables.push('Design Stage SAP Calculations (PEA)')
      timeline.design.active = true

      requiredServices.push({
        name: 'Part L Compliance Report',
        reason: 'Demonstrates energy efficiency compliance to Building Control.',
        stage: 'Design Stage',
        priority: 'Required',
        cost_min: 50,
        cost_max: 100
      })

      requiredServices.push({
        name: 'Water Efficiency Calculations',
        reason: 'Part G requirement to prove water usage is below 125L/person/day.',
        stage: 'Design Stage',
        priority: 'Required',
        cost_min: 50 * units,
        cost_max: 95 * units
      })

      requiredServices.push({
        name: 'Air Tightness Testing',
        reason: 'Mandatory testing for new builds under Part L.',
        stage: 'Completion Stage',
        priority: 'Critical',
        cost_min: 150 + (units * 50),
        cost_max: 300 + (units * 75)
      })
      timeline.completion.deliverables.push('Air Tightness Test Certificate')
      timeline.completion.active = true

      requiredServices.push({
        name: 'On Construction EPC',
        reason: 'Required for building sign-off and sale/letting.',
        stage: 'Completion Stage',
        priority: 'Critical',
        cost_min: 45 * units,
        cost_max: 75 * units
      })
      timeline.completion.deliverables.push('On Construction EPC Lodged')

      if (['Heat Pump', 'Unknown'].includes(heating_strategy)) {
         requiredServices.push({
          name: 'Overheating Assessment (Part O)',
          reason: 'Part O requires assessment of overheating risk, highly recommended when heat pumps are used or large glazing areas exist.',
          stage: 'Design Stage',
          priority: 'Recommended',
          cost_min: 250,
          cost_max: 600
        })
        timeline.design.deliverables.push('Part O Overheating Assessment')
        riskAnalysis.factors.push('Heat Pump strategy specified - Overheating compliance must be carefully managed.')
      }
    } else {
      // Commercial Rules
      requiredServices.push({
        name: 'SBEM Calculations / BRUKL',
        reason: 'Part L requirement for non-domestic buildings.',
        stage: 'Design Stage',
        priority: 'Critical',
        cost_min: 450,
        cost_max: 1500
      })
      timeline.design.deliverables.push('Design Stage BRUKL Report')
      timeline.design.active = true

      requiredServices.push({
        name: 'Commercial EPC',
        reason: 'Required prior to sale, let, or occupation.',
        stage: 'Completion Stage',
        priority: 'Critical',
        cost_min: 250,
        cost_max: 800
      })
      timeline.completion.deliverables.push('Commercial EPC Lodged')
      timeline.completion.active = true
    }

    // Specific Risk Factors based on inputs
    if (['Construction Stage', 'Completion Stage'].includes(stage)) {
       riskScore = 'HIGH'
       riskAnalysis.factors.push('Project is already in Construction/Completion but compliance planning is being done now.')
       riskAnalysis.delays.push('High risk of delays to Building Control sign-off if Design Stage calculations were not completed.')
       riskAnalysis.regulatory.push('Potential non-compliance with Part L if building fabric does not meet required specifications.')
       riskAnalysis.recommendations.push('URGENT: Commission As-Built SAP/SBEM calculations immediately.')
    } else if (units >= 10 || isCommercial) {
       riskScore = 'MEDIUM'
       riskAnalysis.factors.push('Large scale / commercial project introduces complexity.')
    }

    if (ventilation_strategy === 'MVHR') {
      riskAnalysis.factors.push('MVHR specified: Strict air tightness targets must be met for the system to operate efficiently.')
    }

    if (['Timber Frame', 'SIPS', 'ICF'].includes(construction_type)) {
       riskAnalysis.factors.push(`Construction method (${construction_type}) typically achieves good air tightness, but requires careful attention to detailing.`)
    }

    // Tally costs
    requiredServices.forEach(s => {
      costMin += s.cost_min
      costMax += s.cost_max
    })

    // 3. Create Report Record
    const { data: report, error: reportErr } = await supabase
      .from('developer_compliance_reports')
      .insert({
        project_id: project.id,
        risk_score: riskScore,
        required_services: requiredServices,
        compliance_timeline: timeline,
        risk_analysis: riskAnalysis,
        estimated_cost_total_min: costMin,
        estimated_cost_total_max: costMax
      })
      .select('id')
      .single()

    if (reportErr) throw reportErr

    return NextResponse.json({ success: true, report_id: report.id, project_id: project.id })

  } catch (error: any) {
    console.error('Compliance Engine Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
