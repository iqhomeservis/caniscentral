import { Heart, Shield, Award, Microscope, MapPin, Phone, Mail } from 'lucide-react'
import type { Locale } from '@/types'

export const metadata = {
  title: 'O nás – Canis Central od roku 1991 | CanisCentral',
  description: 'Profesionálna starostlivosť o psov od roku 1991. Certifikovaný salón, hotel pre psov, chovateľská stanica CEVARO FCI a prírodné doplnky Longevity for Animals.',
  openGraph: {
    title: 'O nás | CanisCentral',
    description: '40+ rokov skúseností, chovateľská stanica CEVARO od 1984, spolupráca s MVDr. Jiří Urbánek.',
  },
}

const MILESTONES = [
  { year: '1984', text: 'Vznik chovateľskej stanice CEVARO — chov nemeckého ovčiaka v duchu zdravia a charakteru' },
  { year: '1991', text: 'Otvorenie kamennej predajne Canis Central v Spišskej Novej Vsi — všetko pre vašich miláčikov' },
  { year: '2005', text: 'Rozšírenie o Certifikovaný Canis Cutting salón a Certifikovaný hotel pre psov' },
  { year: '2024', text: 'Spustenie e-shopu caniscentral.sk a spolupráca s MVDr. Jiří Urbánkom na koncepte dlhovekosti' },
]

const TEAM_VALUES = [
  {
    icon: Heart,
    title: 'Láska k zvieratám',
    desc: 'Za každou službou stojí úprimná vášeň — nie biznis, ale životný štýl. Psi sú pre nás rodina.',
  },
  {
    icon: Shield,
    title: 'Zodpovedný chov',
    desc: 'Chovateľská stanica CEVARO (1984) stavia zdravie a charakter nad exteriér. Genetické testy, FCI zápis.',
  },
  {
    icon: Microscope,
    title: 'Veda v praxi',
    desc: 'Spolupracujeme s MVDr. Jiří Urbánkom, MBA, M.Ed. — veterinárom zameraným na preventívnu medicínu a dlhovekosť psov (Longevity for Animals).',
  },
  {
    icon: Award,
    title: 'Certifikovaná kvalita',
    desc: 'Canis Cutting salón aj hotel pre psov sú certifikované. Vieme, čo robíme, a máme na to doklady.',
  },
]

export default async function ONasPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-[#f5f2ee] py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-96 h-96 bottom-[-4rem] right-[-4rem] opacity-10" style={{ background: '#c8b89a' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-stone-light">Náš príbeh</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-6 leading-tight">
            Canis Central —<br />
            <em className="text-clay">od roku 1991</em>
          </h1>
          <p className="text-stone text-lg leading-relaxed max-w-2xl">
            Vitajte na e-shope, ktorý je pokračovaním dlhoročných profesionálnych služieb kamennej predajne Canis Central Spišská Nová Ves. Viac ako 40 rokov so psami — a stále nás to baví rovnako.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="prose-custom max-w-none space-y-6 text-stone leading-relaxed">
          <p>
            Naším poslaním je priniesť majiteľom psov a mačiek lepšiu dostupnosť kvalitných produktov, ktoré skutočne fungujú. Štvornohí členovia rodiny si zaslúžia to najlepšie — a my ich chceme pomôcť prežiť dlhší, aktívnejší a zdravší život.
          </p>
          <p>
            Psi, na rozdiel od nás, nemôžu zmeniť svoje prostredie ani stravovacie návyky. Sú vystavení stresu, znečisteniu, nezdravej strave a nedostatku pohybu — presne ako ľudia. Prvotné signály zdravotných problémov majitelia často prehliadajú, pretože ich jednoducho nepoznajú.
          </p>
          <p>
            Naším zámerom je uľahčiť chovateľom starostlivosť o ich psi — a dať psom nádej na dlhší a zdravší život. Keď už nemôžeme odstrániť vplyv prostredia, stravy a genetiky, pomôžme im lepšie sa s týmito výzvami vysporiadať.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-light text-ink text-center mb-14">Naša história</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-sand hidden md:block" />
            <div className="flex flex-col gap-10">
              {MILESTONES.map(({ year, text }) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="font-display text-2xl font-light text-clay">{year}</span>
                  </div>
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-clay mt-2 hidden md:block" />
                  <p className="text-stone text-sm leading-relaxed flex-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-12">Čo nás pohýna</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {TEAM_VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#f5f2ee] flex items-center justify-center">
                <Icon size={20} className="text-clay" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-stone text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vet partner */}
      <section className="bg-ink text-cream py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Microscope size={28} className="mx-auto mb-4 text-clay" />
          <h2 className="font-display text-3xl font-light mb-4">Vedecký základ</h2>
          <p className="text-cream/70 leading-relaxed mb-6">
            Spolupracujeme s <strong className="text-cream">MVDr. Jiří Urbánkom, MBA, M.Ed.</strong> — veterinárom zameraným na preventívnu medicínu a výskum faktorov dlhovekosti u psov (Longevity for Animals). Publikuje v odborných časopisoch a propaguje koncept zdravého a dlhého života zvierat v médiách.
          </p>
          <p className="text-cream/50 text-sm">
            Pred nami je ešte dlhá cesta. Ale zdravie a spokojný život zvierat, ktoré sú odkázané na našu starostlivosť, za to stojí.
          </p>
          <p className="mt-8 text-clay font-display text-lg font-light italic">„Môžete na túto cestu vykročiť spolu s nami."</p>
          <p className="text-stone text-xs mt-2">— Tím Canis Central</p>
        </div>
      </section>

      {/* Contact card */}
      <section className="max-w-2xl mx-auto py-20 px-6 text-center">
        <h2 className="font-display text-3xl font-light text-ink mb-8">Kde nás nájdete</h2>
        <div className="bg-white border border-sand rounded-2xl p-8 text-left space-y-4">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-clay flex-shrink-0" />
            <div>
              <span className="text-stone text-sm block">S. Chalupku 1789/34, 052 01 Spišská Nová Ves</span>
              <span className="text-stone-light text-xs">Kamenná predajňa · Hotel pre psov · Canis Cutting salón</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-clay flex-shrink-0" />
            <a href="tel:+421908267278" className="text-stone text-sm hover:text-ink transition-colors">
              +421 908 267 278
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-clay flex-shrink-0" />
            <a href="mailto:canisdogsport@gmail.com" className="text-stone text-sm hover:text-ink transition-colors">
              canisdogsport@gmail.com
            </a>
          </div>
        </div>
        <p className="text-xs text-stone-light mt-6">
          Kamenná predajňa Canis Central Spišská Nová Ves — e-shop je online rozšírením dlhoročných služieb.
        </p>
      </section>
    </main>
  )
}
