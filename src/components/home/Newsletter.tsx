'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: connect to Resend/Supabase list
    setSent(true)
  }

  return (
    <section className="bg-ink py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <span className="text-xs uppercase tracking-widest text-stone-light mb-3 block reveal">
          Newsletter
        </span>
        <h2 className="font-display text-4xl font-light text-[#fdfcfa] mb-4 reveal">
          Buďte prvý <em className="text-clay">informovaní</em>
        </h2>
        <p className="font-body text-sm text-stone-light mb-8 reveal">
          Novinky, tipy pre vaše zviera a exkluzívne zľavy priamo do emailu.
        </p>
        {sent ? (
          <p className="font-body text-clay text-sm reveal">Ďakujeme! Čoskoro sa ozveme. 🐾</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 reveal">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Váš email"
              className="flex-1 bg-white/10 border border-stone/40 rounded-full px-5 py-3 text-sm text-[#fdfcfa] placeholder:text-stone-light focus:outline-none focus:border-clay transition-colors"
            />
            <button
              type="submit"
              className="bg-clay text-cream text-sm font-body px-6 py-3 rounded-full hover:bg-clay-light transition-colors whitespace-nowrap"
            >
              Prihlásiť sa
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
