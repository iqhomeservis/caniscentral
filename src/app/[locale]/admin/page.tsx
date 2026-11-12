import { createClient } from '@/lib/supabase/server'
import { asLocale } from '@/lib/seo'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminLogin from '@/components/admin/AdminLogin'
import { loadAnalytics, loadLeads } from '@/lib/admin-stats'
import type { Locale } from '@/types'

// Admin panel nesmie skončiť vo vyhľadávači. robots.txt len zakazuje
// prechádzanie — adresa by sa aj tak mohla dostať do indexu, preto noindex.
export const metadata = {
  title: 'Správa',
  robots: { index: false, follow: false },
}

// Panel musí ukazovať aktuálne čísla, nie zapečené pri builde.
export const dynamic = 'force-dynamic'

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <AdminLogin locale={locale} />
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect(`/${locale}`)
  }

  // Podklady pre panel
  const [{ data: products }, { data: orders }, { data: messages }, analytics, leads] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    // Položky sa premenúvajú na "items", aby sedeli s typom Order — detail
    // objednávky v správe ich inak nenájde a tváril by sa, že objednávka
    // nemá čo obsahovať.
    supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false }).limit(200),
    // Správy z kontaktného formulára. Čítanie povolí politika len správcovi,
    // takže pri komkoľvek inom sa sem ani nedostaneme.
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(300),
    loadAnalytics(),
    loadLeads(),
  ])

  return (
    <AdminDashboard
      locale={locale}
      products={products ?? []}
      orders={orders ?? []}
      messages={messages ?? []}
      analytics={analytics}
      abandoned={leads.abandoned}
      subscribers={leads.subscribers}
    />
  )
}
