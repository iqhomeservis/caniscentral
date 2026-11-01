import type { Metadata } from 'next'
import type { Locale } from '@/types'

/**
 * Základná adresa webu. Pri presune na ostrú doménu stačí zmeniť
 * NEXT_PUBLIC_APP_URL v Netlify — nikde inde sa URL nehardkóduje.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL || 'https://caniscentral.sk'
).replace(/\/$/, '')

export const LOCALES: Locale[] = ['sk', 'en', 'de']
export const DEFAULT_LOCALE: Locale = 'sk'

const OG_LOCALE: Record<Locale, string> = {
  sk: 'sk_SK',
  en: 'en_US',
  de: 'de_DE',
}

/**
 * Zostaví metadata pre podstránku: vlastný canonical, hreflang odkazy
 * na tú istú stránku v ostatných jazykoch a x-default na slovenčinu.
 *
 * Jazyky bez vlastného prekladu obsahu sa neindexujú (index: false),
 * aby sa rovnaký slovenský text nepredkladal Googlu trikrát.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  ogTitle,
  ogDescription,
}: {
  locale: Locale
  /** cesta bez jazykovej predpony, napr. '/hotel'; pre domov prázdny reťazec */
  path: string
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
}): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`

  const languages: Record<string, string> = {
    'x-default': `${SITE_URL}/${DEFAULT_LOCALE}${path}`,
  }
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}/${l}${path}`
  }

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale],
      siteName: 'CanisCentral',
      url: canonical,
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'CanisCentral' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      images: ['/og-image.jpg'],
    },
    robots:
      locale === DEFAULT_LOCALE
        ? { index: true, follow: true }
        : { index: false, follow: true },
  }
}
