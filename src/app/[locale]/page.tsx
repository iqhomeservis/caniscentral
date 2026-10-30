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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  // Fetch active products for the Longevity section
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, price, compare_price, images, description, badge_text, stock_quantity')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(6)

  return (
    <>
      <HeroSplit locale={locale} />
      <TrustBar />
      <CategoryGrid locale={locale} />
      <LongevitySection locale={locale} products={products ?? []} />
      <SportSection locale={locale} />
      <StorySection locale={locale} />
      <ValuesSection />
      <Newsletter />
    </>
  )
}
