'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useCartStore } from '@/store/cart'
import type { Locale } from '@/types'

type PaymentMethod = 'card' | 'invoice'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  zip: string
  country: string
  companyName: string
  ico: string
  dic: string
  payment: PaymentMethod
  notes: string
}

const INIT: FormData = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', zip: '', country: 'SK',
  companyName: '', ico: '', dic: '',
  payment: 'card', notes: '',
}

/**
 * Id rozpracovanej objednávky. Drží sa v localStorage, takže prežije
 * aj odchod na platobnú bránu a návrat späť — vďaka tomu sa nedokončená
 * objednávka neduplikuje pri každom načítaní stránky.
 */
const CHECKOUT_SESSION_KEY = 'cc_checkout_sid'

function getCheckoutSessionId(): string {
  try {
    let id = localStorage.getItem(CHECKOUT_SESSION_KEY)
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      localStorage.setItem(CHECKOUT_SESSION_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

export default function CheckoutForm({ locale }: { locale: Locale }) {
  const t = useTranslations('checkout')
  const { items, total, clearCart } = useCartStore()
  const [form, setForm] = useState<FormData>(INIT)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorKey, setErrorKey] = useState<string | null>(null)
  const [showBusiness, setShowBusiness] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const shipping = total() >= 50 ? 0 : 3.99

  // Priebežné uloženie kontaktu, aby sa dalo ozvať tomu, kto objednávku
  // nedokončí. Posielame až po krátkej pauze v písaní, nie po každom znaku.
  useEffect(() => {
    const hasContact = form.email.includes('@') || form.phone.replace(/\D/g, '').length >= 9
    if (!hasContact || items.length === 0) return

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const sessionId = getCheckoutSessionId()
      if (!sessionId) return
      void fetch('/api/checkout/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          cart: items.map((i) => ({ id: i.product.id, name: i.product.name, quantity: i.quantity })),
          cartTotal: total(),
          locale,
        }),
      }).catch(() => {})
    }, 1200)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [form.email, form.phone, form.firstName, form.lastName, items, total, locale])

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorKey(null)

    const payload = { items, form: { ...form, checkoutSessionId: getCheckoutSessionId() }, locale }

    try {
      const endpoint = form.payment === 'card' ? '/api/checkout/stripe' : '/api/orders'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrorKey(res.status === 429 ? 'errorRateLimited' : 'errorGeneric')
        return
      }

      if (form.payment === 'card') {
        if (data.url) {
          // Košík zámerne nemažeme pred presmerovaním — keby zákazník
          // platbu zrušil, vrátil by sa k prázdnemu košíku.
          window.location.href = data.url
          return
        }
        setErrorKey('errorGeneric')
        return
      }

      clearCart()
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setErrorKey('errorGeneric')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="font-display text-4xl font-light text-ink mb-3">
          Objednávka odoslaná!
        </h2>
        <p className="text-stone text-sm">Potvrdenie sme vám zaslali na email.</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24 text-stone">
        <p>Váš košík je prázdny</p>
      </div>
    )
  }

  const InputField = ({
    label, name, type = 'text', required = false, half = false
  }: {
    label: string; name: keyof FormData; type?: string; required?: boolean; half?: boolean
  }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs text-stone-light mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
        required={required}
        value={form[name] as string}
        onChange={set(name)}
        className="w-full bg-white border border-sand rounded-xl px-4 py-3 text-sm text-ink placeholder:text-stone-light focus:outline-none focus:border-clay transition-colors"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-body text-sm font-medium text-ink mb-5">Kontaktné údaje</h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Meno" name="firstName" required half />
              <InputField label="Priezvisko" name="lastName" required half />
              <InputField label="Email" name="email" type="email" required />
              <InputField label="Telefón" name="phone" type="tel" half />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-body text-sm font-medium text-ink mb-5">Doručovacia adresa</h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Ulica a číslo" name="street" required />
              <InputField label="Mesto" name="city" required half />
              <InputField label="PSČ" name="zip" required half />
              <div className="col-span-2">
                <label className="block text-xs text-stone-light mb-1">Krajina *</label>
                <select
                  required
                  value={form.country}
                  onChange={set('country')}
                  className="w-full bg-white border border-sand rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-clay"
                >
                  <option value="SK">Slovensko</option>
                  <option value="CZ">Česká republika</option>
                  <option value="AT">Rakúsko</option>
                  <option value="HU">Maďarsko</option>
                  <option value="DE">Nemecko</option>
                </select>
              </div>
            </div>

            {/* Business toggle */}
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={showBusiness}
                onChange={(e) => setShowBusiness(e.target.checked)}
                className="w-4 h-4 accent-clay"
              />
              <span className="text-xs text-stone">Objednávam na firmu</span>
            </label>
            {showBusiness && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <InputField label="Názov firmy" name="companyName" />
                <InputField label="IČO" name="ico" half />
                <InputField label="DIČ" name="dic" half />
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6">
            <h2 className="font-body text-sm font-medium text-ink mb-5">Spôsob platby</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'card', label: '💳 Platba kartou', desc: 'Visa, Mastercard, Apple Pay' },
                { value: 'invoice', label: '📄 Faktúra', desc: 'Faktúra do 24 hodín emailom' },
              ].map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={`cursor-pointer border-2 rounded-xl p-4 transition-colors ${
                    form.payment === value
                      ? 'border-clay bg-clay-pale'
                      : 'border-sand hover:border-clay-light'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={form.payment === value}
                    onChange={() => setForm((f) => ({ ...f, payment: value as PaymentMethod }))}
                    className="sr-only"
                  />
                  <div className="font-body text-sm font-medium text-ink">{label}</div>
                  <div className="text-xs text-stone mt-0.5">{desc}</div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right — order summary */}
        <div>
          <div className="bg-white rounded-2xl p-6 sticky top-24">
            <h2 className="font-body text-sm font-medium text-ink mb-5">Súhrn objednávky</h2>

            <ul className="space-y-3 mb-5">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between text-sm">
                  <span className="text-stone flex-1 line-clamp-1">
                    {product.name} × {quantity}
                  </span>
                  <span className="text-ink ml-2 flex-shrink-0">
                    {(product.price * quantity).toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-sand pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone">
                <span>Medzisúčet</span>
                <span>{total().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-stone">
                <span>Doprava</span>
                <span>{shipping === 0 ? 'Zadarmo' : `${shipping.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between font-medium text-ink border-t border-sand pt-2">
                <span>Celkom</span>
                <span>{(total() + shipping).toFixed(2)} €</span>
              </div>
            </div>

            {errorKey && (
              <p className="mt-5 text-sm text-center rounded-2xl bg-clay-pale border border-clay/30 text-ink px-4 py-3">
                {t(errorKey)}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-clay text-cream text-sm font-body py-3.5 rounded-full hover:bg-clay-light transition-colors disabled:opacity-60"
            >
              {loading
                ? t('processing')
                : form.payment === 'card'
                  ? t('payByCard')
                  : t('orderWithObligation')}
            </button>

            <p className="text-xs text-stone-light text-center mt-3">
              🔒 Bezpečná platba
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
