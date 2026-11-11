import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LOCALES, DEFAULT_LOCALE } from '@/lib/seo'

/**
 * Dokončenie prihlásenia magic linkom.
 *
 * PREČO TOTO EXISTUJE:
 * Supabase neposiela v odkaze hotovú reláciu, ale jednorazový kód (?code=...).
 * Ten si musí server vymeniť za prihlásenie — inak kód ostane visieť v adrese
 * a používateľ uvidí prihlasovací formulár znova, akoby sa nič nestalo.
 * Presne to sa dialo: odkaz bol platný, len ho nemal kto spracovať.
 *
 * Výmena musí prebehnúť na serveri, lebo k nej treba overovací reťazec
 * uložený v cookie pri odoslaní odkazu. Preto je to samostatná cesta
 * a nie komponent stránky.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(`${origin}${next}?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] výmena kódu zlyhala:', error.message)
    return NextResponse.redirect(`${origin}${next}?error=auth_failed`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}

/**
 * Cieľ presmerovania berieme z adresy, takže ho vie ovplyvniť ktokoľvek.
 * Bez kontroly by sa dal podstrčiť odkaz, ktorý po prihlásení odošle
 * návštevníka na cudzí web — aj s dojmom, že je to stále náš. Preto
 * povolíme výhradne tvar /<jazyk>/<cesta> a nič iné.
 */
function safeNext(raw: string | null): string {
  const fallback = `/${DEFAULT_LOCALE}/admin`
  if (!raw) return fallback

  // Musí ísť o cestu v rámci webu. Dve lomítka alebo spätné lomítko na
  // začiatku prehliadač chápe ako inú doménu (//zly-web.sk).
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return fallback
  }

  const [, locale] = raw.split('/')
  if (!(LOCALES as readonly string[]).includes(locale)) {
    return fallback
  }

  return raw
}
