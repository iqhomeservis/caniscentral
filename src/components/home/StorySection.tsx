import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'

export default function StorySection({ locale }: { locale: Locale }) {
  return (
    <section className="py-24 px-6 overflow-hidden" style={{ background: '#fdfcfa' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="reveal">
            <span className="text-xs uppercase tracking-widest text-stone-light mb-3 block">
              Od roku 1991
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-ink mb-6 leading-tight">
              Príbeh, ktorý<br />
              <em className="text-clay">začal láskou</em>
            </h2>
            <p className="text-stone text-sm leading-relaxed mb-4 max-w-md">
              Canis Central Spišská Nová Ves vznikol v roku 1991 s jednoduchou víziou — dať každému psovi to najlepšie. Chovateľská stanica CEVARO existuje od roku 1984 a vždy kladie zdravie a charakter psa nad exteriér.
            </p>
            <p className="text-stone text-sm leading-relaxed mb-8 max-w-md">
              Dnes sme e-shop, certifikovaný salón, hotel a škola — ale filozofia zostala rovnaká. Spolupracujeme s veterinárom MVDr. Jiří Urbánkom na produkte dlhovekosti <em>Longevity for Animals</em>.
            </p>
            <Link
              href={`/${locale}/o-nas`}
              className="inline-flex items-center gap-2 text-sm text-clay border border-clay rounded-full px-6 py-3 hover:bg-clay hover:text-white transition-colors"
            >
              Prečítať náš príbeh →
            </Link>
          </div>

          {/* Sketches collage */}
          <div className="reveal relative">
            {/* Main sketch — woman with dog sitting */}
            <div className="relative rounded-3xl overflow-hidden bg-[#f5f2ee]" style={{ aspectRatio: '4/5' }}>
              <Image
                src="/illustrations/sketch-woman-dog.jpg"
                alt="Júlia s nemeckým ovčiakom — kresba"
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Floating small sketch */}
            <div
              className="absolute -bottom-6 -left-6 w-40 h-40 rounded-2xl overflow-hidden bg-white shadow-lg border border-sand"
            >
              <Image
                src="/illustrations/sketch-training.webp"
                alt="Výcvik psa — kresba"
                fill
                className="object-contain p-2"
                sizes="160px"
              />
            </div>
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border border-sand rounded-full px-3 py-1.5 text-xs text-stone">
              🏆 CEVARO od 1984
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
