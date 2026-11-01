'use client'

import { Phone, Mail, ShoppingCart, Info } from 'lucide-react'

export type AbandonedCheckout = {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  cart: { name?: string; quantity?: number }[] | null
  cart_total: number | null
  locale: string | null
  created_at: string
  updated_at: string
}

export type Subscriber = {
  id: string
  email: string
  locale: string
  created_at: string
  unsubscribed_at: string | null
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('sk-SK', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function LeadsPanel({
  abandoned,
  subscribers,
}: {
  abandoned: AbandonedCheckout[]
  subscribers: Subscriber[]
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Nedokončené objednávky */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingCart size={16} className="text-clay" />
          <h3 className="font-body text-sm font-medium text-ink">Nedokončené objednávky</h3>
        </div>
        <p className="text-xs text-stone-light mb-5">
          Ľudia, ktorí v pokladni vyplnili kontakt, ale objednávku nedokončili.
          Po dokončení objednávky zo zoznamu zmiznú.
        </p>

        {abandoned.length === 0 ? (
          <p className="text-sm text-stone-light">Žiadne nedokončené objednávky.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="border-b border-sand">
                <tr>
                  <th className="text-left px-3 py-2 text-xs text-stone-light font-normal">Kontakt</th>
                  <th className="text-left px-3 py-2 text-xs text-stone-light font-normal">Košík</th>
                  <th className="text-right px-3 py-2 text-xs text-stone-light font-normal">Suma</th>
                  <th className="text-right px-3 py-2 text-xs text-stone-light font-normal">Naposledy</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {abandoned.map((row) => {
                  const name = [row.first_name, row.last_name].filter(Boolean).join(' ')
                  return (
                    <tr key={row.id} className="border-b border-sand/50 align-top">
                      <td className="px-3 py-3">
                        {name && <p className="text-ink">{name}</p>}
                        {row.email && <p className="text-stone text-xs">{row.email}</p>}
                        {row.phone && <p className="text-stone text-xs">{row.phone}</p>}
                      </td>
                      <td className="px-3 py-3 text-stone text-xs">
                        {row.cart?.length
                          ? row.cart.map((i, idx) => (
                              <span key={idx} className="block">
                                {i.quantity}× {i.name}
                              </span>
                            ))
                          : '—'}
                      </td>
                      <td className="px-3 py-3 text-right text-ink">
                        {row.cart_total != null ? `${Number(row.cart_total).toFixed(2)} €` : '—'}
                      </td>
                      <td className="px-3 py-3 text-right text-stone-light text-xs whitespace-nowrap">
                        {formatDate(row.updated_at)}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        {row.phone && (
                          <a href={`tel:${row.phone}`} className="inline-flex items-center gap-1 text-xs text-clay hover:underline mr-3">
                            <Phone size={12} /> Zavolať
                          </a>
                        )}
                        {row.email && (
                          <a href={`mailto:${row.email}`} className="inline-flex items-center gap-1 text-xs text-clay hover:underline">
                            <Mail size={12} /> Napísať
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex gap-2.5 items-start bg-sand/40 rounded-xl p-4">
          <Info size={15} className="text-stone flex-shrink-0 mt-0.5" />
          <p className="text-xs text-stone leading-relaxed">
            Sú to osobné údaje. Pred oslovením si over, že spracovanie je uvedené
            v zásadách ochrany osobných údajov, a oslovuj len v súvislosti
            s konkrétnou nedokončenou objednávkou — nie ako reklamu.
          </p>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Mail size={16} className="text-clay" />
          <h3 className="font-body text-sm font-medium text-ink">
            Newsletter — {subscribers.filter((s) => !s.unsubscribed_at).length} prihlásených
          </h3>
        </div>

        {subscribers.length === 0 ? (
          <p className="text-sm text-stone-light">Zatiaľ nikto prihlásený.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-sand">
                <tr>
                  <th className="text-left px-3 py-2 text-xs text-stone-light font-normal">E-mail</th>
                  <th className="text-left px-3 py-2 text-xs text-stone-light font-normal">Jazyk</th>
                  <th className="text-right px-3 py-2 text-xs text-stone-light font-normal">Prihlásený</th>
                  <th className="text-right px-3 py-2 text-xs text-stone-light font-normal">Stav</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-sand/50">
                    <td className="px-3 py-2.5 text-ink">{s.email}</td>
                    <td className="px-3 py-2.5 text-stone uppercase text-xs">{s.locale}</td>
                    <td className="px-3 py-2.5 text-right text-stone-light text-xs whitespace-nowrap">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.unsubscribed_at ? 'bg-sand text-stone' : 'bg-sage-pale text-sage-deep'}`}>
                        {s.unsubscribed_at ? 'Odhlásený' : 'Aktívny'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
