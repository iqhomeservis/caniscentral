import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CanisCentral',
  description: 'Profesionálna starostlivosť o vášho psa — tréning, hotel, salón, chov a prírodné produkty.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
