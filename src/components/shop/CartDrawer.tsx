'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity, total } = useCartStore()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-cart', handler)
    return () => window.removeEventListener('open-cart', handler)
  }, [])

  const shipping = total() >= 50 ? 0 : 3.99

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-ink/40 z-50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-cream z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
          <h2 className="font-body text-base font-medium text-ink">Košík</h2>
          <button onClick={() => setOpen(false)} className="text-stone hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone text-sm">Váš košík je prázdny</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-off rounded-xl flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      '🐾'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-ink line-clamp-2">{product.name}</p>
                    <p className="font-body text-sm text-clay mt-0.5">
                      {product.price.toFixed(2)} €
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded-full border border-sand flex items-center justify-center text-stone hover:border-clay"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-sm w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded-full border border-sand flex items-center justify-center text-stone hover:border-clay"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-stone-light hover:text-clay flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-sand px-6 py-5">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-stone">
                <span>Medzisúčet</span>
                <span>{total().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-stone">
                <span>Doprava</span>
                <span>{shipping === 0 ? 'Zadarmo' : `${shipping.toFixed(2)} €`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-light">
                  Doprava zadarmo od 50 €. Chýba: {(50 - total()).toFixed(2)} €
                </p>
              )}
              <div className="flex justify-between font-medium text-ink border-t border-sand pt-2">
                <span>Celkom</span>
                <span>{(total() + shipping).toFixed(2)} €</span>
              </div>
            </div>
            <Link
              href="/sk/pokladna"
              onClick={() => setOpen(false)}
              className="block w-full bg-clay text-cream text-sm font-body py-3.5 rounded-full text-center hover:bg-clay-light transition-colors"
            >
              Prejsť k platbe →
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-center text-xs text-stone-light mt-3 hover:text-stone transition-colors"
            >
              Pokračovať v nákupe
            </button>
          </div>
        )}
      </div>
    </>
  )
}
