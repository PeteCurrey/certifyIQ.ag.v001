import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe if key is present
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' as any })
  : null

export async function POST(request: Request) {
  try {
    const { amount, metadata } = await request.json()

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 })
    }

    if (!stripe) {
      // Mock Stripe response for development when API key is missing
      return NextResponse.json({
        clientSecret: 'mock_client_secret_' + Math.random().toString(36).substring(7),
        warning: 'Running in sandbox mode with mock Stripe intent.'
      })
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents/pence
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error('Error creating Stripe payment intent:', error)
    return NextResponse.json({ error: error.message || 'Stripe error' }, { status: 500 })
  }
}
