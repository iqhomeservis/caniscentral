import { createServiceClient } from '@/lib/supabase/server'

/**
 * Obmedzenie počtu požiadaviek pre verejné endpointy.
 *
 * Endpointy na objednávku a platbu nevyžadujú prihlásenie a odosielajú e-maily
 * na adresu z požiadavky. Bez obmedzenia ich vie ktokoľvek volať dokola
 * a cez našu doménu rozposielať poštu cudzím adresátom — tým by utrpela
 * povesť domény a Júlii by prestali chodiť e-maily do schránok.
 *
 * Počítadlo je v databáze, nie v pamäti — na Netlify beží viac inštancií
 * a pamäťové počítadlo by sa dalo obísť.
 */
export async function checkRateLimit(
  bucket: string,
  clientKey: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const supabase = await createServiceClient()
    // Funkcia je v schéme public, lebo Supabase sprístupňuje cez REST API
    // len ju. Právo na spustenie má však výhradne service_role (server),
    // takže verejný RPC endpoint z toho nevzniká.
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_bucket: bucket,
      p_key: clientKey,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })
    if (error) {
      console.error('[rate-limit] check failed:', error.message)
      // Pri výpadku kontroly požiadavku radšej pustíme ďalej, než by sme
      // zablokovali skutočných zákazníkov.
      return true
    }
    return data !== false
  } catch (err) {
    console.error('[rate-limit] unexpected error:', err)
    return true
  }
}

/**
 * Identifikátor volajúceho z hlavičiek. Netlify posiela skutočnú IP
 * v x-nf-client-connection-ip. IP sa nikam neukladá — slúži len ako kľúč
 * počítadla a v databáze je uložená ako skrátený hash.
 */
export function clientKeyFromRequest(req: Request): string {
  const ip =
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  return hashString(ip)
}

function hashString(value: string): string {
  let h = 5381
  for (let i = 0; i < value.length; i++) {
    h = ((h << 5) + h + value.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}
