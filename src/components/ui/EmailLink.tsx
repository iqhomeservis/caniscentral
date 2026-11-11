'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'

export const CONTACT_EMAIL = 'canisdogsport@gmail.com'

/**
 * Odkaz na e-mailovú adresu.
 *
 * PREČO NESTAČÍ OBYČAJNÝ mailto:
 * Odkaz mailto: otvorí poštový program len vtedy, keď ho má návštevník
 * v systéme nastavený ako predvolený. Kto používa Gmail v prehliadači —
 * a takých je väčšina — po kliknutí neuvidí vôbec nič. Tlačidlo vyzerá
 * pokazené a návštevník odíde.
 *
 * Preto sa adresa pri kliknutí zároveň skopíruje do schránky a popis
 * tlačidla sa na pár sekúnd zmení tak, aby bolo vidieť samotnú adresu.
 * Komu sa pošta otvorí, ten zmenu ani nezaregistruje. Kto ju nemá,
 * vie aspoň kam písať a má to rovno v schránke.
 *
 * Zostáva to <a href="mailto:...">, takže meranie kliknutí na kontakt
 * (Tracker) funguje ďalej bez zmeny.
 */
export default function EmailLink({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const handleClick = () => {
    // Schránka nemusí byť dostupná (staršie prehliadače, odopreté právo).
    // Popis zmeníme tak či tak — adresa je potom aspoň vidieť.
    try {
      void navigator.clipboard?.writeText(CONTACT_EMAIL)
    } catch {
      /* ticho — adresa zostane aspoň čitateľná */
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 6000)
  }

  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      onClick={handleClick}
      className={className}
      aria-label={`Napísať na ${CONTACT_EMAIL}`}
    >
      {copied ? CONTACT_EMAIL : children}
    </a>
  )
}
