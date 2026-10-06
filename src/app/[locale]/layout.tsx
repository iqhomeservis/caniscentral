import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import CartDrawer from '@/components/shop/CartDrawer'
import ScrollRevealInit from '@/components/ui/ScrollRevealInit'
import type { Locale } from '@/types'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <CustomCursor />
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <CartDrawer />
      <ScrollRevealInit />
    </NextIntlClientProvider>
  )
}
