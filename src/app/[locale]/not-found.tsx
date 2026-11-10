'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

/**
 * Stránka 404 vnútri jazykovej sekcie.
 *
 * Zobrazí sa pri neexistujúcej adrese aj vtedy, keď detail produktu zavolá
 * notFound() — napríklad po zmazaní produktu, na ktorý vedie starý odkaz.
 * Je to klientsky komponent, aby mohla použiť preklady z providera v layoute.
 */
export default function LocaleNotFound() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <main className="pt-20 font-body min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-display text-7xl font-light text-clay mb-4">404</p>
        <h1 className="font-display text-3xl font-light text-ink mb-4">{t('title')}</h1>
        <p className="text-stone text-sm leading-relaxed mb-8">{t('text')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm bg-ink text-cream hover:bg-clay transition-colors"
          >
            {t('home')}
          </Link>
          <Link
            href={`/${locale}/obchod`}
            className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm border border-stone/30 text-stone hover:border-ink hover:text-ink transition-colors"
          >
            {t('shop')}
          </Link>
        </div>
      </div>
    </main>
  )
}
