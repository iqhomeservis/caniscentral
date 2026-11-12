import { cache } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { pageMetadata, asLocale, SITE_URL } from '@/lib/seo'
import ProductDetail from '@/components/shop/ProductDetail'
import type { Locale, Product } from '@/types'

/**
 * Jeden produkt sa pri požiadavke načíta raz, hoci ho potrebuje aj
 * generateMetadata, aj samotná stránka. Bez cache() by išli do databázy
 * dva rovnaké dopyty na každé otvorenie stránky.
 */
const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return (data as Product) ?? null
})

/** Obrázky sú v databáze ako cesty v rámci webu; schema.org chce úplné adresy. */
const absolute = (src: string): string | null => {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith('/')) return `${SITE_URL}${src}`
  return null
}

/** Popis do výsledkov vyhľadávania — celé vety, orezané na rozumnú dĺžku. */
function metaDescription(product: Product): string {
  const text = (product.description ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return `${product.name} v e-shope CanisCentral.`
  if (text.length <= 160) return text
  const cut = text.slice(0, 160)
  const space = cut.lastIndexOf(' ')
  return `${(space > 100 ? cut.slice(0, space) : cut).trim()}…`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: localeParam, slug } = await params
  const locale = asLocale(localeParam)
  const product = await getProduct(slug)

  // Neexistujúci produkt rieši notFound() v samotnej stránke. Tu stačí
  // nedať mu vlastný titulok a zakázať indexovanie.
  if (!product) {
    return { title: 'Produkt sa nenašiel', robots: { index: false, follow: false } }
  }

  const meta = pageMetadata({
    locale,
    path: `/obchod/${product.slug}`,
    title: product.name,
    description: metaDescription(product),
  })

  const image = product.images?.[0] ? absolute(product.images[0]) : null

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      // Pre produkt je správny typ "website" zavádzajúci — zdieľaný odkaz
      // má ukázať tovar, nie stránku.
      type: 'website' as const,
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
    ...(image ? { twitter: { ...meta.twitter, images: [image] } } : {}),
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const images = (product.images ?? [])
    .map(absolute)
    .filter((src): src is string => src !== null)

  /**
   * Štruktúrované dáta o produkte. Vďaka nim vie Google zobraziť pod
   * odkazom cenu a dostupnosť. Uvádzame len to, čo je overené v databáze —
   * žiadne hodnotenia ani výrobca, ktoré nemáme.
   */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(images.length ? { image: images } : {}),
    sku: product.slug,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/${locale}/obchod/${product.slug}`,
      price: product.price.toFixed(2),
      priceCurrency: 'EUR',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@id': `${SITE_URL}/#organizacia` },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetail product={product} locale={locale} />
    </>
  )
}
