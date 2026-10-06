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
        <div className="text-center py-24 text-stone">
          <p>Žiadne produkty</p>
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
