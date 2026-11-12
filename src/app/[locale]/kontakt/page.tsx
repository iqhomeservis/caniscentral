import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Phone, MapPin } from 'lucide-react'
import { pageMetadata, asLocale } from '@/lib/seo'
import ContactForm from '@/components/contact/ContactForm'
import EmailLink from '@/components/ui/EmailLink'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'contact' })
  return pageMetadata({
    locale,
    path: '/kontakt',
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale = asLocale(localeParam)
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <main className="pt-20 font-body">
      <section className="bg-clay-pale py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-stone-light">{t('eyebrow')}</span>
          <h1 className="font-display text-5xl font-light text-ink mt-1 leading-tight">
            {t('title')}
            <br />
            <em className="text-clay">{t('titleAccent')}</em>
          </h1>
          <p className="text-stone mt-4 max-w-xl leading-relaxed">{t('intro')}</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14">
        {/* useSearchParams potrebuje hranicu Suspense, inak build zlyhá
            pri prerenderovaní stránky. */}
        <Suspense fallback={<div className="h-96" />}>
          <ContactForm locale={locale} />
        </Suspense>
      </section>

      <section className="border-t border-sand">
        <div className="max-w-3xl mx-auto px-6 py-12 grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-2xl font-light text-ink mb-2">{t('orCallTitle')}</h2>
            <p className="text-sm text-stone leading-relaxed mb-4">{t('orCallText')}</p>
            <a
              href="tel:+421908267278"
              className="inline-flex items-center gap-2 text-sm text-ink hover:text-clay transition-colors"
            >
              <Phone size={15} /> +421 908 267 278
            </a>
            <div className="mt-2">
              <EmailLink className="text-sm text-stone hover:text-ink transition-colors">
                canisdogsport@gmail.com
              </EmailLink>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-light mb-2">
              <MapPin size={12} /> Canis Central
            </div>
            <p className="text-sm text-stone leading-relaxed">
              S. Chalupku 1789/34<br />
              052 01 Spišská Nová Ves
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
