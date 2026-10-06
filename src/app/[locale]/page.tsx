import HeroSplit from '@/components/home/HeroSplit'
import TrustBar from '@/components/home/TrustBar'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import SportSection from '@/components/home/SportSection'
import ValuesSection from '@/components/home/ValuesSection'
import Newsletter from '@/components/home/Newsletter'
import type { Locale } from '@/types'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  return (
    <>
      <HeroSplit locale={locale} />
      <TrustBar />
      <CategoryGrid locale={locale} />
      <FeaturedProducts locale={locale} />
      <SportSection locale={locale} />
      <ValuesSection />
      <Newsletter />
    </>
  )
}
