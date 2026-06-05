const { Client } = require('pg');

const DB_URL = 'postgresql://postgres:Vivaro2104!!@db.oramerurfzpwonchnmka.supabase.co:5432/postgres';

async function main() {
  console.log('🔌 Connecting to database to apply super admin changes...');
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  
  try {
    await client.connect();
    console.log('✅ Connected');

    // 1. Add column if it doesn't exist
    console.log('adding is_super_admin column to assessors...');
    await client.query(`
      ALTER TABLE assessors 
      ADD COLUMN IF NOT EXISTS is_super_admin boolean DEFAULT false;
    `);
    
    // 2. Set Pete Currey as super admin
    console.log('setting petecurrey@gmail.com as super admin...');
    const result = await client.query(`
      UPDATE assessors 
      SET is_super_admin = true 
      WHERE email = 'petecurrey@gmail.com'
      RETURNING id, email, is_super_admin;
    `);

    console.log('🎉 Super Admin update successful:', result.rows[0]);
  } catch (err) {
    console.error('❌ Error executing SQL:', err.message);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

main().catch(console.error);
