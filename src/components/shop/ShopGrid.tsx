'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Mountain } from 'lucide-react'
import ProductCard from './ProductCard'
import type { Locale, Product, ProductCategory } from '@/types'
import EmailLink from '@/components/ui/EmailLink'

const FILTER_KEYS: (ProductCategory | 'all')[] = ['all', 'food', 'supplements', 'care', 'accessories']

export default function ShopGrid({
  products,
  locale,
  activeCategory,
}: {
  products: Product[]
  locale: Locale
  activeCategory?: string
}) {
  const t = useTranslations('shop')
  const tEmpty = useTranslations('shopEmpty')
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState<string>(activeCategory ?? 'all')

  const setCategory = (cat: string) => {
    setActive(cat)
    const params = cat !== 'all' ? `?cat=${cat}` : ''
    router.push(`${pathname}${params}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Psy z vlastnej chovateľskej stanice slúžiace v Horskej záchrannej službe sú
          najsilnejšia referencia, akú na tieto prípravky máme. Patrí nad produkty,
          nie do pätičky — zákazník ju má vidieť skôr, než začne porovnávať ceny. */}
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-sage/40 bg-sage-pale px-5 py-4">
        <Mountain size={18} className="text-sage-deep shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-ink">{t('breederNote')}</p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${
              active === key
                ? 'bg-ink text-cream'
                : 'bg-sand text-stone hover:bg-sand-deep'
            }`}
          >
            {t(`filter.${key}`)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 px-6">
          <p className="font-display text-2xl font-light text-ink mb-3">
            {tEmpty('title')}
          </p>
          <p className="text-stone text-sm leading-relaxed max-w-md mx-auto mb-8">
            {tEmpty('text')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+421908267278"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-medium bg-ink text-cream hover:bg-clay transition-colors"
            >
              +421 908 267 278
            </a>
            <EmailLink
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-medium border border-stone/30 text-stone hover:border-ink hover:text-ink transition-colors"
            >
              canisdogsport@gmail.com
            </EmailLink>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
