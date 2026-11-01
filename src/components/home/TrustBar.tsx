import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/types'

const ICONS = ['🏆', '🏅', '🧬', '🚚', '📍']

export default async function TrustBar({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'home' })
  const items = ICONS.map((icon, i) => ({ icon, label: t(`t${i + 1}`) }))

  return (
    <div className="bg-ink py-5 px-6 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 min-w-max md:min-w-0">
        {items.map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-body text-sand-deep tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
