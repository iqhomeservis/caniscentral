import Link from 'next/link'

/**
 * Stránka 404 mimo jazykovej sekcie — napríklad pri adrese, ktorá nemá
 * jazykovú predponu a nie je medzi presmerovaniami v next.config.js.
 *
 * Nemá k dispozícii jazyk ani preklady (je nad layoutom [locale]),
 * preto je po slovensky a odkazuje na slovenskú verziu.
 */
export default function RootNotFound() {
  return (
    <html lang="sk">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#faf8f5',
          color: '#2d1f0e',
          fontFamily: 'Georgia, "Times New Roman", serif',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '32rem' }}>
          <p style={{ fontSize: '4rem', margin: '0 0 0.5rem', color: '#8b6f47', fontWeight: 300 }}>404</p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 300, margin: '0 0 1rem' }}>
            Stránka sa nenašla
          </h1>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#6b5d4f', margin: '0 0 2rem' }}>
            Adresa, ktorú ste zadali, na našom webe neexistuje. Možno sa zmenila
            alebo je v nej preklep.
          </p>
          <Link
            href="/sk"
            style={{
              display: 'inline-block',
              padding: '0.85rem 1.75rem',
              borderRadius: '999px',
              background: '#2d1f0e',
              color: '#faf8f5',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            Späť na úvod
          </Link>
        </div>
      </body>
    </html>
  )
}
