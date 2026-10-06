import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['sk', 'en', 'de'],
  defaultLocale: 'sk',
  pathnames: {
    '/': '/',
    '/obchod': {
      sk: '/obchod',
      en: '/shop',
      de: '/shop',
    },
    '/hotel': '/hotel',
    '/skola': {
      sk: '/skola',
      en: '/school',
      de: '/schule',
    },
    '/salon': '/salon',
    '/chov': {
      sk: '/chov',
      en: '/breeding',
      de: '/zucht',
    },
    '/pokladna': {
      sk: '/pokladna',
      en: '/checkout',
      de: '/kasse',
    },
    '/admin': '/admin',
  },
})
