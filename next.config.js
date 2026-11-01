const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Optimalizátor obrázkov smie siahať len do nášho vlastného úložiska.
    // Cudzia doména longevityforanimals.com je odstránená — fotky produktov
    // sú už v projekte. Čím menej cudzích zdrojov, tým menšia plocha na útok:
    // v Next.js 14 sú známe zraniteľnosti optimalizátora obrázkov, ktoré sa
    // zneužívajú práve podstrčením škodlivého súboru z povolenej domény.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // SVG sa neoptimalizuje (predvolené) — ponechané zámerne.
    dangerouslyAllowSVG: false,
  },
  // Disable x-powered-by header
  poweredByHeader: false,

  // Odkazy bez jazykovej predpony (napr. /hotel z vizitky alebo e-mailu)
  // presmerujeme na slovenskú verziu, nech nekončia na 404.
  async redirects() {
    const paths = [
      'obchod',
      'hotel',
      'skola',
      'salon',
      'chov',
      'o-nas',
      'pokladna',
      'obchodne-podmienky',
      'ochrana-osobnych-udajov',
    ]
    return paths.map((p) => ({
      source: `/${p}`,
      destination: `/sk/${p}`,
      permanent: true,
    }))
  },
}

module.exports = withNextIntl(nextConfig)
