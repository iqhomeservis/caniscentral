import { defineRouting } from 'next-intl/routing'

/**
 * Projekt nepoužíva next-intl middleware — jazyk je daný priečinkom [locale]
 * a odkazy sa skladajú ako `/${locale}/obchod`. Preto tu zámerne NIE JE
 * konfigurácia `pathnames` (lokalizované URL ako /en/shop): bez middleware
 * sa neuplatňovala a len mylne naznačovala, že také adresy existujú.
 *
 * Ak budeme chcieť lokalizované adresy, treba doplniť middleware a zároveň
 * prepísať všetky odkazy na navigačné API z next-intl.
 */
export const routing = defineRouting({
  locales: ['sk', 'en', 'de'],
  defaultLocale: 'sk',
})
