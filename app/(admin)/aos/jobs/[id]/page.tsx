'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function JobRedirectPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const supabase = createClient()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function getJobAndRedirect() {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('service_type')
          .eq('id', id)
          .single()

        if (error || !data) {
          throw new Error('Booking job not found')
        }

        const serviceType = data.service_type || 'domestic'

        if (serviceType.startsWith('on_construction_')) {
          router.replace(`/aos/sap/${id}`)
        } else if (serviceType.startsWith('air_tightness_')) {
          router.replace(`/aos/airtest/${id}`)
        } else if (serviceType.startsWith('commercial_')) {
          router.replace(`/aos/commercial/${id}`)
        } else {
          router.replace(`/aos/assess/${id}`)
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading job details')
      }
    }

    if (id) {
      getJobAndRedirect()
    }
  }, [id, router])

  if (errorMsg) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-red)' }}>
        <h2>Redirection Error</h2>
        <p>{errorMsg}</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
      <LoadingSpinner size={48} />
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Identifying assessment type and routing...</p>
    </div>
  )
}
