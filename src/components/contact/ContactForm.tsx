'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Send, Check, AlertCircle } from 'lucide-react'
import type { Locale } from '@/types'

const TOPICS = ['hotel', 'skola', 'salon', 'chov', 'obchod', 'ine'] as const
type Topic = (typeof TOPICS)[number]

const TOPIC_KEY: Record<Topic, string> = {
  hotel: 'topicHotel',
  skola: 'topicSkola',
  salon: 'topicSalon',
  chov: 'topicChov',
  obchod: 'topicObchod',
  ine: 'topicIne',
}

const FIELD =
  'w-full bg-white border border-sand rounded-2xl px-4 py-3 text-sm text-ink ' +
  'placeholder:text-stone-light focus:outline-none focus:border-clay transition-colors'

const LABEL = 'block text-xs uppercase tracking-wider text-stone-light mb-1.5'

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations('contact')
  const tFooter = useTranslations('footer')
  const params = useSearchParams()

  // Z ktorej sekcie návštevník prišiel. Keď si tému nevyberie sám,
  // nech ju nemusí hľadať — prišiel z konkrétnej stránky s konkrétnou otázkou.
  const fromUrl = params.get('tema')
  const initialTopic: Topic = TOPICS.includes(fromUrl as Topic) ? (fromUrl as Topic) : 'ine'

  const [topic, setTopic] = useState<Topic>(initialTopic)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [web, setWeb] = useState('') // pasca na roboty
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) return setError(t('errorName'))
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError(t('errorEmail'))
    if (message.trim().length < 10) return setError(t('errorMessage'))

    setState('sending')
    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, topic, message, locale, web }),
      })
      if (res.ok) {
        setState('done')
        return
      }
      const body = await res.json().catch(() => ({}))
      setError(body?.error === 'rate_limited' ? t('errorRateLimit') : t('errorGeneric'))
    } catch {
      setError(t('errorGeneric'))
    }
    setState('idle')
  }

  if (state === 'done') {
    return (
      <div className="bg-sage-pale border border-sage/40 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
          <Check size={22} className="text-sage-deep" />
        </div>
        <h2 className="font-display text-2xl font-light text-ink mb-2">{t('successTitle')}</h2>
        <p className="text-sm text-stone leading-relaxed max-w-md mx-auto mb-6">{t('successText')}</p>
        <button
          onClick={() => {
            setName(''); setEmail(''); setPhone(''); setMessage('')
            setTopic(initialTopic); setState('idle')
          }}
          className="text-sm text-clay hover:text-ink transition-colors underline underline-offset-4"
        >
          {t('successAgain')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="k-meno" className={LABEL}>{t('labelName')}</label>
          <input
            id="k-meno" name="name" value={name} onChange={(e) => setName(e.target.value)}
            autoComplete="name" maxLength={100} required className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="k-email" className={LABEL}>{t('labelEmail')}</label>
          <input
            id="k-email" name="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" maxLength={200} required className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="k-tel" className={LABEL}>{t('labelPhone')}</label>
          <input
            id="k-tel" name="phone" type="tel" value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel" maxLength={50} className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="k-tema" className={LABEL}>{t('labelTopic')}</label>
          <select
            id="k-tema" name="topic" value={topic}
            onChange={(e) => setTopic(e.target.value as Topic)}
            className={`${FIELD} cursor-pointer`}
          >
            {TOPICS.map((key) => (
              <option key={key} value={key}>{t(TOPIC_KEY[key])}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="k-sprava" className={LABEL}>{t('labelMessage')}</label>
        <textarea
          id="k-sprava" name="message" value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6} maxLength={4000} required
          placeholder={t('placeholderMessage')}
          className={`${FIELD} resize-y`}
        />
      </div>

      {/* Pasca na roboty. Pre človeka neviditeľná, čítačky ju preskočia. */}
      <div aria-hidden="true" className="absolute w-px h-px -left-[9999px] overflow-hidden">
        <label htmlFor="k-web">Nevypĺňajte</label>
        <input id="k-web" name="web" tabIndex={-1} autoComplete="off"
          value={web} onChange={(e) => setWeb(e.target.value)} />
      </div>

      {error && (
        <div className="flex items-start gap-2.5 text-sm text-[#aa3a3a] bg-[#f9ebe6] border border-[#aa3a3a]/20 rounded-2xl px-4 py-3">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-ink text-cream px-7 py-3.5 rounded-full text-sm hover:bg-clay transition-colors disabled:opacity-60"
        >
          <Send size={15} /> {state === 'sending' ? t('sending') : t('submit')}
        </button>
        <p className="text-xs text-stone-light leading-relaxed">
          {t('privacyNote')}{' '}
          <Link
            href={`/${locale}/ochrana-osobnych-udajov`}
            className="underline underline-offset-2 hover:text-ink transition-colors"
          >
            {tFooter('privacy')}
          </Link>
          .
        </p>
      </div>
    </form>
  )
}
