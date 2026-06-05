const { Client } = require('pg');

const DB_URL = 'postgresql://postgres:Vivaro2104!!@db.oramerurfzpwonchnmka.supabase.co:5432/postgres';

const LOCATIONS = [
  // Derbyshire
  { name: 'Chesterfield', county: 'Derbyshire', code: 'S40', landmark: 'Crooked Spire' },
  { name: 'Derby', county: 'Derbyshire', code: 'DE1', landmark: 'Pride Park' },
  { name: 'Matlock', county: 'Derbyshire', code: 'DE4', landmark: 'Heights of Abraham' },
  { name: 'Belper', county: 'Derbyshire', code: 'DE56', landmark: 'Strutts North Mill' },
  { name: 'Buxton', county: 'Derbyshire', code: 'SK17', landmark: 'Buxton Crescent' },
  { name: 'Ilkeston', county: 'Derbyshire', code: 'DE7', landmark: 'Erewash Museum' },
  { name: 'Ripley', county: 'Derbyshire', code: 'DE5', landmark: 'Butterley Station' },
  { name: 'Alfreton', county: 'Derbyshire', code: 'DE55', landmark: 'Alfreton Hall' },
  { name: 'Ashbourne', county: 'Derbyshire', code: 'DE6', landmark: 'St Oswalds Church' },
  { name: 'Glossop', county: 'Derbyshire', code: 'SK13', landmark: 'Manor Park' },
  { name: 'Swadlincote', county: 'Derbyshire', code: 'DE11', landmark: 'Gresley Old Hall' },
  { name: 'Long Eaton', county: 'Derbyshire', code: 'NG10', landmark: 'West Park' },
  { name: 'Heanor', county: 'Derbyshire', code: 'DE75', landmark: 'Shipley Country Park' },
  { name: 'Bakewell', county: 'Derbyshire', code: 'DE45', landmark: 'Chatsworth House' },
  { name: 'Dronfield', county: 'Derbyshire', code: 'S18', landmark: 'Dronfield Manor' },
  
  // Nottinghamshire
  { name: 'Nottingham', county: 'Nottinghamshire', code: 'NG1', landmark: 'Nottingham Castle' },
  { name: 'Mansfield', county: 'Nottinghamshire', code: 'NG18', landmark: 'Mansfield Market' },
  { name: 'Worksop', county: 'Nottinghamshire', code: 'S80', landmark: 'Mr Straws House' },
  { name: 'Newark', county: 'Nottinghamshire', code: 'NG24', landmark: 'Newark Castle' },
  { name: 'Retford', county: 'Nottinghamshire', code: 'DN22', landmark: 'Retford Market Square' },
  { name: 'Southwell', county: 'Nottinghamshire', code: 'NG25', landmark: 'Southwell Minster' },
  { name: 'Beeston', county: 'Nottinghamshire', code: 'NG9', landmark: 'Beeston Marina' },
  { name: 'West Bridgford', county: 'Nottinghamshire', code: 'NG2', landmark: 'Trent Bridge' },

  // South Yorkshire
  { name: 'Sheffield', county: 'South Yorkshire', code: 'S1', landmark: 'Winter Garden' },
  { name: 'Rotherham', county: 'South Yorkshire', code: 'S60', landmark: 'Rotherham Minster' },
  { name: 'Doncaster', county: 'South Yorkshire', code: 'DN1', landmark: 'Doncaster Minster' },
  { name: 'Barnsley', county: 'South Yorkshire', code: 'S70', landmark: 'Barnsley Town Hall' },
  { name: 'Wombwell', county: 'South Yorkshire', code: 'S73', landmark: 'Wombwell Woods' },
  { name: 'Penistone', county: 'South Yorkshire', code: 'S36', landmark: 'Penistone Viaduct' }
];

const SERVICES = [
  { id: 'domestic-epc', label: 'Domestic EPC Assessment', type: 'domestic' },
  { id: 'landlord-epc', label: 'Landlord EPC Compliance', type: 'landlord' },
  { id: 'commercial-epc', label: 'Commercial EPC', type: 'commercial' },
  { id: 'estate-agent-epc', label: 'Estate Agent Partner EPC', type: 'agent' },
  { id: 'new-build-epc', label: 'New Build EPC', type: 'new_build' },
  { id: 'sap-calculations', label: 'SAP Calculations', type: 'sap' },
  { id: 'air-tightness', label: 'Air Tightness Testing', type: 'air' }
];

async function main() {
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  console.log('✨ Seed generating dynamic SEO Landing Pages for Derbyshire, Nottinghamshire, and South Yorkshire...');

  for (const loc of LOCATIONS) {
    for (const srv of SERVICES) {
      const slug = `${loc.name.toLowerCase().replace(/ /g, '-')}-${srv.id}`;
      const title = `${srv.label} ${loc.name} | CertifyIQ`;
      const description = `Get a certified ${srv.label} in ${loc.name}, ${loc.county}. Fast 24-hour delivery, accredited RdSAP 10 energy assessors. Book online today.`;
      
      const page_content = `Accredited ${srv.label} services in ${loc.name} (${loc.code}) and surrounding ${loc.county} communities. Our experienced local assessors are fully qualified to perform assessments near local landmarks such as ${loc.landmark}. We provide comprehensive reports matching national standards, including lodging details directly to the official registry within 24 hours of inspection.`;

      await client.query(`
        INSERT INTO location_seo_pages (slug, town, county, postcode_prefix, page_title, page_content, is_live)
        VALUES ($1, $2, $3, $4, $5, $6, true)
        ON CONFLICT (slug) DO UPDATE SET
          town = EXCLUDED.town,
          county = EXCLUDED.county,
          postcode_prefix = EXCLUDED.postcode_prefix,
          page_title = EXCLUDED.page_title,
          page_content = EXCLUDED.page_content,
          is_live = true;
      `, [slug, loc.name, loc.county, loc.code, title, page_content]);
    }
  }

  console.log('✅ Custom location pages successfully generated in database.');
  await client.end();
}

main().catch(console.error);
