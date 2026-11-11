'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Locale } from '@/types'

export default function AdminLogin({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Keď prihlásenie zlyhá, Supabase aj náš callback vrátia dôvod v adrese.
  // Bez tohto by používateľ videl len prázdny formulár a nevedel prečo.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const code = params.get('error_code') ?? hash.get('error_code') ?? params.get('error')

    if (!code) return
    setError(
      code === 'otp_expired'
        ? 'Prihlasovací odkaz už neplatí. Nechajte si poslať nový — každý odkaz platí len raz.'
        : 'Prihlásenie sa nepodarilo. Nechajte si poslať nový odkaz.'
    )
    // Dôvod z adresy odstránime, nech po novom pokuse nestraší.
    window.history.replaceState({}, '', window.location.pathname)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    // Odkaz musí viesť na /auth/callback, nie rovno do správy. Supabase
    // posiela jednorazový kód, ktorý si musí server vymeniť za prihlásenie —
    // stránka správy to spraviť nevie. Kam ísť po prihlásení povie parameter
    // next, ktorý si callback overuje.
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(`/${locale}/admin`)}`
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    if (error) {
      setError('Odkaz sa nepodarilo odoslať. Skúste to o chvíľu znova.')
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
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

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="font-body text-base font-medium text-ink mb-2">Odkaz odoslaný!</h2>
            <p className="text-sm text-stone">Skontrolujte váš email a kliknite na odkaz.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}
            <div>
              <label className="block text-xs text-stone-light mb-1">Email</label>
              <input
                type="email"
                required
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
              {loading ? 'Odosielam…' : 'Poslať prihlasovací odkaz'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
