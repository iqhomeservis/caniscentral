import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-ink text-sand-light py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-3">
            <img
              src="/images/logo.svg"
              alt="Canis Central"
              className="h-10 w-auto brightness-0 invert opacity-90"
              width={220}
              height={80}
            />
          </div>
          <p className="text-sm text-stone-light leading-relaxed">
            Profesionálna starostlivosť o vášho psa od roku 1991. Tréning, hotel, salón, chov a prírodné produkty.
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
          <h4 className="text-xs uppercase tracking-widest text-stone-light mb-4">Služby</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Hotel', href: '/hotel' },
              { label: 'Škola', href: '/skola' },
              { label: 'Salón', href: '/salon' },
              { label: 'Chov CEVARO FCI', href: '/chov' },
              { label: 'O nás', href: '/o-nas' },
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
          <h4 className="text-xs uppercase tracking-widest text-stone-light mb-4">Obchod</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Krmivá', href: '/obchod?cat=food' },
              { label: 'Doplnky', href: '/obchod?cat=supplements' },
              { label: 'Starostlivosť', href: '/obchod?cat=care' },
              { label: 'Príslušenstvo', href: '/obchod?cat=accessories' },
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
          <h4 className="text-xs uppercase tracking-widest text-stone-light mb-4">Kontakt</h4>
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
        <p>© {new Date().getFullYear()} CanisCentral. Všetky práva vyhradené.</p>
        <div className="flex gap-4">
          <Link href={`/${locale}/ochrana-osobnych-udajov`} className="hover:text-[#fdfcfa] transition-colors">
            Ochrana osobných údajov
          </Link>
          <Link href={`/${locale}/obchodne-podmienky`} className="hover:text-[#fdfcfa] transition-colors">
            VOP
          </Link>
        </div>
      </div>
    </footer>
  )
}
