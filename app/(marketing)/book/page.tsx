import { Suspense } from 'react'
import BookingWizardClient from './BookingWizardClient'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function BookPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080D18' }}>
        <LoadingSpinner size={48} />
      </div>
    }>
      <BookingWizardClient />
    </Suspense>
  )
}
