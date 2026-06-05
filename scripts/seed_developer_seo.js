import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) envVars[key.trim()] = value.trim();
});

const DB_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const DB_KEY = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!DB_URL || !DB_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(DB_URL, DB_KEY);

const LOCATIONS = [
  { town: 'Chesterfield', county: 'Derbyshire', prefix: 'S40' },
  { town: 'Derby', county: 'Derbyshire', prefix: 'DE1' },
  { town: 'Matlock', county: 'Derbyshire', prefix: 'DE4' },
  { town: 'Belper', county: 'Derbyshire', prefix: 'DE56' },
  { town: 'Buxton', county: 'Derbyshire', prefix: 'SK17' },
  { town: 'Ilkeston', county: 'Derbyshire', prefix: 'DE7' },
  { town: 'Ripley', county: 'Derbyshire', prefix: 'DE5' },
  { town: 'Alfreton', county: 'Derbyshire', prefix: 'DE55' },
  { town: 'Ashbourne', county: 'Derbyshire', prefix: 'DE6' },
  { town: 'Glossop', county: 'Derbyshire', prefix: 'SK13' },
  { town: 'Swadlincote', county: 'Derbyshire', prefix: 'DE11' },
  { town: 'Long Eaton', county: 'Derbyshire', prefix: 'NG10' },
  { town: 'Heanor', county: 'Derbyshire', prefix: 'DE75' },
  { town: 'Bakewell', county: 'Derbyshire', prefix: 'DE45' },
  { town: 'Dronfield', county: 'Derbyshire', prefix: 'S18' },
  
  // Nottinghamshire
  { town: 'Nottingham', county: 'Nottinghamshire', prefix: 'NG1' },
  { town: 'Mansfield', county: 'Nottinghamshire', prefix: 'NG18' },
  { town: 'Worksop', county: 'Nottinghamshire', prefix: 'S80' },
  { town: 'Newark', county: 'Nottinghamshire', prefix: 'NG24' },
  { town: 'Retford', county: 'Nottinghamshire', prefix: 'DN22' },
  { town: 'Southwell', county: 'Nottinghamshire', prefix: 'NG25' },
  { town: 'Beeston', county: 'Nottinghamshire', prefix: 'NG9' },
  { town: 'West Bridgford', county: 'Nottinghamshire', prefix: 'NG2' },
  
  // South Yorkshire
  { town: 'Sheffield', county: 'South Yorkshire', prefix: 'S1' },
  { town: 'Rotherham', county: 'South Yorkshire', prefix: 'S60' },
  { town: 'Doncaster', county: 'South Yorkshire', prefix: 'DN1' },
  { town: 'Barnsley', county: 'South Yorkshire', prefix: 'S70' },
  { town: 'Wombwell', county: 'South Yorkshire', prefix: 'S73' },
  { town: 'Penistone', county: 'South Yorkshire', prefix: 'S36' }
];

