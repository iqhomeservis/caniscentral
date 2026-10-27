import { MetadataRoute } from 'next'

const BASE_URL = 'https://caniscentral.sk'
const LOCALES = ['sk', 'en', 'de']

const PAGES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/hotel', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/skola', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/salon', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/chov', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/obchod', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/ochrana-osobnych-udajov', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/obchodne-podmienky', priority: 0.3, changeFrequency: 'yearly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const page of PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }
  }

  return entries
}
