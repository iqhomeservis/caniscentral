import { createClient } from '@/lib/supabase/server'
import ShopGrid from '@/components/shop/ShopGrid'
import type { Locale } from '@/types'

export const metadata = {
  title: 'Obchod',
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ cat?: string; q?: string }>
}) {
  const { locale } = await params
  const { cat, q } = await searchParams

  const supabase = await createClient()
  let query = supabase.from('products').select('*').eq('is_active', true)

  if (cat) query = query.eq('category', cat)
  if (q) query = query.ilike('name', `%${q}%`)

  const { data: products } = await query.order('created_at', { ascending: false })

  return (
    <div className="pt-16">
      <div className="bg-clay-pale py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-stone-light">Prírodné produkty</span>
          <h1 className="font-display text-5xl font-light text-ink mt-1">Obchod</h1>
        </div>
      </div>
      <ShopGrid products={products ?? []} locale={locale} activeCategory={cat} />
    </div>
  )
}
