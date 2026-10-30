import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import HeroSplit from '@/components/home/HeroSplit'
import TrustBar from '@/components/home/TrustBar'
import CategoryGrid from '@/components/home/CategoryGrid'
import LongevitySection from '@/components/home/LongevitySection'
import SportSection from '@/components/home/SportSection'
import StorySection from '@/components/home/StorySection'
import ValuesSection from '@/components/home/ValuesSection'
import Newsletter from '@/components/home/Newsletter'
import type { Locale } from '@/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  noStore()
  const { locale } = await params

  // Fetch active products for the Longevity section
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, price, compare_price, images, description, badge, stock')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(6)

  if (error) {
    console.error('[home] products query failed:', error.message)
  }

  return (
    <>
      <HeroSplit locale={locale} />
      <TrustBar />
      <LongevitySection locale={locale} products={products ?? []} />
      <CategoryGrid locale={locale} />
      <SportSection locale={locale} />
      <StorySection locale={locale} />
      <ValuesSection />
      <Newsletter />
    </>
  )
}
