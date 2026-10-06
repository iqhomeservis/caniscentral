import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/shop/ProductCard'
import Link from 'next/link'
import type { Locale, Product } from '@/types'

export default async function FeaturedProducts({ locale }: { locale: Locale }) {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .limit(4)
    .order('created_at', { ascending: false })

  if (!products?.length) return null

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-light">Obchod</span>
            <h2 className="font-display text-4xl font-light text-ink mt-1">
              Novinky a bestsellery
            </h2>
          </div>
          <Link
            href={`/${locale}/obchod`}
            className="text-sm text-clay hover:text-clay-light transition-colors"
          >
            Zobraziť všetky →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {(products as Product[]).map((product, i) => (
            <div key={product.id} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <ProductCard product={product} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
