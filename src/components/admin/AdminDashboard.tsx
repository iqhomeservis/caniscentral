'use client'

import { useState } from 'react'
import { Package, ShoppingBag, LogOut, Plus, BarChart3, UserPlus, ExternalLink, AlertTriangle } from 'lucide-react'
import AnalyticsPanel, { type AnalyticsData } from './AnalyticsPanel'
import LeadsPanel, { type AbandonedCheckout, type Subscriber } from './LeadsPanel'
import ProductForm from './ProductForm'
import OrdersTable from './OrdersTable'
import { createClient } from '@/lib/supabase/client'
import type { Locale, Product, Order } from '@/types'

type Tab = 'products' | 'orders' | 'analytics' | 'leads'

export default function AdminDashboard({
  locale,
  products: initialProducts,
  orders,
  analytics,
  abandoned,
  subscribers,
}: {
  locale: Locale
  products: Product[]
  orders: Order[]
  analytics: AnalyticsData
  abandoned: AbandonedCheckout[]
  subscribers: Subscriber[]
}) {
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState(initialProducts)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

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

  // Zmazanie je bezpečné: položky objednávok si držia vlastnú kópiu názvu
  // a ceny, väzba na produkt sa pri zmazaní len vynuluje (ON DELETE SET NULL),
  // takže história objednávok zostane čitateľná.
  const handleDelete = async (product: Product) => {
    if (!confirm(`Naozaj zmazať produkt „${product.name}"? Táto akcia sa nedá vrátiť.`)) return
    setBusyId(product.id)
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    setBusyId(null)
    if (error) {
      alert(`Produkt sa nepodarilo zmazať: ${error.message}`)
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
  }

  // Deaktivovanie je šetrnejšie než mazanie — produkt zmizne z obchodu,
  // ale zostane v systéme aj v histórii.
  const handleToggleActive = async (product: Product) => {
    setBusyId(product.id)
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)
    setBusyId(null)
    if (error) {
      alert(`Zmenu sa nepodarilo uložiť: ${error.message}`)
      return
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: !p.is_active } : p))
    )
  }

  const stats = {
    products: products.length,
    activeProducts: products.filter((p) => p.is_active).length,
    totalOrders: orders.length,
    revenue: orders
      .filter((o) => o.payment_status === 'paid')
      .reduce((s, o) => s + o.total, 0),
  }

  // Objednávky, ktoré ešte niekto musí vziať do ruky. Číslo patrí na záložku —
  // inak sa na ne príde len náhodou.
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  // Čo treba doobjednať. Hranicu päť kusov sme zvolili podľa toho, že
  // dodanie od výrobcu trvá dni, nie hodiny.
  const LOW_STOCK = 5
  const lowStock = products.filter((p) => p.is_active && p.stock <= LOW_STOCK)

  return (
    <div className="pt-20 min-h-screen bg-off">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-light text-ink">Správa</h1>
            <p className="text-sm text-stone mt-1">CanisCentral admin panel</p>
          </div>
          <div className="flex items-center gap-5">
            {/* Web sa otvára v novom paneli, aby správa zostala otvorená. */}
            <a
              href={`/${locale}`}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 text-sm text-stone hover:text-ink transition-colors"
            >
              <ExternalLink size={16} /> Zobraziť web
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-stone hover:text-ink transition-colors"
            >
              <LogOut size={16} /> Odhlásiť sa
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Produkty', value: stats.products, icon: Package },
            { label: 'Aktívne', value: stats.activeProducts, icon: Package },
            { label: 'Objednávky', value: stats.totalOrders, icon: ShoppingBag },
            { label: 'Tržby', value: `${stats.revenue.toFixed(0)} €`, icon: ShoppingBag },
            { label: 'Zobrazenia (7 dní)', value: analytics.views7, icon: BarChart3 },
            { label: 'Nedokončené', value: abandoned.length, icon: UserPlus },
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
            { key: 'orders' as Tab, label: pendingOrders ? `Objednávky (${pendingOrders} čaká)` : 'Objednávky', icon: ShoppingBag },
            { key: 'analytics' as Tab, label: 'Návštevnosť', icon: BarChart3 },
            { key: 'leads' as Tab, label: `Záujemcovia (${abandoned.length})`, icon: UserPlus },
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

            {lowStock.length > 0 && !showForm && !editProduct && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-clay/40 bg-clay-pale px-5 py-4">
                <AlertTriangle size={18} className="text-clay shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-ink leading-relaxed">
                  <span className="font-medium">Dochádza sklad:</span>{' '}
                  {lowStock.map((p) => `${p.name} (${p.stock} ks)`).join(', ')}
                </p>
              </div>
            )}

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
                      <td className={`px-5 py-3 text-right ${
                        product.stock === 0
                          ? 'text-red-700 font-medium'
                          : product.stock <= LOW_STOCK ? 'text-clay font-medium' : ''
                      }`}>
                        {product.stock === 0 ? 'Vypredané' : product.stock}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleToggleActive(product)}
                          disabled={busyId === product.id}
                          title={product.is_active ? 'Skryť z obchodu' : 'Zobraziť v obchode'}
                          className={`text-xs px-2 py-0.5 rounded-full transition-opacity hover:opacity-80 disabled:opacity-50 ${product.is_active ? 'bg-sage-pale text-sage-deep' : 'bg-sand text-stone'}`}
                        >
                          {product.is_active ? 'Áno' : 'Nie'}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => { setEditProduct(product); setShowForm(false) }}
                          className="text-xs text-clay hover:underline mr-3"
                        >
                          Upraviť
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={busyId === product.id}
                          className="text-xs text-stone hover:text-red-700 hover:underline disabled:opacity-50"
                        >
                          Zmazať
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
        {tab === 'analytics' && <AnalyticsPanel data={analytics} />}
        {tab === 'leads' && <LeadsPanel abandoned={abandoned} subscribers={subscribers} />}
      </div>
    </div>
  )
}
