'use client'

import { useState } from 'react'
import { ShoppingBag, Heart, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import type { Locale, Product } from '@/types'

export default function ProductDetail({
  product,
  locale,
}: {
  product: Product
  locale: Locale
}) {
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = () => {
    addItem(product, qty)
    window.dispatchEvent(new CustomEvent('open-cart'))
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-off rounded-3xl overflow-hidden mb-4 flex items-center justify-center">
              {product.images?.[activeImg] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">🐾</span>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === activeImg ? 'border-clay' : 'border-transparent'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.badge && (
              <span className="inline-block mb-3 text-xs font-body px-3 py-1 rounded-full bg-clay text-white w-fit capitalize">
                {product.badge}
              </span>
            )}
            <h1 className="font-display text-4xl font-light text-ink mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-body text-3xl font-medium text-ink">
                {product.price.toFixed(2)} €
              </span>
              {product.compare_price && (
                <span className="text-stone-light line-through text-lg">
                  {product.compare_price.toFixed(2)} €
                </span>
              )}
            </div>

            <p className="font-body text-sm text-stone leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock */}
            <p className="text-xs font-body text-stone-light mb-4">
              {product.stock > 0 ? `Na sklade: ${product.stock} ks` : 'Momentálne vypredané'}
            </p>

            {/* Qty + add */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-sand rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-3 text-stone hover:text-ink"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-body text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-4 py-3 text-stone hover:text-ink"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 bg-clay text-cream flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-body hover:bg-clay-light transition-colors"
                >
                  <ShoppingBag size={16} />
                  Pridať do košíka
                </button>

                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="w-12 h-12 border border-sand rounded-full flex items-center justify-center hover:border-clay transition-colors"
                >
                  <Heart
                    size={16}
                    className={wishlisted ? 'fill-clay text-clay' : 'text-stone'}
                  />
                </button>
              </div>
            )}

            {/* Benefits */}
            <div className="border-t border-sand pt-6 space-y-2 text-xs text-stone-light">
              <p>✓ Doprava zadarmo od 50 €</p>
              <p>✓ Vrátenie do 14 dní</p>
              <p>✓ Bezpečná platba kartou</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
