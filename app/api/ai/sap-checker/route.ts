import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      propertyType,
      floorArea,
      storeys,
      wallUValue,
      roofUValue,
      floorUValue,
      windowUValue,
      heatingSystem,
      heatingFuel,
      renewables = [],
      airPermeability = 5.0,
    } = body;

    // Convert inputs to numbers
    const area = parseFloat(floorArea) || 80;
    const wallU = parseFloat(wallUValue) || 0.18;
    const roofU = parseFloat(roofUValue) || 0.13;
    const floorU = parseFloat(floorUValue) || 0.15;
    const windowU = parseFloat(windowUValue) || 1.4;
    const airPerm = parseFloat(airPermeability) || 5.0;
    const storeyCount = parseInt(storeys) || 2;

    // Standard Part L 2021/2025 Notional Dwelling U-values (limiting standards)
    // Wall: 0.18, Roof: 0.16, Floor: 0.18, Window: 1.4, Air Perm: 8.0
    let failReasons: string[] = [];
    if (wallU > 0.18) failReasons.push(`Wall U-value (${wallU}) exceeds Part L limiting standard of 0.18 W/m²K`);
    if (roofU > 0.16) failReasons.push(`Roof U-value (${roofU}) exceeds Part L limiting standard of 0.16 W/m²K`);
    if (floorU > 0.18) failReasons.push(`Floor U-value (${floorU}) exceeds Part L limiting standard of 0.18 W/m²K`);
    if (windowU > 1.4) failReasons.push(`Window U-value (${windowU}) exceeds Part L limiting standard of 1.4 W/m²K`);
    if (airPerm > 8.0) failReasons.push(`Air permeability target (${airPerm}) exceeds Part L limit of 8.0 m³/h/m²`);

    // Typical TER (Target Emission Rate) for this size/type
    // Usually around 8.0 - 12.0 kgCO2/m²/yr for modern new builds
    const terBase = propertyType === 'flat' ? 8.5 : 10.2;
    const terTypicalRange = `${(terBase - 1).toFixed(1)} - ${(terBase + 1.5).toFixed(1)}`;

    // Typical TFEE (Target Fabric Energy Efficiency)
    // Around 35.0 - 48.0 kWh/m²/yr
    const tfeeBase = propertyType === 'flat' ? 36.0 : 44.0;
    const tfeeTypicalRange = `${(tfeeBase - 3).toFixed(1)} - ${(tfeeBase + 4).toFixed(1)}`;

    // Calculate DER (Dwelling Emission Rate) based on specifications
    // Start with a base, add penalty for poor U-values, discount for good U-values and renewables
    let der = terBase;
    
    // Fabric performance score offsets
    const wallDiff = wallU - 0.15; // 0.15 is the typical good design target
    const roofDiff = roofU - 0.11;
    const floorDiff = floorU - 0.12;
    const windowDiff = windowU - 1.2;
    const airPermDiff = airPerm - 5.0;

    der += wallDiff * 15;
    der += roofDiff * 12;
    der += floorDiff * 10;
    der += windowDiff * 4;
    der += airPermDiff * 0.5;

    // Heating system impact on emissions
    if (heatingFuel === 'electric' || heatingFuel === 'Electric Storage Heaters') {
      // Direct electric is expensive and higher carbon factor than heat pump
      der += 4.5;
    } else if (heatingFuel === 'oil' || heatingFuel === 'Oil Boiler') {
      der += 3.0;
    } else if (heatingFuel === 'heat_pump' || heatingFuel === 'Heat Pump') {
      // Heat pumps have very low emissions factors in SAP 10.2
      der -= 2.5;
    } else if (heatingFuel === 'gas' || heatingFuel === 'Mains Gas Boiler') {
      der += 0.5;
    }

    // Renewables discount
    if (renewables.includes('solar_pv') || renewables.includes('pv')) {
      der -= 2.0;
    }
    if (renewables.includes('heat_pump')) {
      der -= 1.0;
    }
    if (renewables.includes('solar_thermal')) {
      der -= 0.5;
    }

    // Keep DER within realistic ranges
    der = Math.max(2.1, der);

    // Calculate DFEE (Dwelling Fabric Energy Efficiency)
    let dfee = tfeeBase;
    dfee += wallDiff * 45;
    dfee += roofDiff * 35;
    dfee += floorDiff * 30;
    dfee += windowDiff * 12;
    dfee += airPermDiff * 1.5;
    dfee = Math.max(15, dfee);

    // Compliance check
    let complianceStatus: 'PASS' | 'FAIL' | 'MARGINAL' = 'PASS';
    let complianceNote = '';

    if (failReasons.length > 0) {
      complianceStatus = 'FAIL';
      complianceNote = `Fails mandatory Part L limiting standards: ${failReasons.join('. ')}.`;
    } else if (der > terBase || dfee > tfeeBase) {
      complianceStatus = 'FAIL';
      complianceNote = 'Your Dwelling Emission Rate (DER) or Fabric Energy Efficiency (DFEE) exceeds the target rates.';
    } else if (der > terBase - 0.5 || dfee > tfeeBase - 2) {
      complianceStatus = 'MARGINAL';
      complianceNote = 'Passes basic limits but has very low margins. Small construction variations could trigger a failure.';
    } else {
      complianceStatus = 'PASS';
      complianceNote = 'Excellent! Your specification comfortably meets or exceeds standard Part L Building Regulations.';
    }

    // Suggest recommended changes if marginal or fail
    let recommendedChange = 'None required. Your current design is highly optimized.';
    let recommendedChangeCostEstimate = '£0';

    if (complianceStatus !== 'PASS') {
      if (wallU > 0.18) {
        recommendedChange = 'Improve wall insulation to achieve a U-value of 0.15 W/m²K (e.g. increase cavity insulation width or upgrade thermal boards).';
        recommendedChangeCostEstimate = '£800 - £2,200 (depending on building size)';
      } else if (heatingFuel === 'electric' || heatingFuel === 'gas') {
        recommendedChange = 'Upgrade the primary heating specification to an Air Source Heat Pump (ASHP) to drastically reduce DER emissions.';
        recommendedChangeCostEstimate = '£6,000 - £9,500 (with boiler upgrade grants)';
      } else if (!renewables.includes('solar_pv') && !renewables.includes('pv')) {
        recommendedChange = 'Install a 2.5kWp Solar PV array on the roof to offset electricity consumption and lower the Dwelling Emission Rate.';
        recommendedChangeCostEstimate = '£3,500 - £5,000';
      } else if (windowU > 1.2) {
        recommendedChange = 'Specify higher-performance double glazing or triple glazing with a U-value of 0.8 to 1.2 W/m²K.';
        recommendedChangeCostEstimate = '£1,200 - £3,000';
      } else if (airPerm > 4.0) {
        recommendedChange = 'Tighten the air permeability design target to 3.0 m³/h/m² and employ high-quality sealing tapes around joints.';
        recommendedChangeCostEstimate = '£400 - £900 (sealant materials and specialist labor)';
      } else {
        recommendedChange = 'Add Solar PV panels or specify a waste water heat recovery (WWHR) system.';
        recommendedChangeCostEstimate = '£1,500 - £4,000';
      }
    }

    // Estimate final SAP Score and EPC Band
    let sapScore = 80; // Baseline for new builds
    const derTerMargin = terBase - der;
    sapScore += derTerMargin * 3;

    if (heatingFuel === 'heat_pump' || heatingFuel === 'Heat Pump') sapScore += 4;
    if (renewables.includes('solar_pv') || renewables.includes('pv')) sapScore += 5;

    sapScore = Math.max(1, Math.min(100, Math.round(sapScore)));

    let epcBand = 'B';
    if (sapScore >= 92) epcBand = 'A';
    else if (sapScore >= 81) epcBand = 'B';
    else if (sapScore >= 69) epcBand = 'C';
    else if (sapScore >= 55) epcBand = 'D';
    else if (sapScore >= 39) epcBand = 'E';
    else if (sapScore >= 21) epcBand = 'F';
    else epcBand = 'G';

    return NextResponse.json({
      der_estimate: parseFloat(der.toFixed(2)),
      ter_typical_range: terTypicalRange,
      dfee_estimate: parseFloat(dfee.toFixed(1)),
      tfee_typical_range: tfeeTypicalRange,
      compliance_status: complianceStatus,
      compliance_note: complianceNote,
      recommended_change: recommendedChange,
      recommended_change_cost_estimate: recommendedChangeCostEstimate,
      epc_band: epcBand,
      sap_score_estimate: sapScore,
      confidence: 'indicative_only',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
