'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Check, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import type { Locale } from '@/types'

interface LongevityProduct {
  id: string
  name: string
  slug: string
  price: number
  compare_price: number | null
  images: string[]
  description: string | null
  badge: string | null
  stock: number
}

export default function LongevitySection({
  locale,
  products,
}: {
  locale: Locale
  products: LongevityProduct[]
}) {
  if (!products || products.length === 0) return null

  return (
    <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #faf7f4 0%, #f0ebe3 100%)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-light mb-4 bg-white/70 px-4 py-2 rounded-full border border-sand">
            <Star size={12} className="text-clay fill-clay" />
            Spolupráca s MVDr. Jiří Urbánkom
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-4">
            Dlhovekosť<br />
            <em className="text-clay">pre vášho psa</em>
          </h2>
          <p className="text-stone text-sm leading-relaxed max-w-lg mx-auto">
            Prírodné doplnky stravy vyvinuté veterinárnym lekárom. Telomérová podpora, adaptogény a antioxidanty — veda v každej kvapke.
          </p>
        </div>

        {/* Products grid */}
        <div className={`grid gap-6 mb-12 ${products.length === 1 ? 'md:grid-cols-1 max-w-sm mx-auto' : products.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' : 'md:grid-cols-3'}`}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} locale={locale} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center reveal">
          <Link
            href={`/${locale}/obchod`}
            className="inline-flex items-center gap-2 text-sm text-stone hover:text-ink transition-colors border-b border-stone/30 hover:border-ink pb-0.5"
          >
            Zobraziť celý obchod →
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, index, locale }: { product: LongevityProduct; index: number; locale: Locale }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const isBundle = product.badge === 'sale' || (product.compare_price && product.compare_price > product.price)
  const imageUrl = product.images?.[0] ?? '/illustrations/product-placeholder.jpg'
  const savings = product.compare_price ? Math.round(product.compare_price - product.price) : 0

  function handleAddToCart() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addItem(product as any)
    window.dispatchEvent(new CustomEvent('open-cart'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      className="reveal bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative bg-[#f8f5f1]" style={{ aspectRatio: '4/3' }}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Badge */}
        {isBundle && (
          <div className="absolute top-3 left-3 bg-clay text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium">
            Sada — ušetríš {savings}€
          </div>
        )}
        {!isBundle && product.badge && (
          <div className="absolute top-3 left-3 bg-ink text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium">
            {product.badge === 'new' ? 'Novinka' : product.badge === 'bio' ? 'Bio' : product.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-light text-ink mb-2 leading-tight">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-stone text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-center gap-3 mb-5 mt-auto">
          <span className="font-display text-2xl font-light text-ink">
            {product.price} €
          </span>
          {product.compare_price && (
            <span className="text-stone-light text-sm line-through">
              {product.compare_price} €
            </span>
          )}
        </div>

        {/* Add to cart — always visible */}
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
            added
              ? 'bg-sage-deep text-white'
              : 'bg-ink text-cream hover:bg-clay'
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              Pridané do košíka
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Vložiť do košíka
            </>
          )}
        </button>

        {/* Stock hint */}
        {product.stock <= 10 && product.stock > 0 && (
          <p className="text-center text-xs text-clay mt-2">
            Posledných {product.stock} kusov
          </p>
        )}
      </div>
    </div>
  )
}
