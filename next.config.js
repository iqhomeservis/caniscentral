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
}

module.exports = withNextIntl(nextConfig)
