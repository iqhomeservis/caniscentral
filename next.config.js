const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'longevityforanimals.com',
      },
      {
        protocol: 'https',
        hostname: '*.longevityforanimals.com',
      },
    ],
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
