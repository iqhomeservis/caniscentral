import Link from 'next/link'
import type { Locale } from '@/types'

const CATEGORIES = [
  {
    key: 'food',
    label: 'Krmivá',
    emoji: '🥩',
    color: 'from-sage-pale to-sage-light',
    href: '/obchod?cat=food',
  },
  {
    key: 'supplements',
    label: 'Doplnky',
    emoji: '💊',
    color: 'from-clay-pale to-clay-light',
    href: '/obchod?cat=supplements',
  },
  {
    key: 'care',
    label: 'Starostlivosť',
    emoji: '🛁',
    color: 'from-sand-light to-sand',
    href: '/obchod?cat=care',
  },
  {
    key: 'accessories',
    label: 'Príslušenstvo',
    emoji: '🎾',
    color: 'from-[#e8e0f0] to-[#d8c8e8]',
    href: '/obchod?cat=accessories',
  },
]

export default function CategoryGrid({ locale }: { locale: Locale }) {
  return (
    <section className="py-20 px-6 bg-off">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 reveal">
          <span className="text-xs uppercase tracking-widest text-stone-light">Kategórie</span>
          <h2 className="font-display text-4xl font-light text-ink mt-1">
            Nájdite čo hľadáte
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(({ key, label, emoji, color, href }, i) => (
            <Link
              key={key}
              href={`/${locale}${href}`}
              className={`group reveal bg-gradient-to-br ${color} rounded-2xl p-6 aspect-square flex flex-col justify-between hover:shadow-lg transition-shadow`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="text-4xl">{emoji}</span>
              <div>
                <span className="font-body text-sm font-medium text-ink">{label}</span>
                <div className="mt-1 text-xs text-stone opacity-0 group-hover:opacity-100 transition-opacity">
                  Zobraziť →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
