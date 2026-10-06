import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'
import AdminLogin from '@/components/admin/AdminLogin'
import type { Locale } from '@/types'

export const metadata = { title: 'Správa' }

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

  // Load products & orders for dashboard
  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(50),
  ])

  return (
    <AdminDashboard
      locale={locale}
      products={products ?? []}
      orders={orders ?? []}
    />
  )
}
