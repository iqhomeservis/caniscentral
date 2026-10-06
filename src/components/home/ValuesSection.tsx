const VALUES = [
  {
    icon: '🌿',
    title: 'Prírodné zloženie',
    desc: 'Každý produkt prechádza dôkladnou kontrolou. Žiadne umelé prísady, len to najlepšie z prírody.',
  },
  {
    icon: '❤️',
    title: 'S láskou k zvieratám',
    desc: 'Za každým produktom stojí vášeň pre zvieratá a desaťročia skúseností.',
  },
  {
    icon: '🔬',
    title: 'Odborné poradenstvo',
    desc: 'Náš tím veterinárov a odborníkov je tu pre vás a vaše zviera.',
  },
]

export default function ValuesSection() {
  return (
    <section className="py-20 px-6 bg-off">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 reveal">
          <span className="text-xs uppercase tracking-widest text-stone-light">Naše hodnoty</span>
          <h2 className="font-display text-4xl font-light text-ink mt-1">
            Prečo CanisCentral?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sand">
          {VALUES.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="reveal bg-off p-8 text-center"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-body text-base font-medium text-ink mb-2">{title}</h3>
              <p className="font-body text-sm text-stone leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
