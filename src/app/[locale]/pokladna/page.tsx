import CheckoutForm from '@/components/shop/CheckoutForm'
import { asLocale } from '@/lib/seo'
import type { Locale } from '@/types'

export const metadata = { title: 'Pokladňa' }

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  return (
    <div className="pt-20 min-h-screen bg-off">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-light text-ink mb-12">Pokladňa</h1>
        <CheckoutForm locale={locale} />
      </div>
    </div>
  )
}
