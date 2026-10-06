'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Locale } from '@/types'

export default function AdminLogin({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/${locale}/admin`,
      },
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="pt-16 min-h-screen bg-off flex items-center justify-center px-6">
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
            <div>
              <label className="block text-xs text-stone-light mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="julia@caniscentral.sk"
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
