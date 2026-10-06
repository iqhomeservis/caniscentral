import { Trophy, Users, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Locale } from '@/types'

export const metadata = { title: 'Psí škola & kurzy – CanisCentral' }

const COURSES = [
  {
    tag: 'Základný kurz',
    title: 'Poslušnosť pre začiatočníkov',
    desc: 'Základné povely, socializácia, správanie na verejnosti. Ideálny pre šteňatá a psov bez výcviku.',
    duration: '8 týždňov',
    price: '120 €',
    color: 'sage',
  },
  {
    tag: 'Pokročilý kurz',
    title: 'Poslušnosť pre pokročilých',
    desc: 'Nadstavba základného kurzu. Komplexné povely, vodiace cvičenia a práca bez vodítka.',
    duration: '8 týždňov',
    price: '140 €',
    color: 'clay',
  },
  {
    tag: 'Šport',
    title: 'Agility tréning',
    desc: 'Prekážková dráha, rýchlosť a zábava. Pre aktívnych psov a ich majiteľov. Súťažná príprava.',
    duration: 'Otvorené hodiny',
    price: '10 € / hodina',
    color: 'sage',
  },
  {
    tag: 'Tanec',
    title: 'Dog Dancing',
    desc: 'Tanec so psom – kreatívna disciplína, ktorá rozvíja vzájomné porozumenie a radosť z pohybu.',
    duration: '6 týždňov',
    price: '90 €',
    color: 'clay',
  },
]

const STATS = [
  { num: '200+', label: 'spokojných majiteľov' },
  { num: '12', label: 'rokov skúseností' },
  { num: '4', label: 'druhy kurzov' },
  { num: '98 %', label: 'úspešnosť absolventov' },
]

export default async function SkolaPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-16 font-body">
      {/* Hero */}
      <section className="bg-clay-pale py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-80 h-80 bottom-[-2rem] left-[-4rem] opacity-20" style={{ background: 'var(--clay-light)' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-clay">Výcvik & kurzy</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            Psí škola
            <br />
            <em className="text-clay">s radosťou</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">
            Výcvik, ktorý baví psa aj majiteľa. Pozitívna motivácia, profesionálny prístup a výsledky, ktoré vidieť.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-sand">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl font-light text-clay mb-1">{num}</div>
              <div className="text-xs text-stone uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-12">Naše kurzy</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {COURSES.map(({ tag, title, desc, duration, price, color }) => (
            <div key={title} className="bg-white border border-sand rounded-2xl p-8 flex flex-col gap-4">
              <span className={`self-start text-xs uppercase tracking-widest font-medium px-3 py-1 rounded-full ${color === 'sage' ? 'bg-sage-pale text-sage-deep' : 'bg-clay-pale text-clay'}`}>
                {tag}
              </span>
              <h3 className="font-display text-xl font-light text-ink">{title}</h3>
              <p className="text-stone text-sm leading-relaxed flex-1">{desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-sand">
                <div className="flex items-center gap-2 text-xs text-stone-light">
                  <Calendar size={13} /> {duration}
                </div>
                <span className="font-semibold text-clay">{price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-cream py-20 px-6 text-center">
        <Trophy size={32} className="mx-auto mb-4 text-clay" />
        <h2 className="font-display text-3xl font-light mb-4">Začnite trénovať ešte tento mesiac</h2>
        <p className="text-cream/70 mb-8 max-w-md mx-auto text-sm">Nové skupiny sa otvárajú každý mesiac. Kapacita je obmedzená na 8 psov v skupine.</p>
        <a
          href="mailto:julia@caniscentral.sk"
          className="inline-flex items-center gap-2 bg-clay text-white px-8 py-4 rounded-full text-sm hover:bg-clay/80 transition-colors"
        >
          Prihlásiť sa na kurz <ChevronRight size={16} />
        </a>
      </section>
    </main>
  )
}
