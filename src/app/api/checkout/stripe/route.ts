import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const { items, form, locale } = await req.json()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://caniscentral.sk'

    const lineItems = items.map(({ product, quantity }: { product: { name: string; price: number; images?: string[] }; quantity: number }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
          images: product.images?.slice(0, 1) ?? [],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity,
    }))

    // Shipping line item
    const subtotal = items.reduce(
      (s: number, { product, quantity }: { product: { price: number }; quantity: number }) => s + product.price * quantity,
      0
    )
    if (subtotal < 50) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Doprava', images: [] },
          unit_amount: 399, // 3.99 €
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/${locale}/obchod?order=success`,
      cancel_url: `${baseUrl}/${locale}/pokladna`,
      customer_email: form.email,
      metadata: {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        street: form.street,
        city: form.city,
        zip: form.zip,
        country: form.country,
        companyName: form.companyName ?? '',
        ico: form.ico ?? '',
        dic: form.dic ?? '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 })
  }
}
