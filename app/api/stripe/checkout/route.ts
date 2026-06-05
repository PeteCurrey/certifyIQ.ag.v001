import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { priceId, tierId } = await request.json()
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // MOCK CHECKOUT FLOW
    // In a real app, we'd call stripe.checkout.sessions.create(...)
    
    // Check if they already have an org
    const { data: orgs } = await supabase.from('organizations').select('id').eq('owner_id', user.id).limit(1)
    let orgId = orgs?.[0]?.id

    if (!orgId) {
       // Create a default org if they don't have one
       const { data: newOrg } = await supabase.from('organizations').insert({
         owner_id: user.id,
         name: 'My Organization',
         type: tierId === 'agency' ? 'agency' : tierId === 'aos' ? 'assessor' : 'landlord'
       }).select('id').single()
       orgId = newOrg?.id
    }

    // Insert mock subscription
    const { error: subErr } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      org_id: orgId,
      stripe_customer_id: 'cus_mock_' + user.id.substring(0,6),
      stripe_subscription_id: 'sub_mock_' + Date.now(),
      plan_id: priceId,
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    })

    if (subErr) {
      console.error('Mock sub err:', subErr)
      return NextResponse.json({ error: 'Database error applying subscription' }, { status: 500 })
    }

    // Redirect mapping based on tier
    let redirectUrl = '/dashboard'
    if (tierId === 'agency') redirectUrl = '/agency'
    if (tierId === 'aos') redirectUrl = '/aos'

    return NextResponse.json({ url: redirectUrl })

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
