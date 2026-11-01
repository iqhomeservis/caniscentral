import { MetadataRoute } from 'next'
import { SITE_URL, DEFAULT_LOCALE } from '@/lib/seo'

/**
 * Do sitemapy ide len slovenská verzia.
 *
 * Anglická a nemecká verzia zatiaľ nemajú vlastný preklad obsahu — podstránky
 * zobrazujú slovenský text — preto sú označené noindex (viď src/lib/seo.ts)
 * a do sitemapy nepatria. Keď budú preložené, stačí sem pridať ďalšie jazyky.
 *
 * Právne stránky (obchodné podmienky, ochrana osobných údajov) majú noindex,
 * takže v sitemape tiež nie sú — inak by Search Console hlásil rozpor.
 */
const PAGES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/obchod', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/hotel', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/skola', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/salon', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/chov', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/o-nas', priority: 0.7, changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return PAGES.map((page) => ({
    url: `${SITE_URL}/${DEFAULT_LOCALE}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
