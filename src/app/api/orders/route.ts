import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { items, form } = await req.json()
    const supabase = await createServiceClient()

    const subtotal = items.reduce(
      (s: number, { product, quantity }: { product: { price: number }; quantity: number }) =>
        s + product.price * quantity,
      0
    )
    const shipping = subtotal >= 50 ? 0 : 3.99
    const total = subtotal + shipping

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        payment_method: form.payment,
        payment_status: 'pending',
        subtotal,
        shipping,
        total,
        customer_email: form.email,
        customer_first_name: form.firstName,
        customer_last_name: form.lastName,
        customer_phone: form.phone,
        shipping_street: form.street,
        shipping_city: form.city,
        shipping_zip: form.zip,
        shipping_country: form.country,
        company_name: form.companyName || null,
        ico: form.ico || null,
        dic: form.dic || null,
      })
      .select()
      .single()

    if (error || !order) throw error

    // Create order items
    await supabase.from('order_items').insert(
      items.map(({ product, quantity }: { product: { id: string; name: string; price: number }; quantity: number }) => ({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity,
        subtotal: product.price * quantity,
      }))
    )

    // Send confirmation email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'objednavky@caniscentral.sk',
      to: form.email,
      subject: `Potvrdenie objednávky #${order.id.slice(0, 8)} — CanisCentral`,
      html: `
        <h2>Ďakujeme za vašu objednávku!</h2>
        <p>Číslo objednávky: <strong>#${order.id.slice(0, 8)}</strong></p>
        <p>Celková suma: <strong>${total.toFixed(2)} €</strong></p>
        ${form.payment === 'invoice' ? '<p>Faktúra vám bude zaslaná do 24 hodín.</p>' : ''}
        <p>Tím CanisCentral</p>
      `,
    })

    // Notify admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'objednavky@caniscentral.sk',
      to: process.env.ADMIN_EMAIL ?? 'julia@caniscentral.sk',
      subject: `Nová objednávka #${order.id.slice(0, 8)} — ${total.toFixed(2)} €`,
      html: `
        <h2>Nová objednávka</h2>
        <p>${form.firstName} ${form.lastName} (${form.email})</p>
        <p>Platba: ${form.payment === 'card' ? 'Karta' : 'Faktúra'}</p>
        <p>Suma: <strong>${total.toFixed(2)} €</strong></p>
        <p>Adresa: ${form.street}, ${form.zip} ${form.city}, ${form.country}</p>
      `,
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    console.error('Order error:', err)
    return NextResponse.json({ error: 'Order failed' }, { status: 500 })
  }
}
