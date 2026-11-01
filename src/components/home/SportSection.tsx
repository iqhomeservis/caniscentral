import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/types'

export default async function SportSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' })

  const courses = [
    { num: '01', title: t('sportC1'), desc: t('sportC1Desc') },
    { num: '02', title: t('sportC2'), desc: t('sportC2Desc') },
    { num: '03', title: t('sportC3'), desc: t('sportC3Desc') },
    { num: '04', title: t('sportC4'), desc: t('sportC4Desc') },
  ]

  const features = [
    { icon: '🎯', label: t('sportF1') },
    { icon: '⚖️', label: t('sportF2') },
    { icon: '🐾', label: t('sportF3') },
    { icon: '🏠', label: t('sportF4') },
  ]

  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: 'var(--sage-pale)' }}>
      <div className="blob absolute w-96 h-96 -right-20 -top-20 opacity-20" style={{ background: 'var(--sage-light)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <span className="text-xs uppercase tracking-widest text-sage-deep mb-3 block reveal">
              {t('sportEyebrow')}
            </span>
            <h2 className="font-display text-5xl font-light text-ink mb-6 reveal">
              {t('sportTitle')}{' '}
              <em className="text-sage-deep">{t('sportTitleAccent')}</em>
              <br />
              {t('sportTitleEnd')}
            </h2>
            <p className="font-body text-sm text-stone leading-relaxed mb-8 reveal max-w-md">
              {t('sportIntro')}
            </p>

            <div className="grid grid-cols-2 gap-3 reveal">
              {features.map(({ icon, label }) => (
                <div key={label} className="glass rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <span className="font-body text-xs text-stone">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/skola`}
              className="mt-8 inline-flex items-center gap-2 bg-sage-deep text-cream text-sm font-body px-6 py-3 rounded-full hover:bg-sage transition-colors reveal"
            >
              {t('sportCta')}
            </Link>
          </div>

          {/* Right — numbered course cards */}
          <div className="flex flex-col gap-4">
            {courses.map(({ num, title, desc }, i) => (
              <div
                key={num}
                className="reveal bg-white/60 border border-sage-light/50 rounded-2xl p-5 flex gap-4 hover:bg-white/80 transition-colors"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="font-display text-4xl font-light text-sage-light leading-none">
                  {num}
                </span>
                <div>
                  <h3 className="font-body text-sm font-medium text-ink mb-1">{title}</h3>
                  <p className="font-body text-xs text-stone">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
