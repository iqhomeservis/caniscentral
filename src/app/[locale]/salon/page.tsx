import { Scissors, Sparkles, Clock, Star, Phone } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import type { Locale } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  return pageMetadata({
    locale,
    path: '/salon',
    title: 'Psí salón Spišská Nová Ves – strihanie a trimovanie psov',
    description:
      'Certifikovaný psí salón Canis Cutting v Spišskej Novej Vsi. Strihanie a trimovanie od 25 €, kúpanie a fénovanie od 20 €, čistenie uší, strihanie nechtov.',
    ogTitle: 'Psí salón Canis Cutting | CanisCentral',
    ogDescription:
      'Certifikovaný salón od roku 2005. Strihanie, trimovanie, kúpanie a kompletná úprava srsti.',
  })
}

const SERVICES = [
  { title: 'Strihanie, trimovanie', small: '25 – 45 €', large: '46 – 80 €' },
  { title: 'Kúpanie, rozčesávanie a fénovanie', small: '20 – 30 €', large: '35 – 70 €' },
  { title: 'Strihanie nechtov', small: '3 €', large: '5 €' },
  { title: 'Čistenie uší', small: '5 €', large: '8 €' },
  { title: 'Vybratie kliešťa', small: '1,50 €', large: '1,50 €' },
]

export default async function SalonPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-[#f5f0f8] py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-72 h-72 top-[-2rem] right-0 opacity-20" style={{ background: '#e8d5f0' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest" style={{ color: '#9b7bb8' }}>Starostlivosť & grooming</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            Psí salón
            <br />
            <em style={{ color: '#9b7bb8' }}>krása zvnútra</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">
            Váš pes si zaslúži tú najlepšiu starostlivosť. Skúsené groomérky, prírodné prípravky a jemný prístup.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-10">Cenník služieb</h2>
        <div className="max-w-3xl mx-auto bg-white border border-sand rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 md:gap-4 px-4 md:px-6 py-3 text-[10px] md:text-xs uppercase tracking-wide md:tracking-widest text-stone-light font-medium leading-tight" style={{ background: '#f5f0f8' }}>
            <span className="self-end">Služba</span>
            <span className="w-[72px] md:w-28 text-center">Malé plemeno</span>
            <span className="w-[72px] md:w-28 text-center">Stredné a veľké</span>
          </div>
          {SERVICES.map(({ title, small, large }) => (
            <div key={title} className="grid grid-cols-[1fr_auto_auto] gap-2 md:gap-4 px-4 md:px-6 py-4 border-b border-sand/50 last:border-0 items-center">
              <span className="text-sm text-ink pr-2">{title}</span>
              <span className="w-[72px] md:w-28 text-center text-sm font-semibold" style={{ color: '#9b7bb8' }}>{small}</span>
              <span className="w-[72px] md:w-28 text-center text-sm font-semibold" style={{ color: '#9b7bb8' }}>{large}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-light text-center mt-6">
          Rozpätie ceny závisí od veľkosti psa, typu a stavu srsti. Presnú cenu dohodneme pri obhliadke.
        </p>
      </section>

      {/* Why us */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-10">Prečo CanisCentral salón?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Star, title: 'Certifikovaný salón', desc: 'Canis Cutting je certifikovaný salón, ktorý funguje od roku 2005.' },
              { icon: Sparkles, title: 'Viac ako 40 rokov so psami', desc: 'Salón je súčasťou Canis Central — rodinnej praxe so psami od roku 1984.' },
              { icon: Clock, title: 'Na jednom mieste', desc: 'Úpravu srsti viete spojiť s pobytom v hoteli alebo dennou škôlkou.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#f5f0f8' }}>
                  <Icon size={20} style={{ color: '#9b7bb8' }} />
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-stone text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center border-t border-sand">
        <h2 className="font-display text-3xl font-light text-ink mb-4">Rezervovať termín</h2>
        <p className="text-stone mb-8">Zavolajte nám alebo napíšte — radi si dohodneme čas, ktorý vám vyhovuje.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+421908267278"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm text-white transition-colors"
            style={{ background: '#9b7bb8' }}
          >
            <Phone size={16} /> +421 908 267 278
          </a>
          <a
            href="mailto:canisdogsport@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm border border-stone/30 text-stone hover:border-stone transition-colors"
          >
            <Scissors size={16} /> Napísať e-mail
          </a>
        </div>
      </section>
    </main>
  )
}
