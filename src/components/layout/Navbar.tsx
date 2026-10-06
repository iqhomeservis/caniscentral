'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import type { Locale } from '@/types'

const NAV_LINKS = [
  { key: 'hotel', href: '/hotel' },
  { key: 'school', href: '/skola' },
  { key: 'salon', href: '/salon' },
  { key: 'breeding', href: '/chov' },
  { key: 'shop', href: '/obchod' },
] as const

export default function Navbar({ locale }: { locale: Locale }) {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#fdfcfa]/90 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="font-display text-2xl font-light tracking-wide text-ink">
          Canis<span className="italic text-clay">Central</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ key, href }) => (
            <Link
              key={key}
              href={`/${locale}${href}`}
              className="text-sm font-body text-stone hover:text-ink transition-colors duration-200"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <div className="hidden md:flex gap-2 text-xs text-stone-light">
            {(['sk', 'en', 'de'] as Locale[]).map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`uppercase hover:text-ink transition-colors ${
                  l === locale ? 'text-ink font-medium' : ''
                }`}
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Cart */}
          <button
            className="relative p-2 text-ink hover:text-clay transition-colors"
            aria-label="Košík"
            onClick={() => {
              // CartDrawer opens via event
              window.dispatchEvent(new CustomEvent('open-cart'))
            }}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-clay text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#fdfcfa] border-t border-sand px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map(({ key, href }) => (
            <Link
              key={key}
              href={`/${locale}${href}`}
              className="text-base text-ink py-1"
              onClick={() => setMenuOpen(false)}
            >
              {t(key)}
            </Link>
          ))}
          <div className="flex gap-4 pt-2 border-t border-sand text-sm text-stone">
            {(['sk', 'en', 'de'] as Locale[]).map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`uppercase ${l === locale ? 'text-ink font-medium' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
