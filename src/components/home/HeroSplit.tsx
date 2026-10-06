'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'

export default function HeroSplit({ locale }: { locale: Locale }) {
  const t = useTranslations('hero')
  const [hovered, setHovered] = useState<'sport' | 'shop' | null>(null)

  return (
    <section className="relative h-screen flex">
      {/* Sport panel */}
      <div
        className={`relative flex flex-col justify-end p-10 md:p-16 transition-all duration-700 ease-out overflow-hidden cursor-pointer ${
          hovered === 'shop' ? 'w-[35%]' : hovered === 'sport' ? 'w-[65%]' : 'w-1/2'
        }`}
        style={{ background: 'var(--sage-pale)' }}
        onMouseEnter={() => setHovered('sport')}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Blob bg */}
        <div
          className="blob absolute w-[60%] h-[60%] top-[10%] right-[-10%] opacity-30"
          style={{ background: 'var(--sage-light)' }}
        />

        {/* Floating badge */}
        <div className="float absolute top-24 left-10 bg-white/70 backdrop-blur-sm border border-sage rounded-full px-4 py-2 text-xs font-body text-stone z-10">
          🏆 Sezóna 2025
        </div>

        <div className="relative z-10">
          <span className="text-xs font-body uppercase tracking-widest text-sage-deep mb-3 block">
            {t('sport.eyebrow')}
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-light leading-none text-ink mb-4">
            {t('sport.title')}
            <br />
            <em className="text-sage-deep">{t('sport.titleAccent')}</em>
          </h1>
          <p className="font-body text-sm text-stone max-w-xs mb-8 leading-relaxed">
            {t('sport.subtitle')}
          </p>
          <Link
            href={`/${locale}/skola`}
            className="inline-flex items-center gap-2 bg-ink text-cream text-sm font-body px-6 py-3 rounded-full hover:bg-sage-deep transition-colors"
          >
            {t('sport.cta')}
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Shop panel */}
      <div
        className={`relative flex flex-col justify-end p-10 md:p-16 transition-all duration-700 ease-out overflow-hidden cursor-pointer ${
          hovered === 'sport' ? 'w-[35%]' : hovered === 'shop' ? 'w-[65%]' : 'w-1/2'
        }`}
        style={{ background: 'var(--clay-pale)' }}
        onMouseEnter={() => setHovered('shop')}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Blob bg */}
        <div
          className="blob absolute w-[60%] h-[60%] top-[15%] left-[-10%] opacity-30"
          style={{ background: 'var(--clay-light)' }}
        />

        {/* Floating pill */}
        <div className="float absolute top-32 right-10 bg-white/70 backdrop-blur-sm border border-clay rounded-full px-4 py-2 text-xs font-body text-stone z-10">
          🌿 Prírodné zloženie
        </div>

        <div className="relative z-10">
          <span className="text-xs font-body uppercase tracking-widest text-clay mb-3 block">
            {t('shop.eyebrow')}
          </span>
          <h2 className="font-display text-5xl md:text-7xl font-light leading-none text-ink mb-4">
            {t('shop.title')}
            <br />
            <em className="text-clay">{t('shop.titleAccent')}</em>
          </h2>
          <p className="font-body text-sm text-stone max-w-xs mb-8 leading-relaxed">
            {t('shop.subtitle')}
          </p>
          <Link
            href={`/${locale}/obchod`}
            className="inline-flex items-center gap-2 bg-clay text-cream text-sm font-body px-6 py-3 rounded-full hover:bg-clay-light transition-colors"
          >
            {t('shop.cta')}
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-light">
        <span className="text-xs font-body uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-stone-light/40 animate-pulse" />
      </div>
    </section>
  )
}
