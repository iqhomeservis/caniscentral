import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { pageMetadata, asLocale } from '@/lib/seo'
import ShopGrid from '@/components/shop/ShopGrid'
import type { Locale } from '@/types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'shop' })
  return pageMetadata({
    locale,
    path: '/obchod',
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ cat?: string; q?: string }>
}) {
  noStore()
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const { cat, q } = await searchParams
  const tShop = await getTranslations({ locale, namespace: 'shop' })

  const supabase = await createClient()
  let query = supabase.from('products').select('*').eq('is_active', true)

  if (cat) query = query.eq('category', cat)
  if (q) query = query.ilike('name', `%${q}%`)

  const { data: products } = await query.order('created_at', { ascending: false })

  return (
    <div className="pt-20">
      <div className="bg-clay-pale py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-stone-light">{tShop('eyebrow')}</span>
          <h1 className="font-display text-5xl font-light text-ink mt-1">{tShop('title')}</h1>
        </div>
      </div>
      <ShopGrid products={products ?? []} locale={locale} activeCategory={cat} />
    </div>
  )
}
