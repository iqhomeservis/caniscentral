import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { priceCart, CartError, FREE_SHIPPING_FROM, SHIPPING_FEE } from '@/lib/cart-server'
import { checkRateLimit, clientKeyFromRequest } from '@/lib/rate-limit'

/**
 * Vytvorenie platobnej relácie Stripe.
 *
 * BEZPEČNOSŤ: ceny posielané do Stripe sa berú výhradne z databázy (priceCart).
 * Predtým sa preberali z prehliadača — ktokoľvek si vedel prepísať cenu
 * a zaplatiť 0,01 € za ľubovoľný produkt.
 */

const secret = process.env.STRIPE_SECRET_KEY

export async function POST(req: NextRequest) {
  if (!secret || secret.includes('REPLACE')) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })
  }

  const allowed = await checkRateLimit('stripe', clientKeyFromRequest(req), 10, 600)
  if (!allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  try {
    const { items, form, locale } = await req.json()

    if (typeof form?.email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }
    const safeLocale = ['sk', 'en', 'de'].includes(locale) ? locale : 'sk'

    const cart = await priceCart(items)

    const stripe = new Stripe(secret, { apiVersion: '2024-09-30.acacia' })
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://caniscentral.sk').replace(/\/$/, '')

    // Obrázky produktov sú v databáze uložené ako cesty v rámci webu
    // (/images/...). Stripe ale prijíma výhradne úplné adresy — pri
    // relatívnej ceste odmietne celú platbu chybou "Not a valid URL"
    // a zákazníkovi sa po kliknutí na platbu kartou nestane vôbec nič.
    // Obrázok je len ozdoba platobnej stránky, takže keď sa úplnú adresu
    // nepodarí zostaviť, radšej ho vynecháme, než aby padol nákup.
    const absoluteImage = (src: string | null): string[] => {
      if (!src) return []
      if (src.startsWith('http://') || src.startsWith('https://')) return [src]
      if (src.startsWith('/')) return [`${baseUrl}${src}`]
      return []
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.lines.map((l) => {
      const images = absoluteImage(l.image)
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: l.name,
            ...(images.length ? { images } : {}),
          },
          unit_amount: Math.round(l.unitPrice * 100),
        },
        quantity: l.quantity,
      }
    })

    if (cart.subtotal < FREE_SHIPPING_FROM) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Doprava' },
          unit_amount: Math.round(SHIPPING_FEE * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/${safeLocale}/obchod?order=success`,
      cancel_url: `${baseUrl}/${safeLocale}/pokladna`,
      customer_email: form.email,
      // Stripe obmedzuje metadata na 500 znakov na hodnotu — orezávame.
      metadata: {
        firstName: String(form.firstName ?? '').slice(0, 200),
        lastName: String(form.lastName ?? '').slice(0, 200),
        phone: String(form.phone ?? '').slice(0, 50),
        street: String(form.street ?? '').slice(0, 200),
        city: String(form.city ?? '').slice(0, 100),
        zip: String(form.zip ?? '').slice(0, 20),
        country: String(form.country ?? 'SK').slice(0, 10),
        companyName: String(form.companyName ?? '').slice(0, 200),
        ico: String(form.ico ?? '').slice(0, 20),
        dic: String(form.dic ?? '').slice(0, 20),
        checkoutSessionId: String(form.checkoutSessionId ?? '').slice(0, 100),
      },
    })

    // Objednávku zapíšeme hneď v stave "čaká na platbu" a zapamätáme si
    // id platobnej relácie. Bez toho webhook po zaplatení nemá čo označiť
    // a objednávka zaplatená kartou by sa stratila.
    const supabase = await createServiceClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        payment_method: 'card',
        payment_status: 'pending',
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        total: cart.total,
        customer_email: form.email,
        customer_first_name: form.firstName ?? '',
        customer_last_name: form.lastName ?? '',
        customer_phone: form.phone ?? null,
        shipping_street: form.street ?? '',
        shipping_city: form.city ?? '',
        shipping_zip: form.zip ?? '',
        shipping_country: form.country ?? 'SK',
        company_name: form.companyName || null,
        ico: form.ico || null,
        dic: form.dic || null,
        stripe_session_id: session.id,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('[stripe] objednávku sa nepodarilo zapísať:', orderError?.message)
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

    return NextResponse.json({ url: session.url })
  } catch (err) {
    if (err instanceof CartError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 400 })
    }
    console.error('[stripe] unexpected error:', err)
    return NextResponse.json({ error: 'stripe_error' }, { status: 500 })
  }
}
