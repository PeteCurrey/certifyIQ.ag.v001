import { createClient } from '@supabase/supabase-js'

export async function logAuditAction(params: {
  userId: string | null
  userEmail: string
  action: string
  targetTable?: string
  targetId?: string
  previousValue?: any
  newValue?: any
  ipAddress?: string
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  // Use admin client to write to audit log bypass RLS
  const adminClient = createClient(supabaseUrl, supabaseServiceKey)

  const { error } = await adminClient.from('aos_audit_log').insert({
    user_id: params.userId,
    user_email: params.userEmail,
    action: params.action,
    target_table: params.targetTable || null,
    target_id: params.targetId || null,
    previous_value: params.previousValue || null,
    new_value: params.newValue || null,
    ip_address: params.ipAddress || null,
  })

  if (error) {
    console.error('Failed to log audit action:', error)
  }
}
