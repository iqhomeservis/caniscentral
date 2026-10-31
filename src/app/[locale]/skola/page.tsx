import { Trophy, Users, Calendar, ChevronRight, Phone } from 'lucide-react'
import Link from 'next/link'
import type { Locale } from '@/types'

export const metadata = {
  title: 'Psí škola & kurzy – výcvik a prevýchova psov | CanisCentral',
  description: 'Kurz šteniatko, kurz dospelý pes, individuálny tréning a konzultácia. Intenzívny 3 Day Camp a 28-dňový program prevýchovy psov s problémovým správaním.',
  openGraph: {
    title: 'Psí škola & kurzy | CanisCentral',
    description: 'Výcvik, ktorý baví psa aj majiteľa. Balance tréning s jasnými hranicami a pozitívnou motiváciou.',
  },
}

const COURSES = [
  {
    tag: 'Kurzy',
    title: 'Kurz šteniatko',
    desc: 'Pre správny štart do života. Socializácia, hygiena, zvládanie stresových situácií a rozvoj správnych návykov pre každodenné spolužitie. Nastavenie komunikácie, budovanie dôvery a položenie základov poslušnosti. Nejde o rady pri jednom tréningu — je to kompletný plán na týždne až mesiace, ktorý je potrebné absolvovať v šteňacom veku.',
    duration: '4 lekcie · vhodné od 4 mesiacov',
    color: 'sage',
  },
  {
    tag: 'Kurzy',
    title: 'Kurz dospelý pes',
    desc: 'Lekcie zamerané na povahu a potreby vášho psa. Majiteľ sa naučí správnu techniku a systém výcviku s použitím kynologických pomôcok, vysvetlíme teóriu aj praktické cvičenia so správnou intenzitou.',
    duration: '4 lekcie',
    color: 'clay',
  },
  {
    tag: 'Individuálne',
    title: 'Individuálny tréning',
    desc: 'Zameraný na konkrétny problém alebo na zlepšenie ovládateľnosti psa. Analýza správania, osobná lekcia trénera a okamžitá spätná väzba.',
    duration: '45 minút',
    color: 'sage',
  },
  {
    tag: 'Individuálne',
    title: 'Konzultácia',
    desc: 'Jednorazová konzultácia zameraná na analýzu a diagnostiku problémového správania. Poradíme, ako správne pokračovať so šteňaťom alebo dospelým psom, pomôžeme porozumieť príčinám správania a ukážeme, ako psa aj seba viesť s istotou.',
    duration: '90 minút',
    color: 'clay',
  },
]

const PROGRAMS = [
  {
    tag: '3 Day Camp',
    title: 'Trojdňový intenzívny tréning',
    lead: 'Kombinácia teórie, praxe a skutočného prepojenia psovoda a psa.',
    body: 'Vhodný pre všetkých majiteľov, ktorí sa chcú posunúť s profesionálnymi trénermi. Tri dni stačia na nastolenie pokoja a istoty v každej situácii, s ktorou sa so svojím štvornohým kamošom stretnete. Zmeníte princíp tréningu aj kontakt so svojím psom — a tým zlepšíte váš vzťah.',
    points: [
      'Mestská socializácia',
      'Základný výcvik poslušnosti',
      'Obrana a ďalšie oblasti',
      'Kompletný návod šitý na mieru podľa temperamentu a správania psa',
    ],
    note: 'Balance tréning — vyvážený harmonický tréning zameraný na pozitívnu motiváciu (pochvala, odmena) s jasnými hranicami, kde pes rozumie viac nám a my jemu. Je to efektívne, čitateľné a bezpečné.',
  },
  {
    tag: 'Prevýchova psa',
    title: '28-dňový program',
    lead: 'Pre psov s problémovým správaním — agresivita, reaktivita, strach, separačná úzkosť a iné.',
    body: 'Na základe dlhoročných skúseností a individuálneho prístupu nastavíme pre vášho psa denný harmonogram a presný tréningový plán. Počas procesu zmeníme psíkovi hodnoty a nastavenie v hlave, dáme mu pozitívny zážitok a tým odstránime jeho doterajšie zlozvyky a problémové správanie.',
    points: [
      'Odstránenie problémového správania',
      'Socializácia s cudzími psami v inom prostredí',
      'Socializácia v meste s cudzími ľuďmi',
      'Základná poslušnosť',
    ],
    note: 'Našim spoločným cieľom je, aby ste si opäť užívali pokojné prechádzky bez stresu a napätia.',
  },
]

export default async function SkolaPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-20 font-body">
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

      {/* Courses */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-3">Kurzy a tréningy</h2>
        <p className="text-stone text-sm text-center max-w-xl mx-auto mb-12">
          Cenu a termín dohodneme podľa toho, čo váš pes potrebuje — ozvite sa nám.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {COURSES.map(({ tag, title, desc, duration, color }) => (
            <div key={title} className="bg-white border border-sand rounded-2xl p-8 flex flex-col gap-4">
              <span className={`self-start text-xs uppercase tracking-widest font-medium px-3 py-1 rounded-full ${color === 'sage' ? 'bg-sage-pale text-sage-deep' : 'bg-clay-pale text-clay'}`}>
                {tag}
              </span>
              <h3 className="font-display text-xl font-light text-ink">{title}</h3>
              <p className="text-stone text-sm leading-relaxed flex-1">{desc}</p>
              <div className="flex items-center gap-2 text-xs text-stone-light pt-4 border-t border-sand">
                <Calendar size={13} /> {duration}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Intenzívne programy */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-12">Intenzívne programy</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {PROGRAMS.map(({ tag, title, lead, body, points, note }) => (
              <div key={tag} className="bg-white border border-sand rounded-2xl p-8 flex flex-col gap-4">
                <span className="self-start text-xs uppercase tracking-widest font-medium px-3 py-1 rounded-full bg-ink text-cream">
                  {tag}
                </span>
                <h3 className="font-display text-2xl font-light text-ink">{title}</h3>
                <p className="text-ink text-sm font-medium leading-relaxed">{lead}</p>
                <p className="text-stone text-sm leading-relaxed">{body}</p>
                <ul className="flex flex-col gap-2 mt-1">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-stone">
                      <ChevronRight size={15} className="text-clay flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-stone text-xs leading-relaxed bg-sand/40 rounded-xl p-4 mt-auto">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-cream py-20 px-6 text-center">
        <Trophy size={32} className="mx-auto mb-4 text-clay" />
        <h2 className="font-display text-3xl font-light mb-4">Začnime s vaším psom</h2>
        <p className="text-cream/70 mb-8 max-w-md mx-auto text-sm">Napíšte nám alebo zavolajte — dohodneme termín aj to, ktorý kurz má pre vášho psa najväčší zmysel.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+421908267278"
            className="inline-flex items-center justify-center gap-2 bg-clay text-white px-8 py-4 rounded-full text-sm hover:bg-clay/80 transition-colors"
          >
            <Phone size={16} /> +421 908 267 278
          </a>
          <a
            href="mailto:canisdogsport@gmail.com"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-cream px-8 py-4 rounded-full text-sm hover:bg-white/20 transition-colors"
          >
            Prihlásiť e-mailom <ChevronRight size={16} />
          </a>
        </div>
      </section>
    </main>
  )
}
