import { MetadataRoute } from 'next'
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from '@/lib/seo'

/**
 * Sitemapa pre všetky tri jazyky. Každý záznam nesie aj odkazy na svoje
 * jazykové varianty (hreflang), takže Google vie, že ide o preklady tej istej
 * stránky, nie o duplicitný obsah.
 *
 * Právne stránky (obchodné podmienky, ochrana osobných údajov) majú noindex,
 * takže v sitemape nie sú — inak by Search Console hlásil rozpor.
 */
const PAGES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/obchod', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/hotel', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/skola', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/salon', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/chov', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/o-nas', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/kontakt', priority: 0.7, changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const page of PAGES) {
    const languages: Record<string, string> = {
      'x-default': `${SITE_URL}/${DEFAULT_LOCALE}${page.path}`,
    }
    for (const l of LOCALES) {
      languages[l] = `${SITE_URL}/${l}${page.path}`
    }

    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        // slovenská verzia je hlavná, preklady majú o stupeň nižšiu prioritu
        priority: locale === DEFAULT_LOCALE ? page.priority : page.priority * 0.8,
        alternates: { languages },
      })
    }
  }

  return entries
}
