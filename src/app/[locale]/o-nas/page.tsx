import { Heart, Shield, Award, Microscope, MapPin, Phone, Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { pageMetadata, asLocale } from '@/lib/seo'
import type { Locale } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'about' })
  return pageMetadata({
    locale,
    path: '/o-nas',
    title: t('metaTitle'),
    description: t('metaDescription'),
    ogTitle: t('ogTitle'),
    ogDescription: t('ogDescription'),
  })
}

const MILESTONE_YEARS = ['1984', '1991', '2005', '2024'] as const

export default async function ONasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'about' })

  const milestones = MILESTONE_YEARS.map((year, i) => ({ year, text: t(`m${i + 1}`) }))

  const values = [
    { icon: Heart, title: t('v1Title'), desc: t('v1Desc') },
    { icon: Shield, title: t('v2Title'), desc: t('v2Desc') },
    { icon: Microscope, title: t('v3Title'), desc: t('v3Desc') },
    { icon: Award, title: t('v4Title'), desc: t('v4Desc') },
  ]

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-[#f5f2ee] py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-96 h-96 bottom-[-4rem] right-[-4rem] opacity-10" style={{ background: '#c8b89a' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-stone-light">{t('eyebrow')}</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-6 leading-tight">
            {t('title')}
            <br />
            <em className="text-clay">{t('titleAccent')}</em>
          </h1>
          <p className="text-stone text-lg leading-relaxed max-w-2xl">{t('intro')}</p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="max-w-none space-y-6 text-stone leading-relaxed">
          <p>{t('story1')}</p>
          <p>{t('story2')}</p>
          <p>{t('story3')}</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-14">{t('timelineTitle')}</h2>
          <div className="relative">
            <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-sand hidden md:block" />
            <div className="flex flex-col gap-10">
              {milestones.map(({ year, text }) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="font-display text-2xl font-light text-clay">{year}</span>
                  </div>
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-clay mt-2 hidden md:block" />
                  <p className="text-stone text-sm leading-relaxed flex-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-12">{t('valuesTitle')}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#f5f2ee] flex items-center justify-center">
                <Icon size={20} className="text-clay" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-stone text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vet partner */}
      <section className="bg-ink text-cream py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Microscope size={28} className="mx-auto mb-4 text-clay" />
          <h2 className="font-display text-3xl font-light mb-4">{t('vetTitle')}</h2>
          <p className="text-cream/70 leading-relaxed mb-6">{t('vetText')}</p>
          <p className="text-cream/50 text-sm">{t('vetNote')}</p>
          <p className="mt-8 text-clay font-display text-lg font-light italic">{t('vetQuote')}</p>
          <p className="text-stone text-xs mt-2">{t('vetAuthor')}</p>
        </div>
      </section>

      {/* Contact card */}
      <section className="max-w-2xl mx-auto py-20 px-6 text-center">
        <h2 className="font-display text-3xl font-light text-ink mb-8">{t('contactTitle')}</h2>
        <div className="bg-white border border-sand rounded-2xl p-8 text-left space-y-4">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-clay flex-shrink-0" />
            <div>
              <span className="text-stone text-sm block">S. Chalupku 1789/34, 052 01 Spišská Nová Ves</span>
              <span className="text-stone-light text-xs">{t('contactServices')}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-clay flex-shrink-0" />
            <a href="tel:+421908267278" className="text-stone text-sm hover:text-ink transition-colors">
              +421 908 267 278
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-clay flex-shrink-0" />
            <a href="mailto:canisdogsport@gmail.com" className="text-stone text-sm hover:text-ink transition-colors">
              canisdogsport@gmail.com
            </a>
          </div>
        </div>
        <p className="text-xs text-stone-light mt-6">{t('contactNote')}</p>
      </section>
    </main>
  )
}
