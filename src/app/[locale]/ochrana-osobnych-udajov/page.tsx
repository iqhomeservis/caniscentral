import type { Metadata } from 'next'
import type { Locale } from '@/types'

export const metadata: Metadata = {
  title: 'Ochrana osobných údajov',
  robots: { index: false },
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  await params
  return (
    <main className="pt-24 pb-20 px-6 font-body">
      <div className="max-w-3xl mx-auto prose prose-stone">
        <h1 className="font-display text-4xl font-light text-ink mb-8">Ochrana osobných údajov</h1>

        <p className="text-stone text-sm mb-6">Aktualizované: november 2026</p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">1. Prevádzkovateľ</h2>
        <p className="text-stone leading-relaxed">
          Prevádzkovateľom webovej stránky caniscentral.sk je Mgr. Juliana Oravcová, IČO: 14373998,
          e-mail: canisdogsport@gmail.com, tel.: +421 908 267 278 (ďalej len „prevádzkovateľ").
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">2. Aké údaje zbierame</h2>
        <p className="text-stone leading-relaxed">
          Pri objednávke zbierame: meno, priezvisko, e-mailovú adresu, telefónne číslo,
          doručovaciu adresu a v prípade firemnej objednávky IČO a DIČ.
        </p>
        <p className="text-stone leading-relaxed mt-3">
          Ak v pokladni vyplníte e-mail alebo telefónne číslo a objednávku nedokončíte,
          tieto údaje spolu s obsahom košíka uchovávame, aby sme vás mohli kontaktovať
          a pomôcť objednávku dokončiť. Ak sa prihlásite na odber noviniek, uchovávame
          vašu e-mailovú adresu.
        </p>
        <p className="text-stone leading-relaxed mt-3">
          Ak nám napíšete cez kontaktný formulár, spracúvame meno, e-mailovú adresu,
          telefónne číslo (ak ho vyplníte), zvolenú tému a obsah vašej správy.
        </p>
        <p className="text-stone leading-relaxed mt-3">
          O návštevnosti webu vedieme základnú štatistiku: navštívená stránka, jazyk,
          typ zariadenia, krajina, odkazujúca doména a náhodné identifikačné číslo návštevy.
          <strong> Neukladáme IP adresu</strong> a tieto záznamy nepoužívame na identifikáciu
          konkrétnych osôb ani na reklamu.
        </p>

        <h2 className="font-display text-2xl font-light text-ink mt-8 mb-4">3. Účel spracovania</h2>
        <p className="text-stone leading-relaxed">
          Vaše osobné údaje spracúvame za účelom vybavenia objednávky,
          doručenia tovaru a prípadnej komunikácie súvisiacej s objednávkou.
          Právnym základom je plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR).
        </p>
        <p className="text-stone leading-relaxed mt-3">
          Kontaktné údaje z nedokončenej objednávky spracúvame na základe oprávneného
          záujmu (čl. 6 ods. 1 písm. f) GDPR) — pomôcť vám dokončiť objednávku.
          Proti tomuto spracovaniu môžete kedykoľvek namietať na adrese
          canisdogsport@gmail.com a údaje bezodkladne vymažeme.
          Odber noviniek spracúvame na základe vášho súhlasu (čl. 6 ods. 1 písm. a) GDPR),
          ktorý môžete kedykoľvek odvolať.
        </p>
        <p className="text-stone leading-relaxed mt-3">
          Správu z kontaktného formulára spracúvame na základe oprávneného záujmu
          (čl. 6 ods. 1 písm. f) GDPR) — odpovedať na váš dopyt. Údaje z formulára
          nepoužívame na reklamu ani ich neposkytujeme tretím stranám.
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
        <p className="text-stone leading-relaxed mt-3">
          Kontaktné údaje z nedokončenej objednávky uchovávame najviac 90 dní od poslednej
          aktivity. Údaj o prihlásení na odber noviniek uchovávame do odvolania súhlasu.
          Štatistiku návštevnosti uchovávame 12 mesiacov. Správy z kontaktného formulára
          uchovávame najviac 12 mesiacov od vyriešenia dopytu.
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
          fungovanie košíka a prihlásenia. Nepoužívame marketingové cookies ani nástroje
          tretích strán na sledovanie návštevníkov (napríklad Google Analytics).
        </p>
        <p className="text-stone leading-relaxed mt-3">
          Pre základnú štatistiku návštevnosti ukladáme náhodné identifikačné číslo návštevy
          do úložiska prehliadača (sessionStorage). Zaniká po zatvorení karty, neprenáša sa
          na iné weby ani zariadenia a nie je priradené ku konkrétnej osobe.
        </p>
      </div>
    </main>
  )
}
