import { Bed, Clock, Star, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { pageMetadata, asLocale } from '@/lib/seo'
import type { Locale } from '@/types'
import EmailLink from '@/components/ui/EmailLink'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'hotel' })
  return pageMetadata({
    locale,
    path: '/hotel',
    title: t('metaTitle'),
    description: t('metaDescription'),
    ogTitle: t('ogTitle'),
    ogDescription: t('ogDescription'),
  })
}

// Ceny sú rovnaké vo všetkých jazykoch, menia sa len popisy.
const PRICES = [
  { key: 'p1', small: '20 €', large: '25 €' },
  { key: 'p2', small: '19 €', large: '24 €' },
  { key: 'p3', small: '25 €', large: '30 €' },
  { key: 'p4', small: '16 €', large: '20 €' },
] as const

export default async function HotelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'hotel' })

  const features = [
    { icon: Bed, title: t('f1Title'), desc: t('f1Desc') },
    { icon: Clock, title: t('f2Title'), desc: t('f2Desc') },
    { icon: Star, title: t('f3Title'), desc: t('f3Desc') },
    { icon: Phone, title: t('f4Title'), desc: t('f4Desc') },
  ]

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-sage-pale py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-96 h-96 top-[-4rem] right-[-4rem] opacity-20" style={{ background: 'var(--sage-light)' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-sage-deep">{t('eyebrow')}</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            {t('title')}
            <br />
            <em className="text-sage-deep">{t('titleAccent')}</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">{t('intro')}</p>
          <a
            href="tel:+421908267278"
            className="inline-flex items-center gap-2 mt-8 bg-ink text-cream px-7 py-3 rounded-full text-sm hover:bg-sage-deep transition-colors"
          >
            <Phone size={16} /> {t('cta')}
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-12">{t('featuresTitle')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-sand rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-sage-pale flex items-center justify-center mb-4">
                <Icon size={18} className="text-sage-deep" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{title}</h3>
              <p className="text-stone text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-3">{t('pricesTitle')}</h2>
          <p className="text-stone text-sm text-center mb-10">{t('pricesNote')}</p>
          <div className="bg-white rounded-2xl border border-sand overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 md:gap-4 bg-clay-pale px-4 md:px-6 py-3 text-[10px] md:text-xs uppercase tracking-wide md:tracking-widest text-stone-light font-medium leading-tight">
              <span className="self-end">{t('colService')}</span>
              <span className="w-16 md:w-24 text-center">{t('colSmall')}</span>
              <span className="w-16 md:w-24 text-center">{t('colLarge')}</span>
            </div>
            {PRICES.map(({ key, small, large }) => (
              <div key={key} className="grid grid-cols-[1fr_auto_auto] gap-2 md:gap-4 px-4 md:px-6 py-4 border-b border-sand/50 last:border-0 items-center">
                <span className="text-sm text-ink pr-2">{t(key)}</span>
                <span className="w-16 md:w-24 text-center text-sm font-semibold text-clay">{small}</span>
                <span className="w-16 md:w-24 text-center text-sm font-semibold text-clay">{large}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-clay-pale/60 border border-sand rounded-2xl px-6 py-4">
            <p className="text-sm text-ink font-medium mb-1">{t('weekendTitle')}</p>
            <p className="text-stone text-sm leading-relaxed">{t('weekendText')}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="font-display text-3xl font-light text-ink mb-4">{t('ctaTitle')}</h2>
        <p className="text-stone mb-8">{t('ctaText')}</p>
        <EmailLink
          className="inline-flex items-center gap-2 bg-clay text-white px-8 py-4 rounded-full text-sm hover:bg-clay/80 transition-colors"
        >
          {t('ctaButton')}
        </EmailLink>
      </section>
    </main>
  )
}
