import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieToSet = { name: string; value: string; options: CookieOptions }

/**
 * Obnovenie prihlasovacej relácie.
 *
 * PREČO TOTO EXISTUJE:
 * Prístupový token zo Supabase má krátku platnosť a obnoviť ho treba
 * pri požiadavke — server si ho sám od seba nepredĺži. Bez tohto súboru
 * správcu po chvíli prezerania webu prestal server poznať a musel sa
 * prihlasovať odznova, hoci reláciu nikdy neukončil.
 *
 * Volanie getUser() tu nie je zbytočné: pri ňom knižnica token obnoví
 * a nový zapíše späť do cookies.
 *
 * ROZSAH JE ZÁMERNE ÚZKY. Spúšťať to na každej stránke by znamenalo
 * jedno sieťové volanie do Supabase pri každom načítaní — aj pre
 * návštevníka, ktorý sa nikdy neprihlási. Preto len správa a prihlásenie.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: ['/sk/admin/:path*', '/en/admin/:path*', '/de/admin/:path*', '/auth/:path*'],
}
