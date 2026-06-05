import { NextResponse } from 'next/server'

interface UpgradeMeasure {
  id: string
  title: string
  cost: number
  savingAnnual: number
  sapPoints: number
  co2ReductionTonnes: number
  description: string
}

const AVAILABLE_UPGRADES: UpgradeMeasure[] = [
  {
    id: 'loft_insulation',
    title: 'Increase Loft Insulation (to 270mm)',
    cost: 450,
    savingAnnual: 140,
    sapPoints: 6,
    co2ReductionTonnes: 0.35,
    description: 'Increases depth of loft insulation from existing thin layers to 270mm standard.'
  },
  {
    id: 'cavity_wall_insulation',
    title: 'Cavity Wall Insulation',
    cost: 1000,
    savingAnnual: 210,
    sapPoints: 8,
    co2ReductionTonnes: 0.55,
    description: 'Blows insulation material into empty cavity walls. Highly cost-effective.'
  },
  {
    id: 'heating_controls',
    title: 'Upgrade Heating Controls (TRVs & Programmer)',
    cost: 450,
    savingAnnual: 75,
    sapPoints: 3,
    co2ReductionTonnes: 0.18,
    description: 'Adds thermostatic valves on radiators and a room thermostat.'
  },
  {
    id: 'smart_thermostat',
    title: 'Install Smart Thermostat (Hive/Nest)',
    cost: 220,
    savingAnnual: 40,
    sapPoints: 1.5,
    co2ReductionTonnes: 0.1,
    description: 'Intelligent digital heating controls with home-away detection.'
  },
  {
    id: 'led_lighting',
    title: '100% Low Energy Lighting (LEDs)',
    cost: 80,
    savingAnnual: 35,
    sapPoints: 1.5,
    co2ReductionTonnes: 0.08,
    description: 'Replaces all incandescent or halogen light bulbs with high-efficiency LEDs.'
  },
  {
    id: 'solar_pv',
    title: 'Solar Photovoltaic (PV) Panels (4kWp)',
    cost: 6500,
    savingAnnual: 320,
    sapPoints: 10,
    co2ReductionTonnes: 0.8,
    description: 'Generates renewable electricity for direct use and export to grid.'
  },
  {
    id: 'heat_pump',
    title: 'Air Source Heat Pump Upgrade',
    cost: 9000, // Assuming government boiler upgrade scheme discount already applied (net cost)
    savingAnnual: 80, // Saving is modest relative to gas but massive CO2 reduction
    sapPoints: 6,
    co2ReductionTonnes: 1.8,
    description: 'Replaces fossil fuel boiler with a highly efficient renewable electric heat pump.'
  },
  {
    id: 'solid_wall_insulation',
    title: 'Solid Wall Insulation (Internal)',
    cost: 7500,
    savingAnnual: 380,
    sapPoints: 14,
    co2ReductionTonnes: 1.1,
    description: 'Insulates solid brick walls internally with insulated plasterboard.'
  },
  {
    id: 'double_glazing',
    title: 'Upgrade Single Glazing to Double Glazing',
    cost: 5000,
    savingAnnual: 110,
    sapPoints: 4,
    co2ReductionTonnes: 0.28,
    description: 'Replaces original single panes with argon-filled low-E double glazing.'
  }
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      currentRating, // e.g. 'D'
      targetRating, // e.g. 'C'
      budgetLimit, // e.g. 5000
      selectedFeatures, // e.g. ['uninsulated_loft', 'single_glazing', 'gas_boiler']
    } = body

    if (!currentRating || !targetRating) {
      return NextResponse.json({ error: 'Missing current or target rating' }, { status: 400 })
    }

    // Map bands to SAP scores
    const ratingBaselines: Record<string, number> = {
      'A': 95, 'B': 85, 'C': 73, 'D': 60, 'E': 45, 'F': 30, 'G': 15
    }

    const targetScores: Record<string, number> = {
      'A': 92, 'B': 81, 'C': 69, 'D': 55, 'E': 39, 'F': 21
    }

    const currentScore = ratingBaselines[currentRating] || 60
    const targetScore = targetScores[targetRating] || 69

    if (currentScore >= targetScore) {
      return NextResponse.json({
        message: 'Your property is estimated to already meet or exceed the target band.',
        alreadyCompliant: true,
        currentScore,
        targetScore,
      })
    }

    // Filter potential upgrades based on selected features/problems
    let candidateUpgrades = [...AVAILABLE_UPGRADES]
    
    // Customize options if user specified features
    if (selectedFeatures && selectedFeatures.length > 0) {
      candidateUpgrades = candidateUpgrades.filter(upgrade => {
        // Map features to upgrades
        if (upgrade.id === 'loft_insulation' && !selectedFeatures.includes('uninsulated_loft')) return false
        if (upgrade.id === 'solid_wall_insulation' && !selectedFeatures.includes('solid_walls')) return false
        if (upgrade.id === 'double_glazing' && !selectedFeatures.includes('single_glazing')) return false
        if (upgrade.id === 'cavity_wall_insulation' && !selectedFeatures.includes('uninsulated_cavity')) return false
        if (upgrade.id === 'heat_pump' && selectedFeatures.includes('heat_pump')) return false // Already has one
        return true
      })
    }

    // Sort upgrades by "Bang for Buck" (SAP points added per pound spent)
    candidateUpgrades.sort((a, b) => (b.sapPoints / b.cost) - (a.sapPoints / a.cost))

    // Build the roadmap
    let accumulatedScore = currentScore
    const selectedPath: any[] = []
    let totalCost = 0
    let totalSaving = 0
    let totalCO2 = 0
    let budgetRemaining = budgetLimit || 999999

    for (const upgrade of candidateUpgrades) {
      if (accumulatedScore >= targetScore) break // Target reached
      if (upgrade.cost <= budgetRemaining) {
        accumulatedScore = Math.min(100, accumulatedScore + upgrade.sapPoints)
        budgetRemaining -= upgrade.cost
        totalCost += upgrade.cost
        totalSaving += upgrade.savingAnnual
        totalCO2 += upgrade.co2ReductionTonnes
        
        // Calculate new band
        let band = 'G'
        if (accumulatedScore >= 92) band = 'A'
        else if (accumulatedScore >= 81) band = 'B'
        else if (accumulatedScore >= 69) band = 'C'
        else if (accumulatedScore >= 55) band = 'D'
        else if (accumulatedScore >= 39) band = 'E'
        else if (accumulatedScore >= 21) band = 'F'

        selectedPath.push({
          ...upgrade,
          newScore: Math.round(accumulatedScore),
          newBand: band,
        })
      }
    }

    const reachedTarget = accumulatedScore >= targetScore
    const paybackYears = totalSaving > 0 ? Number((totalCost / totalSaving).toFixed(1)) : 0

    return NextResponse.json({
      alreadyCompliant: false,
      currentScore,
      currentRating,
      targetScore,
      targetRating,
      finalScore: Math.round(accumulatedScore),
      finalRating: getBandFromScore(accumulatedScore),
      reachedTarget,
      path: selectedPath,
      summary: {
        totalCost,
        totalSavingAnnual: totalSaving,
        totalCO2Reduction: Number(totalCO2.toFixed(2)),
        paybackYears,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

function getBandFromScore(score: number): string {
  if (score >= 92) return 'A'
  if (score >= 81) return 'B'
  if (score >= 69) return 'C'
  if (score >= 55) return 'D'
  if (score >= 39) return 'E'
  if (score >= 21) return 'F'
  return 'G'
}
