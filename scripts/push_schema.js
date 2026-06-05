const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://oramerurfzpwonchnmka.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYW1lcnVyZnpwd29uY2hubWthIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY2MTEzMywiZXhwIjoyMDk2MjM3MTMzfQ.u8EW-2fEKTwijrO2vuBjnD-dmZ4DTRQ-Zfz1Ix70SFs';

// Direct Postgres connection string (direct connection)
const DB_URL = 'postgresql://postgres:Vivaro2104!!@db.oramerurfzpwonchnmka.supabase.co:5432/postgres';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runMigrations() {
  console.log('🔌 Connecting to database...');
  
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
  
  try {
    await client.connect();
    console.log('✅ Connected to Supabase database\n');

    const migrations = [
      path.join(__dirname, '../supabase/migrations/20231010000000_initial_schema.sql'),
      path.join(__dirname, '../supabase/migrations/002_additional_services.sql'),
      path.join(__dirname, '../supabase/migrations/003_location_seo_seed.sql'),
    ];

    for (const migrationPath of migrations) {
      const fileName = path.basename(migrationPath);
      console.log(`📄 Running migration: ${fileName}`);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      try {
        await client.query(sql);
        console.log(`✅ ${fileName} - SUCCESS\n`);
      } catch (err) {
        // Some errors are acceptable (e.g. table already exists)
        if (err.message.includes('already exists') || err.message.includes('duplicate')) {
          console.log(`⚠️  ${fileName} - Some objects already exist (OK)\n`);
        } else {
          console.log(`❌ ${fileName} - ERROR: ${err.message}\n`);
        }
      }
    }

    await client.end();
    console.log('🔌 Database connection closed\n');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    // Try alternative connection string
    console.log('\n🔄 Trying alternative connection string (direct)...');
    await client.end().catch(() => {});
    return false;
  }
}

async function createAssessorUser() {
  console.log('👤 Creating assessor user account...');

  const email = 'petecurrey@gmail.com';
  const password = 'Vivaro2104!!';

  // Check if user already exists
  const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('❌ Failed to list users:', listErr.message);
    return null;
  }

  let authUser = users.find(u => u.email === email);

  if (authUser) {
    console.log(`ℹ️  Auth user already exists: ${authUser.id}`);
    // Update password just in case
    await supabaseAdmin.auth.admin.updateUserById(authUser.id, { password });
    console.log('✅ Password updated\n');
  } else {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error('❌ Failed to create auth user:', error.message);
      return null;
    }
    authUser = data.user;
    console.log(`✅ Auth user created: ${authUser.id}\n`);
  }

  return authUser;
}

async function createAssessorRecord(authUserId) {
  console.log('🏷️  Creating/updating assessor record in database...');

  // Use pg directly for the upsert since RLS might block service role on REST
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();

    // Upsert into assessors table
    const result = await client.query(`
      INSERT INTO assessors (
        auth_user_id, full_name, email, phone,
        accreditation_body, accreditation_number, accreditation_expiry,
        service_area_postcodes, is_active
      )
      VALUES (
        $1, 'Pete Currey', 'petecurrey@gmail.com', '07700900000',
        'elmhurst', 'EES-TEST-001', '2027-12-31',
        ARRAY['S40','S41','S42','S43','S44','S45','DE4','DE55'],
        true
      )
      ON CONFLICT (email) DO UPDATE SET
        auth_user_id = EXCLUDED.auth_user_id,
        full_name = EXCLUDED.full_name,
        is_active = true
      RETURNING id, email, full_name;
    `, [authUserId]);

    console.log('✅ Assessor record created/updated:', result.rows[0]);
    await client.end();
    return true;
  } catch (err) {
    console.error('❌ Failed to create assessor record:', err.message);
    await client.end().catch(() => {});
    return false;
  }
}

async function main() {
  console.log('🚀 Avorria - Database Setup Script');
  console.log('====================================\n');

  // Step 1: Push schema migrations
  const migrated = await runMigrations();

  // Step 2: Create auth user
  const authUser = await createAssessorUser();
  if (!authUser) {
    console.error('\n❌ Setup failed at user creation step.');
    process.exit(1);
  }

  // Step 3: Create assessor record
  const assessorCreated = await createAssessorRecord(authUser.id);

  if (assessorCreated) {
    console.log('\n🎉 Setup Complete!');
    console.log('==================');
    console.log('Login URL:  https://avorria.co.uk/login (or localhost:3000/login)');
    console.log('Email:      petecurrey@gmail.com');
    console.log('Password:   Vivaro2104!!');
    console.log('\nYou should now be able to log in and access the assessor dashboard.');
  } else {
    console.log('\n⚠️  Auth user created but assessor record may need manual setup.');
  }
}

main().catch(console.error);
