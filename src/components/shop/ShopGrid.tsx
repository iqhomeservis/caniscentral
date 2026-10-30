'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import ProductCard from './ProductCard'
import type { Locale, Product, ProductCategory } from '@/types'

const FILTERS: { key: ProductCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Všetky' },
  { key: 'food', label: 'Krmivá' },
  { key: 'supplements', label: 'Doplnky' },
  { key: 'care', label: 'Starostlivosť' },
  { key: 'accessories', label: 'Príslušenstvo' },
]

export default function ShopGrid({
  products,
  locale,
  activeCategory,
}: {
  products: Product[]
  locale: Locale
  activeCategory?: string
}) {
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
      {/* Filter pills */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-body transition-colors ${
              active === key
                ? 'bg-ink text-cream'
                : 'bg-sand text-stone hover:bg-sand-deep'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 px-6">
          <p className="font-display text-2xl font-light text-ink mb-3">
            V tejto kategórii zatiaľ nič nemáme
          </p>
          <p className="text-stone text-sm leading-relaxed max-w-md mx-auto mb-8">
            Ponuku priebežne dopĺňame. Napíšte nám alebo zavolajte — väčšinu produktov
            vieme zabezpečiť na objednávku z kamennej predajne.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+421908267278"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-medium bg-ink text-cream hover:bg-clay transition-colors"
            >
              +421 908 267 278
            </a>
            <a
              href="mailto:canisdogsport@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-medium border border-stone/30 text-stone hover:border-ink hover:text-ink transition-colors"
            >
              canisdogsport@gmail.com
            </a>
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
