import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { priceCart, CartError } from '@/lib/cart-server'
import { checkRateLimit, clientKeyFromRequest } from '@/lib/rate-limit'
import { Resend } from 'resend'

/**
 * Vytvorenie objednávky s platbou na faktúru.
 *
 * BEZPEČNOSŤ: sumy sa počítajú výhradne z cien v databáze (priceCart).
 * Predtým sa preberali z prehliadača, takže si ktokoľvek vedel objednať
 * za ľubovoľnú cenu. Platba kartou ide cez /api/checkout/stripe — tento
 * endpoint prijíma len faktúru, aby sa nedala obísť platobná brána.
 */

const resendKey = process.env.RESEND_API_KEY
const resend = resendKey && !resendKey.includes('REPLACE') ? new Resend(resendKey) : null

function isNonEmpty(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

export async function POST(req: NextRequest) {
  // Najviac 5 objednávok za 10 minút z jednej adresy.
  const allowed = await checkRateLimit('orders', clientKeyFromRequest(req), 5, 600)
  if (!allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  try {
    const { items, form } = await req.json()

    // Povinné údaje objednávateľa
    for (const field of ['email', 'firstName', 'lastName', 'street', 'city', 'zip'] as const) {
      if (!isNonEmpty(form?.[field])) {
        return NextResponse.json({ error: 'missing_field', field }, { status: 400 })
      }
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }
    // Karta patrí Stripe, tu prijímame len faktúru.
    if (form.payment !== 'invoice') {
      return NextResponse.json({ error: 'unsupported_payment_method' }, { status: 400 })
    }

    // Ceny z databázy, nie z prehliadača.
    const cart = await priceCart(items)

    const supabase = await createServiceClient()
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        payment_method: 'invoice',
        payment_status: 'pending',
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        total: cart.total,
        customer_email: form.email,
        customer_first_name: form.firstName,
        customer_last_name: form.lastName,
        customer_phone: form.phone ?? null,
        shipping_street: form.street,
        shipping_city: form.city,
        shipping_zip: form.zip,
        shipping_country: form.country ?? 'SK',
        company_name: form.companyName || null,
        ico: form.ico || null,
        dic: form.dic || null,
      })
      .select()
      .single()

    if (error || !order) {
      console.error('[orders] insert failed:', error?.message)
      return NextResponse.json({ error: 'order_failed' }, { status: 500 })
    }

    await supabase.from('order_items').insert(
      cart.lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        product_name: l.name,
        product_price: l.unitPrice,
        quantity: l.quantity,
        subtotal: l.lineTotal,
      }))
    )

    // Označiť prípadnú rozpracovanú objednávku ako dokončenú
    if (isNonEmpty(form.checkoutSessionId)) {
      await supabase
        .from('abandoned_checkouts')
        .update({ completed_at: new Date().toISOString() })
        .eq('session_id', form.checkoutSessionId)
    }

    await sendEmails(order.id, cart.total, form)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    if (err instanceof CartError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 400 })
    }
    console.error('[orders] unexpected error:', err)
    return NextResponse.json({ error: 'order_failed' }, { status: 500 })
  }
}

async function sendEmails(
  orderId: string,
  total: number,
  form: { email: string; firstName: string; lastName: string; street: string; zip: string; city: string; country?: string }
) {
  if (!resend) {
    console.warn('[orders] Resend nie je nastavený — potvrdenie sa neodoslalo')
    return
  }
  const from = process.env.RESEND_FROM_EMAIL ?? 'objednavky@caniscentral.sk'
  const short = orderId.slice(0, 8)

  try {
    await resend.emails.send({
      from,
      to: form.email,
      subject: `Potvrdenie objednávky #${short} — CanisCentral`,
      html: `
        <h2>Ďakujeme za vašu objednávku</h2>
        <p>Číslo objednávky: <strong>#${short}</strong></p>
        <p>Celková suma: <strong>${total.toFixed(2)} €</strong></p>
        <p>Faktúru vám pošleme e-mailom.</p>
        <p>Tím Canis Central</p>
      `,
    })
    await resend.emails.send({
      from,
      to: process.env.ADMIN_EMAIL ?? 'canisdogsport@gmail.com',
      subject: `Nová objednávka #${short} — ${total.toFixed(2)} €`,
      html: `
        <h2>Nová objednávka</h2>
        <p>${form.firstName} ${form.lastName} (${form.email})</p>
        <p>Platba: faktúra</p>
        <p>Suma: <strong>${total.toFixed(2)} €</strong></p>
        <p>Adresa: ${form.street}, ${form.zip} ${form.city}, ${form.country ?? 'SK'}</p>
      `,
    })
  } catch (err) {
    // Objednávka je už uložená — zlyhanie e-mailu ju nesmie zrušiť.
    console.error('[orders] e-mail sa nepodarilo odoslať:', err)
  }
}
