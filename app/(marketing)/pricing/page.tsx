'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Zap, Shield, Building2, HardHat, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './pricing.module.css'

const TIERS = [
  {
    id: 'pro',
    name: 'Pro Landlord',
    price: '£29',
    interval: '/month',
    desc: 'For portfolio landlords managing up to 20 properties.',
    icon: Zap,
    features: [
      'Manage up to 20 properties',
      'AI Document Analyser (Unlimited)',
      'Automated Compliance Alerts',
      'Tasks & Timeline Engine',
      'Basic Risk Analysis',
      'Priority Booking'
    ],
    priceId: 'price_1ProLandlord_Mock'
  },
  {
    id: 'agency',
    name: 'Estate Agency',
    price: '£99',
    interval: '/month',
    desc: 'Full CRM and compliance suite for lettings and estate agents.',
    icon: Building2,
    popular: true,
    features: [
      'Unlimited properties & landlords',
      'Agency Portal & CRM Hub',
      'Lead Generation from AI Analyser',
      'White-labelled Reports',
      'Team Management (up to 5 users)',
      'Advanced Risk Analysis & Forecasting',
      'Dedicated Account Manager'
    ],
    priceId: 'price_1Agency_Mock'
  },
  {
    id: 'aos',
    name: 'Avorria Assessor OS',
    price: '£49',
    interval: '/user/month',
    desc: 'Complete field operating system for energy assessors and surveyors.',
    icon: HardHat,
    features: [
      'Mobile Survey App (iOS/Android PWA)',
      'Offline Capability & Auto-Sync',
      'AI Photo Analysis & Voice Notes',
      'Route Planner & Optimization',
      'Pre-Submission AI Audit Checker',
      'Automated Report & Invoice Generation'
    ],
    priceId: 'price_1AOS_Mock'
  }
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, tierId: string) => {
    setLoading(tierId)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push(`/login?next=/pricing`)
      return
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, tierId })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout failed')
      }
    } catch (err) {
      console.error(err)
      alert('Network error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Simple, transparent pricing</h1>
        <p className={styles.sub}>Choose the right platform tier for your property business.</p>
      </div>

      <div className={styles.grid}>
        {TIERS.map(tier => {
          const Icon = tier.icon
          return (
            <div key={tier.id} className={`${styles.card} ${tier.popular ? styles.popular : ''}`}>
              {tier.popular && <div className={styles.popularBadge}>Most Popular</div>}
              
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}><Icon size={24} color="#9BFF59" /></div>
                <h3 className={styles.tierName}>{tier.name}</h3>
                <p className={styles.tierDesc}>{tier.desc}</p>
                <div className={styles.priceBox}>
                  <span className={styles.price}>{tier.price}</span>
                  <span className={styles.interval}>{tier.interval}</span>
                </div>
              </div>

              <div className={styles.features}>
                {tier.features.map((f, i) => (
                  <div key={i} className={styles.featureItem}>
                    <CheckCircle size={16} color="#10B981" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`${styles.btn} ${tier.popular ? styles.btnPrimary : styles.btnSecondary}`}
                onClick={() => handleSubscribe(tier.priceId, tier.id)}
                disabled={loading !== null}
              >
                {loading === tier.id ? <Loader2 size={18} className={styles.spin} /> : 'Get Started'}
              </button>
            </div>
          )
        })}
      </div>
      
      <div className={styles.footer}>
        <Shield size={16} color="#10B981" />
        <p>Payments are processed securely via Stripe. Cancel anytime.</p>
      </div>
    </div>
  )
}
