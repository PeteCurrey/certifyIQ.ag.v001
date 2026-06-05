import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://oramerurfzpwonchnmka.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYW1lcnVyZnpwd29uY2hubWthIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY2MTEzMywiZXhwIjoyMDk2MjM3MTMzfQ.u8EW-2fEKTwijrO2vuBjnD-dmZ4DTRQ-Zfz1Ix70SFs'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function run() {
  console.log('Creating auth user for petecurrrey@gmail.com...')
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'petecurrrey@gmail.com',
    password: 'Vivaro2104!!',
    email_confirm: true
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
        console.log('User already exists in auth.users.')
    } else {
        console.error('Error creating auth user:', authError)
        process.exit(1)
    }
  }

  // Get the ID of the user we just created or the existing one
  let userId = authData?.user?.id
  
  if (!userId) {
      const { data: users, error: usersErr } = await supabase.auth.admin.listUsers()
      if (usersErr) {
          console.error('Error fetching users:', usersErr)
          process.exit(1)
      }
      const user = users.users.find(u => u.email === 'petecurrrey@gmail.com')
      if (user) {
          userId = user.id
          console.log('Found existing user id:', userId)
      } else {
          console.error('Could not find user after creation error.')
          process.exit(1)
      }
  } else {
      console.log('Created new auth user:', userId)
  }

  console.log('Upserting assessor record...')
  const { data: assessor, error: assessorErr } = await supabase.from('assessors').upsert({
    auth_user_id: userId,
    full_name: 'Pete Currey',
    email: 'petecurrrey@gmail.com',
    phone: '07700900002',
    accreditation_body: 'elmhurst',
    accreditation_number: 'EES123456',
    accreditation_expiry: '2026-12-31',
    service_area_postcodes: ['S40','S41','S42','S43','S44','S45','DE4','DE55'],
    is_active: true,
    attma_registration: true,
    attma_level: 1
  }, { onConflict: 'email' }) // Try upserting by email if there's a unique constraint, or maybe by auth_user_id.

  if (assessorErr) {
      // If the upsert above fails due to a constraint issue, let's just insert
      console.log('Upsert failed, trying direct insert or update by auth_user_id...')
      const { error: insErr } = await supabase.from('assessors').insert({
        auth_user_id: userId,
        full_name: 'Pete Currey',
        email: 'petecurrrey@gmail.com',
        phone: '07700900002',
        accreditation_body: 'elmhurst',
        accreditation_number: 'EES123456',
        accreditation_expiry: '2026-12-31',
        service_area_postcodes: ['S40','S41','S42','S43','S44','S45','DE4','DE55'],
        is_active: true,
        attma_registration: true,
        attma_level: 1
      })
      if (insErr) {
         if (insErr.code === '23505') { // unique violation
             console.log('Assessor already exists.')
         } else {
             console.error('Error inserting assessor:', insErr)
         }
      } else {
         console.log('Assessor record inserted.')
      }
  } else {
      console.log('Assessor record upserted successfully.')
  }
}

run().catch(console.error)
