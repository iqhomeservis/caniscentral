'use client'

import { useMemo, useState } from 'react'
import {
  ChevronDown, Copy, Check, Download, Search, Phone, Mail,
  MapPin, Building2, CreditCard, FileText, Package,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderStatus } from '@/types'

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Čakajúca',
  paid: 'Zaplatená',
  shipped: 'Odoslaná',
  delivered: 'Doručená',
  cancelled: 'Zrušená',
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-sand text-stone',
  paid: 'bg-sage-pale text-sage-deep',
  shipped: 'bg-[#e0e8f8] text-[#3a6aaa]',
  delivered: 'bg-[#d8f8d8] text-[#2a7a2a]',
  cancelled: 'bg-[#f8d8d8] text-[#aa3a3a]',
}

const PAYMENT_STATUS_LABELS: Record<Order['payment_status'], string> = {
  pending: 'Čaká na platbu',
  paid: 'Uhradená',
  failed: 'Neúspešná',
}

const eur = (n: number) => `${n.toFixed(2)} €`

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('sk-SK', {
    day: 'numeric', month: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

/** Malé tlačidlo, ktoré skopíruje hodnotu do schránky. */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      title={`Kopírovať ${label}`}
      aria-label={`Kopírovať ${label}`}
      onClick={() => {
        try {
          void navigator.clipboard?.writeText(value)
        } catch {
          /* ticho — hodnota je aj tak na obrazovke */
        }
        setDone(true)
        setTimeout(() => setDone(false), 1500)
      }}
      className="text-stone-light hover:text-ink transition-colors shrink-0"
    >
      {done ? <Check size={13} className="text-sage-deep" /> : <Copy size={13} />}
    </button>
  )
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-stone-light mb-1.5">
        <Icon size={12} /> {label}
      </div>
      <div className="text-sm text-ink leading-relaxed">{children}</div>
    </div>
  )
}

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [openId, setOpenId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = createClient()
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (error) {
      alert(`Stav sa nepodarilo zmeniť: ${error.message}`)
      return
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  // Hľadá sa cez meno, e-mail, telefón, mesto, firmu aj číslo objednávky —
  // Juliana si objednávku pamätá rôzne, podľa toho, kade k nej prišla.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (!q) return true
      return [
        o.id,
        `${o.customer_first_name} ${o.customer_last_name}`,
        o.customer_email,
        o.customer_phone ?? '',
        o.shipping_city,
        o.company_name ?? '',
        o.ico ?? '',
      ].join(' ').toLowerCase().includes(q)
    })
  }, [orders, query, statusFilter])

  // Export pre účtovníctvo. Bodkočiarka a BOM preto, aby to Excel
  // otvoril rovno v stĺpcoch a nerozsypal diakritiku.
  const exportCsv = () => {
    const head = [
      'Číslo', 'Dátum', 'Meno', 'Priezvisko', 'E-mail', 'Telefón',
      'Ulica', 'Mesto', 'PSČ', 'Krajina', 'Firma', 'IČO', 'DIČ',
      'Položky', 'Medzisúčet', 'Doprava', 'Spolu', 'Platba', 'Stav platby', 'Stav',
    ]
    const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const rows = visible.map((o) => [
      o.id.slice(0, 8), dateTime(o.created_at),
      o.customer_first_name, o.customer_last_name, o.customer_email, o.customer_phone ?? '',
      o.shipping_street, o.shipping_city, o.shipping_zip, o.shipping_country,
      o.company_name ?? '', o.ico ?? '', o.dic ?? '',
      (o.items ?? []).map((i) => `${i.quantity}× ${i.product_name}`).join(', '),
      o.subtotal.toFixed(2), o.shipping.toFixed(2), o.total.toFixed(2),
      o.payment_method === 'card' ? 'Karta' : 'Faktúra',
      PAYMENT_STATUS_LABELS[o.payment_status], STATUS_LABELS[o.status],
    ].map(cell).join(';'))

    const csv = '﻿' + [head.map(cell).join(';'), ...rows].join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `objednavky_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Panel nástrojov */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-light" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hľadať meno, e-mail, telefón, mesto, IČO alebo číslo objednávky"
            className="w-full bg-white rounded-full pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-stone-light focus:outline-none focus:ring-1 focus:ring-clay"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="bg-white rounded-full px-4 py-2.5 text-sm text-ink cursor-pointer focus:outline-none focus:ring-1 focus:ring-clay"
        >
          <option value="all">Všetky stavy</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button
          onClick={exportCsv}
          disabled={visible.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-white text-sm text-stone hover:text-ink px-5 py-2.5 rounded-full transition-colors disabled:opacity-50"
        >
          <Download size={14} /> Stiahnuť CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        {visible.length === 0 ? (
          <div className="text-center py-16 text-stone text-sm">
            {orders.length === 0 ? 'Žiadne objednávky' : 'Nič nevyhovuje hľadaniu'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-sand">
              <tr>
                <th className="w-8 px-5 py-3" />
                <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">#</th>
                <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Zákazník</th>
                <th className="text-right px-5 py-3 text-xs text-stone-light font-normal">Suma</th>
                <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Platba</th>
                <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Stav</th>
                <th className="text-left px-5 py-3 text-xs text-stone-light font-normal">Dátum</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => {
                const open = openId === order.id
                const items = order.items ?? []
                return [
                  <tr
                    key={order.id}
                    onClick={() => setOpenId(open ? null : order.id)}
                    className="border-b border-sand/50 hover:bg-off/50 cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <ChevronDown
                        size={15}
                        className={`text-stone-light transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-stone-light">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-ink">{order.customer_first_name} {order.customer_last_name}</div>
                      <div className="text-xs text-stone-light">{order.customer_email}</div>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-ink">{eur(order.total)}</td>
                    <td className="px-5 py-3 text-stone">
                      <span className="inline-flex items-center gap-1.5">
                        {order.payment_method === 'card'
                          ? <><CreditCard size={13} /> Karta</>
                          : <><FileText size={13} /> Faktúra</>}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {/* Kliknutie na stav nesmie zároveň rozbaliť riadok. */}
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${STATUS_COLORS[order.status]}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-xs text-stone-light whitespace-nowrap">
                      {dateTime(order.created_at)}
                    </td>
                  </tr>,

                  open && (
                    <tr key={`${order.id}-detail`} className="border-b border-sand/50 bg-off/40">
                      <td colSpan={7} className="px-5 py-6">
                        <div className="grid gap-6 md:grid-cols-3 mb-6">
                          <Field icon={MapPin} label="Doručovacia adresa">
                            {order.customer_first_name} {order.customer_last_name}<br />
                            {order.shipping_street}<br />
                            {order.shipping_zip} {order.shipping_city}<br />
                            {order.shipping_country}
                          </Field>

                          <Field icon={Mail} label="Kontakt">
                            <span className="flex items-center gap-2">
                              <a href={`mailto:${order.customer_email}`} className="hover:text-clay break-all">
                                {order.customer_email}
                              </a>
                              <CopyButton value={order.customer_email} label="e-mail" />
                            </span>
                            {order.customer_phone ? (
                              <span className="flex items-center gap-2 mt-1">
                                <Phone size={12} className="text-stone-light" />
                                <a href={`tel:${order.customer_phone.replace(/\s/g, '')}`} className="hover:text-clay">
                                  {order.customer_phone}
                                </a>
                                <CopyButton value={order.customer_phone} label="telefón" />
                              </span>
                            ) : (
                              <span className="block mt-1 text-stone-light text-xs">Telefón neuvedený</span>
                            )}
                          </Field>

                          <Field icon={Building2} label="Firemné údaje">
                            {order.company_name || order.ico || order.dic ? (
                              <>
                                {order.company_name && <>{order.company_name}<br /></>}
                                {order.ico && <>IČO: {order.ico}<br /></>}
                                {order.dic && <>DIČ: {order.dic}</>}
                              </>
                            ) : (
                              <span className="text-stone-light text-xs">Nákup na fyzickú osobu</span>
                            )}
                          </Field>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-stone-light mb-2">
                          <Package size={12} /> Položky objednávky
                        </div>
                        {items.length === 0 ? (
                          <p className="text-xs text-stone-light mb-4">
                            Položky sa k tejto objednávke nenačítali.
                          </p>
                        ) : (
                          <table className="w-full text-sm mb-4">
                            <tbody>
                              {items.map((item) => (
                                <tr key={item.id} className="border-b border-sand/40">
                                  <td className="py-2 text-ink">{item.product_name}</td>
                                  <td className="py-2 text-right text-stone w-20">{item.quantity} ks</td>
                                  <td className="py-2 text-right text-stone w-28">{eur(item.product_price)}</td>
                                  <td className="py-2 text-right text-ink w-28">{eur(item.subtotal)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                          <div className="text-xs text-stone-light space-y-1">
                            <div>
                              Platba: {order.payment_method === 'card' ? 'kartou' : 'na faktúru'} ·{' '}
                              {PAYMENT_STATUS_LABELS[order.payment_status]}
                            </div>
                            <div>Vytvorená: {dateTime(order.created_at)}</div>
                            {order.stripe_session_id && (
                              <div className="flex items-center gap-2">
                                <span className="font-mono break-all">{order.stripe_session_id}</span>
                                <CopyButton value={order.stripe_session_id} label="id platby" />
                              </div>
                            )}
                          </div>
                          <div className="text-sm sm:text-right shrink-0">
                            <div className="text-stone">Medzisúčet: {eur(order.subtotal)}</div>
                            <div className="text-stone">Doprava: {eur(order.shipping)}</div>
                            <div className="text-ink font-medium text-base mt-1">Spolu: {eur(order.total)}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                ]
              })}
            </tbody>
          </table>
        )}
      </div>

      {visible.length > 0 && (
        <p className="text-xs text-stone-light mt-3">
          Zobrazených {visible.length} z {orders.length} načítaných objednávok. Kliknutím na riadok sa rozbalia podrobnosti.
        </p>
      )}
    </div>
  )
}
