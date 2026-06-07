import { redirect } from 'next/navigation'

// /lookup is the old URL — redirect permanently to /epc-register
export default function LookupRedirectPage({
  searchParams,
}: {
  searchParams: { postcode?: string }
}) {
  const postcode = searchParams.postcode
  if (postcode) {
    redirect(`/epc-register?postcode=${encodeURIComponent(postcode)}`)
  }
  redirect('/epc-register')
}
