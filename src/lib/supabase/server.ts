// Poistka: tento súbor obsahuje prístup so servisným kľúčom, ktorý obchádza
// všetky bezpečnostné politiky databázy. Import 'server-only' zariadi, že
// pokus použiť ho v klientskom komponente zlyhá už pri builde — kľúč sa tak
// nemôže omylom dostať do prehliadača.
import 'server-only'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component — ignore
          }
        },
      },
    }
  )
}

/**
 * Servisné pripojenie — obchádza všetky bezpečnostné politiky databázy.
 *
 * ZÁMERNE BEZ COOKIES. Predtým sa staval cez createServerClient s cookies
 * návštevníka. Lenže keď je používateľ prihlásený, knižnica priloží k
 * požiadavke JEHO prihlasovací token namiesto servisného kľúča — a dotaz
 * potom beží s jeho právami, nie s právami servera. Dôsledok: prihlásený
 * zákazník by nedokončil objednávku, lebo zápis do tabuľky orders mu
 * politiky zakazujú. Bez cookies je správanie vždy rovnaké, nech je
 * prihlásený ktokoľvek.
 *
 * Funkcia je asynchrónna, aby sa nemuseli meniť všetky miesta, ktoré ju
 * už volajú s await.
 */
export async function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}
