const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const email = 'petecurrey@gmail.com';
  const password = 'Vivaro2104!!';

  console.log(`Setting up super admin for ${email}...`);

  // 1. Ensure user exists in auth.users
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId;

  if (authError) {
    if (authError.message.includes('already exists') || authError.message.includes('already registered')) {
      console.log('User already exists in auth.users, updating password just in case...');
      // We need to get the user ID
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existingUser = listData.users.find(u => u.email === email);
      if (existingUser) {
        userId = existingUser.id;
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password });
        if (updateError) console.error('Error updating password:', updateError);
        else console.log('Password updated successfully.');
      } else {
        console.log('Could not find existing user in list.');
      }
    } else {
      console.error('Error creating user:', authError);
      return;
    }
  } else {
    console.log('Created new auth user.');
    userId = authUser.user.id;
  }

  // 2. Upsert into public.aos_users
  console.log('Upserting into aos_users...');
  const { data: aosUser, error: aosError } = await supabase
    .from('aos_users')
    .upsert({
      email: email,
      name: 'Pete Currey',
      role: 'super_admin',
      status: 'active',
      password_hash: 'managed-by-supabase-auth' 
    }, { onConflict: 'email' })
    .select();

  if (aosError) {
    console.error('Error upserting aos_users:', aosError);
  } else {
    console.log('Successfully set up aos_users record:', aosUser);
  }
}

main();
