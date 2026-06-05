import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      propertyType,
      constructionPeriod,
      wallType,
      wallInsulation,
      roofInsulation,
      glazing,
      heatingFuel,
      heatingControls,
    } = body

    // Validate request parameters
    if (!propertyType || !constructionPeriod || !wallType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Determine SAP score based on RdSAP-like heuristic rules
    // Start with a baseline score based on age and property type
    let sapScore = 50 // Default baseline

    // Age band score adjustments (older properties have lower efficiency baseline)
    const ageScores: Record<string, number> = {
      'Pre-1900': 35,
      '1900-1929': 40,
      '1930-1949': 45,
      '1950-1966': 50,
      '1967-1975': 55,
      '1976-1982': 60,
      '1983-1990': 64,
      '1991-1995': 68,
      '1996-2002': 72,
      '2003-2006': 76,
      '2007-2011': 80,
      '2012+': 85,
    }
    if (ageScores[constructionPeriod]) {
      sapScore = ageScores[constructionPeriod]
    }

    // Property type adjustments (flats retain heat best; detached houses lose heat fastest)
    const typeOffsets: Record<string, number> = {
      'Flat': 8,
      'Terraced': 4,
      'Semi-Detached': 0,
      'Bungalow': -2,
      'Detached': -6,
    }
    if (typeOffsets[propertyType] !== undefined) {
      sapScore += typeOffsets[propertyType]
    }

    // Wall type and insulation adjustments
    if (wallType === 'Solid Brick') {
      if (wallInsulation === 'Internal/External Insulation') sapScore += 12
      else sapScore -= 5 // Solid brick with no insulation loses a lot of heat
    } else if (wallType === 'Cavity Wall') {
      if (wallInsulation === 'Cavity Filled') sapScore += 10
      else if (wallInsulation === 'Internal/External Insulation') sapScore += 15
      else sapScore += 2 // Unfilled cavity is slightly better than solid brick
    } else if (wallType === 'Timber Frame') {
      sapScore += 5 // Generally built with insulation pre-installed
    }

    // Roof insulation adjustments
    const roofOffsets: Record<string, number> = {
      'No loft/Flat roof': -2,
      'Loft with no insulation': -10,
      'Under 100mm': -3,
      '100mm-200mm': 3,
      '250mm+ / Modern': 8,
    }
    if (roofOffsets[roofInsulation] !== undefined) {
      sapScore += roofOffsets[roofInsulation]
    }

    // Glazing adjustments
    const glazingOffsets: Record<string, number> = {
      'Single Glazing': -8,
      'Double Glazing pre-2002': 0,
      'Double Glazing post-2002 / Triple Glazing': 4,
    }
    if (glazingOffsets[glazing] !== undefined) {
      sapScore += glazingOffsets[glazing]
    }

    // Heating system efficiency adjustments
    const heatingOffsets: Record<string, number> = {
      'Mains Gas Boiler': 5,
      'Oil Boiler': 1,
      'Electric Storage Heaters': -8, // Electric heating is very expensive, dragging down the SAP score (which is cost-indexed)
      'Heat Pump': 8,
      'Biomass/Other': 2,
    }
    if (heatingOffsets[heatingFuel] !== undefined) {
      sapScore += heatingOffsets[heatingFuel]
    }

    // Heating control adjustments
    const controlOffsets: Record<string, number> = {
      'No programmer/thermostat': -4,
      'Programmer & TRVs': 0,
      'Smart Thermostat e.g. Nest/Hive': 3,
    }
    if (controlOffsets[heatingControls] !== undefined) {
      sapScore += controlOffsets[heatingControls]
    }

    // Cap SAP score between 1 and 100
    sapScore = Math.max(1, Math.min(100, Math.round(sapScore)))

    // Calculate rating band
    let band = 'G'
    if (sapScore >= 92) band = 'A'
    else if (sapScore >= 81) band = 'B'
    else if (sapScore >= 69) band = 'C'
    else if (sapScore >= 55) band = 'D'
    else if (sapScore >= 39) band = 'E'
    else if (sapScore >= 21) band = 'F'

    // Mock calculations for cost and potential
    const estimatedCostAnnual = Math.round((100 - sapScore) * 35 + 600)
    const potentialScore = Math.min(88, sapScore + 12)
    let potentialBand = 'C'
    if (potentialScore >= 92) potentialBand = 'A'
    else if (potentialScore >= 81) potentialBand = 'B'
    else if (potentialScore >= 69) potentialBand = 'C'
    else if (potentialScore >= 55) potentialBand = 'D'

    // Formulate tailored recommendations
    const recommendations = []
    if (roofInsulation === 'Loft with no insulation' || roofInsulation === 'Under 100mm') {
      recommendations.push({
        title: 'Increase loft insulation to 270mm',
        cost: '£300 - £600',
        saving: '£140/yr',
        impact: 'High',
      })
    }
    if (wallType === 'Solid Brick' && wallInsulation === 'None/Unknown') {
      recommendations.push({
        title: 'Solid wall insulation (Internal or External)',
        cost: '£4,000 - £14,000',
        saving: '£350/yr',
        impact: 'Very High',
      })
    } else if (wallType === 'Cavity Wall' && wallInsulation === 'None/Unknown') {
      recommendations.push({
        title: 'Cavity wall insulation',
        cost: '£500 - £1,500',
        saving: '£210/yr',
        impact: 'High',
      })
    }
    if (glazing === 'Single Glazing') {
      recommendations.push({
        title: 'Replace single glazing with modern double glazing',
        cost: '£3,000 - £7,000',
        saving: '£110/yr',
        impact: 'Medium',
      })
    }
    if (heatingFuel === 'Electric Storage Heaters') {
      recommendations.push({
        title: 'Install modern high heat retention storage heaters or Air Source Heat Pump',
        cost: '£4,000 - £8,000',
        saving: '£450/yr',
        impact: 'Very High',
      })
    } else if (heatingFuel !== 'Heat Pump') {
      recommendations.push({
        title: 'Upgrade heating system to Air Source Heat Pump',
        cost: '£7,000 - £13,000',
        saving: '£80/yr (and massive CO2 reduction)',
        impact: 'Medium-High',
      })
    }
    if (heatingControls === 'No programmer/thermostat') {
      recommendations.push({
        title: 'Install programmer, room thermostat and thermostatic radiator valves (TRVs)',
        cost: '£350 - £600',
        saving: '£75/yr',
        impact: 'Medium',
      })
    }
    recommendations.push({
      title: 'Install solar photovoltaic (PV) panels',
      cost: '£5,000 - £8,000',
      saving: '£320/yr',
      impact: 'High',
    })

    return NextResponse.json({
      sapScore,
      band,
      estimatedCostAnnual,
      potentialScore,
      potentialBand,
      recommendations,
      compliance: band >= 'E' ? 'PASSES current standards (E or better)' : 'FAILS current landlord standards (Minimum E)',
      futureCompliance: band >= 'C' ? 'PASSES proposed 2028 landlord standard (C or better)' : 'FAILS proposed 2028 landlord standard (Minimum C)',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
