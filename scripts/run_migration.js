const { Client } = require('pg');
const fs = require('fs');

const DB_URL = 'postgresql://postgres:Vivaro2104!!@db.oramerurfzpwonchnmka.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const sql = fs.readFileSync('supabase/migrations/005_landlord_compliance.sql', 'utf8');
  await client.query(sql);
  console.log('Migration applied successfully.');
  await client.end();
}

main().catch(console.error);
