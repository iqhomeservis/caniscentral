import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

/**
 * Stripe webhook — potvrdenie zaplatenia.
 *
 * Objednávku zakladá už /api/checkout/stripe so stavom "čaká na platbu"
 * a s id platobnej relácie. Tu ju len označíme ako zaplatenú, odpíšeme sklad
 * a pošleme potvrdenie. Podpis požiadavky sa overuje — bez platného podpisu
 * sa nič nevykoná.
 */

const resendKey = process.env.RESEND_API_KEY
const resend = resendKey && !resendKey.includes('REPLACE') ? new Resend(resendKey) : null

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret || !webhookSecret || secret.includes('REPLACE') || webhookSecret.includes('REPLACE')) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 400 })
  }

  const stripe = new Stripe(secret, { apiVersion: '2024-09-30.acacia' })
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const supabase = await createServiceClient()

  const { data: order, error } = await supabase
    .from('orders')
    .update({ status: 'paid', payment_status: 'paid' })
    .eq('stripe_session_id', session.id)
    .eq('payment_status', 'pending') // ochrana pred opakovaným spracovaním
    .select('id, total, customer_email, customer_first_name, customer_last_name')
    .maybeSingle()

  if (error) {
    console.error('[webhook] aktualizácia objednávky zlyhala:', error.message)
    return NextResponse.json({ error: 'update_failed' }, { status: 500 })
  }
  // Žiadny riadok = udalosť sme už spracovali. Stripe posiela opakovane.
  if (!order) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  // Odpísať sklad
  const { data: items } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', order.id)

  for (const item of items ?? []) {
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.product_id)
      .single()
    if (product && typeof product.stock === 'number') {
      await supabase
        .from('products')
        .update({ stock: Math.max(0, product.stock - item.quantity) })
        .eq('id', item.product_id)
    }
  }

  // Označiť rozpracovanú objednávku ako dokončenú
  const checkoutSessionId = session.metadata?.checkoutSessionId
  if (checkoutSessionId) {
    await supabase
      .from('abandoned_checkouts')
      .update({ completed_at: new Date().toISOString() })
      .eq('session_id', checkoutSessionId)
  }

  await sendConfirmation(order)

  return NextResponse.json({ received: true })
}

async function sendConfirmation(order: {
  id: string
  total: number
  customer_email: string
  customer_first_name: string
  customer_last_name: string
}) {
  if (!resend) return
  const from = process.env.RESEND_FROM_EMAIL ?? 'objednavky@caniscentral.sk'
  const short = order.id.slice(0, 8)
  try {
    await resend.emails.send({
      from,
      to: order.customer_email,
      subject: `Potvrdenie objednávky #${short} — CanisCentral`,
      html: `
        <h2>Ďakujeme, platba prebehla úspešne</h2>
        <p>Číslo objednávky: <strong>#${short}</strong></p>
        <p>Zaplatená suma: <strong>${Number(order.total).toFixed(2)} €</strong></p>
        <p>Tím Canis Central</p>
      `,
    })
    await resend.emails.send({
      from,
      to: process.env.ADMIN_EMAIL ?? 'canisdogsport@gmail.com',
      subject: `Zaplatená objednávka #${short} — ${Number(order.total).toFixed(2)} €`,
      html: `
        <h2>Objednávka zaplatená kartou</h2>
        <p>${order.customer_first_name} ${order.customer_last_name} (${order.customer_email})</p>
        <p>Suma: <strong>${Number(order.total).toFixed(2)} €</strong></p>
      `,
    })
  } catch (err) {
    console.error('[webhook] e-mail sa nepodarilo odoslať:', err)
  }
}
