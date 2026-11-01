import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkRateLimit, clientKeyFromRequest } from '@/lib/rate-limit'

/**
 * Priebežné uloženie rozpracovanej objednávky.
 *
 * Toto je to, čo naozaj umožní ozvať sa záujemcovi: keď zákazník v pokladni
 * vyplní e-mail alebo telefón a objednávku nedokončí, kontakt tu zostane
 * aj s obsahom košíka. Po dokončení objednávky sa záznam označí ako
 * vybavený (completed_at), takže v prehľade zostanú len tí, ktorí odpadli.
 *
 * OSOBNÉ ÚDAJE: sú to skutočné kontaktné údaje, ktoré zákazník sám vyplnil.
 * Číta ich len administrátor (RLS) a zápis ide výhradne cez server.
 * Informácia o tomto spracovaní musí byť uvedená v zásadách ochrany
 * osobných údajov — bez toho sa záujemcom nesmie ozývať.
 */
export async function POST(req: NextRequest) {
  const allowed = await checkRateLimit('checkout_save', clientKeyFromRequest(req), 60, 600)
  if (!allowed) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  try {
    const { sessionId, email, firstName, lastName, phone, cart, cartTotal, locale } = await req.json()

    if (typeof sessionId !== 'string' || sessionId.length < 8) {
      return NextResponse.json({ ok: false, error: 'invalid_session' }, { status: 400 })
    }
    // Bez kontaktu nemá záznam zmysel — nemali by sme sa komu ozvať.
    const hasContact =
      (typeof email === 'string' && email.includes('@')) ||
      (typeof phone === 'string' && phone.replace(/\D/g, '').length >= 9)
    if (!hasContact) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const supabase = await createServiceClient()
    const { error } = await supabase.from('abandoned_checkouts').upsert(
      {
        session_id: sessionId.slice(0, 64),
        email: typeof email === 'string' ? email.trim().toLowerCase().slice(0, 200) : null,
        first_name: typeof firstName === 'string' ? firstName.slice(0, 100) : null,
        last_name: typeof lastName === 'string' ? lastName.slice(0, 100) : null,
        phone: typeof phone === 'string' ? phone.slice(0, 50) : null,
        cart: cart ?? null,
        cart_total: typeof cartTotal === 'number' ? cartTotal : null,
        locale: ['sk', 'en', 'de'].includes(locale) ? locale : 'sk',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'session_id' }
    )

    if (error) {
      console.error('[checkout/save] upsert failed:', error.message)
      return NextResponse.json({ ok: false }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[checkout/save] error:', err)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
