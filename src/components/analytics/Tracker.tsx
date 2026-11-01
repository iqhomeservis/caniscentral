'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Meranie návštevnosti bez cudzích služieb a bez reklamných cookies.
 *
 * Id relácie žije v sessionStorage — teda len v jednej karte prehliadača
 * a po jej zatvorení zaniká. Neprenáša sa medzi webmi ani zariadeniami.
 *
 * Zachytáva sa aj klik na telefónne číslo a e-mailovú adresu. Je to
 * anonymný údaj: z neho sa nedá zistiť, kto klikol — slúži na štatistiku,
 * koľko ľudí malo záujem ozvať sa.
 */

const SESSION_KEY = 'cc_sid'

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    // Súkromné okno alebo zablokované úložisko — meranie proste preskočíme.
    return ''
  }
}

function send(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload)
    // sendBeacon prežije aj odchod zo stránky (klik na odkaz).
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
      return
    }
    void fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    // Meranie nikdy nesmie ovplyvniť používanie webu.
  }
}

export default function Tracker({ locale }: { locale: string }) {
  const pathname = usePathname()

  // Zobrazenie stránky
  useEffect(() => {
    const sessionId = getSessionId()
    if (!sessionId) return
    send({
      type: 'pageview',
      path: pathname,
      locale,
      referrer: document.referrer || null,
      sessionId,
    })
  }, [pathname, locale])

  // Klik na telefón alebo e-mail kdekoľvek na stránke
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const link = target?.closest?.('a')
      if (!link) return
      const href = link.getAttribute('href') ?? ''
      const type = href.startsWith('tel:') ? 'phone' : href.startsWith('mailto:') ? 'email' : null
      if (!type) return

      const sessionId = getSessionId()
      if (!sessionId) return
      send({ type, path: pathname, locale, sessionId })
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [pathname, locale])

  return null
}
