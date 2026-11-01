import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/sk/admin',
          '/en/admin',
          '/de/admin',
          '/sk/pokladna',
          '/en/checkout',
          '/en/pokladna',
          '/de/kasse',
          '/de/pokladna',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
