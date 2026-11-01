'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export default function Newsletter() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      setState(res.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  return (
    <section className="bg-ink py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-xs uppercase tracking-widest text-stone-light mb-3 block reveal">
          {t('newsEyebrow')}
        </span>
        <h2 className="font-display text-4xl font-light text-[#fdfcfa] mb-4 reveal">
          {t('newsTitle')} <em className="text-clay">{t('newsTitleAccent')}</em>
        </h2>
        <p className="font-body text-sm text-stone-light mb-8 reveal">{t('newsText')}</p>

        {state === 'sent' ? (
          <p className="font-body text-clay text-sm reveal">{t('newsThanks')}</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2 reveal">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsPlaceholder')}
                className="flex-1 min-w-0 bg-white/10 border border-stone/40 rounded-full px-5 py-3 text-sm text-[#fdfcfa] placeholder:text-stone-light focus:outline-none focus:border-clay transition-colors"
              />
              <button
                type="submit"
                disabled={state === 'sending'}
                className="bg-clay text-cream text-sm font-body px-6 py-3 rounded-full hover:bg-clay-light transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {t('newsButton')}
              </button>
            </form>
            {state === 'error' && (
              <p className="font-body text-xs text-clay mt-3">{t('newsError')}</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
