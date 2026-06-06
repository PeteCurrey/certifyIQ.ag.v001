import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Verify token
    const { data: userRecord, error: fetchError } = await adminClient
      .from('aos_users')
      .select('*')
      .eq('invite_token', token)
      .maybeSingle()

    if (fetchError || !userRecord) {
      return NextResponse.json({ error: 'Invalid invitation link or invitation already accepted.' }, { status: 400 })
    }

    // Check expiry
    const expiresAt = new Date(userRecord.invite_token_expires_at).getTime()
    if (Date.now() > expiresAt) {
      return NextResponse.json({ error: 'Invitation link has expired.' }, { status: 400 })
    }

    // 2. Create or Update Supabase auth user
    // We check if an auth user with this email already exists
    const { data: usersList } = await adminClient.auth.admin.listUsers()
    const existingAuthUser = usersList?.users.find(u => u.email === userRecord.email)

    let authUserId = ''
    if (existingAuthUser) {
      authUserId = existingAuthUser.id
      // Update password
      const { error: updateAuthErr } = await adminClient.auth.admin.updateUserById(authUserId, {
        password: password,
      })
      if (updateAuthErr) throw updateAuthErr
    } else {
      // Create new user in auth
      const { data: newAuthUser, error: createAuthErr } = await adminClient.auth.admin.createUser({
        email: userRecord.email,
        password: password,
        email_confirm: true,
      })
      if (createAuthErr) throw createAuthErr
      authUserId = newAuthUser.user.id
    }

    // 3. Update aos_users record
    const { error: updateRecordErr } = await adminClient
      .from('aos_users')
      .update({
        status: 'active',
        invite_token: null,
        invite_token_expires_at: null,
        // For compliance with schema: set password_hash to simulated hash or bcrypt placeholder
        password_hash: 'SupabaseManagedPasswordHash',
      })
      .eq('id', userRecord.id)

    if (updateRecordErr) throw updateRecordErr

    // If assessor role, make sure they have a profile in the assessors table
    if (userRecord.role === 'assessor') {
      const { data: existingAssessor } = await adminClient
        .from('assessors')
        .select('id')
        .eq('email', userRecord.email)
        .maybeSingle()

      if (!existingAssessor) {
        await adminClient.from('assessors').insert({
          auth_user_id: authUserId,
          full_name: userRecord.name,
          email: userRecord.email,
          phone: '',
          accreditation_body: 'elmhurst',
          accreditation_number: 'EES[PLACEHOLDER]',
          is_active: true,
        })
      } else {
        await adminClient
          .from('assessors')
          .update({ auth_user_id: authUserId, is_active: true })
          .eq('email', userRecord.email)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Accept invite error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
