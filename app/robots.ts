import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/aos/', '/portal/'],
    },
    sitemap: 'https://certifyiq.co.uk/sitemap.xml',
  }
}
