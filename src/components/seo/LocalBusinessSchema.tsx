import { SITE_URL } from '@/lib/seo'

/**
 * Štruktúrované dáta (JSON-LD) pre lokálne vyhľadávanie.
 * Vďaka tomu Google rozumie, že ide o konkrétnu prevádzku v Spišskej Novej Vsi,
 * a vie zobraziť adresu, telefón a ponuku služieb priamo vo výsledkoch.
 *
 * Údaje sú len tie, ktoré sú overené. Otváracie hodiny a geolokácia
 * sa doplnia, keď ich budeme mať potvrdené.
 */
export default function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organizacia`,
    name: 'Canis Central',
    alternateName: 'CanisCentral – Canis Dog Sport',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-icon.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      'Hotel pre psov, výcvik a kurzy, certifikovaný psí salón Canis Cutting, chovateľská stanica CEVARO a e-shop s prírodnými doplnkami pre psov.',
    telephone: '+421908267278',
    email: 'canisdogsport@gmail.com',
    foundingDate: '1991',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'S. Chalupku 1789/34',
      addressLocality: 'Spišská Nová Ves',
      postalCode: '05201',
      addressCountry: 'SK',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Spišská Nová Ves a okolie',
    },
    sameAs: ['https://www.facebook.com/share/1WrobSRnzE/'],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hotel pre psov — ubytovanie',
          description: 'Krátkodobé aj dlhodobé ubytovanie psov vrátane pooperačnej starostlivosti.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Denná škôlka pre psov',
          description: 'Osemhodinový pobyt bez nocľahu, 9:00–17:00, krmivo v cene.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Psí salón — strihanie a trimovanie',
          description: 'Certifikovaný salón Canis Cutting: strihanie, trimovanie, kúpanie a úprava srsti.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Výcvik psov a kurzy',
          description: 'Kurz šteniatko, kurz dospelý pes, individuálny tréning, konzultácia, 3 Day Camp a prevýchova psa.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Chovateľská stanica CEVARO',
          description: 'Chov nemeckého ovčiaka so zápisom FCI, chovateľská stanica funguje od roku 1984.',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
