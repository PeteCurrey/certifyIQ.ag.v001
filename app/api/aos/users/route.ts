import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logAuditAction } from '@/lib/aos/audit'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

// Helper to check if the caller is super_admin
async function getCallerProfile(request: Request) {
  const adminClient = createClient(supabaseUrl, supabaseServiceKey)
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return null

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await adminClient.auth.getUser(token)
  if (error || !user) return null

  const { data: profile } = await adminClient
    .from('aos_users')
    .select('*')
    .eq('email', user.email)
    .single()

  return profile
}

// GET: List all users
export async function GET(request: Request) {
  try {
    const caller = await getCallerProfile(request)
    if (!caller || caller.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    const { data: users, error } = await adminClient
      .from('aos_users')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json(users)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Invite a user
export async function POST(request: Request) {
  try {
    const caller = await getCallerProfile(request)
    if (!caller || caller.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { name, email, role } = await request.json()
    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)
    const inviteToken = crypto.randomUUID()
    const inviteTokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

    const { data: newUser, error } = await adminClient
      .from('aos_users')
      .insert({
        name,
        email,
        role,
        status: 'invited',
        invite_token: inviteToken,
        invite_token_expires_at: inviteTokenExpiresAt,
      })
      .select()
      .single()

    if (error) throw error

    // Send email via Resend
    const inviteLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/aos/accept-invite/${inviteToken}`
    
    await resend.emails.send({
      from: 'Avorria Operations <office@avorria.co.uk>',
      to: email,
      subject: 'Invite to Avorria Operations Console (AOS)',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">Avorria Console Invitation</h2>
          <p>Hi ${name},</p>
          <p>You have been invited to join the Avorria Operations System (AOS) with the role of <strong>${role}</strong>.</p>
          <p>Click the button below to accept your invitation and set up your security password. This link is valid for 48 hours.</p>
          <div style="margin: 25px 0;">
            <a href="${inviteLink}" style="background-color: #9BFF59; color: #000; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">Accept Invitation</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">If the button doesn't work, copy and paste this URL into your browser:<br/>${inviteLink}</p>
        </div>
      `
    })

    // Log to Audit Log
    await logAuditAction({
      userId: caller.id,
      userEmail: caller.email,
      action: 'user.invited',
      targetTable: 'aos_users',
      targetId: newUser.id,
      newValue: { name, email, role },
    })

    return NextResponse.json(newUser)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: Edit user role, status or name
export async function PUT(request: Request) {
  try {
    const caller = await getCallerProfile(request)
    if (!caller || caller.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id, name, role, status } = await request.json()
    if (!id || !name || !role || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch previous values
    const { data: previousUser } = await adminClient
      .from('aos_users')
      .select('*')
      .eq('id', id)
      .single()

    if (!previousUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Protect super admin immovable status
    if (previousUser.role === 'super_admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Cannot demote the super_admin role.' }, { status: 400 })
    }

    const { data: updatedUser, error } = await adminClient
      .from('aos_users')
      .update({ name, role, status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log to Audit Log
    await logAuditAction({
      userId: caller.id,
      userEmail: caller.email,
      action: 'user.updated',
      targetTable: 'aos_users',
      targetId: id,
      previousValue: previousUser,
      newValue: updatedUser,
    })

    return NextResponse.json(updatedUser)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Delete user
export async function DELETE(request: Request) {
  try {
    const caller = await getCallerProfile(request)
    if (!caller || caller.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { url } = request
    const userId = url.split('?id=')[1]

    if (!userId) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch previous values
    const { data: deletedUser } = await adminClient
      .from('aos_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (deletedUser.role === 'super_admin') {
      return NextResponse.json({ error: 'Cannot delete super_admin account.' }, { status: 400 })
    }

    // Re-attribute content: find super_admin
    const { data: superAdmin } = await adminClient
      .from('aos_users')
      .select('id, email')
      .eq('role', 'super_admin')
      .limit(1)
      .single()

    if (superAdmin) {
      // Reattribute content: e.g. update assessors assigned bookings, blogs, etc.
      // First update bookings that are assigned to the deleted assessor
      const { data: deletedAssessor } = await adminClient
        .from('assessors')
        .select('id')
        .eq('email', deletedUser.email)
        .maybeSingle()

      const { data: superAssessor } = await adminClient
        .from('assessors')
        .select('id')
        .eq('email', superAdmin.email)
        .maybeSingle()

      if (deletedAssessor && superAssessor) {
        await adminClient
          .from('bookings')
          .update({ assessor_id: superAssessor.id })
          .eq('assessor_id', deletedAssessor.id)
      }
    }

    const { error } = await adminClient
      .from('aos_users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    // Log to Audit Log
    await logAuditAction({
      userId: caller.id,
      userEmail: caller.email,
      action: 'user.deleted',
      targetTable: 'aos_users',
      targetId: userId,
      previousValue: deletedUser,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
