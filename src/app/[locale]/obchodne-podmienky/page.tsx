import type { Metadata } from 'next'
import type { Locale } from '@/types'

export const metadata: Metadata = {
  title: 'Obchodné podmienky',
  robots: { index: false },
}

export default async function TOSPage({ params }: { params: Promise<{ locale: Locale }> }) {
  await params
  return (
    <main className="pt-24 pb-20 px-6 font-body">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-light text-ink mb-8">Obchodné podmienky</h1>

        <p className="text-stone text-sm mb-6">Aktualizované: október 2024</p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">1. Predávajúci</h2>
        <p className="text-stone leading-relaxed">
          Júlia Oravcová, IČO: (doplniť), e-mail: info@caniscentral.sk,
          tel.: (doplniť) (ďalej len „predávajúci").
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">2. Objednávka a uzatvorenie zmluvy</h2>
        <p className="text-stone leading-relaxed">
          Objednávka sa uskutočňuje prostredníctvom e-shopu na caniscentral.sk. Odoslaním
          objednávky kupujúci potvrdzuje, že sa oboznámil s týmito obchodnými podmienkami.
          Zmluva je uzatvorená potvrdením objednávky zo strany predávajúceho.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">3. Ceny a platba</h2>
        <p className="text-stone leading-relaxed">
          Všetky ceny sú uvedené v eurách vrátane DPH. Doprava je zadarmo pri objednávke
          nad 50 €, inak je účtovaná vo výške 3,99 €. Platba prebieha bezpečne kartou
          prostredníctvom Stripe.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">4. Dodanie tovaru</h2>
        <p className="text-stone leading-relaxed">
          Tovar je expedovaný do 2–3 pracovných dní od prijatia platby. Dodacia lehota
          je spravidla 2–5 pracovných dní v závislosti od zvoleného dopravcu.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">5. Odstúpenie od zmluvy</h2>
        <p className="text-stone leading-relaxed">
          Kupujúci má právo odstúpiť od zmluvy bez udania dôvodu do 14 dní od prevzatia
          tovaru. Tovar musí byť vrátený nepoškodený, v pôvodnom obale. Náklady na vrátenie
          tovaru znáša kupujúci.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">6. Reklamácie</h2>
        <p className="text-stone leading-relaxed">
          Reklamácie vybavujeme do 30 dní. Záručná doba na tovar je 24 mesiacov.
          Reklamáciu uplatňujte e-mailom na info@caniscentral.sk s popisom závady a fotodokumentáciou.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">7. Alternatívne riešenie sporov</h2>
        <p className="text-stone leading-relaxed">
          V prípade sporu má kupujúci právo obrátiť sa na Slovenskú obchodnú inšpekciu
          (SOI) alebo využiť platformu na riešenie sporov online:&nbsp;
          <a href="https://ec.europa.eu/consumers/odr" className="text-clay hover:underline" target="_blank" rel="noopener noreferrer">
            ec.europa.eu/consumers/odr
          </a>.
        </p>
      </div>
    </main>
  )
}
