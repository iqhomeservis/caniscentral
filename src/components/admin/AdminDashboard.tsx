'use client'

import { useState } from 'react'
import { Package, ShoppingBag, LogOut, Plus } from 'lucide-react'
import ProductForm from './ProductForm'
import OrdersTable from './OrdersTable'
import { createClient } from '@/lib/supabase/client'
import type { Locale, Product, Order } from '@/types'

type Tab = 'products' | 'orders'

export default function AdminDashboard({
  locale,
  products: initialProducts,
  orders,
}: {
  locale: Locale
  products: Product[]
  orders: Order[]
}) {
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState(initialProducts)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  const onProductSaved = (product: Product) => {
    setProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev]
    )
    setShowForm(false)
    setEditProduct(null)
  }

  const onProductDeleted = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const stats = {
    products: products.length,
    activeProducts: products.filter((p) => p.is_active).length,
    totalOrders: orders.length,
    revenue: orders
      .filter((o) => o.payment_status === 'paid')
      .reduce((s, o) => s + o.total, 0),
  }

  return (
    <div className="pt-16 min-h-screen bg-off">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-light text-ink">Správa</h1>
            <p className="text-sm text-stone mt-1">CanisCentral admin panel</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-stone hover:text-ink transition-colors"
          >
            <LogOut size={16} /> Odhlásiť sa
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Produkty', value: stats.products, icon: Package },
            { label: 'Aktívne', value: stats.activeProducts, icon: Package },
            { label: 'Objednávky', value: stats.totalOrders, icon: ShoppingBag },
            { label: 'Tržby', value: `${stats.revenue.toFixed(0)} €`, icon: ShoppingBag },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-5">
              <p className="text-xs text-stone-light mb-1">{label}</p>
              <p className="font-body text-2xl font-medium text-ink">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'products' as Tab, label: 'Produkty', icon: Package },
            { key: 'orders' as Tab, label: 'Objednávky', icon: ShoppingBag },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body transition-colors ${
                tab === key ? 'bg-ink text-cream' : 'bg-white text-stone hover:text-ink'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => { setEditProduct(null); setShowForm(true) }}
                className="flex items-center gap-2 bg-clay text-cream text-sm font-body px-5 py-2.5 rounded-full hover:bg-clay-light transition-colors"
              >
                <Plus size={14} /> Pridať produkt
              </button>
            </div>

            {(showForm || editProduct) && (
              <div className="bg-white rounded-2xl p-6 mb-6">
                <ProductForm
                  product={editProduct}
                  onSaved={onProductSaved}
                  onCancel={() => { setShowForm(false); setEditProduct(null) }}
                />
              </div>
            )}

            <div className="bg-white rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-sand">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Produkt</th>
                    <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Kategória</th>
                    <th className="text-right px-5 py-3 text-xs text-stone-light font-normal">Cena</th>
                    <th className="text-right px-5 py-3 text-xs text-stone-light font-normal">Sklad</th>
                    <th className="text-right px-5 py-3 text-xs text-stone-light font-normal">Aktívny</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-sand/50 hover:bg-off/50">
                      <td className="px-5 py-3 font-body text-ink">{product.name}</td>
                      <td className="px-5 py-3 text-stone capitalize">{product.category}</td>
                      <td className="px-5 py-3 text-right">{product.price.toFixed(2)} €</td>
                      <td className="px-5 py-3 text-right">{product.stock}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${product.is_active ? 'bg-sage-pale text-sage-deep' : 'bg-sand text-stone'}`}>
                          {product.is_active ? 'Áno' : 'Nie'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => { setEditProduct(product); setShowForm(false) }}
                          className="text-xs text-clay hover:underline"
                        >
                          Upraviť
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && <OrdersTable orders={orders} />}
      </div>
    </div>
  )
}
