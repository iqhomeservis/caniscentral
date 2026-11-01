/**
 * Podmienky dopravy na jednom mieste.
 *
 * Tieto hodnoty boli predtým napísané zvlášť v košíku, v pokladni, na detaile
 * produktu aj v obchodných podmienkach. Keby sa zmenila len jedna, zákazník
 * by videl inú sumu, než by mu nakoniec server naúčtoval.
 *
 * Záväzný výpočet robí vždy server (src/lib/cart-server.ts) — tu sú tie isté
 * konštanty len preto, aby ich vedel použiť aj prehliadač pri zobrazovaní.
 */
export const FREE_SHIPPING_FROM = 50
export const SHIPPING_FEE = 3.99

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
}
