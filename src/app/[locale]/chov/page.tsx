import { Heart, Shield, Award, BookOpen } from 'lucide-react'
import type { Locale } from '@/types'

export const metadata = { title: 'Chov psov – CanisCentral' }

const VALUES = [
  { icon: Heart, title: 'Zdravie na prvom mieste', desc: 'Všetky naše zvieratá sú pravidelne vyšetrované veterinárom a geneticky testované.' },
  { icon: Shield, title: 'Registrovaná chovateľská stanica', desc: 'Chov prebieha pod dohľadom Slovenského kynologického zväzu (SKJ).' },
  { icon: Award, title: 'Výstavní víťazi', desc: 'Naše psy sa pravidelne umiestňujú na kynologických výstavách doma i v zahraničí.' },
  { icon: BookOpen, title: 'Podpora nových majiteľov', desc: 'Každý šteniatko dostane rodokmeň, zdravotnú knižku a celoživotnú poradenskú podporu.' },
]

const FAQ = [
  {
    q: 'Kedy bývajú vrhy?',
    a: 'Vrhy plánujeme 1–2× ročne. Prihláste sa na čakaciu listinu a budeme vás kontaktovať.',
  },
  {
    q: 'Aká je cena šteňaťa?',
    a: 'Cena závisí od plemene a kvality. Kontaktujte nás pre aktuálnu ponuku.',
  },
  {
    q: 'Môžem navštíviť chovateľskú stanicu?',
    a: 'Áno, po telefonickej dohode. Radi vám ukážeme podmienky chovu a rodičov šteňaťa.',
  },
  {
    q: 'Čo dostane šteňa od vás?',
    a: 'Rodokmeň SKJ, čip, 2× očkovanie, odčervenie, zdravotná knižka a vzorka krmiva na prvé dni.',
  },
]

export default async function ChovPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  return (
    <main className="pt-16 font-body">
      {/* Hero */}
      <section className="bg-[#f0f4f8] py-24 px-6 relative overflow-hidden">
        <div className="blob absolute w-80 h-80 top-0 right-[-3rem] opacity-15" style={{ background: '#c8d8e8' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest text-stone">Chovateľská stanica</span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-ink mt-2 mb-4 leading-tight">
            CanisCentral
            <br />
            <em className="text-stone">chov</em>
          </h1>
          <p className="text-stone max-w-xl leading-relaxed">
            Zodpovedný chov psov s dôrazom na zdravie, charakter a štandard plemena. Šteňatá odchované s láskou v rodinnom prostredí.
          </p>
          <a
            href="mailto:julia@caniscentral.sk"
            className="inline-flex items-center gap-2 mt-8 bg-ink text-cream px-7 py-3 rounded-full text-sm hover:opacity-80 transition-opacity"
          >
            Prihlásiť sa na čakaciu listinu
          </a>
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
              href="mailto:julia@caniscentral.sk"
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
