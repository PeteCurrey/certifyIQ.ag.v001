const { Client } = require('pg');
const fs = require('fs');

const DB_URL = 'postgresql://postgres:Vivaro2104!!@db.oramerurfzpwonchnmka.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const sql = fs.readFileSync('supabase/migrations/005_landlord_compliance.sql', 'utf8');
  await client.query(sql);
  try {
    const mig6 = fs.readFileSync('supabase/migrations/006_developer_compliance.sql', 'utf8');
    await client.query(mig6);
    console.log('✅ 006_developer_compliance applied');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    console.log('Migration process completed.');
    await client.end();
  }
}

main().catch(console.error);
