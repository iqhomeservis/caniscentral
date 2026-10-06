'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import type { Locale, Product } from '@/types'

const BADGE_STYLES = {
  sale: 'bg-clay text-white',
  new: 'bg-sage-deep text-white',
  bio: 'bg-[#5a8a4a] text-white',
}

const BADGE_LABELS = {
  sale: 'Zľava',
  new: 'Novinka',
  bio: 'Bio',
}

export default function ProductCard({
  product,
  locale,
}: {
  product: Product
  locale: Locale
}) {
  const [wishlisted, setWishlisted] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    window.dispatchEvent(new CustomEvent('open-cart'))
  }

  return (
    <Link
      href={`/${locale}/obchod/${product.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-off flex items-center justify-center">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl">🐾</span>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-body px-2.5 py-1 rounded-full ${BADGE_STYLES[product.badge]}`}
          >
            {BADGE_LABELS[product.badge]}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setWishlisted(!wishlisted)
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Pridať do obľúbených"
        >
          <Heart
            size={14}
            className={wishlisted ? 'fill-clay text-clay' : 'text-stone'}
          />
        </button>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="font-body text-xs text-stone">Vypredané</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-body text-sm font-medium text-ink line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-body text-base font-medium text-ink">
              {product.price.toFixed(2)} €
            </span>
            {product.compare_price && (
              <span className="ml-2 text-xs text-stone-light line-through">
                {product.compare_price.toFixed(2)} €
              </span>
            )}
          </div>

          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 bg-clay rounded-full flex items-center justify-center hover:bg-clay-light transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Pridať do košíka"
            >
              <ShoppingBag size={14} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
