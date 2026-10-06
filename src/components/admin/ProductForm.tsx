'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product, ProductCategory } from '@/types'

const CATEGORIES: ProductCategory[] = ['food', 'supplements', 'care', 'accessories']
const CAT_LABELS: Record<ProductCategory, string> = {
  food: 'Krmivá',
  supplements: 'Doplnky',
  care: 'Starostlivosť',
  accessories: 'Príslušenstvo',
}

export default function ProductForm({
  product,
  onSaved,
  onCancel,
}: {
  product: Product | null
  onSaved: (p: Product) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    compare_price: product?.compare_price?.toString() ?? '',
    category: product?.category ?? ('food' as ProductCategory),
    badge: product?.badge ?? '',
    stock: product?.stock?.toString() ?? '0',
    is_active: product?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [imgFile, setImgFile] = useState<File | null>(null)

  const set = (key: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    // Auto-generate slug from name
    if (key === 'name' && !product) {
      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setForm((f) => ({ ...f, name: e.target.value, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    let images = product?.images ?? []

    // Upload image if selected
    if (imgFile) {
      const ext = imgFile.name.split('.').pop()
      const path = `products/${form.slug}-${Date.now()}.${ext}`
      const { data: upload } = await supabase.storage.from('product-images').upload(path, imgFile)
      if (upload) {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
        images = [publicUrl, ...images.slice(1)]
      }
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      category: form.category,
      badge: (form.badge || null) as Product['badge'],
      stock: parseInt(form.stock),
      is_active: form.is_active,
      images,
    }

    let result
    if (product) {
      const { data } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
        .select()
        .single()
      result = data
    } else {
      const { data } = await supabase
        .from('products')
        .insert(payload)
        .select()
        .single()
      result = data
    }

    setLoading(false)
    if (result) onSaved(result as Product)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-body text-sm font-medium text-ink mb-5">
        {product ? 'Upraviť produkt' : 'Nový produkt'}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="col-span-2">
          <label className="block text-xs text-stone-light mb-1">Názov *</label>
          <input
            required
            value={form.name}
            onChange={set('name')}
            className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs text-stone-light mb-1">URL slug *</label>
          <input
            required
            value={form.slug}
            onChange={set('slug')}
            className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-stone-light mb-1">Kategória *</label>
          <select
            value={form.category}
            onChange={set('category')}
            className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CAT_LABELS[c]}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs text-stone-light mb-1">Cena (€) *</label>
          <input
            required
            type="number"
            step="0.01"
            value={form.price}
            onChange={set('price')}
            className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay"
          />
        </div>

        {/* Compare price */}
        <div>
          <label className="block text-xs text-stone-light mb-1">Pôvodná cena (€)</label>
          <input
            type="number"
            step="0.01"
            value={form.compare_price}
            onChange={set('compare_price')}
            className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs text-stone-light mb-1">Sklad</label>
          <input
            type="number"
            value={form.stock}
            onChange={set('stock')}
            className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay"
          />
        </div>

        {/* Badge */}
        <div>
          <label className="block text-xs text-stone-light mb-1">Badge</label>
          <select
            value={form.badge}
            onChange={set('badge')}
            className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay"
          >
            <option value="">Žiadny</option>
            <option value="sale">Zľava</option>
            <option value="new">Novinka</option>
            <option value="bio">Bio</option>
          </select>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-xs text-stone-light mb-1">Popis</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={set('description')}
            className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay resize-none"
          />
        </div>

        {/* Image */}
        <div className="col-span-2">
          <label className="block text-xs text-stone-light mb-1">Obrázok</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImgFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-stone"
          />
        </div>

        {/* Active */}
        <div className="col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 accent-clay"
            />
            <span className="text-sm text-stone">Aktívny (zobrazovať v obchode)</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-clay text-cream text-sm font-body px-6 py-2.5 rounded-full hover:bg-clay-light transition-colors disabled:opacity-60"
        >
          {loading ? 'Ukladám…' : 'Uložiť'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-stone hover:text-ink transition-colors px-4"
        >
          Zrušiť
        </button>
      </div>
    </form>
  )
}
