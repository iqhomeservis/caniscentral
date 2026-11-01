import { createClient } from '@/lib/supabase/server'
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
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
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
  const [{ data: products }, { data: orders }, analytics, leads] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(50),
    loadAnalytics(),
    loadLeads(),
  ])

  return (
    <AdminDashboard
      locale={locale}
      products={products ?? []}
      orders={orders ?? []}
      analytics={analytics}
      abandoned={leads.abandoned}
      subscribers={leads.subscribers}
    />
  )
}
