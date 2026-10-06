import { Bed, Clock, Star, Phone } from 'lucide-react'
import Link from 'next/link'
import type { Locale } from '@/types'

export const metadata = { title: 'Hotel pre psov – CanisCentral' }

const FEATURES = [
  { icon: Bed, title: 'Individuálne ubytovanie', desc: 'Každý pes má vlastný komfortný box s posteľou a hračkami.' },
  { icon: Clock, title: 'Starostlivosť 24/7', desc: 'Náš tím je k dispozícii celý deň. Pravidelné prechádzky a venčenie.' },
  { icon: Star, title: 'Denné správy', desc: 'Fotky a správy o vašom miláčikovi každý deň na WhatsApp.' },
  { icon: Phone, title: 'Rezervácia jednoducho', desc: 'Zavolajte alebo napíšte – nájdeme termín aj na poslednú chvíľu.' },
]

const PRICES = [
  { label: 'Malé plemeno (do 10 kg)', day: '20 €', week: '120 €' },
  { label: 'Stredné plemeno (10–25 kg)', day: '25 €', week: '150 €' },
  { label: 'Veľké plemeno (nad 25 kg)', day: '30 €', week: '180 €' },
  { label: 'Denné hlídanie (bez nocľahu)', day: '12 €', week: '—' },
]

export default async function HotelPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-16 font-body">
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
            href="tel:+421900000000"
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
          <h2 className="font-display text-3xl font-light text-ink text-center mb-10">Cenník</h2>
          <div className="bg-white rounded-2xl border border-sand overflow-hidden">
            <div className="grid grid-cols-3 bg-clay-pale px-6 py-3 text-xs uppercase tracking-widest text-stone-light font-medium">
              <span>Kategória</span><span className="text-center">1 deň</span><span className="text-center">Týždeň</span>
            </div>
            {PRICES.map(({ label, day, week }) => (
              <div key={label} className="grid grid-cols-3 px-6 py-4 border-b border-sand/50 last:border-0 items-center">
                <span className="text-sm text-ink">{label}</span>
                <span className="text-center font-semibold text-clay">{day}</span>
                <span className="text-center text-stone">{week}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-light text-center mt-4">Cena zahŕňa stravu, venčenie 3× denne a každodenné správy.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="font-display text-3xl font-light text-ink mb-4">Zaujíma vás pobyt pre vášho psa?</h2>
        <p className="text-stone mb-8">Kontaktujte nás a domlávime termín.</p>
        <a
          href="mailto:julia@caniscentral.sk"
          className="inline-flex items-center gap-2 bg-clay text-white px-8 py-4 rounded-full text-sm hover:bg-clay/80 transition-colors"
        >
          Napísať správu
        </a>
      </section>
    </main>
  )
}
