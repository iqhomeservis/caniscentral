import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkRateLimit, clientKeyFromRequest } from '@/lib/rate-limit'

/**
 * Zápis do newslettera.
 *
 * BEZPEČNOSŤ — prečo tu nie je bežný (anonymný) klient.
 * Pôvodne tento endpoint zapisoval cez createClient(), teda pod verejným
 * kľúčom návštevníka. Aby to fungovalo, musela na tabuľke existovať politika
 * „Anyone can subscribe", ktorá dovolila zápis komukoľvek. Lenže verejný kľúč
 * je v zdrojovom kóde každej stránky — ktokoľvek si ho vedel prečítať a písať
 * do tabuľky priamo cez Supabase REST API, úplne mimo tohto endpointu aj mimo
 * akéhokoľvek obmedzenia počtu požiadaviek. Stačil jeden skript a databáza sa
 * zaplní vymyslenými adresami.
 *
 * Zápis preto ide cez server (service_role) a politika pre anonymný zápis bola
 * z tabuľky odstránená. Jediná cesta dnu vedie cez tento endpoint, ktorý má
 * limit počtu požiadaviek.
 */
export async function POST(req: NextRequest) {
  // Prihlásenie na odber je jednorazový úkon. Desať pokusov za desať minút
  // z jednej adresy je viac než dosť aj pri preklepoch.
  const allowed = await checkRateLimit('newsletter', clientKeyFromRequest(req), 10, 600)
  if (!allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  try {
    const { email, locale } = await req.json()

    if (typeof email !== 'string' || email.length > 200) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    const supabase = await createServiceClient()
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: email.trim().toLowerCase(),
      locale: ['sk', 'en', 'de'].includes(locale) ? locale : 'sk',
    })

    // 23505 = už je prihlásený. Pre návštevníka to nie je chyba.
    if (error && error.code !== '23505') {
      console.error('[newsletter] insert failed:', error.message)
      return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[newsletter] unexpected error:', err)
    return NextResponse.json({ error: 'unexpected' }, { status: 500 })
  }
}
