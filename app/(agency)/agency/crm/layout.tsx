import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import React from 'react'

export default async function AgencyLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/agency')
  }

  // Check subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, plan_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .ilike('plan_id', '%agency%') // simple mock check
    .single()

  if (!sub) {
    redirect('/pricing')
  }

  return (
    <div style={{ padding: '2rem' }}>
      {children}
    </div>
  )
}