const SERVICES = [
  {
    type: 'sap-calculations',
    title: 'SAP Calculations in {town}',
    desc: 'Expert SAP calculations for new builds, extensions and conversions in {town}. Ensure Part L compliance with fast, accurate assessments.',
    content: `
      <h2>Part L SAP Calculations in {town}</h2>
      <p>Standard Assessment Procedure (SAP) calculations are mandatory for all new dwellings in {town} under Part L of the Building Regulations. Our accredited assessors provide rapid, highly accurate SAP calculations for house builders, architects, and developers.</p>
      
      <h3>Why do I need a SAP Calculation?</h3>
      <p>Building Control requires a Design Stage SAP (PEA) before construction begins, and an As-Built SAP before sign-off. The calculation proves your building fabric, heating system, and ventilation strategy meet current energy efficiency targets.</p>
      
      <ul>
        <li><strong>Design Stage (PEA):</strong> Must be submitted to Building Control before you start on site.</li>
        <li><strong>As-Built Stage (EPC):</strong> Must be completed within 5 days of construction finishing to issue the final Energy Performance Certificate.</li>
      </ul>
      
      <h3>Avorria's {town} Service</h3>
      <p>We work directly from your architectural plans to provide a frictionless compliance experience. If your initial design fails to meet Part L requirements, we don't just issue a fail — our assessors will provide cost-effective recommendations to achieve a pass.</p>
    `
  },
  {
    type: 'part-l-compliance',
    title: 'Part L Compliance Consultants in {town}',
    desc: 'Navigate Building Regulations Part L in {town} with Avorria. End-to-end compliance consultancy for residential and commercial developments.',
    content: `
      <h2>Building Regulations Part L Compliance in {town}</h2>
      <p>Part L of the Building Regulations governs the conservation of fuel and power. For developers in {town}, meeting these increasingly stringent requirements is one of the most critical aspects of the design phase.</p>
      
      <h3>Our Part L Services</h3>
      <p>We offer a comprehensive suite of Part L compliance services under one roof:</p>
      <ul>
        <li>SAP Calculations (Domestic)</li>
        <li>SBEM Calculations (Commercial)</li>
        <li>U-Value Calculations</li>
        <li>Thermal Bridging Analysis</li>
        <li>Air Tightness Testing</li>
      </ul>
      
      <h3>The 2022 Part L Updates</h3>
      <p>The recent uplift to Part L means a 31% reduction in carbon emissions is now required for new homes compared to previous standards. This often necessitates the use of renewable technologies (like Air Source Heat Pumps), improved fabric insulation, and wastewater heat recovery systems.</p>
      <p>Our consultants in {town} can help you value-engineer your specifications to meet the new regulations without overspending on unnecessary tech.</p>
    `
  },
  {
    type: 'air-tightness-testing',
    title: 'Air Tightness Testing in {town}',
    desc: 'ATTMA accredited Air Tightness Testing in {town}. Essential Part L compliance testing for new build properties and commercial units.',
    content: `
      <h2>Air Tightness Testing in {town}</h2>
      <p>Air Permeability Testing (also known as Air Tightness Testing or blower door testing) is a mandatory requirement for all new build residential and commercial properties in {town} under Part L of the Building Regulations.</p>
      
      <h3>What is Air Tightness Testing?</h3>
      <p>The test measures the uncontrolled flow of air through gaps and cracks in the building fabric. The result is measured in m³/(h·m²) at 50 Pascals of pressure. A lower number indicates a more airtight, energy-efficient building.</p>
      
      <h3>When should testing occur?</h3>
      <p>Testing should be conducted at the end of the construction phase, once all first and second fix services are complete, but ideally before final cosmetic finishes are applied so any leaks can be easily rectified.</p>
      
      <h3>Why choose Avorria in {town}?</h3>
      <ul>
        <li><strong>ATTMA Accredited:</strong> All our engineers are fully qualified and registered.</li>
        <li><strong>Same-Day Certificates:</strong> Provided your property passes, we issue certificates immediately.</li>
        <li><strong>On-Site Troubleshooting:</strong> If a property fails, our engineers carry smoke pens to identify leaks and allow you time to apply temporary seals while we are still on site.</li>
      </ul>
    `
  },
  {
    type: 'water-calculations',
    title: 'Water Efficiency Calculations in {town}',
    desc: 'Part G Water Efficiency Calculations in {town}. Fast 24-hour turnaround for developers and architects.',
    content: `
      <h2>Part G Water Efficiency Calculations in {town}</h2>
      <p>Building Regulations Part G requires that all new dwellings (and some conversions) in {town} are designed to consume no more than 125 litres of potable water per person per day. In some local authorities, planning conditions dictate a stricter limit of 110 litres.</p>
      
      <h3>How the calculation works</h3>
      <p>We assess the flow rates and capacities of all water fittings specified for the property, including:</p>
      <ul>
        <li>WCs (flush volumes)</li>
        <li>Wash basin taps (flow rate)</li>
        <li>Showers (flow rate)</li>
        <li>Baths (capacity to overflow)</li>
        <li>Kitchen taps (flow rate)</li>
        <li>Washing machines and dishwashers (consumption per cycle)</li>
      </ul>
      
      <h3>The Process</h3>
      <p>You provide us with the proposed sanitaryware specification (or we can use standard defaults to achieve a pass), and we will produce the Part G Water Notice required by Building Control within 24 hours.</p>
    `
  },
  {
    type: 'overheating-assessments',
    title: 'Overheating Assessments (Part O) in {town}',
    desc: 'CIBSE TM59 and Part O Overheating Assessments for new builds in {town}. Ensure compliance and occupant comfort.',
    content: `
      <h2>Part O Overheating Assessments in {town}</h2>
      <p>Part O is a relatively new addition to the Building Regulations, introduced to mitigate the risk of overheating in new residential buildings in {town}. With the push towards highly insulated, airtight homes, the risk of summer overheating has significantly increased.</p>
      
      <h3>The Two Methods of Compliance</h3>
      <ul>
        <li><strong>Simplified Method:</strong> A basic calculation assessing maximum glazing areas and minimum free-opening areas for ventilation. Suitable for straightforward, low-risk houses.</li>
        <li><strong>Dynamic Thermal Modelling (CIBSE TM59):</strong> A complex 3D simulation of the building assessing temperature fluctuations hour-by-hour over a year. Required for apartment blocks, urban sites with noise/pollution restrictions, and buildings with large glazing ratios.</li>
      </ul>
      
      <h3>When to assess?</h3>
      <p>Overheating risks must be assessed at the Design Stage. Waiting until construction begins can lead to expensive redesigns (e.g., adding mechanical cooling or solar shading). Contact our {town} team today to discuss your project.</p>
    `
  },
  {
    type: 'bruk-reports',
    title: 'BRUKL Reports & SBEM Calculations in {town}',
    desc: 'Commercial Part L compliance in {town}. Expert BRUKL reports and SBEM calculations for offices, retail and industrial units.',
    content: `
      <h2>BRUKL Reports & SBEM Calculations in {town}</h2>
      <p>If you are constructing a new commercial building, or carrying out a major extension/conversion in {town}, you must prove compliance with Part L2 of the Building Regulations using the Simplified Building Energy Model (SBEM).</p>
      
      <h3>What is a BRUKL Report?</h3>
      <p>BRUKL stands for "Building Regulations UK Part L". The BRUKL output document is the report generated by SBEM software that demonstrates whether the proposed building design meets the Target Emission Rate (TER) and Target Primary Energy Rate (TPER).</p>
      
      <h3>The Two-Stage Process</h3>
      <ul>
        <li><strong>Design Stage BRUKL:</strong> Required by Building Control before construction begins.</li>
        <li><strong>As-Built BRUKL:</strong> Updated with any changes made during construction. This is used to generate the final Commercial EPC.</li>
      </ul>
      
      <p>Our Level 4 and Level 5 accredited commercial energy assessors in {town} provide rapid turnaround times and proactive design advice to ensure a first-time pass.</p>
    `
  },
  {
    type: 'commercial-epc',
    title: 'Commercial EPCs in {town}',
    desc: 'Level 3, 4 and 5 Commercial Energy Performance Certificates in {town}. Fast, reliable service for landlords and agents.',
    content: `
      <h2>Commercial EPCs (Non-Domestic) in {town}</h2>
      <p>A Commercial Energy Performance Certificate (EPC) is legally required whenever a non-domestic property in {town} is built, sold, or rented. It grades the energy efficiency of the building from A to G.</p>
      
      <h3>MEES Regulations Impact</h3>
      <p>Under the Minimum Energy Efficiency Standards (MEES), it is now unlawful to let a commercial property with an EPC rating of F or G. The government has also proposed raising this minimum standard to a C by 2027, and a B by 2030.</p>
      
      <h3>Our Commercial EPC Service</h3>
      <ul>
        <li><strong>All Building Types:</strong> From small retail units (Level 3) to complex office blocks with advanced HVAC systems (Level 4/5).</li>
        <li><strong>Nationwide Coverage:</strong> Our network covers {town} and the wider region.</li>
        <li><strong>Improvement Advice:</strong> We don't just issue the certificate; we provide a costed action plan to improve your rating and protect your asset value.</li>
      </ul>
    `
  },
  {
    type: 'new-build-epc',
    title: 'On Construction EPCs (New Build) in {town}',
    desc: 'Final As-Built EPCs for new developments in {town}. Fast lodgement to ensure smooth handovers.',
    content: `
      <h2>On Construction EPCs in {town}</h2>
      <p>An On Construction EPC (also known as a New Build EPC or As-Built EPC) is the final energy certificate issued upon completion of a newly built dwelling in {town}.</p>
      
      <h3>How is it different from a standard domestic EPC?</h3>
      <p>Unlike standard EPCs which are produced via a physical site survey using RdSAP methodology, an On Construction EPC is produced entirely from architectural drawings, specifications, and the final Air Tightness Test results using the full SAP methodology.</p>
      
      <h3>When do you need it?</h3>
      <p>You cannot sign off the building with Building Control, nor can you sell or legally let the property, without the On Construction EPC being lodged on the central register.</p>
      <p>Our {town} team guarantees fast lodgement (usually within 24 hours of receiving the final As-Built data and Air Test certificate) to ensure your handover process is never delayed.</p>
    `
  }
];

async function seed() {
  console.log(`Starting to seed Developer SEO Pages...`);
  
  let count = 0;

  for (const loc of LOCATIONS) {
    for (const srv of SERVICES) {
      const titleStr = srv.title.replace(/{town}/g, loc.town);
      const descStr = srv.desc.replace(/{town}/g, loc.town);
      const contentStr = srv.content.replace(/{town}/g, loc.town);
      const slug = `${srv.type}-${loc.town.toLowerCase().replace(/ /g, '-')}`;

      const { error } = await supabase
        .from('developer_seo_pages')
        .upsert({
          slug,
          town: loc.town,
          county: loc.county,
          postcode_prefix: loc.prefix,
          service_type: srv.type,
          page_title: titleStr,
          meta_description: descStr,
          page_content: contentStr,
          is_live: true
        }, { onConflict: 'slug' });

      if (error) {
        console.error(`Error inserting ${slug}:`, error.message);
      } else {
        count++;
        if (count % 20 === 0) console.log(`Seeded ${count} pages...`);
      }
    }
  }

  console.log(`✅ Complete! Seeded ${count} pages into developer_seo_pages.`);
}

seed().catch(console.error);
