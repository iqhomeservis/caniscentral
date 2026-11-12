import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { checkRateLimit, clientKeyFromRequest } from '@/lib/rate-limit'

/**
 * Kontaktný formulár.
 *
 * PREČO VÔBEC EXISTUJE
 * Odkaz mailto: otvorí poštový program len tomu, kto ho má v systéme
 * nastavený. Kto používa Gmail v prehliadači — a to je väčšina — po kliknutí
 * neuvidí nič a odíde. Formulár poštový program nepotrebuje.
 *
 * BEZPEČNOSŤ
 * Zapisuje sa servisným kľúčom zo servera, nie verejným kľúčom z prehliadača.
 * Tabuľka nemá politiku pre anonymný zápis, takže jediná cesta dnu vedie
 * cez tento endpoint — a ten má obmedzený počet požiadaviek. Bez toho by
 * ktokoľvek vedel písať do tabuľky priamo cez REST API Supabase.
 *
 * SPRÁVA SA NAJPRV ULOŽÍ, AŽ POTOM ODOSIELA
 * Keby vypadol Resend, e-mail sa stratí a nikto sa o dopyte nedozvie.
 * Preto je v databáze a v správe webu aj vtedy, keď odoslanie zlyhá.
 */

const TOPICS = ['hotel', 'skola', 'salon', 'chov', 'obchod', 'ine'] as const
type Topic = (typeof TOPICS)[number]

const TOPIC_LABELS: Record<Topic, string> = {
  hotel: 'Hotel pre psov',
  skola: 'Výcviková škola',
  salon: 'Salón',
  chov: 'Chovateľstvo CEVARO',
  obchod: 'Obchod a objednávky',
  ine: 'Iné',
}

const LOCALES = ['sk', 'en', 'de']

/** Obsah od návštevníka ide do HTML e-mailu — musí sa zneškodniť. */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export async function POST(req: NextRequest) {
  // Päť správ za hodinu z jednej adresy. Skutočný zákazník napíše raz,
  // dvakrát pri preklepe. Viac je robot.
  const allowed = await checkRateLimit('kontakt', clientKeyFromRequest(req), 5, 3600)
  if (!allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { name, email, phone, topic, message, locale, web } = body ?? {}

    // Pasca na roboty: pole je v stránke skryté, človek ho nevyplní.
    // Robotovi odpovieme, že je všetko v poriadku — nech nehľadá inú cestu.
    if (typeof web === 'string' && web.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
    const n = text(name)
    const e = text(email).toLowerCase()
    const p = text(phone)
    const m = text(message)
    const t = text(topic) as Topic
    const l = LOCALES.includes(text(locale)) ? text(locale) : 'sk'

    if (n.length < 2 || n.length > 100) {
      return NextResponse.json({ error: 'invalid_name' }, { status: 400 })
    }
    if (e.length > 200 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }
    if (p.length > 50) {
      return NextResponse.json({ error: 'invalid_phone' }, { status: 400 })
    }
    if (!TOPICS.includes(t)) {
      return NextResponse.json({ error: 'invalid_topic' }, { status: 400 })
    }
    if (m.length < 10 || m.length > 4000) {
      return NextResponse.json({ error: 'invalid_message' }, { status: 400 })
    }

    let stored = false
    try {
      const supabase = await createServiceClient()
      const { error } = await supabase.from('contact_messages').insert({
        name: n, email: e, phone: p || null, topic: t, message: m, locale: l,
      })
      if (error) console.error('[kontakt] zápis zlyhal:', error.message)
      else stored = true
    } catch (err) {
      console.error('[kontakt] zápis spadol:', err)
    }

    let sent = false
    const key = process.env.RESEND_API_KEY
    if (key && !key.includes('REPLACE')) {
      const resend = new Resend(key)
      const from = process.env.RESEND_FROM_EMAIL ?? 'objednavky@caniscentral.sk'
      const to = process.env.ADMIN_EMAIL ?? 'canisdogsport@gmail.com'
      try {
        // Odosielateľ musí byť naša overená doména. Keby sme posielali priamo
        // z adresy zákazníka, kontrola SPF a DKIM to vyhodnotí ako podvrh
        // a Gmail správu zahodí. Odpoveď preto smerujeme cez reply-to.
        await resend.emails.send({
          from,
          to,
          replyTo: e,
          subject: `Nová správa z webu — ${TOPIC_LABELS[t]} (${n})`,
          html: `
            <h2>Nová správa z kontaktného formulára</h2>
            <p><strong>Téma:</strong> ${esc(TOPIC_LABELS[t])}</p>
            <p><strong>Meno:</strong> ${esc(n)}</p>
            <p><strong>E-mail:</strong> <a href="mailto:${esc(e)}">${esc(e)}</a></p>
            ${p ? `<p><strong>Telefón:</strong> <a href="tel:${esc(p.replace(/\s/g, ''))}">${esc(p)}</a></p>` : ''}
            <p><strong>Jazyk stránky:</strong> ${esc(l)}</p>
            <hr>
            <p style="white-space:pre-wrap">${esc(m)}</p>
            <hr>
            <p style="color:#6b6560;font-size:12px">
              Odpovedzte priamo na tento e-mail — odpoveď pôjde zákazníkovi.
            </p>
          `,
        })
        sent = true
      } catch (err) {
        console.error('[kontakt] e-mail správcovi zlyhal:', err)
      }

      // Potvrdenie zákazníkovi je zdvorilosť, nie podmienka. Keď zlyhá,
      // správa je aj tak uložená a doručená — návštevníka tým netrápime.
      try {
        await resend.emails.send({
          from,
          to: e,
          subject: 'Vašu správu sme dostali — CanisCentral',
          html: `
            <h2>Ďakujeme za správu</h2>
            <p>Ozveme sa vám čo najskôr. Pre istotu posielame, čo nám prišlo:</p>
            <p><strong>Téma:</strong> ${esc(TOPIC_LABELS[t])}</p>
            <p style="white-space:pre-wrap;color:#6b6560">${esc(m)}</p>
            <p>Tím Canis Central</p>
          `,
        })
      } catch (err) {
        console.error('[kontakt] potvrdenie zákazníkovi zlyhalo:', err)
      }
    } else {
      console.error('[kontakt] RESEND_API_KEY chýba — správa je len v databáze')
    }

    // Keď zlyhalo uloženie aj odoslanie, správa nikde nie je. To sa
    // návštevník musí dozvedieť, inak si myslí, že čaká na odpoveď.
    if (!stored && !sent) {
      return NextResponse.json({ error: 'send_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[kontakt] neočakávaná chyba:', err)
    return NextResponse.json({ error: 'unexpected' }, { status: 500 })
  }
}
