import { Heart, Shield, Award, BookOpen, Phone } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import type { Locale } from '@/types'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  return pageMetadata({
    locale,
    path: '/chov',
    title: 'Chovateľstvo CEVARO – chov nemeckého ovčiaka FCI od 1984',
    description:
      'Chovateľská stanica CEVARO v Spišskej Novej Vsi. Chov nemeckého ovčiaka so zápisom FCI od roku 1984, dôraz na zdravie a charakter, genetické testy.',
    ogTitle: 'Chovateľstvo CEVARO | CanisCentral',
    ogDescription:
      'Chov nemeckého ovčiaka od roku 1984. Zdravie a charakter nad exteriérom, genetické testy, zápis FCI.',
  })
}

const VALUES = [
  { icon: Heart, title: 'Zdravie a charakter nad exteriérom', desc: 'Pri výbere chovných jedincov je pre nás prvoradé zdravie a povaha, nie len vzhľad.' },
  { icon: Shield, title: 'Chovateľská stanica CEVARO', desc: 'Založená v roku 1984, so zápisom FCI. Venujeme sa chovu nemeckého ovčiaka.' },
  { icon: Award, title: 'Genetické testy', desc: 'Chovné jedince necháme geneticky testovať a pravidelne veterinárne vyšetrovať.' },
  { icon: BookOpen, title: 'Podpora nových majiteľov', desc: 'Každé šteňa odchádza s dokladmi a s našou poradenskou podporou aj po odbere.' },
]

const FAQ = [
  {
    q: 'Aké plemeno chováte?',
    a: 'Venujeme sa chovu nemeckého ovčiaka. Chovateľská stanica CEVARO funguje od roku 1984 a je zapísaná v FCI.',
  },
  {
    q: 'Kedy bývajú vrhy?',
    a: 'Vrhy neplánujeme podľa pevného harmonogramu. Ozvite sa nám a zapíšeme vás do poradovníka — dáme vám vedieť, keď bude vrh aktuálny.',
  },
  {
    q: 'Aká je cena šteňaťa?',
    a: 'Cena závisí od konkrétneho vrhu. Kontaktujte nás a povieme vám aktuálne podmienky.',
  },
  {
    q: 'Môžem navštíviť chovateľskú stanicu?',
    a: 'Áno, po telefonickej dohode. Radi vám ukážeme podmienky chovu aj rodičov šteňaťa.',
  },
]

export default async function ChovPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-20 font-body">
      {/* Hero */}
      <section className="bg-[#f0f4f8] py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-80 h-80 top-0 right-[-3rem] opacity-15" style={{ background: '#c8d8e8' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-stone">Chovateľská stanica</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            Chovateľstvo
            <br />
            <em className="text-stone">CEVARO</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">
            Chovateľská stanica CEVARO funguje od roku 1984 a venuje sa chovu nemeckého ovčiaka
            s dôrazom na zdravie a charakter. Šteňatá odchované v rodinnom prostredí.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a
              href="tel:+421908267278"
              className="inline-flex items-center justify-center gap-2 bg-ink text-cream px-7 py-3 rounded-full text-sm hover:opacity-80 transition-opacity"
            >
              <Phone size={16} /> +421 908 267 278
            </a>
            <a
              href="mailto:canisdogsport@gmail.com"
              className="inline-flex items-center justify-center gap-2 border border-stone/30 text-stone px-7 py-3 rounded-full text-sm hover:border-stone transition-colors"
            >
              Čakacia listina e-mailom
            </a>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-12">Naše hodnoty</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center bg-[#f0f4f8]">
                <Icon size={22} className="text-stone" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{title}</h3>
              <p className="text-stone text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current litter placeholder */}
      <section className="bg-sand/30 py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-stone-light">Aktuálna ponuka</span>
          <h2 className="font-display text-3xl font-light text-ink mt-2 mb-6">Dostupné šteňatá</h2>
          <div className="bg-white border border-sand rounded-2xl p-10 text-stone">
            <Heart size={32} className="mx-auto mb-4 text-clay opacity-40" />
            <p className="text-sm">Momentálne nemáme dostupné šteňatá. Prihláste sa na čakaciu listinu a budeme vás informovať o ďalšom vrhu.</p>
            <a
              href="mailto:canisdogsport@gmail.com"
              className="inline-block mt-6 bg-clay text-white px-6 py-3 rounded-full text-sm hover:bg-clay/80 transition-colors"
            >
              Čakacia listina
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto py-20 px-6">
        <h2 className="font-display text-3xl font-light text-ink text-center mb-10">Časté otázky</h2>
        <div className="flex flex-col gap-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="bg-white border border-sand rounded-2xl p-6">
              <h3 className="font-semibold text-ink mb-2">{q}</h3>
              <p className="text-stone text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
