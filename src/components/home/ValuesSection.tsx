import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/types'

export default async function ValuesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' })
  const VALUES = [
    { icon: '🌿', title: t('val1'), desc: t('val1Desc') },
    { icon: '🔬', title: t('val2'), desc: t('val2Desc') },
    { icon: '🏆', title: t('val3'), desc: t('val3Desc') },
  ]
  return (
    <section className="py-20 px-6 bg-off">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-xs uppercase tracking-widest text-stone-light">{t('valuesEyebrow')}</span>
          <h2 className="font-display text-4xl font-light text-ink mt-1">
            {t('valuesTitle')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sand">
          {VALUES.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="reveal bg-off p-8 text-center"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-body text-base font-medium text-ink mb-2">{title}</h3>
              <p className="font-body text-sm text-stone leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
