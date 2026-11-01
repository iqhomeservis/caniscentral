import { Heart, Shield, Award, BookOpen, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { pageMetadata, asLocale } from '@/lib/seo'
import type { Locale } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'chov' })
  return pageMetadata({
    locale,
    path: '/chov',
    title: t('metaTitle'),
    description: t('metaDescription'),
    ogTitle: t('ogTitle'),
    ogDescription: t('ogDescription'),
  })
}

export default async function ChovPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'chov' })

  const values = [
    { icon: Heart, title: t('v1Title'), desc: t('v1Desc') },
    { icon: Shield, title: t('v2Title'), desc: t('v2Desc') },
    { icon: Award, title: t('v3Title'), desc: t('v3Desc') },
    { icon: BookOpen, title: t('v4Title'), desc: t('v4Desc') },
  ]

  const faq = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
  ]

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-[#f0f4f8] py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-80 h-80 top-0 right-[-3rem] opacity-15" style={{ background: '#c8d8e8' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-stone">{t('eyebrow')}</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            {t('title')}
            <br />
            <em className="text-stone">{t('titleAccent')}</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">{t('intro')}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href="tel:+421908267278"
              className="inline-flex items-center justify-center gap-2 bg-ink text-cream px-7 py-3 rounded-full text-sm hover:opacity-80 transition-opacity"
            >
              <Phone size={16} /> +421 908 267 278
            </a>
            <a
              href="mailto:canisdogsport@gmail.com"
              className="inline-flex items-center justify-center gap-2 border border-stone/30 text-stone px-7 py-3 rounded-full text-sm hover:border-stone transition-colors"
            >
              {t('ctaWaitlist')}
            </a>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-12">{t('valuesTitle')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center bg-[#f0f4f8]">
                <Icon size={22} className="text-stone" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{title}</h3>
              <p className="text-stone text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current litter */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-stone-light">{t('litterEyebrow')}</span>
          <h2 className="font-display text-3xl font-light text-ink mt-2 mb-6">{t('litterTitle')}</h2>
          <div className="bg-white border border-sand rounded-2xl p-10 text-stone">
            <Heart size={32} className="mx-auto mb-4 text-clay opacity-40" />
            <p className="text-sm leading-relaxed">{t('litterText')}</p>
            <a
              href="mailto:canisdogsport@gmail.com"
              className="inline-block mt-6 bg-clay text-white px-6 py-3 rounded-full text-sm hover:bg-clay/80 transition-colors"
            >
              {t('litterButton')}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-10">{t('faqTitle')}</h2>
        <div className="flex flex-col gap-4">
          {faq.map(({ q, a }) => (
            <div key={q} className="bg-white border border-sand rounded-2xl p-6">
              <h3 className="font-semibold text-ink mb-2">{q}</h3>
              <p className="text-stone text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
