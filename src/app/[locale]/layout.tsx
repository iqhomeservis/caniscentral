import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL, DEFAULT_LOCALE, LOCALES, asLocale } from '@/lib/seo'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import Tracker from '@/components/analytics/Tracker'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import CartDrawer from '@/components/shop/CartDrawer'
import ScrollRevealInit from '@/components/ui/ScrollRevealInit'
import type { Locale } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)

  const titles: Record<Locale, string> = {
    sk: 'CanisCentral – Hotel, Škola, Salón & Obchod pre psov | Slovensko',
    en: 'CanisCentral – Dog Hotel, School, Salon & Shop | Slovakia',
    de: 'CanisCentral – Hundepension, Schule, Salon & Shop | Slowakei',
  }
  const descriptions: Record<Locale, string> = {
    sk: 'Profesionálna starostlivosť o psa na jednom mieste. Hotel pre psov, výcvik a kurzy, psí salón, chovateľská stanica a e-shop s prírodnými produktmi.',
    en: 'Professional dog care in one place. Dog hotel, training courses, grooming salon, breeding kennel and natural products e-shop.',
    de: 'Professionelle Hundebetreuung an einem Ort. Hundepension, Trainingskurse, Hundesalon, Zucht und Naturprodukte.',
  }

  return {
    title: {
      default: titles[locale],
      template: '%s | CanisCentral',
    },
    description: descriptions[locale],
    metadataBase: new URL(SITE_URL),
    // Pozor: alternates sa tu zámerne NENASTAVUJE. Metadata sa z layoutu dedia
    // do podstránok, takže canonical uvedený tu by každej podstránke povedal,
    // že je kópiou úvodnej stránky. Canonical si určuje každá stránka sama
    // cez pageMetadata() v src/lib/seo.ts.
    openGraph: {
      type: 'website',
      locale: locale === 'sk' ? 'sk_SK' : locale === 'en' ? 'en_US' : 'de_DE',
      siteName: 'CanisCentral',
      title: titles[locale],
      description: descriptions[locale],
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'CanisCentral',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale],
      description: descriptions[locale],
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [{ url: '/favicon.png', type: 'image/png', sizes: '64x64' }],
      apple: '/apple-touch-icon.png',
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params

  // Segment [locale] zachytí ľubovoľný prvý diel adresy, takže /nezmysel by sa
  // bez tejto kontroly tváril ako platný jazyk a vrátil slovenskú úvodnú
  // stránku so stavom 200. Každý preklep v adrese by tak Googlu vyrobil
  // ďalšiu kópiu domovskej stránky. Neznámy jazyk preto končí na 404.
  if (!(LOCALES as string[]).includes(localeParam)) {
    notFound()
  }
  const locale = asLocale(localeParam)
  // Jazyk sa musí odovzdať výslovne. Projekt nepoužíva next-intl middleware,
  // takže requestLocale je prázdny a getMessages() bez parametra by vrátil
  // vždy slovenčinu — klientske komponenty (košík, filtre, newsletter)
  // by potom boli po slovensky aj na /en a /de.
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider messages={messages}>
      <LocalBusinessSchema />
      <Tracker locale={locale} />
      <CustomCursor />
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <CartDrawer />
      <ScrollRevealInit />
    </NextIntlClientProvider>
  )
}
