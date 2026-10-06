import CheckoutForm from '@/components/shop/CheckoutForm'
import type { Locale } from '@/types'

export const metadata = { title: 'Pokladňa' }

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  return (
    <div className="pt-16 min-h-screen bg-off">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl font-light text-ink mb-12">Pokladňa</h1>
        <CheckoutForm locale={locale} />
      </div>
    </div>
  )
}
