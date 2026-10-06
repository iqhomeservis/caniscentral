import Link from 'next/link'
import type { Locale } from '@/types'

const COURSES = [
  { num: '01', title: 'Základná послушnosť', desc: 'Základné povely, socializácia, loptičkovanie.' },
  { num: '02', title: 'Agility tréning', desc: 'Prekážkové dráhy, rýchlosť a koordinácia.' },
  { num: '03', title: 'Dog dancing', desc: 'Tance s psom, muzikalita, choreografia.' },
  { num: '04', title: 'Canisterapia', desc: 'Terapeutická práca, výcvik, certifikácia.' },
]

export default function SportSection({ locale }: { locale: Locale }) {
  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: 'var(--sage-pale)' }}
    >
      {/* Blob decoration */}
      <div
        className="blob absolute w-96 h-96 -right-20 -top-20 opacity-20"
        style={{ background: 'var(--sage-light)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <span className="text-xs uppercase tracking-widest text-sage-deep mb-3 block reveal">
              CanisDogSport
            </span>
            <h2 className="font-display text-5xl font-light text-ink mb-6 reveal">
              Tréning,{' '}
              <em className="text-sage-deep">šport</em>
              <br />a radosť
            </h2>
            <p className="font-body text-sm text-stone leading-relaxed mb-8 reveal max-w-md">
              Profesionálny výcvik psov v príjemnom prostredí. Individuálny prístup,
              overené metódy a výsledky, na ktoré budete hrdí.
            </p>

            {/* Feature cards glassmorphism */}
            <div className="grid grid-cols-2 gap-3 reveal">
              {[
                { icon: '🎯', label: 'Individuálny prístup' },
                { icon: '🏅', label: 'Certifikovaní tréneri' },
                { icon: '🌳', label: 'Vonkajší areál' },
                { icon: '🐾', label: 'Všetky plemená' },
              ].map(({ icon, label }) => (
                <div key={label} className="glass rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <span className="font-body text-xs text-stone">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/skola`}
              className="mt-8 inline-flex items-center gap-2 bg-sage-deep text-cream text-sm font-body px-6 py-3 rounded-full hover:bg-sage transition-colors reveal"
            >
              Prihlásiť sa na kurz →
            </Link>
          </div>

          {/* Right — numbered course cards */}
          <div className="flex flex-col gap-4">
            {COURSES.map(({ num, title, desc }, i) => (
              <div
                key={num}
                className="reveal bg-white/60 border border-sage-light/50 rounded-2xl p-5 flex gap-4 hover:bg-white/80 transition-colors"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="font-display text-4xl font-light text-sage-light leading-none">
                  {num}
                </span>
                <div>
                  <h3 className="font-body text-sm font-medium text-ink mb-1">{title}</h3>
                  <p className="font-body text-xs text-stone">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
