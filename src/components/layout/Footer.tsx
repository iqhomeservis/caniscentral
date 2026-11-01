import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/types'

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tShop = await getTranslations({ locale, namespace: 'shop' })
  return (
    <footer className="bg-ink text-sand-light py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <img
              src="/images/logo-wolf.png"
              alt=""
              className="h-16 w-auto"
              width={212}
              height={318}
            />
            <span className="leading-none">
              <span className="block font-display text-lg font-semibold tracking-[0.1em] text-[#fdfcfa]">
                CANISCENTRAL
              </span>
              <span className="block text-[9px] tracking-[0.28em] text-stone-light mt-1">
                CANIS DOG SPORT
              </span>
            </span>
          </div>
          <p className="text-sm text-stone-light leading-relaxed">
            {t('about')}
          </p>
          {/* Social */}
          <div className="flex gap-3 mt-6">
            <a
              href="https://www.facebook.com/share/1WrobSRnzE/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-stone flex items-center justify-center text-xs text-stone-light hover:border-clay hover:text-clay transition-colors"
              aria-label="Facebook"
            >
              f
            </a>
            <div className="w-8 h-8 rounded-full border border-stone flex items-center justify-center text-xs text-stone-light opacity-40 cursor-default" aria-hidden>ig</div>
            <div className="w-8 h-8 rounded-full border border-stone flex items-center justify-center text-xs text-stone-light opacity-40 cursor-default" aria-hidden>yt</div>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-stone-light mb-4">{t('services')}</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: tNav('hotel'), href: '/hotel' },
              { label: tNav('school'), href: '/skola' },
              { label: tNav('salon'), href: '/salon' },
              { label: t('breedingLink'), href: '/chov' },
              { label: tNav('about'), href: '/o-nas' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={`/${locale}${href}`}
                  className="text-sand-deep hover:text-[#fdfcfa] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-stone-light mb-4">{t('shopSection')}</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: tShop('filter.food'), href: '/obchod?cat=food' },
              { label: tShop('filter.supplements'), href: '/obchod?cat=supplements' },
              { label: tShop('filter.care'), href: '/obchod?cat=care' },
              { label: tShop('filter.accessories'), href: '/obchod?cat=accessories' },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={`/${locale}${href}`}
                  className="text-sand-deep hover:text-[#fdfcfa] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-stone-light mb-4">{t('contact')}</h4>
          <ul className="space-y-2 text-sm text-sand-deep">
            <li>Mgr. Juliana Oravcová</li>
            <li>S. Chalupku 1789/34</li>
            <li>052 01 Spišská Nová Ves</li>
            <li>
              <a href="mailto:canisdogsport@gmail.com" className="hover:text-[#fdfcfa] transition-colors">
                canisdogsport@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+421908267278" className="hover:text-[#fdfcfa] transition-colors">
                +421 908 267 278
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-stone/30 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone">
        <p>© {new Date().getFullYear()} CanisCentral. {t('rights')}.</p>
        <div className="flex gap-4">
          <Link href={`/${locale}/ochrana-osobnych-udajov`} className="hover:text-[#fdfcfa] transition-colors">
            {t('privacy')}
          </Link>
          <Link href={`/${locale}/obchodne-podmienky`} className="hover:text-[#fdfcfa] transition-colors">
            {t('terms')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
