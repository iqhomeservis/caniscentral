import { Scissors, Sparkles, Clock, Star, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { pageMetadata, asLocale } from '@/lib/seo'
import type { Locale } from '@/types'
import EmailLink from '@/components/ui/EmailLink'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'salon' })
  return pageMetadata({
    locale,
    path: '/salon',
    title: t('metaTitle'),
    description: t('metaDescription'),
    ogTitle: t('ogTitle'),
    ogDescription: t('ogDescription'),
  })
}

const SERVICES = [
  { key: 's1', small: '25 – 45 €', large: '46 – 80 €' },
  { key: 's2', small: '20 – 30 €', large: '35 – 70 €' },
  { key: 's3', small: '3 €', large: '5 €' },
  { key: 's4', small: '5 €', large: '8 €' },
  { key: 's5', small: '1,50 €', large: '1,50 €' },
] as const

const ACCENT = '#9b7bb8'

export default async function SalonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'salon' })

  const why = [
    { icon: Star, title: t('w1Title'), desc: t('w1Desc') },
    { icon: Sparkles, title: t('w2Title'), desc: t('w2Desc') },
    { icon: Clock, title: t('w3Title'), desc: t('w3Desc') },
  ]

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-[#f5f0f8] py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-72 h-72 top-[-2rem] right-0 opacity-20" style={{ background: '#e8d5f0' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>{t('eyebrow')}</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            {t('title')}
            <br />
            <em style={{ color: ACCENT }}>{t('titleAccent')}</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">{t('intro')}</p>
        </div>
      </section>

      {/* Price list */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-10">{t('pricesTitle')}</h2>
        <div className="max-w-3xl mx-auto bg-white border border-sand rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 md:gap-4 px-4 md:px-6 py-3 text-[10px] md:text-xs uppercase tracking-wide md:tracking-widest text-stone-light font-medium leading-tight" style={{ background: '#f5f0f8' }}>
            <span className="self-end">{t('colService')}</span>
            <span className="w-[72px] md:w-28 text-center">{t('colSmall')}</span>
            <span className="w-[72px] md:w-28 text-center">{t('colLarge')}</span>
          </div>
          {SERVICES.map(({ key, small, large }) => (
            <div key={key} className="grid grid-cols-[1fr_auto_auto] gap-2 md:gap-4 px-4 md:px-6 py-4 border-b border-sand/50 last:border-0 items-center">
              <span className="text-sm text-ink pr-2">{t(key)}</span>
              <span className="w-[72px] md:w-28 text-center text-sm font-semibold" style={{ color: ACCENT }}>{small}</span>
              <span className="w-[72px] md:w-28 text-center text-sm font-semibold" style={{ color: ACCENT }}>{large}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-light text-center mt-6 max-w-xl mx-auto">{t('pricesNote')}</p>
      </section>

      {/* Why us */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-10">{t('whyTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {why.map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#f5f0f8' }}>
                  <Icon size={20} style={{ color: ACCENT }} />
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-stone text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center border-t border-sand">
        <h2 className="font-display text-3xl font-light text-ink mb-4">{t('ctaTitle')}</h2>
        <p className="text-stone mb-8 max-w-lg mx-auto">{t('ctaText')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+421949128820"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: ACCENT }}
          >
            <Phone size={16} /> +421 949 128 820
          </a>
          <EmailLink
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm border border-stone/30 text-stone hover:border-stone transition-colors"
          >
            <Scissors size={16} /> {t('ctaEmail')}
          </EmailLink>
        </div>
      </section>
    </main>
  )
}
