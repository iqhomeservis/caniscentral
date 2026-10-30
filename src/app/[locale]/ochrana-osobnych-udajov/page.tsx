import type { Metadata } from 'next'
import type { Locale } from '@/types'

export const metadata: Metadata = {
  title: 'Ochrana osobných údajov',
  robots: { index: false },
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  await params
  return (
    <main className="pt-24 pb-20 px-6 font-body">
      <div className="max-w-3xl mx-auto prose prose-stone">
        <h1 className="font-display text-4xl font-light text-ink mb-8">Ochrana osobných údajov</h1>

        <p className="text-stone text-sm mb-6">Aktualizované: október 2024</p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">1. Prevádzkovateľ</h2>
        <p className="text-stone leading-relaxed">
          Prevádzkovateľom webovej stránky caniscentral.sk je Mgr. Juliana Oravcová, IČO: (doplniť),
          e-mail: canisdogsport@gmail.com, tel.: +421 908 267 278 (ďalej len „prevádzkovateľ").
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">2. Aké údaje zbierame</h2>
        <p className="text-stone leading-relaxed">
          Pri objednávke zbierame: meno, priezvisko, e-mailovú adresu, telefónne číslo,
          doručovaciu adresu a v prípade firemnej objednávky IČO a DIČ.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">3. Účel spracovania</h2>
        <p className="text-stone leading-relaxed">
          Vaše osobné údaje spracúvame výlučne za účelom vybavenia objednávky,
          doručenia tovaru a prípadnej komunikácie súvisiacej s objednávkou.
          Právnym základom je plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR).
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">4. Príjemcovia údajov</h2>
        <p className="text-stone leading-relaxed">
          Vaše údaje môžu byť poskytnuté prepravnej spoločnosti za účelom doručenia
          objednávky. Platobné údaje spracúva spoločnosť Stripe, Inc. v súlade s PCI DSS štandardom.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">5. Doba uchovávania</h2>
        <p className="text-stone leading-relaxed">
          Osobné údaje uchovávame po dobu nevyhnutnú na vybavenie objednávky a ďalej
          po dobu stanovenú príslušnými právnymi predpismi (najmä zákon o účtovníctve – 10 rokov).
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">6. Vaše práva</h2>
        <p className="text-stone leading-relaxed">
          Máte právo na prístup k osobným údajom, ich opravu, vymazanie, obmedzenie spracovania
          a prenosnosť. Tieto práva môžete uplatniť na e-mailovej adrese canisdogsport@gmail.com.
          Máte tiež právo podať sťažnosť na Úrad na ochranu osobných údajov SR.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">7. Súbory cookie</h2>
        <p className="text-stone leading-relaxed">
          Táto stránka používa len technicky nevyhnutné súbory cookie potrebné pre správne
          fungovanie košíka. Nepoužívame analytické ani marketingové cookies.
        </p>
      </div>
    </main>
  )
}
