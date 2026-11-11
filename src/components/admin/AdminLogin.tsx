'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Locale } from '@/types'

/**
 * Prihlásenie do správy šesťmiestnym kódom.
 *
 * PREČO NIE ODKAZOM:
 * Pôvodne chodil v e-maile prihlasovací odkaz. Lenže Gmail (a ďalší
 * poskytovatelia) si odkazy v správach sami otvárajú kvôli bezpečnostnej
 * kontrole — a tým jednorazový token spotrebujú skôr, než naň klikne
 * človek. Prihlásenie potom zlyhá s hláškou "Email link is invalid or has
 * expired", hoci odkaz bol čerstvý. Overené v praxi 11. 11. 2026.
 *
 * Kód sa "kliknúť" nedá, takže ho skener nespotrebuje. Používateľ ho opíše
 * ručne. Je to o jeden krok navyše, zato to funguje spoľahlivo.
 *
 * POZOR: e-mailová šablóna v Supabase (Authentication → Emails → Magic Link)
 * musí obsahovať {{ .Token }} a NESMIE obsahovať {{ .ConfirmationURL }}.
 * Odkaz aj kód sú ten istý token — keby bol v správe aj odkaz, skener by ho
 * otvoril a zneplatnil by tým aj kód.
 */
export default function AdminLogin({ locale }: { locale: Locale }) {
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Staršie pokusy o prihlásenie odkazom vracajú dôvod zlyhania v adrese.
  // Bez tohto by používateľ videl len prázdny formulár a nevedel prečo.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const reason = params.get('error_code') ?? hash.get('error_code') ?? params.get('error')
    if (!reason) return
    setError('Prihlásenie sa nepodarilo. Vyžiadajte si nový kód.')
    window.history.replaceState({}, '', window.location.pathname)
  }, [])

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    // Žiadne emailRedirectTo — nechceme odkaz, chceme kód.
    // shouldCreateUser: false znamená, že sa cez tento formulár nedá založiť
    // nový účet. Kto nie je v databáze, dostane chybu namiesto e-mailu.
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: false },
    })

    setLoading(false)
    if (err) {
      setError(
        err.message.toLowerCase().includes('rate')
          ? 'Priveľa pokusov. Skúste to o chvíľu znova.'
          : 'Kód sa nepodarilo odoslať. Skontrolujte adresu a skúste znova.'
      )
      return
    }
    setStep('code')
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: 'email',
    })

    if (err) {
      setLoading(false)
      setError('Kód nesedí alebo už vypršal. Skúste ho opísať znova.')
      return
    }

    // Prihlásenie prebehlo v prehliadači, ale stránku správy vykresľuje
    // server. Preto celé načítanie znova — server si až tak všimne reláciu.
    window.location.href = `/${locale}/admin`
  }

  return (
    <div className="pt-20 min-h-screen bg-off flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="font-display text-2xl font-light text-ink mb-1">
            Canis<span className="italic text-clay">Central</span>
          </div>
          <p className="text-sm text-stone">Správa e-shopu</p>
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3 mb-4">{error}</p>
        )}

        {step === 'email' ? (
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs text-stone-light mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clay text-cream text-sm font-body py-3.5 rounded-full hover:bg-clay-light transition-colors disabled:opacity-60"
            >
              {loading ? 'Odosielam…' : 'Poslať kód'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="space-y-4">
            <p className="text-sm text-stone text-center mb-2">
              Kód sme poslali na <span className="text-ink">{email}</span>. Opíšte ho nižšie.
            </p>
            <div>
              <label htmlFor="code" className="block text-xs text-stone-light mb-1">
                Kód z e-mailu
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-off border border-sand rounded-xl px-4 py-3 text-center text-lg tracking-[0.4em] text-ink focus:outline-none focus:border-clay transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-clay text-cream text-sm font-body py-3.5 rounded-full hover:bg-clay-light transition-colors disabled:opacity-60"
            >
              {loading ? 'Overujem…' : 'Prihlásiť sa'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email')
                setCode('')
                setError(null)
              }}
              className="w-full text-xs text-stone hover:text-ink transition-colors"
            >
              Použiť inú adresu
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
