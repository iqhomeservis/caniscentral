const TRUST_ITEMS = [
  { icon: '🏆', label: '40+ rokov so psami' },
  { icon: '🏅', label: 'Certifikovaný hotel aj salón' },
  { icon: '🧬', label: 'Chovateľská stanica CEVARO od 1984' },
  { icon: '🚚', label: 'Doprava zadarmo nad 50 €' },
  { icon: '📍', label: 'Spišská Nová Ves' },
]

export default function TrustBar() {
  return (
    <div className="bg-ink py-5 px-6 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 min-w-max md:min-w-0">
        {TRUST_ITEMS.map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-body text-sand-deep tracking-wide">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
