import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/sk/admin/', '/en/admin/', '/de/admin/'],
      },
    ],
    sitemap: 'https://caniscentral.sk/sitemap.xml',
    host: 'https://caniscentral.sk',
  }
}
