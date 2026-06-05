import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 86400 // Revalidate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const DB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const DB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient(DB_URL, DB_KEY)
  
  const { data: pages } = await supabase
    .from('location_seo_pages')
    .select('slug, created_at')
    .eq('is_live', true)

  const baseUrl = 'https://certifyiq.co.uk'

  const routes = ['', '/estimate', '/improve', '/lookup', '/prices', '/book'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const seoRoutes = (pages || []).map(page => ({
    url: `${baseUrl}/locations/${page.slug}`,
    lastModified: page.created_at ? new Date(page.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...seoRoutes]
}
