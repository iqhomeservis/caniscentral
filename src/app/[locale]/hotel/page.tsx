import { Bed, Clock, Star, Phone } from 'lucide-react'
import Link from 'next/link'
import type { Locale } from '@/types'

export const metadata = {
  title: 'Hotel pre psov – ubytovanie a denná škôlka | CanisCentral',
  description: 'Certifikovaný hotel pre psov v Spišskej Novej Vsi. Ubytovanie od 19 €/deň, denná škôlka od 16 €, pooperačná starostlivosť. Rezervujte termín telefonicky.',
  openGraph: {
    title: 'Hotel pre psov | CanisCentral',
    description: 'Keď odcestujete, váš pes ostane v starostlivých rukách. Ubytovanie, denná škôlka aj pooperačná starostlivosť.',
  },
}

const FEATURES = [
  { icon: Bed, title: 'Individuálne ubytovanie', desc: 'Každý pes má svoj priestor a režim prispôsobený jeho zvyklostiam.' },
  { icon: Clock, title: 'Denná škôlka', desc: 'Osemhodinový pobyt 9:00–17:00 bez nocľahu, krmivo je v cene.' },
  { icon: Star, title: 'Pooperačná starostlivosť', desc: 'Dohľad a starostlivosť o psa v období rekonvalescencie.' },
  { icon: Phone, title: 'Rezervácia telefonicky', desc: 'Zavolajte alebo napíšte – dohodneme termín aj rozsah starostlivosti.' },
]

const PRICES = [
  { label: 'Ubytovanie 1–14 dní', small: '20 €', large: '25 €' },
  { label: 'Ubytovanie nad 15 dní', small: '19 €', large: '24 €' },
  { label: 'Pooperačná starostlivosť', small: '25 €', large: '30 €' },
  { label: 'Denná škôlka 8 hod. (9:00–17:00, krmivo v cene)', small: '16 €', large: '20 €' },
]

export default async function HotelPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-sage-pale py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-96 h-96 top-[-4rem] right-[-4rem] opacity-20" style={{ background: 'var(--sage-light)' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-sage-deep">Hlídanie & ubytovanie</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            Hotel pre psov
            <br />
            <em className="text-sage-deep">ako doma</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">
            Keď odcestujete, váš pes ostane v starostlivých rukách. Útulné prostredie, pravidelný program a kopec lásky.
          </p>
          <a
            href="tel:+421908267278"
            className="inline-flex items-center gap-2 mt-8 bg-ink text-cream px-7 py-3 rounded-full text-sm hover:bg-sage-deep transition-colors"
          >
            <Phone size={16} /> Rezervovať teraz
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-12">Čo zahŕňa pobyt</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-sand rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-sage-pale flex items-center justify-center mb-4">
                <Icon size={18} className="text-sage-deep" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{title}</h3>
              <p className="text-stone text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-3">Cenník</h2>
          <p className="text-stone text-sm text-center mb-10">Ceny sú uvedené za jeden deň pobytu.</p>
          <div className="bg-white rounded-2xl border border-sand overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-clay-pale px-6 py-3 text-xs uppercase tracking-widest text-stone-light font-medium">
              <span>Služba</span>
              <span className="w-20 text-center">Malé plemeno</span>
              <span className="w-20 text-center">Stredné a veľké</span>
            </div>
            {PRICES.map(({ label, small, large }) => (
              <div key={label} className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 border-b border-sand/50 last:border-0 items-center">
                <span className="text-sm text-ink">{label}</span>
                <span className="w-20 text-center font-semibold text-clay">{small}</span>
                <span className="w-20 text-center font-semibold text-clay">{large}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-clay-pale/60 border border-sand rounded-2xl px-6 py-4">
            <p className="text-sm text-ink font-medium mb-1">Víkendové ubytovanie</p>
            <p className="text-stone text-sm leading-relaxed">
              Pri pobyte od štvrtka do nedele platí základná cena + 50 % príplatok.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="font-display text-3xl font-light text-ink mb-4">Zaujíma vás pobyt pre vášho psa?</h2>
        <p className="text-stone mb-8">Kontaktujte nás a domlávime termín.</p>
        <a
          href="mailto:canisdogsport@gmail.com"
          className="inline-flex items-center gap-2 bg-clay text-white px-8 py-4 rounded-full text-sm hover:bg-clay/80 transition-colors"
        >
          Napísať správu
        </a>
      </section>
    </main>
  )
}
