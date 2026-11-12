'use client'

import { useState } from 'react'
import { Mail, Phone, Check, Inbox } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

/**
 * Správy z kontaktného formulára.
 *
 * Správa je v databáze aj vtedy, keď odoslanie e-mailu zlyhalo — toto je
 * teda jediné miesto, kde sa dopyt nestratí. Preto sa tu nič nemaže, len
 * označuje za vyriešené.
 */

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  topic: string
  message: string
  locale: string
  handled: boolean
  created_at: string
}

const TOPIC_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  skola: 'Výcviková škola',
  salon: 'Salón',
  chov: 'Chovateľstvo',
  obchod: 'Obchod',
  ine: 'Iné',
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('sk-SK', {
    day: 'numeric', month: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

export default function MessagesPanel({ messages }: { messages: ContactMessage[] }) {
  const [rows, setRows] = useState(messages)
  const [onlyOpen, setOnlyOpen] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const setHandled = async (id: string, handled: boolean) => {
    setBusyId(id)
    const supabase = createClient()
    const { error } = await supabase.from('contact_messages').update({ handled }).eq('id', id)
    setBusyId(null)
    if (error) {
      alert(`Zmenu sa nepodarilo uložiť: ${error.message}`)
      return
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, handled } : r)))
  }

  const open = rows.filter((r) => !r.handled).length
  const shown = onlyOpen ? rows.filter((r) => !r.handled) : rows

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-stone">
          {open > 0
            ? <><span className="font-medium text-ink">{open}</span> nevyriešených z celkovo {rows.length}</>
            : `Všetko vyriešené — ${rows.length} správ v archíve`}
        </p>
        <button
          onClick={() => setOnlyOpen((v) => !v)}
          className="text-sm text-clay hover:text-ink transition-colors underline underline-offset-4"
        >
          {onlyOpen ? 'Zobraziť aj vyriešené' : 'Zobraziť len nevyriešené'}
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <Inbox size={28} className="mx-auto mb-3 text-stone-light" aria-hidden="true" />
          <p className="text-sm text-stone">
            {onlyOpen && rows.length > 0 ? 'Žiadne nevyriešené správy.' : 'Zatiaľ neprišla žiadna správa.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((m) => (
            <div
              key={m.id}
              className={`bg-white rounded-2xl p-5 ${m.handled ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-ink font-medium">{m.name}</span>
                    <span className="text-[11px] uppercase tracking-wider bg-sand text-stone rounded-full px-2.5 py-0.5">
                      {TOPIC_LABELS[m.topic] ?? m.topic}
                    </span>
                    {m.locale !== 'sk' && (
                      <span className="text-[11px] uppercase tracking-wider text-stone-light">
                        {m.locale}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-light mt-1">{fmt(m.created_at)}</p>
                </div>
                <button
                  onClick={() => setHandled(m.id, !m.handled)}
                  disabled={busyId === m.id}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
                    m.handled
                      ? 'bg-sand text-stone hover:text-ink'
                      : 'bg-sage-pale text-sage-deep hover:bg-sage/30'
                  }`}
                >
                  <Check size={13} /> {m.handled ? 'Vyriešené' : 'Označiť ako vyriešené'}
                </button>
              </div>

              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{m.message}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-sand/70 text-sm">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent('Re: Vaša správa z webu CanisCentral')}`}
                  className="inline-flex items-center gap-1.5 text-clay hover:text-ink transition-colors"
                >
                  <Mail size={14} /> {m.email}
                </a>
                {m.phone && (
                  <a
                    href={`tel:${m.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-1.5 text-stone hover:text-ink transition-colors"
                  >
                    <Phone size={14} /> {m.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
