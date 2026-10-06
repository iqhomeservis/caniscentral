import { Scissors, Sparkles, Clock, Star } from 'lucide-react'
import type { Locale } from '@/types'

export const metadata = { title: 'Psí salón – CanisCentral' }

const SERVICES = [
  { title: 'Kúpeľ & fén', desc: 'Šampón podľa typu srsti, kondicionér, sušenie a rozčesanie.', from: '20 €' },
  { title: 'Strihanie', desc: 'Profesionálny strih podľa štandardu plemena alebo podľa vašich predstáv.', from: '35 €' },
  { title: 'Kompletná starostlivosť', desc: 'Kúpeľ, strih, čistenie uší, strihanie pazúrikov a parfumácia.', from: '55 €' },
  { title: 'Dezinfekcia & antiparazitika', desc: 'Ošetrenie špeciálnym šampónom proti kliešťom a blchám.', from: '15 €' },
  { title: 'Čistenie uší', desc: 'Šetrné čistenie ušného kanálika špeciálnym roztokom.', from: '8 €' },
  { title: 'Strihanie pazúrikov', desc: 'Bezpečné skrátenie a opílenie pazúrikov.', from: '8 €' },
]

const BREEDS = ['Pudel', 'Bišónek', 'Shih-tzu', 'Jorkšír', 'Maltezer', 'Špic', 'Golden retriever', 'Border kólia']

export default async function SalonPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-16 font-body">
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
        <h2 className="font-display text-3xl font-light text-ink text-center mb-12">Naše služby</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ title, desc, from }) => (
            <div key={title} className="bg-white border border-sand rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-ink">{title}</h3>
                <span className="text-sm font-semibold" style={{ color: '#9b7bb8' }}>od {from}</span>
              </div>
              <p className="text-stone text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-light text-center mt-6">* Ceny závisia od veľkosti psa a stavu srsti. Presná cena po obhliadke.</p>
      </section>

      {/* Why us */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-10">Prečo CanisCentral salón?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Sparkles, title: 'Prírodné prípravky', desc: 'Používame šampóny bez parabénov a umelých vôní.' },
              { icon: Clock, title: 'Rýchle termíny', desc: 'Väčšinou vieme prijať do 2–3 dní. Urgentné prípady riešime.' },
              { icon: Star, title: 'Skúsenosť', desc: 'Groomujeme všetky plemená vrátane náročných a úzkostlivých psov.' },
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

      {/* Breeds */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h2 className="font-display text-2xl font-light text-ink mb-6">Skúsenosti s plemenami</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {BREEDS.map(b => (
            <span key={b} className="bg-white border border-sand text-stone text-sm px-4 py-2 rounded-full">{b}</span>
          ))}
          <span className="bg-white border border-sand text-stone text-sm px-4 py-2 rounded-full">a mnohé ďalšie...</span>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center border-t border-sand">
        <h2 className="font-display text-3xl font-light text-ink mb-4">Rezervovať termín</h2>
        <p className="text-stone mb-8">Zavolajte nám alebo napíšte – radi domlávime čas, ktorý vám vyhovuje.</p>
        <a
          href="mailto:julia@caniscentral.sk"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm text-white transition-colors"
          style={{ background: '#9b7bb8' }}
        >
          <Scissors size={16} /> Objednať sa
        </a>
      </section>
    </main>
  )
}
