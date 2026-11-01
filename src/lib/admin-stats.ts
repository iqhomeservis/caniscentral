import { createServiceClient } from '@/lib/supabase/server'
import type { AnalyticsData } from '@/components/admin/AnalyticsPanel'

/**
 * Podklady pre modul návštevnosti v admin paneli.
 *
 * Čítame cez service klienta, lebo stránka už predtým overila, že prihlásený
 * používateľ má rolu admin. Dáta sa nikdy nedostanú k bežnému návštevníkovi —
 * tabuľky majú RLS, ktoré čítanie povoľuje len administrátorovi.
 */
export async function loadAnalytics(): Promise<AnalyticsData> {
  const supabase = await createServiceClient()

  const now = Date.now()
  const d7 = new Date(now - 7 * 864e5).toISOString()
  const d30 = new Date(now - 30 * 864e5).toISOString()

  const [{ data: views30 }, { data: intents30 }] = await Promise.all([
    supabase
      .from('page_views')
      .select('path, referrer_host, device, session_id, created_at')
      .gte('created_at', d30)
      .limit(20000),
    supabase.from('contact_intents').select('kind').gte('created_at', d30).limit(20000),
  ])

  const rows = views30 ?? []
  const recent = rows.filter((r) => r.created_at >= d7)

  const count = <T extends string>(items: (T | null)[]) => {
    const map = new Map<string, number>()
    for (const item of items) {
      if (!item) continue
      map.set(item, (map.get(item) ?? 0) + 1)
    }
    return map
  }

  const topFrom = (map: Map<string, number>, limit: number) =>
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)

  // Návštevy po dňoch za 30 dní, vrátane dní bez návštev
  const perDay = new Map<string, number>()
  for (let i = 29; i >= 0; i--) {
    perDay.set(new Date(now - i * 864e5).toISOString().slice(0, 10), 0)
  }
  for (const r of rows) {
    const day = r.created_at.slice(0, 10)
    if (perDay.has(day)) perDay.set(day, (perDay.get(day) ?? 0) + 1)
  }

  const pageMap = count(rows.map((r) => r.path))
  const refMap = count(rows.map((r) => r.referrer_host))
  const deviceMap = count(rows.map((r) => r.device))

  return {
    views7: recent.length,
    views30: rows.length,
    visitors7: new Set(recent.map((r) => r.session_id).filter(Boolean)).size,
    phoneClicks30: (intents30 ?? []).filter((i) => i.kind === 'phone').length,
    emailClicks30: (intents30 ?? []).filter((i) => i.kind === 'email').length,
    topPages: topFrom(pageMap, 8).map(([path, views]) => ({ path, views })),
    topReferrers: topFrom(refMap, 8).map(([host, views]) => ({ host, views })),
    byDay: Array.from(perDay.entries()).map(([day, views]) => ({ day: day.slice(5), views })),
    devices: topFrom(deviceMap, 2).map(([device, views]) => ({ device, views })),
  }
}

export async function loadLeads() {
  const supabase = await createServiceClient()
  const [{ data: abandoned }, { data: subscribers }] = await Promise.all([
    supabase
      .from('abandoned_checkouts')
      .select('*')
      .is('completed_at', null)
      .order('updated_at', { ascending: false })
      .limit(100),
    supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200),
  ])
  return { abandoned: abandoned ?? [], subscribers: subscribers ?? [] }
}
