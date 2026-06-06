import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 86400 // Revalidate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient(DB_URL, DB_KEY)
  
  const baseUrl = 'https://avorria.co.uk'

  // Core static routes
  const routes = [
    '',
    '/estimate',
    '/improve',
    '/epc-register',
    '/landlord-compliance',
    '/developer',
    '/developer/wizard',
    '/prices',
    '/book',
    '/faq',
    '/glossary',
    '/blog',
    '/services',
    '/tools',
    '/locations/london/commercial-epc',
    '/locations/london/tm44',
    '/locations/london/city-of-london/commercial-epc',
    '/locations/london/canary-wharf/commercial-epc',
    '/locations/london/westminster/commercial-epc',
    '/locations/london/city-of-london/tm44',
    '/locations/london/canary-wharf/tm44',
    '/locations/london/westminster/tm44',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/locations/london') ? 0.8 : route === '/landlord-compliance' || route === '/epc-register' ? 0.9 : 0.8,
  }))

  // Location EPC SEO pages
  const { data: epcPages } = await supabase
    .from('location_seo_pages')
    .select('slug, created_at')
    .eq('is_live', true)

  const epcRoutes = (epcPages || []).map((page: { slug: string; created_at: string }) => ({
    url: `${baseUrl}/locations/${page.slug}`,
    lastModified: page.created_at ? new Date(page.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Landlord Compliance location SEO pages
  const { data: compliancePages } = await supabase
    .from('landlord_compliance_seo_pages')
    .select('slug, created_at')
    .eq('is_live', true)

  const complianceRoutes = (compliancePages || []).map((page: { slug: string; created_at: string }) => ({
    url: `${baseUrl}/landlord-compliance/${page.slug}`,
    lastModified: page.created_at ? new Date(page.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Developer Compliance location SEO pages
  const { data: developerPages } = await supabase
    .from('developer_seo_pages')
    .select('slug, created_at')
    .eq('is_live', true)

  const developerRoutes = (developerPages || []).map((page: { slug: string; created_at: string }) => ({
    url: `${baseUrl}/developer/${page.slug}`,
    lastModified: page.created_at ? new Date(page.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...epcRoutes, ...complianceRoutes, ...developerRoutes]
}
