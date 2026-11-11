import { Trophy, Calendar, ChevronRight, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { pageMetadata, asLocale } from '@/lib/seo'
import type { Locale } from '@/types'
import EmailLink from '@/components/ui/EmailLink'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'skola' })
  return pageMetadata({
    locale,
    path: '/skola',
    title: t('metaTitle'),
    description: t('metaDescription'),
    ogTitle: t('ogTitle'),
    ogDescription: t('ogDescription'),
  })
}

export default async function SkolaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'skola' })

  const courses = [
    { tag: t('tagCourses'), title: t('c1Title'), desc: t('c1Desc'), meta: t('c1Meta'), color: 'sage' },
    { tag: t('tagCourses'), title: t('c2Title'), desc: t('c2Desc'), meta: t('c2Meta'), color: 'clay' },
    { tag: t('tagIndividual'), title: t('c3Title'), desc: t('c3Desc'), meta: t('c3Meta'), color: 'sage' },
    { tag: t('tagIndividual'), title: t('c4Title'), desc: t('c4Desc'), meta: t('c4Meta'), color: 'clay' },
  ]

  const programs = [
    {
      tag: t('pr1Tag'),
      title: t('pr1Title'),
      lead: t('pr1Lead'),
      body: t('pr1Body'),
      points: [t('pr1P1'), t('pr1P2'), t('pr1P3'), t('pr1P4')],
      note: t('pr1Note'),
    },
    {
      tag: t('pr2Tag'),
      title: t('pr2Title'),
      lead: t('pr2Lead'),
      body: t('pr2Body'),
      points: [t('pr2P1'), t('pr2P2'), t('pr2P3'), t('pr2P4')],
      note: t('pr2Note'),
    },
  ]

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-clay-pale py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-80 h-80 bottom-[-2rem] left-[-4rem] opacity-20" style={{ background: 'var(--clay-light)' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-clay">{t('eyebrow')}</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            {t('title')}
            <br />
            <em className="text-clay">{t('titleAccent')}</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">{t('intro')}</p>
        </div>
      </section>

      {/* Courses */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-3">{t('coursesTitle')}</h2>
        <p className="text-stone text-sm text-center max-w-xl mx-auto mb-12">{t('coursesNote')}</p>
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map(({ tag, title, desc, meta, color }) => (
            <div key={title} className="bg-white border border-sand rounded-2xl p-8 flex flex-col gap-4">
              <span className={`self-start text-xs uppercase tracking-widest font-medium px-3 py-1 rounded-full ${color === 'sage' ? 'bg-sage-pale text-sage-deep' : 'bg-clay-pale text-clay'}`}>
                {tag}
              </span>
              <h3 className="font-display text-xl font-light text-ink">{title}</h3>
              <p className="text-stone text-sm leading-relaxed flex-1">{desc}</p>
              <div className="flex items-center gap-2 text-xs text-stone-light pt-4 border-t border-sand">
                <Calendar size={13} /> {meta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Intensive programmes */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-12">{t('programsTitle')}</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {programs.map(({ tag, title, lead, body, points, note }) => (
              <div key={tag} className="bg-white border border-sand rounded-2xl p-8 flex flex-col gap-4">
                <span className="self-start text-xs uppercase tracking-widest font-medium px-3 py-1 rounded-full bg-ink text-cream">
                  {tag}
                </span>
                <h3 className="font-display text-2xl font-light text-ink">{title}</h3>
                <p className="text-ink text-sm font-medium leading-relaxed">{lead}</p>
                <p className="text-stone text-sm leading-relaxed">{body}</p>
                <ul className="flex flex-col gap-2 mt-1">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-stone">
                      <ChevronRight size={15} className="text-clay flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-stone text-xs leading-relaxed bg-sand/40 rounded-xl p-4 mt-auto">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-cream py-20 px-6 text-center">
        <Trophy size={32} className="mx-auto mb-4 text-clay" />
        <h2 className="font-display text-3xl font-light mb-4">{t('ctaTitle')}</h2>
        <p className="text-cream/70 mb-8 max-w-md mx-auto text-sm">{t('ctaText')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+421908267278"
            className="inline-flex items-center justify-center gap-2 bg-clay text-white px-8 py-4 rounded-full text-sm hover:bg-clay/80 transition-colors"
          >
            <Phone size={16} /> +421 908 267 278
          </a>
          <EmailLink
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-cream px-8 py-4 rounded-full text-sm hover:bg-white/20 transition-colors"
          >
            {t('ctaEmail')} <ChevronRight size={16} />
          </EmailLink>
        </div>
      </section>
    </main>
  )
}
