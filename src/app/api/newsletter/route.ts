import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Zápis do newslettera.
 *
 * Formulár na úvodnej stránke predtým e-mail nikam neukladal — len zobrazil
 * poďakovanie a adresu zahodil. Tento endpoint ju uloží do tabuľky
 * newsletter_subscribers. Zoznam vie čítať len administrátor (RLS).
 */
export async function POST(req: Request) {
  try {
    const { email, locale } = await req.json()

    if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: email.trim().toLowerCase(),
      locale: typeof locale === 'string' ? locale : 'sk',
    })

    // 23505 = už je prihlásený. Pre návštevníka to nie je chyba.
    if (error && error.code !== '23505') {
      console.error('[newsletter] insert failed:', error.message)
      return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[newsletter] unexpected error:', err)
    return NextResponse.json({ error: 'unexpected' }, { status: 500 })
  }
}
