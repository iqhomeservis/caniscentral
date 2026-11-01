import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkRateLimit, clientKeyFromRequest } from '@/lib/rate-limit'

/**
 * Meranie návštevnosti a záujmu o kontakt — vlastné, bez cudzích služieb.
 *
 * SÚKROMIE: zámerne neukladáme IP adresu ani nič, čím by sa dal návštevník
 * priamo identifikovať. Ukladáme cestu, jazyk, typ zariadenia, krajinu
 * (z hlavičky Netlify) a náhodné id relácie, ktoré žije len v jednej karte
 * prehliadača. Nejde o sledovanie naprieč webmi ani o reklamné cookies.
 *
 * Pozor na očakávania: klik na telefón alebo e-mail je anonymný údaj.
 * Prehliadač neprezradí, kto klikol, takže z týchto záznamov sa nedá nikomu
 * ozvať. Na to slúžia rozpracované objednávky (/api/checkout/save), kde
 * zákazník kontakt sám vyplní.
 */
export async function POST(req: NextRequest) {
  // Štedrý limit — bežný návštevník za 10 minút toľko stránok neotvorí.
  const allowed = await checkRateLimit('track', clientKeyFromRequest(req), 120, 600)
  if (!allowed) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  try {
    const { type, path, locale, referrer, sessionId } = await req.json()
    const supabase = await createServiceClient()

    const country = req.headers.get('x-nf-geo-country') || req.headers.get('x-country') || null
    const ua = req.headers.get('user-agent') ?? ''
    const device = /mobile|android|iphone|ipad/i.test(ua) ? 'mobile' : 'desktop'
    const session = typeof sessionId === 'string' ? sessionId.slice(0, 64) : null
    const safePath = typeof path === 'string' ? path.slice(0, 300) : '/'
    const safeLocale = ['sk', 'en', 'de'].includes(locale) ? locale : null

    if (type === 'pageview') {
      // Z odkazovača berieme len doménu, nie celú adresu s parametrami.
      let referrerHost: string | null = null
      if (typeof referrer === 'string' && referrer.length > 0) {
        try {
          referrerHost = new URL(referrer).hostname.slice(0, 200)
        } catch {
          referrerHost = null
        }
      }
      await supabase.from('page_views').insert({
        path: safePath,
        locale: safeLocale,
        referrer_host: referrerHost,
        device,
        country,
        session_id: session,
      })
      return NextResponse.json({ ok: true })
    }

    if (type === 'phone' || type === 'email') {
      await supabase.from('contact_intents').insert({
        kind: type,
        path: safePath,
        locale: safeLocale,
        session_id: session,
      })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: false, error: 'unknown_type' }, { status: 400 })
  } catch (err) {
    console.error('[track] error:', err)
    // Meranie nesmie nikdy zhodiť stránku návštevníkovi.
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
